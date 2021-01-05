<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Tools\ExamMailable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Laravel\Lumen\Routing\Controller as BaseController;
use phpDocumentor\Reflection\DocBlock\Tags\Example;
use Tymon\JWTAuth\Contracts\Providers\Auth;
use Tymon\JWTAuth\JWTAuth;
class TeacherController extends BaseController
{

    //老师获取对应的考试
    public function GetSpeakingAnswer(Request $request)
    {
        $examID = $request->input("ExamID");
        $data = DB::table("Ielts_A_S_Answer")->where("ExamID","=",$examID)->get();
        $data = json_decode($data,"true");
        $data = $data[0];
        $information = explode(";",base64_decode($examID));
        $paperID = $information[2];
        $SpeakingText = DB::table("Ielts_A_S_Question")->where("Paper_ID","=",$paperID)->get();
        $SpeakingText = json_decode($SpeakingText,"true");
        $data['SA1']=explode(";",$data["SA1"]);
        $data["SQ1_Text"]=explode(";",$SpeakingText[0]['Section_1_TextArray']);
        $data['SA2']=array(explode(";",$data["SA2"]));
        $data["SQ2_Text"]=explode(";",$SpeakingText[0]['Section_2_Question']);
        $data['SA3']=explode(";",$data["SA3"]);
        $data["SQ3_Text"]=explode(";",$SpeakingText[0]['Section_3_TextArray']);
        $isCommentExist = DB::table("Ielts_A_S_Comment")->get();
        if(sizeof($isCommentExist)>0)
        {
            $isCommentExist = json_decode($isCommentExist,"true");
            $data["SC"]=$isCommentExist[0]["SC"];
            $data["SS"]=$isCommentExist[0]["SS"];
        }
       else
        {

            $data["SC"]="";
            $data["SS"]="";
        }

        $data = array("msg"=>"success","data"=>$data);
        return response()->json($data);
    }


    //老师获取对应考试的写作答案
    public function GetWritingAnswer(Request $request)
    {
        $examID = $request->input("ExamID");
        $data = DB::table("Ielts_A_W_Answer")->where("ExamID","=",$examID)->get();
        $data = json_decode($data,"true");
        $data = $data[0];
        $information = explode(";",base64_decode($examID));
        $paperID = $information[2];
        $WritingText = DB::table("Ielts_A_W_Question")->where("Paper_ID","=",$paperID)->get();
        $WritingText = json_decode($WritingText,"true");
        $data['WQ1_Text']=$WritingText[0]["W_Section_1_Text"];


        $data['WQ2_Text']=$WritingText[0]["W_Section_2_Text"];
        $isFinish=DB::table("Ielts_A_W_Comment")->where("ExamID","=",$examID)->get();//判断老师是否给过分，给过就取之前的内容，没给过就新建个插进去数据库
        if(sizeof($isFinish)==0)
        {
            $data["WS1"]=0.0;
            $data["WS2"]=0.0;
            $data["WC1"]="";
            $data["WC2"]="";
        }
        else{
            $isFinish = json_decode($isFinish,"true");
            $existComment = $isFinish[0];
            $data["WS1"]=$existComment["WS1"];
            $data["WS2"]=$existComment["WS2"];
            $data["WC1"]=$existComment["WC1"];
            $data["WC2"]=$existComment["WC2"];

        }


        $data = array("msg"=>"success","data"=>$data);
        return response()->json($data);
    }


    //这个接口用于老师界面的查看所有的考试记录
    public function GetScore(Request $request)
    {

//        $infoArray = explode(";",base64_decode($Exam_ID));

        //$status = $request->get("Status","-1");
        $status = $request->input("Status","-2");


        if($status=="-2") {
            $ExamInfo = DB::table("Ielts_A_ExamScore")->whereRaw('( Status != -1 AND NOT (isFree=1 AND isExpert=0  ))')->orderByDesc("CreateAt")->get();
            $data = array("msg"=>"success","data"=>$ExamInfo);
        }
        else {
            $ExamInfo = DB::table("Ielts_A_ExamScore")->where("Status","=",$status)->whereRaw('( NOT (isFree=1 AND isExpert=0  ))')->orderByDesc("CreateAt")->get();
            $data = array("msg"=>"success","data"=>$ExamInfo);
        }
        return response()->json($data);
    }



