<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class GiftPack extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Gift_pack', function (Blueprint $table) {
            $table->id();
            $table->integer('pte_Voucher');
            $table->integer('expert_pte_Voucher');
            $table->integer('ccl_Voucher');
            $table->integer('expert_ccl_Voucher');
            $table->integer('ielts_Voucher');
            $table->integer('expert_ielts_Voucher');
            $table->text('vip_Voucher');
            $table->text('voucher_code');
            $table->text('activity');
            $table->text('comment');
            $table->dateTime('start_day');
            $table->integer('duration');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('Gift_pack');
    }
}
