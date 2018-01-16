<?php

namespace App\Mail;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ExitConfirmationOmission extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $tries = 3;

    public $records;
    public $index;
    protected $yesterday;

    /**
     * Create a new message instance.
     * @param $records
     */
    public function __construct($records)
    {
        error_log('constructing email...');
        $this->records = $records;
        $this->index = 0;
        $this->yesterday = Carbon::yesterday()->format('Y/m/d');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        error_log('building email...');
        return $this->subject('[Exit Confirmation Omission Alert] ' . $this->yesterday)
            ->view('emails.exit-confirmation-omission');
    }

    /**
     * The job failed to process.
     *
     * @return void
     */
    public function failed()
    {
        error_log('emailing failed...');
    }
}