    public function UpdateIeltsWriting(Request $request)
    {
       $Exam_ID = $request->post("ExamID");
       $WS1 = $request->post("WS1");
       $WS2 = $request->post("WS2");
       $WC1 = $request->post("WC1");
       $WC2 = $request->post("WC2");
       $infomation = explode(";",base64_decode($Exam_ID));
       $userID = $infomation[0];
       $getComment = DB::table("Ielts_A_W_Comment")->where("ExamID","=",$Exam_ID)->get();
       if(sizeof($getComment)==0)
       {
           $totalscore = $WS1/3+$WS2*2/3;

           $intval = floor($totalscore);
           $Decimal = $totalscore-$intval;
           switch ($Decimal)
           {
               case ($Decimal>=0.75):
                   $Decimal=1.0;break;
               case($Decimal>=0.25):
                   $Decimal=0.5;break;
               default:
                   $Decimal=0.0;break;
           }
           $totalscore=$intval+$Decimal;

           $insertCommentTable = array("ExamID"=>$Exam_ID,"user_ID"=>$userID, "WS1"=>$WS1,"WS2"=>$WS2,"WC1"=>$WC1,"WC2"=>$WC2);
           $updateScoreTable= array("Writing_Score"=>$totalscore);//总表
           DB::beginTransaction();
           try{
               DB::table("Ielts_A_W_Comment")->insert($insertCommentTable);
               DB::table("Ielts_A_ExamScore")->where("ExamID","=",$Exam_ID)->update($updateScoreTable);
               DB::commit();
               return response()->json(array("msg"=>"succeed"));
           }
           catch (\Exception $e)
           {
               DB::rollBack();
               return response()->json(array("msg"=>"insert error"));
           }

       }
       else{
           $totalscore = $WS1/3+$WS2*2/3;
           $UpdateCommentTable = array("ExamID"=>$Exam_ID,"user_ID"=>$userID, "WS1"=>$WS1,"WS2"=>$WS2,"WC1"=>$WC1,"WC2"=>$WC2);
           $UpdateScoreTable= array("Writing_Score"=>$totalscore);//总表
           DB::beginTransaction();
           try{
               DB::table("Ielts_A_W_Comment")->where("ExamID","=",$Exam_ID)->update($UpdateCommentTable);
               DB::table("Ielts_A_ExamScore")->where("ExamID","=",$Exam_ID)->update($UpdateScoreTable);
               DB::commit();
               return response()->json(array("msg"=>"succeed"));
           }
           catch (\Exception $e)
           {
               DB::rollBack();
               return response()->json(array("msg"=>"insert error"));
           }

       }

    }



    public function UpdateIeltsSpeaking(Request $request)
    {
        $examID = $request->post("ExamID");
        $information = explode(";",base64_decode($examID));
        $userID = $information[0];
        $SS = $request->post("SS");//分数1
        $SC = $request->post("SC");//评论
        $isExist = DB::table("Ielts_A_S_Comment")->where("ExamID","=",$examID)->get();
        if(sizeof($isExist)>0)
        {
            $UpdateData = array("SS"=>$SS,"SC"=>$SC);
            $UpdateExamData = array("Speaking_Score"=>$SS);
            DB::beginTransaction();
            try
            {
                DB::table("Ielts_A_S_Comment")->where("ExamID", "=",$examID)->update($UpdateData);
                DB::table("Ielts_A_ExamScore")->where("ExamID","=",$examID)->update($UpdateExamData);
                DB::commit();
                return response()->json(array("msg"=>"succeed"));
            }
            catch (\Exception $e)
            {
                DB::rollBack();
                return response()->json(array("msg"=>"Data update error"));
            }
        }
        else{
            $insertData = array("ExamID"=>$examID,"user_ID"=>$userID,"SS"=>$SS,"SC"=>$SC);
            $UpdateExamData = array("Speaking_Score"=>$SS);
            DB::beginTransaction();
            try
            {
                DB::table("Ielts_A_S_Comment")->where("ExamID", "=",$examID)->insert($insertData);
                DB::table("Ielts_A_ExamScore")->where("ExamID","=",$examID)->update($UpdateExamData);
                DB::commit();
                return response()->json(array("msg"=>"succeed"));
            }
            catch (\Exception $e)
            {
                DB::rollBack();
                return response()->json(array("msg"=>"Data update or insert error"));
            }

        }


    }



