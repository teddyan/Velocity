<?php


namespace App\Http\Controllers;
use http\Env\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\RelationNotFoundException;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Laravel\Lumen\Routing\Controller as BaseController;

class Ielts_controller extends BaseController
{

    public function GetListeningQuestion(Request $request)
    {

        $Exam_ID = $request->input("ExamID","1");
        $infoArray = explode(";",base64_decode($Exam_ID));

        $ExamInfo = DB::table("Ielts_A_ExamScore")->where("ExamID","=",$Exam_ID)->get();

        $ExamInfo=json_decode($ExamInfo,"true");
        if(sizeof($ExamInfo)>0) {

            $data = DB::table("Ielts_A_L_Question")->where("Paper_ID", "=", $infoArray[2])->get();
            return response()->json(array("msg"=>"succeed","data"=>$data));
        }
        else
        {
            return response()->json(array("msg"=>"error","data"=>[]),400);
        }


    }

    public function GetReadingQuestion(Request $request)
    {


        $Exam_ID = $request->input("ExamID","1");
        $infoArray = explode(";",base64_decode($Exam_ID));

        $ExamInfo = DB::table("Ielts_A_ExamScore")->where("ExamID","=",$Exam_ID)->get();

        $ExamInfo=json_decode($ExamInfo,"true");
        if(sizeof($ExamInfo)>0) {

            $data = DB::table("Ielts_A_R_Question")->where("Paper_ID", "=", $infoArray[2])->get();
            return response()->json(array("msg"=>"succeed","data"=>$data));
        }
        else
        {
            return response()->json(array("msg"=>"error","data"=>[]),400);
        }

    }

    public function GetWritingQuestion(Request $request)
    {


        $Exam_ID = $request->input("ExamID","1");
        $infoArray = explode(";",base64_decode($Exam_ID));

        $ExamInfo = DB::table("Ielts_A_ExamScore")->where("ExamID","=",$Exam_ID)->get();

        $ExamInfo=json_decode($ExamInfo,"true");
        if(sizeof($ExamInfo)>0) {

            $data = DB::table("Ielts_A_W_Question")->where("Paper_ID", "=", $infoArray[2])->get();
            return response()->json(array("msg"=>"succeed","data"=>$data));
        }
        else
        {
            return response()->json(array("msg"=>"error","data"=>[]));
        }

    }

    public function GetSpeakingQuestion(Request $request)
    {

        $Exam_ID = $request->input("ExamID","1");
        $infoArray = explode(";",base64_decode($Exam_ID));

        $ExamInfo = DB::table("Ielts_A_ExamScore")->where("ExamID","=",$Exam_ID)->get();

        $ExamInfo=json_decode($ExamInfo,"true");
        if(sizeof($ExamInfo)>0)
        {

                $data = DB::table("Ielts_A_S_Question")->where("Paper_ID","=",$infoArray[2])->get();
                $data=json_decode($data,"true");
                $data = $this->speakingJsonGenerate($data[0]);
                return response()->json(array("msg"=>"succeed","data"=>$data));
        }
        else
        {
            return response()->json(array("msg"=>"error","data"=>[]));

        }

    }

    #分割speaking音频数组的转换函数
    public function speakingJsonGenerate($SpeakingQuestion)
    {

        $SpeakingQuestion['Section_1_AudioArray']=explode(";",$SpeakingQuestion['Section_1_AudioArray']);
        $SpeakingQuestion['Section_3_AudioArray']=explode(";",$SpeakingQuestion['Section_3_AudioArray']);


        return $SpeakingQuestion;

    }


