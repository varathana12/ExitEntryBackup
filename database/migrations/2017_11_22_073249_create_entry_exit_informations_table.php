<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEntryExitInformationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('entry_exit_informations', function (Blueprint $table) {

            $table->increments('entry_exit_information_id')->unsigned()->index();
            $table->integer('member_id')->unsigned()->index();
            $table->integer('number_of_visitor');
            $table->dateTime('entry_datetime');
            $table->dateTime('exit_datetime')->nullable();
            $table->integer('exit_confirmer_id')->unsigned()->nullable();
            $table->integer('update_manager_id')->unsigned()->nullable();
            $table->integer('used_company_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::table('entry_exit_informations', function(Blueprint $table) {
            $table->foreign('member_id')->references('member_id')->on('visitors');
            $table->foreign('exit_confirmer_id')->references('exit_confirmer_id')->on('exit_confirmers');
            $table->foreign('update_manager_id')->references('administrator_id')->on('administrators');
            $table->foreign('used_company_id')->references('used_company_id')->on('used_companies');
        });
    }

    public function down()
    {
        Schema::dropIfExists('entry_exit_informations');
    }
}
