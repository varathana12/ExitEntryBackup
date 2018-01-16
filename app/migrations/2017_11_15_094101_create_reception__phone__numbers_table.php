<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReceptionPhoneNumbersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reception_phone_numbers', function (Blueprint $table) {
            $table->increments('reception_phone_id');
            $table->string('phone_number');
            $table->dateTime('registered_datetime');
            $table->integer('admin_id')->unsigned()->index();
            $table->integer('used_company_id')->unsigned()->index();
            $table->timestamps();


        });

        Schema::table('reception_phone_numbers', function($table) {
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
        Schema::dropIfExists('reception_phone_numbers');
    }
}