    //提交最终成绩，发送邮件
    public function SubmitScoreFinish(Request $request){
        $this->validate($request, [
            'ExamID'    => 'required',

        ]);
        $ExamID = $request->input("ExamID");
        $examinfo = DB::table("Ielts_A_ExamScore")->where("ExamID", "=",$ExamID)->where("status","=",0)->get();
        if(sizeof($examinfo)>0)
        {
            $examinfo = json_decode($examinfo,"true");
            $userid = $examinfo[0]["user_ID"];
            $examyear = date('Y' ,strtotime($examinfo[0]['CreateAt']));
            $exammonth= date("m" ,strtotime($examinfo[0]['CreateAt']));
            $examday= date("d" ,strtotime($examinfo[0]['CreateAt']));
            $speakingScore = $examinfo[0]["Speaking_Score"];
            $readingScore = $examinfo[0]["Reading_Score"];
            $writingScore = $examinfo[0]["Writing_Score"];
            $listeningScore = $examinfo[0]["Listening_Score"];
            $overall = (((float)$listeningScore)+((float)$writingScore)+((float)$readingScore)+((float)$speakingScore))/4.0;

            $int_overall = floor($overall);
            $flot_overall = $overall-(float)$int_overall;
            switch ($flot_overall)
            {
                case($flot_overall>0.75):
                {
                    $flot_overall=1.0;
                }break;
                case($flot_overall>0.5):
                    {
                        $flot_overall=0.5;
                    }break;
                default:
                    {
                        $flot_overall=0.0;
                    }break;

            }
            $overallScore=$int_overall+$flot_overall;//根据算分规则算总分

            $userinfo = DB::table("User")->where("user_ID","=",$userid)->get();
            $userinfo =json_decode($userinfo,"true");
            $email = $userinfo[0]['Email'];
            $username = $userinfo[0]['username'];
            $subject="迅达英语模考平台考试成绩";
            $emailcontent = "亲爱的".$username."，您好，您曾经在".$examyear."年.".$exammonth."月".$examday."日参加的雅思模考成绩已出。您的成绩是: Speaking:".$speakingScore.", Reading:".$readingScore .", Writing:".$writingScore.", Listening:".$listeningScore.", Overall:".$overallScore."考试详情请登陆迅达英语模考平台查看";
            DB::beginTransaction();
            try {

                Mail::send(new ExamMailable($email, $subject, $emailcontent));
                DB::table("User_Paper")->where("ExamID","=",$ExamID)->update(["FinishScore"=>$overallScore]);
                DB::table("Ielts_A_ExamScore")->where("ExamID","=",$ExamID)->update(["Status"=>1]);
                DB::commit();
                return response()->json(["msg"=>"succeed"]);
            }
            catch (\Exception $e)
            {
                DB::rollBack();
                return response()->json(["msg"=>"error happend"],400);
            }



        }

        else{
            return response()->json(["msg"=>"exam score has been submitted"],400);
        }


    }
    

    public function GetCCLScore(Request $request) {
        $status = $request->input("Status","-2");
        if($status=="-2") {
            $ExamInfo = DB::table("CCL_ExamScore")->whereRaw('( Status != -1 AND NOT (isFree=1 AND isExpert=0  ))')->orderByDesc("CreateAt")->get();
            $data = array("msg"=>"success","data"=>$ExamInfo);
        }
        else {
            $ExamInfo = DB::table("CCL_ExamScore")->where("Status","=",$status)->whereRaw('( NOT (isFree=1 AND isExpert=0  ))')->orderByDesc("CreateAt")->get();
            $data = array("msg"=>"success","data"=>$ExamInfo);
        }
        return response()->json($data);
    }

    //老师获取对应的考试 CCL
    public function GetCCLAnswer(Request $request)
    {
        // Load the answer form student
        $examID = $request->input("ExamID");
        $data = DB::table("CCL_Answer")->where("ExamID","=",$examID)->get();
        $data = json_decode($data,"true");
        $data = $data[0];
        $information = explode(";",base64_decode($examID));
        $paperID = $information[2];

        // Partition
        $partition = array(explode(";", $data['Pardon']));
        // Load the correspond question
        $CCL_Question = DB::table("CCL_Question")->where("Paper_ID","=",$paperID)->get();
        $CCL_Question_data = json_decode($CCL_Question,"true");
        $CCL_Question_data = $CCL_Question_data[0];

        // Push into the array
        $data['Answer_1'] = array(explode(";",$data["Answer_1"]));
        $data['Answer_2'] = array(explode(";",$data["Answer_2"]));
        $data['Pardon1'] = array(explode("/", $partition[0][0]));
        $data['Pardon2'] = array(explode("/", $partition[0][1]));
        $data['Scenario_Audio_1'] = array(explode(";",$CCL_Question_data["Scenario_Audio_1"]));
        $data['Scenario_Audio_2'] = array(explode(";",$CCL_Question_data["Scenario_Audio_2"]));
        $data['Section1_Audio'] = array(explode(";",$CCL_Question_data["Section1_Audio"]));
        $data['Section2_Audio'] = array(explode(";",$CCL_Question_data["Section2_Audio"]));

        $isCommentExist = DB::table("CCL_Comment")->where("ExamID","=",$examID)->get();
        if (sizeof($isCommentExist) > 0) {
            $isCommentExist = json_decode($isCommentExist,"true");
            $data["CCLC1"] = $isCommentExist[0]["CCLC1"];
            $data["CCLS1"] = $isCommentExist[0]["CCLS1"];
            $data["CCLC2"] = $isCommentExist[0]["CCLC2"];
            $data["CCLS2"] = $isCommentExist[0]["CCLS2"];
        }
        else {
            $data["CCLC1"] = "";
            $data["CCLS1"] = "";
            $data["CCLC2"] = "";
            $data["CCLS2"] = "";
        }
        $data = array("msg"=>"success","data"=>$data);
        return response()->json($data);
    }

