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
            $table->increments('exit_confirmer_id');
            $table->string('id_name');
            $table->integer('update_manager_id')->unsigned()->nullable();
            $table->integer('used_company_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('exit_confirmers', function(Blueprint $table) {
            $table->foreign('update_manager_id')->references('administrator_id')->on('administrators');
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
