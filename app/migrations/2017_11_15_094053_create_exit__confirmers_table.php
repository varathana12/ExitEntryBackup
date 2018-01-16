<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExitConfirmersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exit_confirmers', function (Blueprint $table) {
            $table->increments('exit_confirm_id');
            $table->string('id_name');
            $table->dateTime('registered_datetime');
            $table->integer('admin_id')->unsigned()->index();
            $table->integer('used_company_id')->unsigned()->index();
            $table->timestamps();



        });
        Schema::table('exit_confirmers', function($table) {
            $table->foreign('admin_id')->references('admin_id')->on('administrators');
            $table->foreign('used_company_id')->references('used_company_id')->on('used_companies');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('exit_confirmers');
    }
}
