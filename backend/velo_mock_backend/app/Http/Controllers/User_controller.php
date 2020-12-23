<?php

//这俩头文件是用来使用数据库模块和controller模块的
namespace App\Http\Controllers;

use App\Model\CCLExamScore;
use App\Model\IeltsAExamScore;
use App\Model\Product;
use http\Env\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Laravel\Lumen\Routing\Controller as BaseController;
use GuzzleHttp;


class User_controller extends BaseController
{

    public function GetUserInfo(Request $request)
    {
        $this->validate($request, [
            'userID'    => 'required',

        ]);
        $userid = $request->input("userID", "0");
        $data = DB::table("User")->where("user_ID", "=", $userid)->select("Email", "Country", "City", "username", "pte_Voucher", "ccl_Voucher", "ielts_Voucher", "expert_pte_Voucher", "expert_ccl_Voucher", "expert_ielts_Voucher", "isVIP", "VIPStart", "VIPEnd", "loginday")->get()->first();
        return response()->json(["msg" => "succeed", "data" => $data]);
    }


    public function SetCountryCity(Request $request)
    {
        $this->validate($request, [
            'userID'    => 'required',
            "Country" => "required",
            "City" => "required",
        ]);
        $userid = $request->input("userID", "0");
        $Country = $request->input("Country");
        $City = $request->input("City");

        DB::table("User")->where("user_ID", "=", $userid)->update(["Country" => $Country, "City" => $City]);
        return response()->json(["msg" => "succeed"]);
    }

    #获取考试卷list
    public function GetPaperList(Request $request)
    {
        ## type
        ## isFree
        ## userID
        $type = $request->input("type", "pte");
        $isFree = $request->input("isFree", "-1");
        $userID = $request->input("userID", "0");


        $userExist = DB::table("User")->where("user_ID", "=", $userID)->get();
        if (sizeof(json_decode($userExist, "true")) == 0) {
            return response()->json(array("errmsg" => "user not exist"), 400);
        }

        $PaperID = DB::table("User_Paper")->where("user_ID", "=", $userID)->select("Paper_ID", "FinishScore")->orderBy("FinishTime")->get();
        $PaperID = json_decode($PaperID, "true");
        $FinishIDArray = array();
        #用paperid做字典，方便之后检查做过没
        #格式{"1":"7.0"}
        foreach ($PaperID as $currentID) {

            $FinishIDArray[$currentID['Paper_ID']] = $currentID["FinishScore"];
        }
        if ($isFree != "-1")
            $All_PaperID = DB::table("Paper_Info")->where("type", "=", $type)->where("isFree", "=", $isFree)->where("isActive", "=", 1)->orderByDesc("CreateAt")->get();
        else
            $All_PaperID = DB::table("Paper_Info")->where("type", "=", $type)->where("isActive", "=", 1)->orderByDesc("CreateAt")->get();


        $All_PaperID = json_decode($All_PaperID, "true");
        $ReturnArray = array();
        foreach ($All_PaperID as $currentItem) {
            $isFinish =  array_key_exists($currentItem["Paper_ID"], $FinishIDArray);
            $currentData = array();
            #判断做过没
            if ($isFinish) {
                $currentData["Paper_ID"] = $currentItem['Paper_ID'];

                $currentData["Score"] = $FinishIDArray[$currentItem["Paper_ID"]];
                $currentData["Paper_Name"] = $currentItem["Paper_Name"];
                $currentData["isFinish"] = true;
                $currentData["ReleasedDate"] = $currentItem["CreateAt"];
                $currentData["isFree"] = $currentItem["isFree"] == 0 ? false : true;
            } else {
                $currentData["Paper_ID"] = $currentItem['Paper_ID'];
                $currentData["Score"] = "0.0";
                $currentData["Paper_Name"] = $currentItem["Paper_Name"];
                $currentData["isFinish"] = false;
                $currentData["ReleasedDate"] = $currentItem["CreateAt"];
                $currentData["isFree"] = $currentItem["isFree"] == 0 ? false : true;
            }
            array_push($ReturnArray, $currentData);
        }

        return response()->json($ReturnArray);
    }

