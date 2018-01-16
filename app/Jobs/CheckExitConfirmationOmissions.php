<?php

namespace App\Jobs;

use App\EntryExitInformation;
use App\Mail\ErrorDetection;
use App\Mail\BatchExceededTimeout;
use App\Mail\ExitConfirmationOmission;
use App\UsedCompany;
use Carbon\Carbon;
use function GuzzleHttp\Promise\exception_for;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class CheckExitConfirmationOmissions implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $now;
    protected $today;
    protected $yesterday;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        Log::useDailyFiles(storage_path() . '/logs/exit_confirmation_omission_check.log');
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        error_log(' > Job started running...');
        $this->today = Carbon::today();
        $this->yesterday = Carbon::yesterday();
        $this->now = Carbon::now();

        Log::info('');
        Log::info('##################### ' . $this->today->format('Y/m/d') . ' #####################');
        Log::info('================== Batch started at ' . Carbon::now()->toTimeString() . ' ==================');

        $usedCompanyIds = UsedCompany::pluck(USED_COMPANY_ID)->toarray();

        $abnormal = 0;

        foreach ($usedCompanyIds as $usedCompanyId) {

            $sendingEmailStatus = true;
            $confirmationStatus = true;

            Log::info('================== Used Company ID : ' . $usedCompanyId . ' ==================');

            $omittedVisitors = $this->getOmittedVisitors($usedCompanyId);
            if ($omittedVisitors != null) {
                Log::info('DryRun : [SUCCESS]');
            } else {
                Log::error('DryRun : [FAILED]');
            }

            $numberOfOmissions = count($omittedVisitors);

            if ($numberOfOmissions > 0) {
                // execute if there is any exit confirmation omission
                // get all admin's emails from DB
                Log::info('Exit Confirmation Omission records : [YES]');
                $adminsEmails = UsedCompany::find($usedCompanyId)
                    ->admins()
                    ->pluck(ADMINISTRATOR_EMAIL)
                    ->toarray();
                // send an Exit Confirmation Omission Alert email to every admin's email
                $sendingEmailStatus = $this->sendExitConfirmationOmissionAlert($adminsEmails, $omittedVisitors);
                // log the emailing status
                if ($sendingEmailStatus) {
                    Log::info('Emailing Exit Confirmation Omission Alert : [SUCCESS]');
                } else {
                    Log::error('Emailing Exit Confirmation Omission Alert : [FAILED]');
                }
                // confirm the omissions in the DB
                $confirmationStatus = $this->confirmOmissions($omittedVisitors);
                // log the confirmation status
                if ($confirmationStatus) {
                    Log::info('Confirmation of Omission in DB : [SUCCESS]');
                } else {
                    Log::error('Confirmation of Omission in DB : [FAILED]');
                }
            } else {
                Log::info('Exit Confirmation Omission records : [NO]');
            }

            $status = (($omittedVisitors != null) && $sendingEmailStatus && $confirmationStatus);
            $abnormal = $status ? $abnormal : ++$abnormal;
            Log::info('');
        }

        if ($abnormal) {
            $this->sendErrorDetectionAlert();
            Log::error('***************** Batch abnormally ended at ' . Carbon::now()->toTimeString() . ' *****************');
        } else {
            Log::info('================== Batch ended at ' . Carbon::now()->toTimeString() . ' ==================');
        }
        error_log(' > Job ended running...');
    }

    /**
     * Determine the time at which the job should timeout.
     *
     * @return \DateTime
     */
    public function retryUntil()
    {
        return now()->addSeconds(5);
    }

    /**
     * The job failed to process.
     *
     * @return void
     */
    public function failed()
    {
        error_log(' > Job failed...');
        Log::error('***************** Batch Exceeded Timeout *****************');
        $this->sendErrorDetectionAlert();
    }

    protected function getOmittedVisitors($usedCompanyId)
    {
        $omittedVisitors = UsedCompany::find($usedCompanyId)
            ->entryExitInfos()
            ->where(EXIT_CONFIRMER_ID, null)
            ->where(EXIT_DATETIME, null)
            ->where(ENTRY_DATETIME, '>=', $this->yesterday)
            ->where(ENTRY_DATETIME, '<', $this->today)
            ->get();
        return $omittedVisitors;
    }

    protected function confirmOmissions($omittedVisitors)
    {
        $updateStatus = false;

        foreach ($omittedVisitors as $omittedVisitor) {
            $entryExitInfo = EntryExitInformation::find($omittedVisitor->entry_exit_information_id);
            $entryExitInfo->exit_datetime = $this->now;

            $updateStatus = DB::transaction(function () use ($entryExitInfo) {
                return $entryExitInfo->update();
            });
        }
        return $updateStatus;
    }

    protected function sendExitConfirmationOmissionAlert($adminsEmails, $records)
    {
        error_log(' > Sending Exit Confirmation Omission alert ...');
        try {
            Mail::send('emails.exit-confirmation-omission', ['records' => $records, 'index' => 0], function ($message) use ($adminsEmails) {
                $message->to($adminsEmails);
                $message->subject('[Exit Confirmation Omission Alert] ' . $this->yesterday->format('Y/m/d'));
            });
            return true;
        } catch (\Exception $exception) {
            return false;
        }
    }

    protected function sendErrorDetectionAlert()
    {
        error_log(' > Sending error detection alert ...');
        $message = (new ErrorDetection())->onQueue('emails');
        Mail::send($message);
    }
}
