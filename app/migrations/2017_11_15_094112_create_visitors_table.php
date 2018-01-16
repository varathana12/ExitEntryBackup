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
            $table->string('email');
            $table->integer('admin_id')->unsigned()->index();
            $table->integer('used_company_id')->unsigned()->index();
            $table->timestamps();


        });

        Schema::table('visitors', function($table) {
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
        Schema::dropIfExists('visitors');
    }
}