    #开始考试
    public function IeltsExamStart(Request $request)
    {
        $user_ID = $request->post("userID", "0");
        $Page_ID = $request->post("PaperID", "0");
        $ExamType = $request->post("ExamType", "0");


        //        $checkRecord = DB::table("User_Paper")->where("user_ID","=",$user_ID)->where("Paper_ID","=",$Page_ID)->get();
        //        if(sizeof($checkRecord)==0)
        //        {
        $userInfo = DB::table("User")->where("user_ID", "=", $user_ID)->get();
        $userInfo = json_decode($userInfo, "true");
        if (sizeof($userInfo) > 0) {
            $paperExist = DB::table("Paper_Info")->where("Paper_ID", "=", $Page_ID)->where("Type", "=", $ExamType)->get();
            $paperExist = json_decode($paperExist, "true");
            if (sizeof($paperExist) > 0) {
                if ($paperExist[0]["isFree"] == "1") {
                    $time = date('Y-m-d H:i:s');
                    $examID = base64_encode($user_ID . ";" . $ExamType . ";" . $Page_ID . ";" . $time);

                    $userdata = array("user_ID" => $user_ID, "ExamID" => $examID, "Paper_ID" => $Page_ID, "FinishTime" => $time, "FinishScore" => "0.0");

                    //使用事务保证插入数据库不会出错

                    DB::beginTransaction();
                    try {
                        DB::table("User_Paper")->insert($userdata);
                        $IeltsAExamScoreData = array("ExamID" => $examID, "user_ID" => $user_ID, "ExamType" => $ExamType, "Listening_Score" => 0.0, "Reading_Score" => 0.0,  "Speaking_Score" => 0.0,  "Writing_Score" => 0.0, "status" => 1, "isFree" => 1, "isExpert" => 0, "isAudioExist" => 0, "CreateAt" => $time);
                        DB::table("Ielts_A_ExamScore")->insert($IeltsAExamScoreData);
                        DB::commit();
                        return response()->json(array("msg" => "succeed", "ExamID" => $examID));
                    } catch (ModelNotFoundException $e) {
                        DB::rollBack();
                        return response()->json(array("msg" => "exception happened"), 400);
                    }
                } else {
                    if ((int)$userInfo[0]["ielts_Voucher"] > 0) {
                        $newVoucherValue = (int)$userInfo[0]["ielts_Voucher"] - 1;
                        $UserInfoUpdate = array("ielts_Voucher" => $newVoucherValue);
                        $time = date('Y-m-d H:i:s');
                        $examID = base64_encode($user_ID . ";" . $ExamType . ";" . $Page_ID . ";" . $time);

                        $userdata = array("user_ID" => $user_ID, "ExamID" => $examID, "Paper_ID" => $Page_ID, "FinishTime" => $time, "FinishScore" => "0.0");
                        //使用事务保证插入数据库不会出错
                        DB::beginTransaction();

                        try {
                            DB::table("User_Paper")->insert($userdata);
                            $IeltsAExamScoreData = array("ExamID" => $examID, "user_ID" => $user_ID, "ExamType" => $ExamType, "Listening_Score" => 0.0, "Reading_Score" => 0.0,  "Speaking_Score" => 0.0,  "Writing_Score" => 0.0, "status" => 0, "isFree" => 0, "isExpert" => 0, "isAudioExist" => 0, "CreateAt" => $time);
                            DB::table("Ielts_A_ExamScore")->insert($IeltsAExamScoreData);
                            DB::table("User")->where("user_ID", "=", $user_ID)->update($UserInfoUpdate);
                            DB::commit();
                            return response()->json(array("msg" => "succeed", "ExamID" => $examID));
                        } catch (\Exception $e) {
                            DB::rollBack();
                            return response()->json(array("msg" => "exception happened"), 400);
                        }
                    } else {
                        return response()->json(array("msg" => "lack of Ielts Voucher"), 400);
                    }
                }
            } else {
                return response()->json(array("msg" => "paper is not exist"), 400);
            }
        } else {
            return response()->json(array("msg" => "user is not exist"), 400);
        }
        //        }
        //        else
        //            return response()->json(array("msg"=>"user has finished this exam"));
    }

    #CCL开始考试
    public function CCLExamStart(Request $request)
    {
        $user_ID = $request->post("userID", "0");
        $Page_ID = $request->post("PaperID", "0");
        $ExamType = $request->post("ExamType", "0");

        $userInfo = DB::table("User")->where("user_ID", "=", $user_ID)->get();
        $userInfo = json_decode($userInfo, "true");
        if (sizeof($userInfo) > 0) {
            $paperExist = DB::table("Paper_Info")->where("Paper_ID", "=", $Page_ID)->where("Type", "=", $ExamType)->get();
            $paperExist = json_decode($paperExist, "true");
            if (sizeof($paperExist) > 0) {
                if ($paperExist[0]["isFree"] == "1") {
                    $time = date('Y-m-d H:i:s');
                    $examID = base64_encode($user_ID . ";" . $ExamType . ";" . $Page_ID . ";" . $time);

                    $userdata = array("user_ID" => $user_ID, "ExamID" => $examID, "Paper_ID" => $Page_ID, "FinishTime" => $time, "FinishScore" => "0.0");

                    //使用事务保证插入数据库不会出错

                    DB::beginTransaction();
                    try {
                        DB::table("User_Paper")->insert($userdata);
                        $CCLExamScoreData = array("ExamID" => $examID, "user_ID" => $user_ID, "ExamType" => $ExamType, "Dialogue1_Score" => 0.0, "Dialogue2_Score" => 0.0, "status" => 1, "isFree" => 1, "isExpert" => 0, "isAudioExist" => 0, "CreateAt" => $time);
                        DB::table("CCL_ExamScore")->insert($CCLExamScoreData);
                        DB::commit();
                        return response()->json(array("msg" => "succeed", "ExamID" => $examID));
                    } catch (ModelNotFoundException $e) {
                        DB::rollBack();
                        return response()->json(array("msg" => "exception happened"), 400);
                    }
                } else {
                    if ((int)$userInfo[0]["ccl_Voucher"] > 0) {
                        $newVoucherValue = (int)$userInfo[0]["ccl_Voucher"] - 1;
                        $UserInfoUpdate = array("ccl_Voucher" => $newVoucherValue);
                        $time = date('Y-m-d H:i:s');
                        $examID = base64_encode($user_ID . ";" . $ExamType . ";" . $Page_ID . ";" . $time);

                        $userdata = array("user_ID" => $user_ID, "ExamID" => $examID, "Paper_ID" => $Page_ID, "FinishTime" => $time, "FinishScore" => "0.0");
                        //使用事务保证插入数据库不会出错
                        DB::beginTransaction();

                        try {
                            DB::table("User_Paper")->insert($userdata);
                            $CCLExamScoreData = array("ExamID" => $examID, "user_ID" => $user_ID, "ExamType" => $ExamType, "Dialogue1_Score" => 0.0, "Dialogue2_Score" => 0.0, "status" => 0, "isFree" => 0, "isExpert" => 0, "isAudioExist" => 0, "CreateAt" => $time);
                            DB::table("CCL_ExamScore")->insert($CCLExamScoreData);
                            DB::table("User")->where("user_ID", "=", $user_ID)->update($UserInfoUpdate);
                            DB::commit();
                            return response()->json(array("msg" => "succeed", "ExamID" => $examID));
                        } catch (\Exception $e) {
                            DB::rollBack();
                            return response()->json(array("msg" => "exception happened"), 400);
                        }
                    } else {
                        return response()->json(array("msg" => "lack of CCL Voucher"), 400);
                    }
                }
            } else {
                return response()->json(array("msg" => "paper is not exist"), 400);
            }
        } else {
            return response()->json(array("msg" => "user is not exist"), 400);
        }
        //        }
        //        else
        //            return response()->json(array("msg"=>"user has finished this exam"));
    }

