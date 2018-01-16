<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEntryExitsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('entry_exits', function (Blueprint $table) {
            $table->integer('member_id')->unsigned()->index();
            $table->integer('number_of_visitor');
            $table->dateTime('entry_datetime');
            $table->dateTime('exit_datetime');
            $table->dateTime('registered_datetime');
            $table->integer('exit_confirm_id')->unsigned()->index();
            $table->integer('admin_id')->unsigned()->index();
            $table->integer('used_company_id')->unsigned()->index();
            $table->timestamps();


        });

        Schema::table('entry_exits', function($table) {
            $table->foreign('member_id')->references('member_id')->on('visitors');
            $table->foreign('exit_confirm_id')->references('exit_confirm_id')->on('exit_confirmers');
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
        Schema::dropIfExists('entry_exits');
    }
}
