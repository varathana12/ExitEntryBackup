<?php

namespace App\Mail;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ErrorDetection extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected $yesterday;

    public $tries = 3;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->yesterday = Carbon::yesterday()->format('Y/m/d');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $email = env('WEBIMPACT_ADMINS_EMAIL', 'administrator@webimpact.com');
        $name = env('WEBIMPACT_ADMINS_NAME', 'WebImpact Administrator');
        return $this->to($email, $name)
            ->subject('[Exit Confirmation Omission Alert] ' . $this->yesterday)
            ->view('emails.error-detection');
    }
}
