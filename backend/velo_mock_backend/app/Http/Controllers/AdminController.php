<?php

namespace App\Http\Controllers;

use App\Model\Product;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class AdminController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function GenerateGeneralPromotion(Request $request)
    {
        $code = $request->input("code","-1");
        $promotCodeName = $request->input("name","-1");
        $value = $request->input("value","0");
        $duration = $request->input("duration","0");
        $userconllection="[]";
        $userID="";
        $isAvaliable=1;
        $Comment = $request->input("comment","");

        $insertVoucher = array("Promot_code"=>$code,"Promot_code_name"=>$promotCodeName,"user_ID_collection"=> $userconllection,"user_ID"=>$userID,"value"=>$value,"duration"=>$duration,"isAvaliable"=>$isAvaliable,"Comment"=>$Comment);
        try {
            DB::table("Promotion_Voucher")->insert($insertVoucher);
            return response()->json(array("msg"=>"succeed"));
        }
        catch (\Exception $e)
        {
            return response()->json(array("msg"=>"insert error,maybe code is exists"),400);
        }
    }


    //有安全逻辑bug，暂时只能给客服用，不能外放给public，例如填入个人信息获取特殊激活码之类的
    public function GenerateSpecialPromotion(Request $request)
    {


        //三个核心参数生成code
        $time = date('Y-m-d H:i:s');//日期
        $value = $request->post("value","0");//券的价值
        $userID=$request->post("userID","-1");//用户userid

        $code =$this->MD5PromoteCode($userID,$time,$value);//激活码

        $promotCodeName = $request->input("name","-1");//码的名字类型

        $duration = $request->input("duration","0");//优惠券时长
        $userconllection="";

        $isAvaliable=1;
        $Comment = $request->input("comment","");

        $insertVoucher = array("Promot_code"=>$code,"Promot_code_name"=>$promotCodeName,"user_ID_collection"=> $userconllection,"user_ID"=>$userID,"value"=>$value,"duration"=>$duration,"isAvaliable"=>$isAvaliable,"Comment"=>$Comment);
        try {
            DB::table("Promotion_Voucher")->insert($insertVoucher);
            return response()->json(array("msg"=>array("userid"=>$userID, "code"=>$code)));
        }
        catch (\Exception $e)
        {
            return response()->json(array("msg"=>"insert error,maybe code is exists"),400);
        }
    }


    public function MD5PromoteCode($userID,$time,$value){
        $content = $userID.$value.$time;
        $code = MD5(MD5($content));
        return $code;


    }

    public function ChangeCodeStatus(Request $request)
    {
        $code = $request->post("code","-1");

        $codeinfo = DB::table("Promotion_Voucher")->where("Promot_code","=",$code)->get();
        $codeinfo = json_decode($codeinfo,"true");
        if(sizeof($codeinfo)==1)
        {if($codeinfo[0]["isAvaliable"]==1)
        {
            $updatecode= array("isAvaliable"=>0);
        }
        else{
            $updatecode= array("isAvaliable"=>1);
        }
        DB::table("Promotion_Voucher")->where("Promot_code","=",$code)->update($updatecode);
        return response()->json(array("msg"=>"succeed"));
        }
        else
        {
            return response()->json(array("msg"=>"code is not exist"),400);
        }


    }


    public function DeleteCode(Request $request)
    {
        $code = $request->post("code","-1");

        $codeinfo = DB::table("Promotion_Voucher")->where("Promot_code","=",$code)->get();
        $codeinfo = json_decode($codeinfo,"true");
        if(sizeof($codeinfo)==1)
        {

            DB::table("Promotion_Voucher")->where("Promot_code","=",$code)->delete();
            return response()->json(array("msg"=>"succeed"));
        }
        else
        {
            return response()->json(array("msg"=>"code is not exist"),400);
        }


    }


    //用于批量生成个人专属券，可能后期活动要用，例如前一百个参加xxx活动的送优惠券，此接口用于生成
    public function BatchActivityCodeGenerate(Request $request)
    {
            $numberofCode = $request->post("number","0");
            $activityName = $request->post("activity","NONE");
            $value = $request->post("value","0");
            $duration=$request->post("duration","0");
            if($numberofCode>0 && $activityName!="NONE")
            {
                    DB::beginTransaction();
                    try {
                        for ($i = 0; $i < $numberofCode; $i++) {
                            $time = date('Y-m-d H:i:s');
                            $code = MD5($activityName . $this->MD5PromoteCode("UNKNOWN", $time, $i));
                            $insertVoucher = array("Promot_code" => $code, "Promot_code_name" => $activityName . "券", "user_ID_collection" => "", "user_ID" => "UNKNOWN", "value" => $value, "duration" => $duration, "isAvaliable" => 1, "Comment" => "");
                            DB::table("Promotion_Voucher")->insert($insertVoucher);

                        }
                        DB::commit();
                        return response()->json(array("msg" => "succeed"));
                    }
                    catch (\Exception $e)
                    {
                        DB::rollBack();
                        return response()->json(array("msg" => "input data error"),400);
                    }
            }



            else
            {
                return response()->json(array("msg" => "input data error"),400);
            }
    }

    //雅思新卷子插入//未激活
    public function InsertIeltsPaper(Request $request)
    {
        $this->validate($request, [
            'papername'    => 'required',
            'isFree'=>"required"

        ]);
        $papername = $request->input("papername");
        $paperType= "ielts";
        $isFree = $request->input("isFree");
        $time = date('Y-m-d H:i:s');
        //先插卷子，然后获取最新卷子的id，因为卷子id是auto_increase的
        DB::table("Paper_Info")->insert(["Type"=>$paperType,"Paper_Name"=>$papername,"isFree"=>$isFree,"CreateAt"=>$time,"isActive"=>0]);
        $PaperID = DB::table("Paper_Info")->orderByDesc("CreateAt")->get()->first()->Paper_ID;
        $RAStand= array();
        $LAStand=array();
        for($i=1;$i<41;$i++)
        {
            $RAStand["RA".$i]="";
            $LAStand["SA".$i]="";
        }
        DB::beginTransaction();
        try
        {
            DB::table("Ielts_A_W_Standard")->insert(["Paper_ID"=>$PaperID,"W_Section_1_Standard"=>"standard","W_Section_2_Standard"=>"standard"]);
            DB::table("Ielts_A_W_Question")->insert(["Paper_ID"=>$PaperID,"W_Section_1_Text"=>"","W_Section_1_Imgpath"=>"","W_Section_2_Text"=>"","W_Section_2_Imgpath"=>""]);
            DB::table("Ielts_A_S_Question")->insert(["Paper_ID"=>$PaperID,"Section_1_AudioArray"=>"","Section_1_TextArray"=>"","Section_2_Question"=>"","Section_2_Image"=>"","Section_3_TextArray"=>"","Section_3_AudioArray"=>""]);
            DB::table("Ielts_A_L_Question")->insert(["Paper_ID"=>$PaperID,"L_Section1_Text"=>"","L_Section1_ImageSrc"=>"","L_Section1_AudioSrc"=>"","L_Section2_Text"=>"","L_Section2_ImageSrc"=>"","L_Section2_AudioSrc"=>"","L_Section3_Text"=>"","L_Section3_ImageSrc"=>"","L_Section3_AudioSrc"=>"","L_Section4_Text"=>"","L_Section4_ImageSrc"=>"","L_Section4_AudioSrc"=>""]);
            DB::table("Ielts_A_R_Question")->insert(["Paper_ID"=>$PaperID,"R_Section1_Text"=>"","R_Section1_ImageSrc"=>"","R_Section2_Text"=>"","R_Section2_ImageSrc"=>"","R_Section3_Text"=>"","R_Section3_ImageSrc"=>""]);
            DB::table("Ielts_A_L_Standard")->insert(["Paper_ID"=>$PaperID,"Answer"=>json_encode($LAStand)]);
            DB::table("Ielts_A_R_Standard")->insert(["Paper_ID"=>$PaperID,"Answer"=>json_encode($RAStand)]);
            DB::commit();
            return response()->json(["msg"=>"succeed"]);
        }
        catch (\Exception $e)

        {
            DB::rollBack();
            return response()->json(["msg"=>"insert error"],400);

        }





    }

    //雅思试卷名字修改
    public function updatePaperName(Request $request)
    {
        $this->validate($request, [
            'papername'    => 'required',
            'paperid'=>"required"
            ]);
        try{
            DB::table("Paper_Info")->where("Paper_ID","=",$request->input("paperid"))->update(["Paper_Name"=>$request->input("papername")]);
            return response()->json(["msg"=>"succeed"]);
        }
        catch(\Exception $e)
        {
            return response()->json(["msg"=>"paper maybe not exist"],400);
        }
    }

    //雅思隐藏学生界面卷子，就是不激活
    public function DeActivePaper(Request $request)
    {
        $this->validate($request, [
            'paperid'    => 'required|numeric'
        ]);
        try
        {
            DB::table("Paper_Info")->where("Paper_ID","=",$request->input("paperid"))->update(["isActive"=>0]);
            return response()->json(["msg"=>"succeed"]);
        }
        catch (\Exception $e)
        {
            return response()->json(["msg"=>"failed"],400);
        }
    }

    //雅思显示卷子
    public function ActivePaper(Request $request)
    {
        $this->validate($request, [
            'paperid'    => 'required|numeric'
        ]);
        try
        {
            DB::table("Paper_Info")->where("Paper_ID","=",$request->input("paperid"))->update(["isActive"=>1]);
            return response()->json(["msg"=>"succeed"]);
        }
        catch (\Exception $e)
        {
            return response()->json(["msg"=>"failed"],400);
        }
    }


    public function PaperSetFree(Request $request)
    {
        $this->validate($request, [
            'paperid'    => 'required|numeric'
        ]);
        try
        {
            DB::table("Paper_Info")->where("Paper_ID","=",$request->input("paperid"))->update(["isFree"=>1]);
            return response()->json(["msg"=>"succeed"]);
        }
        catch (\Exception $e)
        {
            return response()->json(["msg"=>"failed"],400);
        }
    }


    public function PaperSetUnFree(Request $request)
    {
        $this->validate($request, [
            'paperid'    => 'required|numeric'
        ]);
        try
        {
            DB::table("Paper_Info")->where("Paper_ID","=",$request->input("paperid"))->update(["isFree"=>0]);
            return response()->json(["msg"=>"succeed"]);
        }
        catch (\Exception $e)
        {
            return response()->json(["msg"=>"failed"],400);
        }
    }


    public function UserSetActive(Request $request)
    {
        $this->validate($request, [
            'userID'    => 'required'
        ]);
        try
        {
            DB::table("User")->where("user_ID","=",$request->input("userID"))->update(["isActive"=>1]);
            return response()->json(["msg"=>"succeed"]);
        }
        catch (\Exception $e)
        {
            return response()->json(["msg"=>"failed"],400);
        }
    }


    public function UserSetDeActive(Request $request)
    {
        $this->validate($request, [
            'userID'    => 'required'
        ]);
        try
        {
            DB::table("User")->where("user_ID","=",$request->input("userID"))->update(["isActive"=>0]);
            return response()->json(["msg"=>"succeed"]);
        }
        catch (\Exception $e)
        {
            return response()->json(["msg"=>"failed"],400);
        }
    }

    public function WritingPaperUpdate(Request $request){
        $this->validate($request, [
            'paperid'    => 'required',
            "section1"=>'required',
            'section2'=>'required',
            'section1Standard'=>'required',
            'section2Standard'=>'required',
        ]);
        $paperid = $request->input("paperid");
        $section_1_text=$request->input("section1");
        $section_2_text=$request->input("section2");
        $sectioin1Standard=$request->input("section1Standard");
        $sectioin2Standard=$request->input("section2Standard");
        DB::beginTransaction();
        try {

            DB::table("Ielts_A_W_Question")->where("Paper_ID", "=", $paperid)->update(['W_Section_1_Text' => $section_1_text, "W_Section_2_Text" => $section_2_text]);
            DB::table("Ielts_A_W_Standard")->where("Paper_ID", "=", $paperid)->update(['W_Section_1_Standard'=>$sectioin1Standard,"W_Section_2_Standard"=>$sectioin2Standard]);
            DB::commit();
            return response()->json(['msg'=>"succeed"]);
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(['msg'=>"fail"]);
        }

    }

    //口语插入
    public function SpeakingPaperUpdate(Request $request)
    {

        $this->validate($request, [
            'paperid'    => 'required',
            "Section_1_AudioArray" =>"required",
            "Section_1_TextArray"=>"required",
            "Section_2_Question"=>"required",
            "Section_3_AudioArray"=>"required",
            "Section_3_TextArray"=>"required"

        ]);
        //4个数组，分别保存s1文本，S3文本，S3音频
      DB::table("Ielts_A_S_Question")->where("Paper_ID","=",$request->input("paperid"))->update(["Section_1_AudioArray"=>$request->input("Section_1_AudioArray"),"Section_3_AudioArray"=>$request->input("Section_3_AudioArray"),"Section_2_Question"=>$request->input("Section_2_Question"),"Section_3_TextArray"=>$request->input("Section_3_TextArray"),"Section_1_TextArray"=>$request->input("Section_1_TextArray")]);
      return \response()->json(["msg"=>"succeed"]);



    }
    //阅读插入
    public function ReadingPaperUpdate(Request $request)
    {
        $this->validate($request, [
            'paperid'    => 'required',
            "section1"=>'required',
            'section2'=>'required',
            'section3'=>'required',
        ]);
        $paperid = $request->input("paperid");
        $section1=$request->input("section1");
        $section2=$request->input("section2");
        $section3=$request->input("section3");
        $readingstand = array();
        for($i=1;$i<41;$i++)
        {
            $readingstand["RA".$i]=$request->input("RA".$i,"");
        }
        $readingstand=json_encode($readingstand);

        DB::beginTransaction();
        try
        {
            DB::table("Ielts_A_R_Question")->where("Paper_ID","=",$paperid)->update(['R_Section1_Text'=>$section1,"R_Section2_Text"=>$section2,"R_Section3_Text"=>$section3]);
            DB::table("Ielts_A_R_Standard")->where("Paper_ID","=",$paperid)->update(["Answer"=>$readingstand]);
            DB::commit();
            return response()->json(['msg'=>"succeed"]);
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(['msg'=>"fail"]);

        }


    }

    //听力插入
    public function ListeningPaperUpdate(Request $request)
    {
//        'paperid'    => 'required',
//            "Section1Text"=>'required',
//            'Section2Text'=>'required',
//            'Section3Text'=>'required',
//            'Section4Text'=>'required',
        //    'Section1Audio
        //    'Section2Audio
        $this->validate($request, [
            'paperid'    => 'required',
            "Section1Text"=>'required',
            'Section2Text'=>'required',
            'Section3Text'=>'required',
            'Section4Text'=>'required',
        ]);
        $paperid = $request->input("paperid");
        $section1=$request->input("Section1Text");
        $section2=$request->input("Section2Text");
        $section3=$request->input("Section3Text");
        $section4=$request->input("Section4Text");
        $listeningstand = array();
        $listeningAudio = array();
        for($i=1;$i<41;$i++)
        {
            $listeningstand["LA".$i]=$request->input("LA".$i,"");
        }
        $listeningstand=json_encode($listeningstand);
        $audiofile = $request->allFiles();

        foreach ($audiofile as $key=>$value)
        {
            $path = "AUDIO/PAPER".$paperid."/Listening";
            $audiofile[$key]->move($path,$key.".mp3");
            $path="/".$path."/".$key.".mp3";
            if(strstr($key,"Section1"))
                $listeningAudio["L_Section1_AudioSrc"]=$path;
            elseif(strstr($key,"Section2"))
                $listeningAudio["L_Section2_AudioSrc"]=$path;
            elseif(strstr($key,"Section3"))
                $listeningAudio["L_Section3_AudioSrc"]=$path;
            else
                $listeningAudio["L_Section4_AudioSrc"]=$path;

        }

        DB::beginTransaction();
        try
        {
            DB::table("Ielts_A_L_Question")->where("Paper_ID","=",$paperid)->update(array_merge(['L_Section1_Text'=>$section1,"L_Section2_Text"=>$section2,"L_Section3_Text"=>$section3,"L_Section4_Text"=>$section4],$listeningAudio));
            DB::table("Ielts_A_L_Standard")->where("Paper_ID","=",$paperid)->update(["Answer"=>$listeningstand]);
            DB::commit();
            return response()->json(['msg'=>"succeed"]);
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(['msg'=>"fail"]);

        }


    }

    //用戶信息
    public function UserInfo(Request $request)
    {
        $data = DB::table("User")->select("user_ID","Email","Promo_Voucher","role_ID","Country","City","username","AudioTime","pte_Voucher","ccl_Voucher","ielts_Voucher","expert_pte_Voucher","expert_ielts_Voucher","expert_ccl_Voucher","isActive","isVIP","VIPStart","VIPEnd")->get();
        return response()->json(["msg"=>"succeed","data"=>$data]);
    }

    //试卷信息
    public function PaperInfo(Request $request)
    {
        $this->validate($request, [
            'type'    => 'required',

        ]);
        $type = $request->input("type");

        $data = DB::table("Paper_Info")->where("Type","=",$type)->orderByDesc("CreateAt")->get();
        return response()->json(["msg"=>"succeed","data"=>$data]);
    }


    //设置vip
    public function SetVIP(Request $request)
    {
        $this->validate($request,[
            "userid"=>"required"
    ]);
        try {
            DB::table("User")->where("user_ID", "=", $request->input("userid"))->update(["isVIP" => 1, "VIPStart" => date('Y-m-d H:i:s'), "VIPEnd" => date('Y-m-d H:i:s', strtotime("+1 day", strtotime(date('Y-m-d H:i:s'))))]);
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            return response()->json(["msg"=>"faild"],400);
        }

    }
    //取消vip
    public function unSetVIP(Request $request)
    {

            $this->validate($request, [
                "userid" => "required"
            ]);
            try {
                DB::table("User")->where("user_ID", "=", $request->input("userid"))->update(["isVIP" => 0, "VIPStart" => date('Y-m-d H:i:s'), "VIPEnd" => date('Y-m-d H:i:s')]);
                return response()->json(["msg" => "succeed"], 200);
            } catch (\Exception $e) {
                return response()->json(["msg" => "faild"], 400);
            }



    }




    //setIelsVoucher
    public function setIeltsVoucher(Request $request){
        $this->validate($request,[
            "userid"=>"required",
            "ieltsvoucher"=>"required|numeric"
        ]);
        try {
            DB::table("User")->where("user_ID", "=", $request->input("userid"))->update(["ielts_Voucher" => $request->input("ieltsvoucher")]);
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            return response()->json(["msg"=>"faild"],400);
        }

    }
    //setPTEVoucher
    public function setPteVoucher(Request $request){
        $this->validate($request,[
            "userid"=>"required",
            "ptevoucher"=>"required|numeric"
        ]);
        try {
            DB::table("User")->where("user_ID", "=", $request->input("userid"))->update(["pte_Voucher" => $request->input("ptevoucher")]);
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            return response()->json(["msg"=>"faild"],400);
        }

    }

    //setPTEVoucher
    public function setCclVoucher(Request $request){
        $this->validate($request,[
            "userid"=>"required",
            "cclvoucher"=>"required|numeric"
        ]);
        try {
            DB::table("User")->where("user_ID", "=", $request->input("userid"))->update(["ccl_Voucher" => $request->input("cclvoucher")]);
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            return response()->json(["msg"=>"faild"],400);
        }

    }

    //更新ielts专家券
    public function setIeltsExpertVoucher(Request $request){
        $this->validate($request,[
            "userid"=>"required",
            "ieltsexpertvoucher"=>"required|numeric"
        ]);
        try {
            DB::table("User")->where("user_ID", "=", $request->input("userid"))->update(["expert_ielts_Voucher" => $request->input("ieltsexpertvoucher")]);
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            return response()->json(["msg"=>"faild"],400);
        }

    }

    //更新pte专家券
    public function setPteExpertVoucher(Request $request){
        $this->validate($request,[
            "userid"=>"required",
            "pteexpertvoucher"=>"required|numeric"
        ]);
        try {
            DB::table("User")->where("user_ID", "=", $request->input("userid"))->update(["expert_pte_Voucher" => $request->input("pteexpertvoucher")]);
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            return response()->json(["msg"=>"faild"],400);
        }

    }

    //更新pte专家券
    public function setCclExpertVoucher(Request $request){
        $this->validate($request,[
            "userid"=>"required",
            "cclexpertvoucher"=>"required|numeric"
        ]);
        try {
            DB::table("User")->where("user_ID", "=", $request->input("userid"))->update(["expert_ccl_Voucher" => $request->input("cclexpertvoucher")]);
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            return response()->json(["msg"=>"faild"],400);
        }

    }


    //更新audio保存次数
    public function setAudioTime(Request $request){
        $this->validate($request,[
            "userid"=>"required",
            "audiotime"=>"required|numeric"
        ]);
        try {
            DB::table("User")->where("user_ID", "=", $request->input("userid"))->update(["AudioTime" => $request->input("audiotime")]);
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            return response()->json(["msg"=>"faild"],400);
        }

    }

    //更新权限,0为admin,1为老师，2为学生
    public function setRoleID(Request $request){
        $this->validate($request,[
            "userid"=>"required",
            "roleid"=>"required|numeric"
        ]);
        try {
            DB::table("User")->where("user_ID", "=", $request->input("userid"))->update(["role_ID" => $request->input("roleid")]);
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            return response()->json(["msg"=>"faild"],400);
        }

    }


    //修改vip开始时间
    public function setVIPStart(Request $request){
        $this->validate($request,[
            "userid"=>"required",
            "vipstart"=>"required"
        ]);
        try{
            DB::table("User")->where("user_ID", "=", $request->input("userid"))->update(["VIPStart" => $request->input("vipstart")]);
            return response()->json(["msg"=>"succeed"],200);

        }catch (\Exception $e)
        {
            return response()->json(["msg"=>"faild"],400);
        }

    }


    //修改vip结束时间
    public function setVIPEnd(Request $request){
        $this->validate($request,[
            "userid"=>"required",
            "vipend"=>"required"
        ]);
        try{
            DB::table("User")->where("user_ID", "=", $request->input("userid"))->update(["VIPEnd" => $request->input("vipend")]);
            return response()->json(["msg"=>"succeed"],200);

        }catch (\Exception $e)
        {
            return response()->json(["msg"=>"faild"],400);
        }

    }





    #双重MD5加翻转字符串
    public function  PassWord($password)
    {
        $Password=$password;
        $Password=md5($Password);
        $Password=md5($Password);
        $Password=strrev($Password);
        return $Password;
    }
    //增加用户
    public function addAccount(Request $request){
        $this->validate($request, [
            'email'    => 'required|email',
            'password' => 'required',
            'username'=>'required',
            'roleid'=>'required|numeric'
        ]);

        $user_id = "velo_".md5($request->input('email').$request->input("username"));
        $password =$this->PassWord($request->input("password"));
        $Promote_vocher = "{}";
        $email = $request->input("email");
        $username = htmlspecialchars( $request->input("username"), ENT_NOQUOTES, 'UTF-8', false);
        $role_ID = $request->input("roleid");
        $country =htmlspecialchars( "澳大利亚", ENT_NOQUOTES, 'UTF-8', false);
        $city = htmlspecialchars( "悉尼", ENT_NOQUOTES, 'UTF-8', false);
        $AudioTime = 3;
        $Pte_voucher = 0;
        $ccl_voucher = 0;
        $ielts_voucher = 0;
        $expert_ccl_voucher= 0;
        $expert_pte_voucher=0;
        $expert_iels_voucher=0;
        $create_At = date('Y-m-d H:i:s');
       // $default_date = mktime(0,0,0,0,0,0);
        $last_login = date('Y-m-d', strtotime("00-00-00"));
        $loginday = 0;
        $newUser=array("user_ID"=>$user_id,"Email"=>$email,"PassWord"=>$password,"Promo_Voucher"=>$Promote_vocher,"role_ID"=>$role_ID,"Country"=>$country,"City"=>$city,"username"=>$username,"AudioTime"=>$AudioTime,"pte_Voucher"=>$Pte_voucher,"ccl_Voucher"=>$ccl_voucher,"ielts_Voucher"=>$ielts_voucher,"expert_pte_Voucher"=>$expert_pte_voucher,"expert_ccl_Voucher"=>$expert_ccl_voucher,"expert_ielts_Voucher"=>$expert_iels_voucher,"createAt"=>$create_At,"isActive"=>1,"isVIP"=>0,"VIPStart"=>$create_At,"VIPEnd"=>$create_At, "last_login"=>$last_login,"loginday"=>$loginday);
        try
        {
            DB::table("User")->insert($newUser);
            return response()->json(['msg'=>"succeed"]);
        }
        catch (\Exception $e)
        {
            return response()->json(['msg'=>"insert fail,maybe the email has exist"]);
        }
    }



    //获取产品信息
    public function ProductInfo(Request $request)
    {
        $ProductModel = new Product();
        $data = $ProductModel->getAdminShopStore();
        return response()->json(['msg'=>"succeed","data"=>$data]);
    }

    //不激活产品
    public function ProductDeActive(Request $request)
    {
        $this->validate($request,[
            "productid"=>"required"
        ]);
        $productModel = new Product();
        $productModel->setAdminProductDeActive($request->input("productid"));

        return response()->json(['msg'=>'succeed']);
    }


    //激活产品
    public function ProductActive(Request $request)
    {
        $this->validate($request,[
            "productid"=>"required"
        ]);
        $productModel = new Product();
        $productModel->setAdminProductActive($request->input("productid"));
        return response()->json(['msg'=>'succeed']);
    }

    //增加商品
    public function ProductAdd(Request $request)
    {
        $this->validate($request,[
            "Description"=>"required",
            "productContent"=>"required",
            "price"=>"required",

        ]);

        $Description=$request->input("Description");
        $productContent=$request->input("productContent");
        $price = $request->input("price");
        DB::table("Product")->insert(['Description'=>$Description,'Product_Content'=>$productContent,'Price'=>$price,'isActive'=>0]);
        return response()->json(['msg'=>'succeed']);
    }


    public function ProductEdit(Request $request)
    {
        $this->validate($request,[
            "productid"=>"required",
            "Description"=>"required",
            "productContent"=>"required",
            "price"=>"required",

        ]);

        $Description=$request->input("Description");
        $productContent=$request->input("productContent");
        $price = $request->input("price");
        DB::table("Product")->where("Product_ID","=",$request->input("productid"))->update(['Description'=>$Description,'Product_Content'=>$productContent,'Price'=>$price]);
        return response()->json(['msg'=>'succeed']);
    }



    public function GetIeltsListeningInfo(Request $request)
    {
        $this->validate($request,[
            "paperid"=>"required|numeric",
        ]);

        $data=DB::table("Ielts_A_L_Question")->join("Ielts_A_L_Standard","Ielts_A_L_Question.Paper_ID","=","Ielts_A_L_Standard.Paper_ID")->where("Ielts_A_L_Question.Paper_ID","=",$request->input("paperid"))->get()->first();
        return response()->json(["msg"=>"succeed","data"=>$data]);
    }

    public function GetIeltsReadingInfo(Request $request)
    {
        $data=DB::table("Ielts_A_R_Question")->join("Ielts_A_R_Standard","Ielts_A_R_Question.Paper_ID","=","Ielts_A_R_Standard.Paper_ID")->where("Ielts_A_R_Question.Paper_ID","=",$request->input("paperid"))->get()->first();
        return response()->json(["msg"=>"succeed","data"=>$data]);
    }

    public function GetIeltsWritingInfo(Request $request)
    {
        $data=DB::table("Ielts_A_W_Question")->where("Paper_ID","=",$request->input("paperid"))->get();
        $standard=DB::table("Ielts_A_W_Standard")->where("Paper_ID","=",$request->input("paperid"))->select(["W_Section_1_Standard","W_Section_2_Standard"])->get();
        $standard=json_decode($standard,"true");
        $data=json_decode($data,"true");

        return response()->json(["msg"=>"succeed","data"=>array_merge($data[0],$standard[0])]);
    }

    public function GetIeltsSpeakingInfo(Request $request)
    {
        $this->validate($request,[
            "paperid"=>"required"
        ]);
        $data=DB::table("Ielts_A_S_Question")->where("Paper_ID","=",$request->input("paperid"))->get()->first();
        $data->Section_1_AudioArray=explode(";",$data->Section_1_AudioArray);
        $data->Section_1_TextArray=explode(";",$data->Section_1_TextArray);
        $data->Section_3_AudioArray=explode(";",$data->Section_3_AudioArray);
        $data->Section_3_TextArray=explode(";",$data->Section_3_TextArray);
        return response()->json(["msg"=>"succeed","data"=>$data]);
    }


    public function GetAllVipPower(Request $request)
    {
        $data=DB::table("VIP_Right")->select("ielts_Voucher","ccl_Voucher","pte_Voucher","expert_ielts_Voucher","expert_ccl_Voucher","expert_pte_Voucher")->get()->first();
        return response()->json(["msg"=>"succeed","data"=>$data]);
    }

    public function UpdateAllVipPower(Request $request)
    {
        $this->validate($request,[
            "ieltsVoucher"=>"required|numeric",
            "cclVoucher"=>"required|numeric",
            "pteVoucher"=>"required|numeric",
            "expertieltsVoucher"=>"required|numeric",
            "expertcclVoucher"=>"required|numeric",
            "expertpteVoucher"=>"required|numeric",

        ]);
        $ielts_Voucher=$request->input("ieltsVoucher");
        $ccl_Voucher=$request->input("cclVoucher");
        $pte_Voucher=$request->input("pteVoucher");
        $expert_ielts_Voucher =$request->input("expertieltsVoucher");
        $expert_ccl_Voucher = $request->input("expertcclVoucher");
        $expert_pte_Voucher=$request->input("expertpteVoucher");
        try {
            DB::table("VIP_Right")->where("id", "=", 1)->update(["ielts_Voucher" => $ielts_Voucher, "ccl_Voucher" => $ccl_Voucher, "pte_Voucher" => $pte_Voucher, "expert_ielts_Voucher" => $expert_ielts_Voucher, "expert_ccl_Voucher" => $expert_ccl_Voucher, "expert_pte_Voucher" => $expert_pte_Voucher]);
            return response()->json(["msg" => "succeed"]);
        }
        catch (\Exception $e) {
            return response()->json(["msg" => "faild"]);
        }
    }


    public function GetPromoInfo(Request $request)
    {
        $data = DB::table("Promotion_Voucher")->get();
        return response()->json(['msg'=>"succeed","data"=>$data]);
    }


    public function DelGeneralProActive(Request $request)
    {
        $this->validate($request,[
            "promocode"=>"required",
            "userid"=>"required"
        ]);

        $promocode=$request->input("promocode");
        $userid=$request->input("userid");
        $data = DB::table("Promotion_Voucher")->where("user_ID","=","")->where("Promot_code","=",$promocode)->get()->first();
        if($data)
        {

            if($data->user_ID_collection!="")
            {
                $newcollection = "";
                $userarray =  explode(";",$data->user_ID_collection);
                foreach ( $userarray as $user)//比较逐个用户 是否 和用户id
                {
                    if($userid!=$user) {
                        $newcollection = $newcollection . $user.";" ;
                    }
                }
                $newcollection=substr($newcollection,0,-1);
                try
                {
                    DB::table('Promotion_Voucher')->where("user_ID","=","")->where("Promot_code","=",$promocode)->update(["user_ID_collection"=>$newcollection]);
                    return response()->json(["msg"=>"succeed"]);
                }
                catch (\Exception $e)
                {
                    return response()->json(["msg"=>"update faild"]);
                }

            }
            else
            {
                return response()->json(["msg"=>"collection is null",400]);
            }

        }
        else{
            return response()->json(["msg"=>"code is no exist or no a general code",400]);

        }


    }




    public function GetBannerImg(Request $request)
    {
        $data = DB::table("Index_banner_management")->get()->first();
        $data->left_banner=explode(";",$data->left_banner);
        $data->right_banner=explode(";",$data->right_banner);
        $data->left_banner_link=explode(";",$data->left_banner_link);
        $data->right_banner_link=explode(";",$data->right_banner_link);
        return response()->json(["msg"=>"succeed","data"=>$data]);
    }
    //

    public function ChangeBannerImg(Request $request)
    {
        $this->validate($request, [
            'left'=>'required',//left or right
            'right'=>'required',
            'left_link'=>'required',
            'right_link'=>'required',
        ]);

        $left = $request->input("left");
        $right = $request->input("right");
        $left_link = $request->input("left_link");
        $right_link = $request->input("right_link");

        DB::table("Index_banner_management")->where("ID","=",1)->update(["left_banner"=>$left,"right_banner"=>$right,"left_banner_link"=>$left_link,"right_banner_link"=>$right_link]);

        return response()->json(["msg"=>"succeed"]);
    }
    
    // 禮包生成
    public function CreateVipVoucher(Request $request) {
        DB::beginTransaction();
        try {
            for ($i = 0; $i < $request->json()->get('number'); $i++) {
                $code = MD5($request->json()->get('ielts') . $request->json()->get('pte') . $request->json()->get('ccl') . $request->json()->get('vip') . $request->json()->get('activity') . $i . date("Y/m/d/h/i/s"));
                $insertVoucher = array(
                    'pte_Voucher' => (int)$request->json()->get('pte'),
                    'expert_pte_Voucher' => (int)$request->json()->get('expert_pte'),
                    'ccl_Voucher' => (int)$request->json()->get('ccl'),
                    'expert_ccl_Voucher' => (int)$request->json()->get('expert_ccl'),
                    'ielts_Voucher' => (int)$request->json()->get('ielts'),
                    'expert_ielts_Voucher' => (int)$request->json()->get('expert_ielts'),
                    'vip' => $request->json()->get('vip'), 
                    'voucher_code' => $code, 
                    'activity' => $request->json()->get('activity'), 
                    'comment' => $request->json()->get('comment'), 
                    'start_day' => $request->json()->get('start_day'),
                    'duration' => (int)$request->json()->get('duration'),
                    'status'  => 0
                );
                DB::table("Gift_pack")->lockForUpdate()->insert($insertVoucher);

            }
            DB::commit();
            return response()->json(array("msg" => "succeed"), 200);
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(array("msg" => "input data error"),400);
        }
    }
    
    // 禮包生成頁面 table更改
    public function SetEPVip_PTE(Request $request) {
        $this->validate($request,[
            "Code"=>"required",
            "PTE"=>"required|numeric"
        ]);
        DB::beginTransaction();
        try {
            DB::table("Gift_pack")->where("Voucher_code", "=", $request->input("Code"))->lockForUpdate()->update(["pte_Voucher" => 
                $request->input("PTE")]);
            DB::commit();
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(["msg"=>"faild"],400);
        }
    }

    public function SetEPVip_Expert_PTE(Request $request) {
        $this->validate($request,[
            "Code"=>"required",
            "Expert_PTE"=>"required|numeric"
        ]);
        DB::beginTransaction();
        try {
            DB::table("Gift_pack")->where("Voucher_code", "=", $request->input("Code"))->lockForUpdate()->update(["expert_pte_Voucher" => 
                $request->input("Expert_PTE")]);
            DB::commit();
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(["msg"=>"faild"],400);
        }
    }

    public function SetEPVip_CCL(Request $request) {
        $this->validate($request,[
            "Code"=>"required",
            "CCL"=>"required|numeric"
        ]);
        DB::beginTransaction();
        try {
            DB::table("Gift_pack")->where("Voucher_code", "=", $request->input("Code"))->lockForUpdate()->update(["ccl_Voucher" => $request->input("CCL")]);
            DB::commit();
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(["msg"=>"faild"],400);
        }
    }

    public function SetEPVip_Expert_CCL(Request $request) {
        $this->validate($request,[
            "Code"=>"required",
            "Expert_CCL"=>"required|numeric"
        ]);
        DB::beginTransaction();
        try {
            DB::table("Gift_pack")->where("Voucher_code", "=", $request->input("Code"))->lockForUpdate()->update(["expert_ccl_Voucher" => $request->input("Expert_CCL")]);
            DB::commit();
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(["msg"=>"faild"],400);
        }
    }

    public function SetEPVip_IELTS(Request $request) {
        $this->validate($request,[
            "Code"=>"required",
            "IELTS"=>"required|numeric"
        ]);
        DB::beginTransaction();
        try {
            DB::table("Gift_pack")->where("Voucher_code", "=", $request->input("Code"))->lockForUpdate()->update(["ielts_Voucher" => $request->input("IELTS")]);
            DB::commit();
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(["msg"=>"faild"],400);
        }
    }

    public function SetEPVip_Expert_IELTS(Request $request) {
        $this->validate($request,[
            "Code"=>"required",
            "Expert_IELTS"=>"required|numeric"
        ]);
        DB::beginTransaction();
        try {
            DB::table("Gift_pack")->where("Voucher_code", "=", $request->input("Code"))->lockForUpdate()->update(["expert_ielts_Voucher" => $request->input("Expert_IELTS")]);
            DB::commit();
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(["msg"=>"faild"],400);
        }
    }

    public function SetEPVip_VIP(Request $request) {
        $this->validate($request,[
            "Code"=>"required",
            "VIP"=>"required|numeric"
        ]);
        DB::beginTransaction();
        try {
            DB::table("Gift_pack")->where("Voucher_code", "=", $request->input("Code"))->lockForUpdate()->update(["vip" => $request->input("VIP")]);
            DB::commit();
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(["msg"=>"faild"],400);
        }
    }

    public function SetEPVip_Activity(Request $request) {
        $this->validate($request,[
            "Code"=>"required",
            "Activity"=>"required"
        ]);
        DB::beginTransaction();
        try {
            DB::table("Gift_pack")->where("Voucher_code", "=", $request->input("Code"))->lockForUpdate()->update(["activity" => $request->input("Activity")]);
            DB::commit();
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(["msg"=>"faild"],400);
        }
    }

    public function SetEPVip_Comment(Request $request) {
        $this->validate($request,[
            "Code"=>"required",
            "Comment"=>"required"
        ]);
        DB::beginTransaction();
        try {
            DB::table("Gift_pack")->where("Voucher_code", "=", $request->input("Code"))->lockForUpdate()->update(["comment" => $request->input("Comment")]);
            DB::commit();
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(["msg"=>"faild"],400);
        }
    }

    public function SetEPVip_Start_Day(Request $request) {
        $this->validate($request,[
            "Code"=>"required",
            "Start_Day"=>"required"
        ]);
        DB::beginTransaction();
        try {
            DB::table("Gift_pack")->where("Voucher_code", "=", $request->input("Code"))->lockForUpdate()->update(["start_day" => $request->input("Start_Day")]);
            DB::commit();
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(["msg"=>"faild"],400);
        }
    }

    public function SetEPVip_Duration(Request $request) {
        $this->validate($request,[
            "Code"=>"required",
            "Duration"=>"required|numeric"
        ]);
        DB::beginTransaction();
        try {
            DB::table("Gift_pack")->where("Voucher_code", "=", $request->input("Code"))->lockForUpdate()->update(["duration" => $request->input("Duration")]);
            DB::commit();
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(["msg"=>"faild"],400);
        }
    }

    public function SetEPVip_Status(Request $request) {
        $this->validate($request,[
            "Code"=>"required",
            "Status"=>"required|numeric"
        ]);
        DB::beginTransaction();
        try {
            DB::table("Gift_pack")->where("Voucher_code", "=", $request->input("Code"))->lockForUpdate()->update(["status" => $request->input("Status")]);
            DB::commit();
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(["msg"=>"faild"],400);
        }
    }

    // 獲取禮包生成頁面table資料
    public function VoucherInfo(Request $request)
    {
        $data = DB::table("Gift_pack")->select("pte_Voucher","expert_pte_Voucher","ccl_Voucher","expert_ccl_Voucher","ielts_Voucher","expert_ielts_Voucher","vip","activity","comment","start_day","duration","Status","Voucher_code")->get();
        return response()->json(["msg"=>"succeed","data"=>$data]);
    }
    
    // 禮包生成頁面table delete row
    public function DeleteVoucherInfo(Request $request)
    {
        $this->validate($request,[
            "Code"=>"required",
        ]);
        DB::beginTransaction();
        try {
            for ($i = 0; $i < sizeof($request->input('Code')); $i++)
            $data = DB::table("Gift_pack")->where('Voucher_code', '=', $request->input("Code")[$i])->lockForUpdate()->delete();
            DB::commit();
            return response()->json(["msg"=>"succeed"],200);
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(["msg"=>"faild"],400);
        }
    }
}