    #当前能用的优惠券//同时删去过期的
    public function GetPromotionInfo(Request $request)
    {
        $UserID = $request->input("userID", "-1");
        $userdata = DB::table("User")->where("user_ID", "=", $UserID)->get();
        $userdata = json_decode($userdata, "true");
        DB::beginTransaction();
        try {
            if (sizeof($userdata) == 1) {

                $voucher_code = $userdata[0]["Promo_Voucher"];
                $voucher_code = json_decode($voucher_code, "true");
                $userfularray = array();
                $time = date("y-m-d H:i:s");
                foreach ($voucher_code as $key => $value) {
                    $tempkeyUser = array(); //保存当前键值还能有的券的信息

                    foreach ($value as $index => $eachItem) {
                        $expriedData = date('Y-m-d H:i:s', strtotime("+" . $eachItem["duration"] . " day", strtotime($eachItem["CreateAt"]))); //获取当前券过期时间

                        if (strtotime($time) < strtotime($expriedData)) //如果过期时间小于于当前服务器时间
                        {
                            array_push($tempkeyUser, $voucher_code[$key][$index]); //加进去
                        }
                    }
                    if (sizeof($tempkeyUser) > 0) {
                        $userfularray[$key] = $tempkeyUser;
                    }
                }
            }


            //更新用户表优惠券field的信息
            $updateUser = array("Promo_Voucher" => json_encode($userfularray));


            //更新
            DB::table("User")->where("user_ID", "=", $UserID)->update($updateUser);
            DB::commit();
            return response()->json(array("msg" => "succeed", "data" => json_decode($updateUser["Promo_Voucher"])));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(array("msg" => "error"));;
        }
    }




