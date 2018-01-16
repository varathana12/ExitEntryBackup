<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAdministratorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::create('administrators', function (Blueprint $table) {
            $table->increments('admin_id');
            $table->string('email');
            $table->mediumText('password');
            $table->dateTime('registered_datetime');
            $table->integer('used_company_id')->unsigned()->index();
            $table->timestamps();


        });

        Schema::table('administrators', function($table) {
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
        Schema::dropIfExists('administrators');
    }
}
