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
            $table->string('reception_phone_number',20);
            $table->integer('update_manager_id')->unsigned();
            $table->integer('used_company_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('reception_phone_numbers', function(Blueprint $table) {
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
        Schema::dropIfExists('reception_phone_numbers');
    }
}