    #提交答案相关函数
    public function ReadingSubmit(Request $request)
    {
        $bodyData = $request->all();
        $answerData=array();


        $information = explode(";", base64_decode($bodyData["examID"]));
        $data = DB::table("Ielts_A_R_Standard")->where("Paper_ID","=",$information[2])->get();
        $userID = $information[0];
        $data=json_decode($data,"true");
        $CalculateNumber=0;
        $ReadingScore = 0.0;
        $standradAnswer= json_decode($data[0]['Answer'],"true");
        for($i=1;$i<41;$i++)
        {
            $answerData["RA".$i]=$bodyData["RA".$i];
            if($answerData["RA".$i]==$standradAnswer['RA'.$i])
            {
                $CalculateNumber+=1;
            }

        }

        switch ($CalculateNumber)
        {
            case ($CalculateNumber>=39):
                {
                    $ReadingScore=9.0;
                }break;
            case ($CalculateNumber>=37):
                {
                    $ReadingScore=8.5;
                }break;
            case ($CalculateNumber>=35):
                {
                    $ReadingScore=8.0;
                }break;
            case ($CalculateNumber>=33):
                {
                    $ReadingScore=7.5;
                }break;
            case ($CalculateNumber>=30):
                {
                    $ReadingScore=7.0;
                }break;
            case ($CalculateNumber>=27):
                {
                    $ReadingScore=6.5;
                }break;
            case ($CalculateNumber>=23):
                {
                    $ReadingScore=6.0;
                }break;
            case ($CalculateNumber>=20):
                {
                    $ReadingScore=5.5;
                }break;
            case ($CalculateNumber>=16):
                {
                    $ReadingScore=5.0;
                }break;
            case ($CalculateNumber>=13):
                {
                    $ReadingScore=4.5;
                }break;
            case ($CalculateNumber>=10):
                {
                    $ReadingScore=4.0;
                }break;
            case ($CalculateNumber>=6):
                {
                    $ReadingScore=3.5;
                }break;
            case ($CalculateNumber>=4):
                {
                    $ReadingScore=3.0;
                }break;
            case ($CalculateNumber==3):
                {
                    $ReadingScore=2.5;
                }break;
            case ($CalculateNumber==2):
                {
                    $ReadingScore=2;
                }break;
            case ($CalculateNumber==1):
                {
                    $ReadingScore=1;
                }break;
            default:
                $ReadingScore=0;break;

        }
        DB::beginTransaction();
        try
        {
            $answerData=json_encode($answerData);
            $user_answer_insert=array("ExamID"=>$bodyData["examID"],"user_ID"=>$userID,"Answer"=>$answerData);
            DB::table("Ielts_A_R_Answer")->insert($user_answer_insert);
            $updateUser_Paper=array("Reading_Score"=>$ReadingScore);
            DB::table("Ielts_A_ExamScore")->where("ExamID","=",$bodyData["examID"])->update($updateUser_Paper);
            DB::commit();
            return response()->json(array("msg"=>"succeed"));
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(array("msg"=>"error happened"),400);
        }


    }

    public function ListeningSubmit(Request $request)
    {
        $bodyData = $request->all();
        $answerData=array();


        $information = explode(";", base64_decode($bodyData["examID"]));
        $data = DB::table("Ielts_A_L_Standard")->where("Paper_ID","=",$information[2])->get();
        $userID = $information[0];
        $data=json_decode($data,"true");
        $CalculateNumber=0;
        $listeningScore = 0.0;
        $standradAnswer= json_decode($data[0]['Answer'],"true");
        for($i=1;$i<41;$i++)
        {
            $answerData["LA".$i]=$bodyData["LA".$i];
            if($answerData["LA".$i]==$standradAnswer['LA'.$i])
            {
                $CalculateNumber+=1;
            }

        }

        switch ($CalculateNumber)
        {
            case ($CalculateNumber>=39):
                {
                    $ListeningScore=9.0;
                }break;
            case ($CalculateNumber>=37):
                {
                    $ListeningScore=8.5;
                }break;
            case ($CalculateNumber>=35):
                {
                    $ListeningScore=8.0;
                }break;
            case ($CalculateNumber>=33):
                {
                    $ListeningScore=7.5;
                }break;
            case ($CalculateNumber>=30):
                {
                    $ListeningScore=7.0;
                }break;
            case ($CalculateNumber>=27):
                {
                    $ListeningScore=6.5;
                }break;
            case ($CalculateNumber>=23):
                {
                    $ListeningScore=6.0;
                }break;
            case ($CalculateNumber>=20):
                {
                    $ListeningScore=5.5;
                }break;
            case ($CalculateNumber>=16):
                {
                    $ListeningScore=5.0;
                }break;
            case ($CalculateNumber>=13):
                {
                    $ListeningScore=4.5;
                }break;
            case ($CalculateNumber>=10):
                {
                    $ListeningScore=4.0;
                }break;
            case ($CalculateNumber>=6):
                {
                    $ListeningScore=3.5;
                }break;
            case ($CalculateNumber>=4):
                {
                    $ListeningScore=3.0;
                }break;
            case ($CalculateNumber==3):
                {
                    $ListeningScore=2.5;
                }break;
            case ($CalculateNumber==2):
                {
                    $ListeningScore=2;
                }break;
            case ($CalculateNumber==1):
                {
                    $ListeningScore=1;
                }break;
            default:
                $ListeningScore=0;break;

        }
        DB::beginTransaction();
        try
        {
            $answerData=json_encode($answerData);
            $user_answer_insert=array("ExamID"=>$bodyData["examID"],"user_ID"=>$userID,"Answer"=>$answerData);
            DB::table("Ielts_A_L_Answer")->insert($user_answer_insert);
            $updateUser_Paper=array("Listening_Score"=>$ListeningScore);
            DB::table("Ielts_A_ExamScore")->where("ExamID","=",$bodyData["examID"])->update($updateUser_Paper);
            DB::commit();
            return response()->json(array("msg"=>"succeed"));
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(array("msg"=>"error happened"),400);
        }


    }