    public function UpdateCCLScore(Request $request)
    {
        $examID = $request->post("ExamID");
        $information = explode(";",base64_decode($examID));
        $userID = $information[0];
        $CCLS1 = $request->post("CCLS1") ? $request->post("CCLS1") : 0;//分数1
        $CCLC1 = $request->post("CCLC1") ? $request->post("CCLC1") : " ";//评论1
        $CCLS2 = $request->post("CCLS2") ? $request->post("CCLS2") : 0;//分数2
        $CCLC2 = $request->post("CCLC2") ? $request->post("CCLC2") : " ";//评论2
        
        $isExist = DB::table("CCL_Comment")->where("ExamID","=",$examID)->get();
        if(sizeof($isExist) > 0)
        {
            $UpdateData = array("CCLC1"=>$CCLC1,"CCLS1"=>$CCLS1,"CCLC2"=>$CCLC2,"CCLS2"=>$CCLS2);
            $UpdateExamData = array("Dialogue1_Score"=>$CCLS1,"Dialogue2_Score"=>$CCLS2);
            DB::beginTransaction();
            try
            {
                DB::table("CCL_Comment")->where("ExamID", "=",$examID)->update($UpdateData);
                DB::table("CCL_ExamScore")->where("ExamID","=",$examID)->update($UpdateExamData);
                DB::commit();
                return response()->json(array("msg"=>"succeed"));
            }
            catch (\Exception $e)
            {
                DB::rollBack();
                return response()->json(array("msg"=>"Data update error"));
            }
        }
        else {
            $insertData = array("ExamID"=>$examID,"user_ID"=>$userID,"CCLC1"=>$CCLC1,"CCLS1"=>$CCLS1,"CCLC2"=>$CCLC2,"CCLS2"=>$CCLS2);
            $UpdateExamData = array("Dialogue1_Score"=>$CCLS1,"Dialogue2_Score"=>$CCLS2);
            error_log(print_r($insertData, TRUE));
            DB::beginTransaction();
            try
            {
                DB::table("CCL_Comment")->insert($insertData);
                DB::table("CCL_ExamScore")->where("ExamID","=",$examID)->update($UpdateExamData);
                DB::commit();
                return response()->json(array("msg"=>"succeed"));
            }
            catch (\Exception $e)
            {
                DB::rollBack();
                return response()->json(array("msg"=>"Data update or insert error"));
            }
        }
    }



    //提交最终成绩，发送邮件
    public function SubmitCCLScoreFinish(Request $request){
        $this->validate($request, [
            'ExamID'    => 'required',

        ]);
        $ExamID = $request->input("ExamID");
        $examinfo = DB::table("CCL_ExamScore")->where("ExamID", "=",$ExamID)->where("status","=",0)->get();
        if(sizeof($examinfo)>0)
        {
            $examinfo = json_decode($examinfo,"true");
            $userid = $examinfo[0]["user_ID"];
            $examyear = date('Y' ,strtotime($examinfo[0]['CreateAt']));
            $exammonth= date("m" ,strtotime($examinfo[0]['CreateAt']));
            $examday= date("d" ,strtotime($examinfo[0]['CreateAt']));
            $CCLS1Score = $examinfo[0]["Dialogue1_Score"];
            $CCLS2Score = $examinfo[0]["Dialogue2_Score"];

            $overall = ( ((float)$CCLS1Score) + ((float)$CCLS2Score) ) / 2.0;

            $userinfo = DB::table("User")->where("user_ID","=",$userid)->get();
            $userinfo =json_decode($userinfo,"true");
            $email = $userinfo[0]['Email'];
            $username = $userinfo[0]['username'];
            $subject="迅达英语模考平台考试成绩";
            $emailcontent = "亲爱的".$username."，您好，您曾经在".$examyear."年.".$exammonth."月".$examday."日参加的CCL模考成绩已出。您的成绩是: Section1:".$CCLS1Score.", Section2:".$CCLS2Score.", Overall:".$overall."考试详情请登陆迅达英语模考平台查看";
            DB::beginTransaction();
            try {

                Mail::send(new ExamMailable($email, $subject, $emailcontent));
                DB::table("User_Paper")->where("ExamID","=",$ExamID)->update(["FinishScore"=>$overall]);
                DB::table("CCL_ExamScore")->where("ExamID","=",$ExamID)->update(["Status"=>1]);
                DB::commit();
                return response()->json(["msg"=>"succeed"]);
            }
            catch (\Exception $e)
            {
                DB::rollBack();
                return response()->json(["msg"=>"error happend"],400);
            }
        }

        else{
            return response()->json(["msg"=>"exam score has been submitted"],400);
        }
    }
}
