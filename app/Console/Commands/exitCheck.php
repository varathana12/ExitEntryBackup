<?php

namespace App\Console\Commands;

use App\Visitor;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Mail;
use App\EntryExitInformation;
use Carbon\Carbon;
use DateTime;
use App\Administrator;
class exitCheck extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:exit_alert';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {

        Log::info("query");
        $date = Carbon::now();
        $entry_exit = EntryExitInformation::groupBy(USED_COMPANY_ID)
            ->where(ENTRY_DATETIME,'<=',$date)
            ->where(EXIT_DATETIME,null)
            ->get();
        if(count($entry_exit)>0){

            foreach( $entry_exit as $value ) {
                $send_email = EntryExitInformation::where(USED_COMPANY_ID,$value->used_company_id)
                    ->where(ENTRY_DATETIME,'<=',$date)
                    ->where(EXIT_DATETIME,null)
                    ->get();
                $admin = Administrator::where(USED_COMPANY_ID,$value->used_company_id)
                    ->first();
                $data = array();
                foreach ($send_email as $member){
                    $visitor = Visitor::where(MEMBER_ID,$member->member_id)
                        ->select(NAME,COMPANY_NAME)
                        ->first();

                    $one  = array(NAME=>$visitor->name,COMPANY_NAME=>$visitor->company_name
                    ,ENTRY_DATETIME=>(new DateTime($member->entry_datetime))->format('Y/m/d H:i'),MEMBER_ID=>$member->member_id,
                        NUMBER_OF_VISITOR=>$member->number_of_visitor);

                    array_push($data,$one);

                }

                Mail::send(['html'=>'MailAlert.mail'],['data'=>$data],function($message) use ($admin){
                    $message->to($admin->email_address,'rathana15')->subject('batch process');
                    $message->from('varatahana12@gmail.com','rathana12');
                });
            }
            }


    }
}