    public function SpeakingSubmit(Request $request){
        $examID = $request->post("examID");
        $file = $request->allFiles();
        $section1 = "";
        $section2 = "";
        $section3 = "";
        foreach ( $file as $key=>$value)
        {
            if(strstr($key,"Section1_"))
            {    
                 $path = "SpeakingAudio/".$examID;
                 $file[$key]->move($path,$key."-".$examID.".mp3");
                 $path="/".$path."/".$key."-".$examID.".mp3";
                 $section1= $section1.$path.";";
            }
            else if(strstr($key,"Section2_")) 
            {
                $path = "SpeakingAudio/".$examID;
                $file[$key]->move($path,$key."-".$examID.".mp3");
                $path="/".$path."/".$key."-".$examID.".mp3";
                $section2= $section2.$path.";";

            }
            else if(strstr($key,"Section3_")) {

                $path = "SpeakingAudio/".$examID;
                $file[$key]->move($path,$key."-".$examID.".mp3");
                $path="/".$path."/".$key."-".$examID.".mp3";
                $section3= $section3.$path.";";

            }
        }
        $data = array();
        $data['ExamID']=$examID;
        $data["user_ID"] = explode(";",base64_decode($examID))[0];
        $userID =  explode(";",base64_decode($examID))[0];
        $data['SA1']= substr($section1, 0, -1);
        $data['SA2']=substr($section2, 0, -1);
        $data['SA3']=substr($section3, 0, -1);
        error_log("-------DataSA1是-------");
        error_log($data['SA1']);
        error_log("-------DataSA2是-------");
        error_log($data['SA2']);
        error_log("-------DataSA3是-------");
        error_log($data['SA3']);
        DB::beginTransaction();
        try{
            if ($data['SA2'] != "") {
                error_log("sa2");
                DB::table("Ielts_A_S_Answer")->where("ExamID","=",$examID)->update(['SA2' => $data['SA2']]);
                $updataAudioExist = array("isAudioExist"=>1);
                DB::table("Ielts_A_ExamScore")->where("ExamID","=",$examID)->update($updataAudioExist);
                DB::commit();
            }
            else if ($data['SA3'] != "") {
                error_log("sa3");
                DB::table("Ielts_A_S_Answer")->where("ExamID","=",$examID)->update(['SA3' => $data['SA3']]);
                $updataAudioExist = array("isAudioExist"=>1);
                DB::table("Ielts_A_ExamScore")->where("ExamID","=",$examID)->update($updataAudioExist);
                DB::commit();
            }
            else {
                error_log("sa1");
                DB::table("Ielts_A_S_Answer")->insert($data);
                $updataAudioExist = array("isAudioExist"=>1);
                DB::table("Ielts_A_ExamScore")->where("ExamID","=",$examID)->update($updataAudioExist);
                DB::commit();
            }
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(array("msg"=>"Data insert error happened"));
        }
        if ($data['SA3'] != "") {
            $UserInfo = DB::table("User")->where("user_ID","=",$userID)->get();
            $UserInfo = json_decode($UserInfo,"true");
            $Audiotime = $UserInfo[0]["AudioTime"];//获取最多能存储多少次
            $deleteAudio=DB::table("Ielts_A_ExamScore")->where("Status","=",1)->where("user_ID","=", $userID)->where("isAudioExist","=",1)->orderByDesc("CreateAt")->limit($Audiotime)->get();
            $deleteAudio=json_decode($deleteAudio,"true");
            //找出已经改好分的,而且音频是存在的
            DB::beginTransaction();
            try {
                //如果已经改好分的音频存在的个数超过限制
                if (sizeof($deleteAudio) > $Audiotime) {
                    for ($i = $Audiotime; $i < sizeof($deleteAudio); $i++) {
                        //根据路径删除音频文件夹
                        $this->deldir("SpeakingAudio/" . $deleteAudio[$i]["ExamID"]);
                        $currentUpdateisAudio = array("isAudioExist" => 0);
                        DB::table("Ielts_A_ExamScore")->where("ExamID", "=", $deleteAudio[$i]["ExamID"])->update($currentUpdateisAudio);
                    }
                    DB::commit();

                }
                return response()->json(array("msg"=>"succeed"));
            }
            catch (\Exception $e)
            {
                DB::rollBack();
                return response()->json(array("msg"=>"delete error"),400);

            }
        }
    }

    public function WritingSubmit(Request $request){
        $examID = $request->post("examID");
        $WritingSection1 = $request->post("WA1");
        $WritingSection2= $request->post("WA2");
        $information = explode(";", base64_decode($examID));
        $userID = $information[0];

        $WritingAnswer = array("ExamID"=>$examID,"user_ID"=>$userID,"WA1"=>$WritingSection1,"WA2"=>$WritingSection2);

        try{
            DB::table("Ielts_A_W_Answer")->insert($WritingAnswer);

            return response()->json(array("msg"=>"succeed"));

        }catch (\Exception $e)
        {
            return response()->json(array("msg"=>"error happened"))->setStatusCode(400);
        }




    }

    #文件夹删除
    public function deldir($dir) {
        //先删除目录下的文件：
        $dh = opendir($dir);
        while ($file = readdir($dh)) {
            if($file != "." && $file!="..") {
                $fullpath = $dir."/".$file;
                if(!is_dir($fullpath)) {
                    unlink($fullpath);
                } else {
                    $this->deldir($fullpath);
                }
            }
        }
        closedir($dh);

        //删除当前文件夹：
        if(rmdir($dir)) {
            return true;
        } else {
            return false;
        }
    }


}
