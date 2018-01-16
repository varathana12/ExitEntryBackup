<?php

namespace App\Console;

use App\Jobs\CheckExitConfirmationOmissions;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
//        'App\Console\Commands\exitCheck'
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        error_log('scheduling...');
//        $schedule->command('command:exit_alert')->dailyAt('00:00');
        /*
        |--------------------------------------------------------------------------
        | Exit Confirmation Omission Alert job schedule
        |--------------------------------------------------------------------------
        | To start queue worker listener instantly on the Terminal run:
        |   php artisan queue:work --queue=default,emails --tries=3
        | To configure cron job for this schedule, use this configuration:
        |   * * * * * php /somewhere/Entry-Exit-Management-System/artisan schedule:run >> /dev/null 2>&1
        |
        */
        $schedule->job(new CheckExitConfirmationOmissions())->dailyAt('00:00');
//        $schedule->job(new CheckExitConfirmationOmissions())->everyTenMinutes();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
