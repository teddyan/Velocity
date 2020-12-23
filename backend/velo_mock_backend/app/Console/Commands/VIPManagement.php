<?php


namespace App\Console\Commands;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
class VIPManagement extends Command
{

    protected $name = 'VIPManagement';
    public function handle()
    {
        //VIP定期检测修改状态
        DB::table("User")->where("VIPEnd","<",date('Y-m-d H:i:s'))->update(["isVIP"=>"0","AudioTime"=>3]);
        //
        $vipData = DB::table("VIP_Right")->get()->first();
        $expireDate =  date('Y-m-d H:i:s', strtotime("+1 month", strtotime($vipData->OperateTime)));
        if(strtotime(date('Y-m-d H:i:s'))>strtotime($expireDate)) {
            try {
                DB::beginTransaction();
                DB::table("VIP_Right")->update(["OperateTime" => date('Y-m-d H:i:s')]);
                DB::table("User")->where("isVIP", "=", 1)->increment("expert_ielts_Voucher", $vipData->expert_ielts_Voucher);
                DB::table("User")->where("isVIP", "=", 1)->increment("expert_pte_Voucher", $vipData->expert_pte_Voucher);
                DB::table("User")->where("isVIP", "=", 1)->increment("expert_ccl_Voucher", $vipData->expert_ccl_Voucher);
                DB::table("User")->where("isVIP", "=", 1)->increment("ielts_Voucher", $vipData->ielts_Voucher);
                DB::table("User")->where("isVIP", "=", 1)->increment("pte_Voucher", $vipData->pte_Voucher);
                DB::table("User")->where("isVIP", "=", 1)->increment("ccl_Voucher", $vipData->ccl_Voucher);
                DB::commit();
            }
            catch (\Exception $e)
            {

                DB::rollBack();

            }
        }
    }

}