    #激活优惠券
    public function ActivateGiftCode(Request $request)
    {
        $code = $request->post("code");
        $userid = $request->post("userID");
        DB::beginTransaction();
        try {
            $codeinfo = DB::table("Gift_pack")->where("Voucher_code", "=", $code)->lockForUpdate()->get();
            $codeinfo = json_decode($codeinfo, true);
            error_log($codeinfo[0]["status"]);
            if ($codeinfo[0]["status"] == 0) {
                if (date('Y-m-d H:i:s') > $codeinfo[0]['start_day']) {
                    if (date('Y-m-d H:i:s') < date('Y-m-d', strtotime($codeinfo[0]['start_day'] . (string)$codeinfo[0]['duration'] . ' days'))) {
                        DB::table("User")->where("user_ID", "=", $userid)->increment("pte_Voucher", $codeinfo[0]['pte_Voucher']);
                        DB::table("User")->where("user_ID", "=", $userid)->increment("ielts_Voucher", $codeinfo[0]['ielts_Voucher']);
                        DB::table("User")->where("user_ID", "=", $userid)->increment("ccl_Voucher", $codeinfo[0]['ccl_Voucher']);
                        DB::table("User")->where("user_ID", "=", $userid)->increment("expert_pte_Voucher", $codeinfo[0]['expert_pte_Voucher']);
                        DB::table("User")->where("user_ID", "=", $userid)->increment("expert_ielts_Voucher", $codeinfo[0]['expert_ielts_Voucher']);
                        DB::table("User")->where("user_ID", "=", $userid)->increment("expert_ccl_Voucher", $codeinfo[0]['expert_ccl_Voucher']);

                        $vipinfo = DB::table("User")->where("user_ID", "=", $userid)->get();
                        $vipinfo = json_decode($vipinfo, true);

                        if ($vipinfo[0]["isVIP"] != "1") {
                            DB::table("User")->where("user_ID", "=", $userid)->lockForUpdate()->update([
                                "isVIP" => 1,
                                "VIPStart" => date('Y-m-d H:i:s'),
                                "VIPEnd" => date('Y-m-d H:i:s', strtotime(date('Y-m-d H:i:s') . (string)$codeinfo[0]['vip'] . ' days'))
                            ]);
                        }

                        if ($vipinfo[0]["isVIP"] == "1") {
                            if (date('Y-m-d H:i:s') < $vipinfo[0]["VIPEnd"]) {
                                DB::table("User")->where("user_ID", "=", $userid)->lockForUpdate()->update([
                                    "VIPEnd" => date('Y-m-d H:i:s', strtotime($vipinfo[0]["VIPEnd"] . (string)$codeinfo[0]['vip'] . ' days'))
                                ]);
                            } else {
                                DB::table("User")->where("user_ID", "=", $userid)->lockForUpdate()->update([
                                    "VIPStart" => date('Y-m-d H:i:s'),
                                    "VIPEnd" => date('Y-m-d H:i:s', strtotime(date('Y-m-d H:i:s') . (string)$codeinfo[0]['vip'] . ' days'))
                                ]);
                            }
                        }
                        DB::table("Gift_pack")->where("Voucher_code", "=", $code)->lockForUpdate()->update(["status" => 1]);
                        DB::commit();
                        return response()->json(array("msg" => "succeed"));
                    } else {
                        return response()->json(array("msg" => "Event is expired"), 400);
                    }
                } else {
                    return response()->json(array("msg" => "Event is not start yet!"), 400);
                }
            } else {
                return response()->json(array("msg" => "This code has already been activated"), 400);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(array("msg" => "error happened,please contact IT support"), 400);
        }
    }

    #激活优惠券
    public function ActivateCode(Request $request)
    {
        $code = $request->post("code");
        $userid = $request->post("userID");
        DB::beginTransaction();
        try {
            $codeinfo = DB::table("Promotion_Voucher")->where("Promot_code", "=", $code)->lockForUpdate()->get();
            $codeinfo = json_decode($codeinfo, true);
            if (sizeof($codeinfo) == 1) {
                if ($codeinfo[0]["isAvaliable"] == "1") {
                    if ($codeinfo[0]["user_ID"] != "") {           //这张是专属优惠券
                        if ($codeinfo[0]["user_ID"] == $userid) {
                            //更新用户表的field
                            $userinfo = DB::table("User")->where("user_ID", "=", $userid)->get();
                            $userinfo = json_decode($userinfo, true);
                            $user_voucher = $userinfo[0];
                            $insert_user_voucherData = array();
                            $insert_user_voucherData["code"] = $codeinfo[0]["Promot_code"];
                            $insert_user_voucherData["value"] = (string)$codeinfo[0]["value"];
                            $insert_user_voucherData["CreateAt"] = date('Y-m-d H:i:s');
                            $insert_user_voucherData["duration"] = (string)$codeinfo[0]["duration"];

                            $Promo_Voucher = json_decode($user_voucher["Promo_Voucher"], "true");
                            if (array_key_exists($codeinfo[0]["Promot_code_name"], $Promo_Voucher)) {     //判断以前是否存在这种优惠券
                                //如果存在
                                array_push($Promo_Voucher[$codeinfo[0]["Promot_code_name"]], $insert_user_voucherData);
                            } else {
                                $temparray = array(); //保证数组格式
                                array_push($temparray, $insert_user_voucherData);
                                $Promo_Voucher[$codeinfo[0]["Promot_code_name"]] = $temparray;
                            }
                            $updateUser = array("Promo_Voucher" => json_encode($Promo_Voucher));
                            DB::table("User")->where("user_ID", "=", $userid)->update($updateUser);
                            DB::table("Promotion_Voucher")->where("Promot_code", "=", $code)->update(array("isAvaliable" => 0));
                            DB::commit();
                            return response()->json(array("msg" => "succeed"));
                        } else {
                            return response()->json(array("msg" => "code and userid is not match or the code has been used"), 400);
                        }
                    } else { //这个是通用优惠券
                        $actedUser = $codeinfo[0]["user_ID_collection"];
                        $actedUserarray = explode(";", $codeinfo[0]["user_ID_collection"]);
                        foreach ($actedUserarray as $item) {
                            if ($item == $userid) {
                                return response()->json(array("msg" => "code has been activated")); //有就直接返回已激活
                            }
                        }
                        $actedUser = $actedUser . $userid . ";";

                        $userinfo = DB::table("User")->where("user_ID", "=", $userid)->get();
                        $userinfo = json_decode($userinfo, true);
                        $user_voucher = $userinfo[0];
                        $insert_user_voucherData = array();
                        $insert_user_voucherData["code"] = $codeinfo[0]["Promot_code"];
                        $insert_user_voucherData["value"] = (string)$codeinfo[0]["value"];
                        $insert_user_voucherData["CreateAt"] = date('Y-m-d H:i:s');
                        $insert_user_voucherData["duration"] = (string)$codeinfo[0]["duration"];

                        $Promo_Voucher = json_decode($user_voucher["Promo_Voucher"], "true");
                        if (array_key_exists($codeinfo[0]["Promot_code_name"], $Promo_Voucher)) { //判断以前是否存在这种优惠券

                            //如果存在
                            array_push($Promo_Voucher[$codeinfo[0]["Promot_code_name"]], $insert_user_voucherData);
                        } else {
                            $temparray = array(); //保证数组格式
                            array_push($temparray, $insert_user_voucherData);
                            $Promo_Voucher[$codeinfo[0]["Promot_code_name"]] = $temparray;
                        }

                        $updateUser = array("Promo_Voucher" => json_encode($Promo_Voucher));
                        DB::table("User")->where("user_ID", "=", $userid)->update($updateUser);
                        DB::table("Promotion_Voucher")->where("Promot_code", "=", $code)->update(array("user_ID_collection" => $actedUser));
                        DB::commit();
                        return response()->json(array("msg" => "succeed"));
                    }
                } else {
                    DB::commit();
                    return response()->json(array("msg" => "code is no avaliable"), 400);
                }
            } else {
                DB::commit();
                return response()->json(array("msg" => "code is no exist"), 400);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(array("msg" => "error happened,please contact IT support"), 400);
        }
    }

    //雅思目标分设定
    public function IELTSTargetSetting(Request $request)
    {
        $this->validate($request, [
            'userid'    => 'required',
            'target' => 'required',
            'examDate' => 'required'
        ]);

        $userid = $request->input("userid");
        $target = $request->input("target");
        $examDate = $request->input("examDate");
        $tagetinfo = DB::table("Ielts_A_Target_Score")->where("user_ID", "=", $userid)->get();
        if (sizeof($tagetinfo) > 0) {
            //假如目标分数存在就更新
            try {
                DB::table("Ielts_A_Target_Score")->where("user_ID", "=", $userid)->update(array("user_ID" => $userid, "Target_Score" => $target, "Exam_Date" => $examDate));
                return response()->json(["msg" => "succeed"]);
            } catch (\Exception $e) {
                return response()->json(["msg" => "update error"], 400);
            }
        } else {
            try {
                DB::table("Ielts_A_Target_Score")->insert(array("user_ID" => $userid, "Target_Score" => $target, "Exam_Date" => $examDate));
                return response()->json(["msg" => "succeed"]);
            } catch (\Exception $e) {
                return response()->json(["msg" => "insert error"], 400);
            }
        }
    }



    //获取雅思目标分数和考试日期
    public function IELTSTargetGet(Request $request)
    {
        $this->validate($request, [
            'userid'    => 'required'
        ]);

        $userid = $request->input("userid");

        $tagetinfo = DB::table("Ielts_A_Target_Score")->where("user_ID", "=", $userid)->get()->first();

        return response()->json(array("msg" => "succeed", "data" => $tagetinfo));
    }



    //用户获取考卷历史，根据用户id
    public function IELTSPaperHistoryByID(Request $request)
    {
        $this->validate($request, [
            'userid'    => 'required'
        ]);


        $userid = $request->input("userid");
        //        $paperid=$request->input("paperid");
        $IeltsAModel = new IeltsAExamScore();
        $histroy = $IeltsAModel->GetUserExamData($userid);
        return response()->json(array("msg" => "succeed", "data" => $histroy));
    }




    //用户登出
    public function UserLogout(Request $request)
    {
        Auth::invalidate(true);

        return response()->json(["msg" => "log out"]);
    }


    //获取考卷历史
    public function IELTSPaperHistory(Request $request)
    {
        $this->validate($request, [
            'userid'    => 'required'
        ]);


        $userid = $request->input("userid");


        $histroy = DB::table("Ielts_A_ExamScore")->join("User_Paper", "Ielts_A_ExamScore.ExamID", "=", "User_Paper.ExamID")->join("Paper_Info", "Paper_Info.Paper_ID", "=", "User_Paper.Paper_ID")->where("Ielts_A_ExamScore.user_ID", "=", $userid)->select("Paper_Info.Paper_ID", "Paper_Info.Paper_Name", "Ielts_A_ExamScore.ExamID as ExamID", "Ielts_A_ExamScore.user_ID as user_ID", "Ielts_A_ExamScore.Listening_Score as Listening_Score", "Ielts_A_ExamScore.Speaking_Score as Speaking_Score", "Ielts_A_ExamScore.Reading_Score", "Ielts_A_ExamScore.Writing_Score as Writing_Score", "Ielts_A_ExamScore.Status as Status", "Ielts_A_ExamScore.isAudioExist as isAudioExist", "User_Paper.FinishScore as FinishScore", "Ielts_A_ExamScore.CreateAt as CreateAt", "Ielts_A_ExamScore.isExpert as isExpert", "Ielts_A_ExamScore.isFree as isFree")->orderByDesc("CreateAt")->get();

        return response()->json(array("msg" => "succeed", "data" => $histroy));
    }


    //获取考试听力做过的考试答案和标准答案
    public function IELTSListeningHistoryAnswer(Request $request)
    {
        $this->validate($request, [
            'examID'    => 'required',

        ]);
        error_log("jaja");
        $examID = $request->input("examID", 0);
        $information = explode(";", base64_decode($examID));
        $paperid = $information[2];

        $ListeningQuestion = DB::table("Ielts_A_L_Question")->where("Paper_ID", "=", $paperid)->select(["L_Section1_Text as LQ1", "L_Section2_Text as LQ2", "L_Section3_Text as LQ3", "L_Section4_Text as LQ4"])->get()->first();
        $ListeningStandard =  DB::table("Ielts_A_L_Standard")->where("Paper_ID", "=", $paperid)->select(["Answer as LS"])->get();
        $ListeningStandard = json_decode($ListeningStandard, "true");
        $ListeningAnswer =  DB::table("Ielts_A_L_Answer")->where("ExamID", "=", $examID)->select(["Answer as LA"])->get();
        $ListeningAnswer = json_decode($ListeningAnswer, "true");
        $ListenHistory = array();
        $ListenHistory['ListeningQuestion'] = $ListeningQuestion;
        $ListenHistory['ListeningStandard'] = json_decode($ListeningStandard[0]["LS"], "true");
        //        $ListenHistory['ListeningAnswer']= json_decode($ListeningAnswer[0]["LA"],"true");
        if (sizeof($ListeningAnswer) > 0)
            $ListenHistory['ListeningAnswer'] = json_decode($ListeningAnswer[0]["LA"], "true");
        else {
            $tempanswer = array();
            for ($i = 1; $i < 41; $i++) {
                $tempanswer["LA" . $i] = "";
            }
            $ListenHistory['ListeningAnswer'] = $tempanswer;
        }

        return response()->json(["msg" => "succeed", "data" => $ListenHistory]);
    }




    //获取考试阅读做过的考试答案和标准答案
    public function IELTSReadingHistoryAnswer(Request $request)
    {
        $this->validate($request, [
            'examID'    => 'required'
        ]);
        $examID = $request->input("examID", 0);
        $information = explode(";", base64_decode($examID));
        $paperid = $information[2];

        $ReadingQuestion = DB::table("Ielts_A_R_Question")->where("Paper_ID", "=", $paperid)->select(["R_Section1_Text as RQ1", "R_Section2_Text as RQ2", "R_Section3_Text as RQ3"])->get()->first();
        $ReadingStandard =  DB::table("Ielts_A_R_Standard")->where("Paper_ID", "=", $paperid)->select(["Answer as RS"])->get();
        $ReadingStandard = json_decode($ReadingStandard, "true");
        $ReadingAnswer =  DB::table("Ielts_A_R_Answer")->where("ExamID", "=", $examID)->select(["Answer as RA"])->get();
        $ReadingAnswer = json_decode($ReadingAnswer, "true");
        $ReadHistory = array();
        $ReadHistory['ReadingQuestion'] = $ReadingQuestion;
        $ReadHistory['ReadingStandard'] = json_decode($ReadingStandard[0]["RS"], "true");
        if (sizeof($ReadingAnswer) > 0)
            $ReadHistory['ReadingAnswer'] = json_decode($ReadingAnswer[0]["RA"], "true");
        else {
            $tempanswer = array();
            for ($i = 1; $i < 41; $i++) {
                $tempanswer["RA" . $i] = "";
            }
            $ReadHistory['ReadingAnswer'] = $tempanswer;
        }


        return response()->json(["msg" => "succeed", "data" => $ReadHistory]);
    }

    //获取考试写作做过的考试答案和标准答案
    public function IELTSWritingHistoryAnswer(Request $request)
    {
        $this->validate($request, [
            'examID'    => 'required'
        ]);
        $examID = $request->input("examID", 0);
        $information = explode(";", base64_decode($examID));
        $paperid = $information[2];
        $isVIP = DB::table("User")->where("user_ID", "=", \Illuminate\Support\Facades\Auth::user()['user_ID'])->get()->first();
        $WritingStandard = array();
        if ($isVIP->isVIP == 1) {
            $WritingStandard["WritingStandard"] = DB::table("Ielts_A_W_Standard")->where("Paper_ID", "=", $paperid)->select(["W_Section_1_Standard", "W_Section_2_Standard"])->first();
        } else {
            $WritingStandard["WritingStandard"] = ["W_Section_1_Standard" => "", "W_Section_2_Standard" => ""];
        }

        $WritingQuestion = DB::table("Ielts_A_W_Question")->where("Paper_ID", "=", $paperid)->select(["W_Section_1_Text as WQ1", "W_Section_2_Text as WQ2"])->get()->first();
        $WritingAnswer = DB::table("Ielts_A_W_Answer")->where("ExamID", "=", $examID)->select(["WA1", "WA2"])->get()->first();
        $WritingComment = DB::table("Ielts_A_W_Comment")->where("ExamID", "=", $examID)->select(["WC1", "WS1", "WC2", "WS2"])->get()->first();

        $WritingHistory = array();
        $WritingHistory['WritingStandard'] = $WritingStandard["WritingStandard"];
        $WritingHistory["WritingQuestion"] = $WritingQuestion;
        if ($WritingAnswer != null) {
            $WritingHistory["WritingAnswer"] = $WritingAnswer;
        } else {
            $TWA = array(["WA1" => "", "WA2" => ""]);
            $WritingHistory["WritingAnswer"] = $TWA;
        }
        if ($WritingComment != null) {
            $WritingHistory['WritingComment'] = $WritingComment;
        } else {
            $temparray = array(["WC1" => "", "WS1" => 0, "WC2" => "", "WS2" => 0]);
            $WritingHistory['WritingComment'] = $temparray;
        }
        return response()->json(["msg" => "succeed", "data" => $WritingHistory]);
    }



    //获取考试口语做过的考试答案和标准答案
    public function IELTSSpeakingHistoryAnswer(Request $request)
    {
        $this->validate($request, [
            'examID'    => 'required'
        ]);
        $examID = $request->input("examID", 0);
        $information = explode(";", base64_decode($examID));
        $paperid = $information[2];
        //插三个表逐步拼接结果
        $SpeakingQuestion = DB::table("Ielts_A_S_Question")->where("Paper_ID", "=", $paperid)->get()->first();
        $SpeakingHistory = array();
        $SpeakingHistory["SQ1Audio"] = explode(";", $SpeakingQuestion->Section_1_AudioArray);
        $SpeakingHistory["SQ1TextArray"] = explode(";", $SpeakingQuestion->Section_1_TextArray);
        $SpeakingHistory["SQ2Text"] = $SpeakingQuestion->Section_2_Question;
        $SpeakingHistory["SQ3Audio"] = explode(";", $SpeakingQuestion->Section_3_AudioArray);
        $SpeakingHistory["SQ3TextArray"] = explode(";", $SpeakingQuestion->Section_3_TextArray);
        $SpeakingAnswer = DB::table("Ielts_A_S_Answer")->where("ExamID", "=", $examID)->get()->first();
        if ($SpeakingAnswer != null) {
            $SpeakingHistory["SA1Audio"] = explode(";", $SpeakingAnswer->SA1);
            $SpeakingHistory["SA2Audio"] = $SpeakingAnswer->SA2;
            $SpeakingHistory["SA3Audio"] = explode(";", $SpeakingAnswer->SA3);
        } else {
            $SpeakingHistory["SA1Audio"] = array();
            $SpeakingHistory["SA2Audio"] = "";
            $SpeakingHistory["SA3Audio"] = array();
        }
        $SpeakingScore = DB::table("Ielts_A_S_Comment")->where("ExamID", "=", $examID)->get()->first();
        if ($SpeakingScore != null) {
            $SpeakingHistory["SC"] = $SpeakingScore->SC;

            $SpeakingHistory["SS"] = $SpeakingScore->SS;
        } else {
            $SpeakingHistory["SC"] = "";

            $SpeakingHistory["SS"] = 0;
        }

        //        $WritingAnswer = DB::table("Ielts_A_W_Answer")->where("ExamID","=",$examID)->select(["WA1","WA2"])->get()->first();
        //        $WritingComment = DB::table("Ielts_A_W_Comment")->where("ExamID","=",$examID)->select(["WC1","WS1","WC2","WS2"])->get()->first();
        //
        //        $WritingHistory=array();
        //        $WritingHistory["WritingQuestion"]=$WritingQuestion;
        //        $WritingHistory["WritingAnswer"]=$WritingAnswer;
        //        $WritingHistory['WritingComment']= $WritingComment;
        return response()->json(["msg" => "succeed", "data" => $SpeakingHistory]);
    }


    public function GetUserExamDoing(Request $request)
    {
        $data = array(["Helen" => "IELTS|100", "Bear" => "IELTS|100", "Sam" => "IELTS|92", "Nicky" => "IELTS|92", "Kevin" => "IELTS|87", "Eric" => "IELTS|33", "Melody" => "IELTS|12", "Daniel" => "IELTS|6", "Ken" => "IELTS|6", "Simon" => "IELTS|6", "Evelen" => "IELTS|6", "Tallet" => "IELTS|6"]);
        return response()->json(["msg" => "succeed", "data" => $data]);
    }


    public function GetShopStore(Request $request)
    {

        $ProductModel = new Product();
        $data = $ProductModel->getUserShopStore();
        return response()->json(['msg' => "succeed", "data" => $data]);
    }


    public function UseExpertIeltsTicket(Request $request)
    {
        $this->validate($request, [
            'userID'    => 'required',
            'examID' => 'required'
        ]);
        $userid = $request->input("userID");
        $examid = $request->input('examID');
        $data = DB::table("User")->where("user_ID", "=", $userid)->get()->first();
        if ($data->expert_ielts_Voucher > 0) {  //防止hack，用token中的id和傳進去的id比較
            if (\Illuminate\Support\Facades\Auth::user()['user_ID'] == $userid) {
                DB::beginTransaction();
                DB::table("User")->where("user_ID", "=", $userid)->decrement("expert_ielts_Voucher", 1);
                DB::table("Ielts_A_ExamScore")->where("ExamID", "=", $examid)->update(['isExpert' => 1, "Status" => 0, "isFree" => 0]);
                DB::commit();
                return response()->json(["msg" => "succeed"]);
            } else {
                return response()->json(["msg" => "illegle hack"], 400);
            }
        }
    }

    //增加单词列表
    public function GetWordList(Request $request)
    {
        $this->validate($request, [
            'userID'    => 'required'
        ]);
        $userid = $request->input("userID");
        if (\Illuminate\Support\Facades\Auth::user()['user_ID'] == $userid) {
            $listExist = DB::table("Voca_book")->where("user_ID", "=", $userid)->get()->first();
            if ($listExist) {
                $listExist->wordlist = json_decode($listExist->wordlist, "true");
                return response()->json(["msg" => "succeed", "data" => $listExist]);
            } else {
                DB::table("Voca_book")->insert(["user_ID" => $userid, "wordlist" => "{}"]);
                $listExist = DB::table("Voca_book")->where("user_ID", "=", $userid)->get()->first();
                $listExist->wordlist = json_decode($listExist->wordlist, "true");
                return response()->json(["msg" => "succeed", "data" => $listExist]);
            }
        } else {
            return response()->json(["msg" => "user is not exist"], 400);
        }
    }


    public function AddWord(Request $request)
    {
        $this->validate($request, [
            'userID'    => 'required',
            'word' => 'required',
        ]);
        $userid = $request->input("userID");
        $word = strtolower($request->input("word"));
        if (\Illuminate\Support\Facades\Auth::user()['user_ID'] == $userid) {
            $userinfo = DB::table('User')->where('user_ID', '=', $userid)->get()->first();
            if ($userinfo->isVIP == 0) {
                return response()->json(["msg" => "failed,not a vip"], 400);
            }
            $listExist = DB::table("Voca_book")->where("user_ID", "=", $userid)->get()->first();
            if (!$listExist) {
                DB::table("Voca_book")->insert(["user_ID" => $userid, "wordlist" => "{}"]);
                $listExist = DB::table("Voca_book")->where("user_ID", "=", $userid)->get()->first();
            }


            $wordlist = json_decode($listExist->wordlist, "true");
            if (array_key_exists($word, $wordlist)) //判断是否已经存在这个单词了单词本
            {
                return response()->json(["msg" => "succeed"]);
            } else //如果单词不存在，判断大队列有没有这个单词
            {
                $wordexist = DB::table("All_Word_Book")->where("word", "=", $word)->get()->first();
                if ($wordexist) //大队列有
                {
                    $wordlist[$wordexist->word] = $wordexist->exp;
                    DB::table('Voca_book')->where("user_ID", "=", $userid)->update(["wordlist" => json_encode($wordlist)]);
                    return response()->json(["msg" => "succeed"]);
                } else {
                    $http = new GuzzleHttp\Client();
                    $url = "http://apii.dict.cn/mini.php?q=" . $word;
                    $headers = ["User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36"];
                    $getDict = $http->request("GET", $url, $headers)->getBody();

                    preg_match("/<span class=\'p\'>(.+?)<\/span>/i", $getDict, $pronun);
                    preg_match("/<div id=\"e\">(.+?)<\/div><br>/i", $getDict, $exp);
                    preg_match("/<div id=\"s\">(.+?)<br><\/div>/i", $getDict, $sentence);
                    $newword = array();
                    try {
                        $newword['word'] = $word;
                        $newword['pronun'] = str_replace("<br>", "\n ", $pronun[1]);
                        $newword['exp'] = str_replace("<br>", "\n ", $exp[1]);
                        $newword['sentence'] = str_replace("</em>", "", str_replace("<em>", "", str_replace("</i>", "", str_replace("<i>", "", str_replace("<br>", "\n", $sentence[1])))));
                    } catch (\Exception $e) {
                        return response()->json(["msg" => "that's not a word in english"], 400);
                    }

                    DB::beginTransaction();
                    try {
                        $wordlist[$word] = $newword['exp'];
                        DB::table('Voca_book')->where("user_ID", "=", $userid)->update(["wordlist" => json_encode($wordlist)]);
                        DB::table("All_Word_Book")->insert($newword);
                        DB::commit();
                        return response()->json(["msg" => "succeed"]);
                    } catch (\Exception $e) {
                        DB::rollBack();
                        return response()->json(["msg" => "insert error"], 400);
                    }
                }
            }
        } else {
            return response()->json(["msg" => "user is not exist"], 400);
        }
    }

    public function CheckWord(Request $request)
    {
        $this->validate($request, [
            'word' => 'required',
        ]);
        $word = $request->input("word");
        $data = DB::table("All_Word_Book")->where("word", "=", $word)->get()->first();
        return response()->json(["msg" => "succeed", "data" => $data]);
    }

    public function DelWord(Request $request)
    {
        $this->validate($request, [
            'userID'    => 'required',
            'word' => 'required',
        ]);
        $userid = $request->input("userID");
        $word = strtolower($request->input("word"));
        $listExist = DB::table("Voca_book")->where("user_ID", "=", $userid)->get()->first();
        if ($listExist) {
            $wordlist = json_decode($listExist->wordlist, "true");
            unset($wordlist[$word]);
            DB::table("Voca_book")->where("user_ID", "=", $userid)->update(["wordlist" => json_encode($wordlist)]);
            return response()->json(["msg" => "succeed"]);
        } else {
            return response()->json(["msg" => "user not exist"], 400);
        }
    }


    public function PurchaseOrder(Request $request)
    {
        $request->input("ProductID");
        $request->input("userID");
    }

    public function GetBannerImg(Request $request)
    {
        $data = DB::table("Index_banner_management")->get()->first();
        $data->left_banner = explode(";", $data->left_banner);
        $data->right_banner = explode(";", $data->right_banner);
        $data->left_banner_link = explode(";", $data->left_banner_link);
        $data->right_banner_link = explode(";", $data->right_banner_link);
        return response()->json(["msg" => "succeed", "data" => $data]);
    }

    //放弃考试
    public function Giveup(Request $request)
    {
        $this->validate($request, [
            'examID'    => 'required',
            'type'      => 'required'
        ]);

        $examID = $request->input("examID");
        $type = strtolower($request->input('type'));

        //放弃对应的考试并删除答案
        //Status=-1,isFree,老师列表不会出现
        if ($type == 'ielts') {
            DB::table("Ielts_A_ExamScore")->where("ExamID", "=", $examID)->update(["Status" => -1]);
            if ($answer = DB::table("Ielts_A_L_Answer")->where("ExamID", "=", $examID)) {
                $answer->delete();
            }
            if ($answer = DB::table("Ielts_A_R_Answer")->where("ExamID", "=", $examID)) {
                $answer->delete();
            }
            if ($answer = DB::table("Ielts_A_W_Answer")->where("ExamID", "=", $examID)) {
                $answer->delete();
            }
            if ($answer = DB::table("Ielts_A_S_Answer")->where("ExamID", "=", $examID)) {
                $answer->delete();
            }
        } else if ($type == 'ccl') {
            DB::table("CCL_ExamScore")->where("ExamID", "=", $examID)->update(["Status" => -1]);
            if ($answer = DB::table("CCL_Answer")->where("ExamID", "=", $examID)) {
                $answer->delete();
            }
        }
        return response()->json(["msg" => "succeed"]);
    }

    //CCL口語考試歷史
    public function CCLSpeakingHistoryAnswer(Request $request)
    {
        $this->validate($request, [
            'examID'    => 'required'
        ]);
        $examID = $request->input("examID", 0);
        $information = explode(";", base64_decode($examID));
        $paperid = $information[2];
        //插表拼接结果
        $SpeakingQuestion = DB::table("CCL_Question")->where("Paper_ID", "=", $paperid)->get()->first();
        $SpeakingHistory = array();
        $SpeakingHistory["Q1ScenarioAudio"] = explode(";", $SpeakingQuestion->Scenario_Audio_1);
        $SpeakingHistory["Q1Audio"] = explode(";", $SpeakingQuestion->Section1_Audio);
        $SpeakingHistory["Q2ScenarioAudio"] = explode(";", $SpeakingQuestion->Scenario_Audio_2);
        $SpeakingHistory["Q2Audio"] = explode(";", $SpeakingQuestion->Section2_Audio);

        $SpeakingAnswer = DB::table("CCL_Answer")->where("ExamID", "=", $examID)->get()->first();
       
        if ($SpeakingAnswer != null) {
            $SpeakingHistory["SA1Audio"] = explode(";", $SpeakingAnswer->Answer_1);
            $SpeakingHistory["SA2Audio"] = explode(";", $SpeakingAnswer->Answer_2);
            $SpeakingHistory["Pardon"] = explode("/",$SpeakingAnswer->Pardon );
        } else {
            $SpeakingHistory["SA1Audio"] = array();
            $SpeakingHistory["SA2Audio"] = array();
            $SpeakingHistory["Pardon"] = array();
        }
        $SpeakingScore = DB::table("CCL_Comment")->where("ExamID", "=", $examID)->get()->first();
        if ($SpeakingScore != null) {
            $SpeakingHistory["CCLC1"] = $SpeakingScore->CCLC1;
            $SpeakingHistory["CCLS1"] = $SpeakingScore->CCLS1;
            $SpeakingHistory["CCLC2"] = $SpeakingScore->CCLC2;
            $SpeakingHistory["CCLS2"] = $SpeakingScore->CCLS2;
        } else {
            $SpeakingHistory["CCLC1"] = "";
            $SpeakingHistory["CCLS1"] = 0;
            $SpeakingHistory["CCLC2"] = "";
            $SpeakingHistory["CCLS2"] = 0;
        }

        return response()->json(["msg" => "succeed", "data" => $SpeakingHistory]);
    }

    //CCL評分卷
    public function UseExpertCCLTicket(Request $request)
    {
        $this->validate($request, [
            'userID'    => 'required',
            'examID' => 'required'
        ]);
        $userid = $request->input("userID");
        $examid = $request->input('examID');
        $data = DB::table("User")->where("user_ID", "=", $userid)->get()->first();
        if ($data->expert_ielts_Voucher > 0) {  //防止hack，用token中的id和傳進去的id比較
            if (\Illuminate\Support\Facades\Auth::user()['user_ID'] == $userid) {
                DB::beginTransaction();
                DB::table("User")->where("user_ID", "=", $userid)->decrement("expert_CCL_Voucher", 1);
                DB::table("CCL_ExamScore")->where("ExamID", "=", $examid)->update(['isExpert' => 1, "Status" => 0, "isFree" => 0]);
                DB::commit();
                return response()->json(["msg" => "succeed"]);
            } else {
                return response()->json(["msg" => "illegle hack"], 400);
            }
        }
    }

    public function CCLPaperHistory(Request $request)
    {
        $this->validate($request, [
            'userid'    => 'required'
        ]);


        $userid = $request->input("userid");


        $histroy = DB::table("CCL_ExamScore")->join("User_Paper", "CCL_ExamScore.ExamID", "=", "User_Paper.ExamID")->
        join("Paper_Info", "Paper_Info.Paper_ID", "=", "User_Paper.Paper_ID")->
        where("CCL_ExamScore.user_ID", "=", $userid)->
        select(
                "Paper_Info.Paper_ID",
                "Paper_Info.Paper_Name",
                "CCL_ExamScore.ExamID as ExamID",
                "CCL_ExamScore.user_ID as user_ID",
                "CCL_ExamScore.Dialogue1_Score as Dialogue1_Score",
                "CCL_ExamScore.Dialogue2_Score as Dialogue2_Score",
                "CCL_ExamScore.Status as Status",
                "CCL_ExamScore.isAudioExist as isAudioExist",
                "User_Paper.FinishScore as FinishScore",
                "CCL_ExamScore.CreateAt as CreateAt",
                "CCL_ExamScore.isExpert as isExpert",
                "CCL_ExamScore.isFree as isFree"
            )->orderByDesc("CreateAt")->get();

        return response()->json(array("msg" => "succeed", "data" => $histroy));
    }


    public function CCLPaperHistoryByID(Request $request)
    {
        $this->validate($request, [
            'userid'    => 'required'
        ]);

        $userid = $request->input("userid");
        //$paperid=$request->input("paperid");
        $CCLModel = new CCLExamScore();
        $histroy = $CCLModel->GetUserExamData($userid);
        return response()->json(array("msg" => "succeed", "data" => $histroy));
    }
}
