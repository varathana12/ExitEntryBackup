<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVisitorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('visitors', function (Blueprint $table) {
            $table->increments('member_id');
            $table->string('company_name');
            $table->string('name');
            $table->string('email_address');
            $table->string('phone_number',20);
            $table->integer('update_manager_id')->unsigned()->nullable();
            $table->integer('used_company_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('visitors', function(Blueprint $table) {
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
        Schema::dropIfExists('visitors');
    }
}
