<?php


namespace App\Http\Controllers;
use Laravel\Lumen\Routing\Controller as BaseController;
use http\Env\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\RelationNotFoundException;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;


class CCL_controller extends BaseController
{

    /*CCL口說取得題目 */
    public function GetSpeakingQuestion(Request $request)
    {

        $Exam_ID = $request->input("ExamID","1");
        $infoArray = explode(";",base64_decode($Exam_ID));

        $ExamInfo = DB::table("CCL_ExamScore")->where("ExamID","=",$Exam_ID)->get();

        $ExamInfo=json_decode($ExamInfo,"true");
        if(sizeof($ExamInfo)>0)
        {

                $data = DB::table("CCL_Question")->where("Paper_ID","=",$infoArray[2])->get();
                $data=json_decode($data,"true");
                $data = $this->speakingJsonGenerate($data[0]);
                return response()->json(array("msg"=>"succeed","data"=>$data));
        }
        else
        {
            return response()->json(array("msg"=>"error","data"=>[]));

        }

    }

    #分割口說音檔陣列
    public function speakingJsonGenerate($SpeakingQuestion)
    {

        $SpeakingQuestion['Section_1_AudioArray']=explode(";",$SpeakingQuestion['Section_1_AudioArray']);
        $SpeakingQuestion['Section_2_AudioArray']=explode(";",$SpeakingQuestion['Section_2_AudioArray']);


        return $SpeakingQuestion;

    }
    #提交口說
    public function SpeakingSubmit(Request $request){
        $examID = $request->post("examID");
        error_log('test');
        $file = $request->allFiles();
       /*ccl Section分割 */
        $section1 = "";
        $section2 = "";
        $pardon = $request->post("Pardontime");
        foreach ( $file as $key=>$value)
        {
            if(strstr($key,"Section1_"))
            {    
                 $path = "SpeakingAudio/".$examID;
                 $file[$key]->move($path,$key."-".$examID.".mp3");
                 $path="/".$path."/".$key."-".$examID.".mp3";
                 $section1= $section1.$path.";";
                 error_log($section1);
            }
            else if(strstr($key,"Section2_")) 
            { 
                $path = "SpeakingAudio/".$examID;
                $file[$key]->move($path,$key."-".$examID.".mp3");
                $path="/".$path."/".$key."-".$examID.".mp3";
                $section2= $section2.$path.";";
                error_log($section2);
            }
            // else if(strstr($key,"Section3_")) {

            //     $path = "SpeakingAudio/".$examID;
            //     $file[$key]->move($path,$key."-".$examID.".mp3");
            //     $path="/".$path."/".$key."-".$examID.".mp3";
            //     $section3= $section3.$path.";";

            // }
        }
        $data = array();
        $data['ExamID']=$examID;
        $data["user_ID"] = explode(";",base64_decode($examID))[0];
        $userID =  explode(";",base64_decode($examID))[0];

        //-1 自己本身
        $data['Answer_1']= substr($section1, 0, -1);
        $data['Answer_2']=substr($section2, 0, -1);
       $data['Pardon']=$pardon;
        // $ifCCLExamA1Exist = DB::table("CCL_Answer")->where("ExamID","=",$examID)->first()->value('Answer_1');
        // $data['SA3']=substr($section3, 0, -1);
        DB::beginTransaction();
        try{
            error_log("準備進入囉");
            if ($data['Answer_2'] != "") {
                error_log("進入ANSWER2");
                $Section2_ = DB::table("CCL_Answer")->where("ExamID","=",$examID)->value("Answer_2");
                DB::table("CCL_Answer")->where("ExamID","=",$examID)->update(['Answer_2' => $Section2_.$data['Answer_2']]);
                $Pardontemp = DB::table("CCL_Answer")->where("ExamID","=",$examID)->value("Pardon");
                DB::table("CCL_Answer")->where("ExamID","=",$examID)->update(['Pardon' => $Pardontemp.$data['Pardon']]);
                $updataAudioExist = array("isAudioExist"=>1);
                DB::table("CCL_ExamScore")->where("ExamID","=",$examID)->update($updataAudioExist);
                DB::commit();
            }
            else if($data['Answer_1'] != ""){
                
                if(strstr($key,"Section1_1")=="Section1_1"){
                    error_log("進入1_1");
                    DB::table("CCL_Answer")->insert($data);
                    $updataAudioExist = array("isAudioExist"=>1);
                    DB::table("CCL_ExamScore")->where("ExamID","=",$examID)->update($updataAudioExist);
                     DB::commit();
                }else if(strstr($key,"Section1_")){
                    error_log("進入1_其他");
                    $Section1_ = DB::table("CCL_Answer")->where("ExamID","=",$examID)->value("Answer_1");
                    DB::table("CCL_Answer")->where("ExamID","=",$examID)->update(['Answer_1' => $Section1_.$data['Answer_1']]);
                    $Pardontemp = DB::table("CCL_Answer")->where("ExamID","=",$examID)->value("Pardon");
                    DB::table("CCL_Answer")->where("ExamID","=",$examID)->update(['Pardon' => $Pardontemp.$data['Pardon']]);
                    $updataAudioExist = array("isAudioExist"=>1);
                    DB::table("CCL_ExamScore")->where("ExamID","=",$examID)->update($updataAudioExist);
                    DB::commit();
                }

            }
        }
        catch (\Exception $e)
        {
            DB::rollBack();
            return response()->json(array("msg"=>"Data insert error happened"));
        }
        if ($data['Answer_2'] != "") {
            $UserInfo = DB::table("User")->where("user_ID","=",$userID)->get();
            $UserInfo = json_decode($UserInfo,"true");
            $Audiotime = $UserInfo[0]["AudioTime"];//获取最多能存储多少次
            $deleteAudio=DB::table("CCL_ExamScore")->where("Status","=",1)->where("user_ID","=", $userID)->where("isAudioExist","=",1)->orderByDesc("CreateAt")->limit($Audiotime)->get();
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
                        DB::table("CCL_ExamScore")->where("ExamID", "=", $deleteAudio[$i]["ExamID"])->update($currentUpdateisAudio);
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
    // public function SpeakingSubmit(Request $request){
    //     $examID = $request->post("examID");
    //     error_log('test');
    //     $file = $request->allFiles();
    //    /*ccl Section分割 */
    //     $section1 = "";
    //     $section2 = "";
    //     foreach ( $file as $key=>$value)
    //     {
    //         if(strstr($key,"Section1_"))
    //         {    error_log('我在S1');
    //             error_log(strstr($key,"Section1_1"));
    //              $path = "SpeakingAudio/".$examID;
    //              $file[$key]->move($path,$key."-".$examID.".mp3");
    //              $path="/".$path."/".$key."-".$examID.".mp3";
    //              $section1= $section1.$path.";";
    //         }
    //         else if(strstr($key,"Section2_")) 
    //         {   error_log('我在S2');
    //             $path = "SpeakingAudio/".$examID;
    //             error_log('Path是:');
    //             error_log($path);
    //             $file[$key]->move($path,$key."-".$examID.".mp3");
    //             $path="/".$path."/".$key."-".$examID.".mp3";
    //             $section2= $section2.$path.";";

    //         }
    //         // else if(strstr($key,"Section3_")) {

    //         //     $path = "SpeakingAudio/".$examID;
    //         //     $file[$key]->move($path,$key."-".$examID.".mp3");
    //         //     $path="/".$path."/".$key."-".$examID.".mp3";
    //         //     $section3= $section3.$path.";";

    //         // }
    //     }
    //     $data = array();
    //     $data['ExamID']=$examID;
    //     $data["user_ID"] = explode(";",base64_decode($examID))[0];
    //     $userID =  explode(";",base64_decode($examID))[0];

    //     //-1 自己本身
    //     $data['Answer_1']= substr($section1, 0, -1);
    //     $data['Answer_2']=substr($section2, 0, -1);
    //     error_log("準備進入囉");
    //     // $data['SA3']=substr($section3, 0, -1);

    //     //使用DB前要先開始記錄
    //     DB::beginTransaction();
    //     // $ifCCLExamA1Exist = DB::table("CCL_Answer")->where("ExamID","=",$examID)->first()->value('Answer_1');
    //     try{
    //         error_log("準備進入囉");
    //         if ($data['Answer_2'] != "") {
    //             // error_log("Answer_2");
    //             // DB::table("CCL_Answer")->where("ExamID","=",$examID)->update(['Answer_2' => $data['Answer_2']]);
    //             // $updataAudioExist = array("isAudioExist"=>1);
    //             // DB::table("CCL_ExamScore")->where("ExamID","=",$examID)->update($updataAudioExist);
    //             // DB::commit();
    //         error_log("enterS2222");
    //             $Section2_ = DB::table("CCL_Answer")->where("ExamID","=",$examID)->value("Answer_2");
    //             DB::table("CCL_Answer")->where("ExamID","=",$examID)->update(['Answer_2' => $Section2_+$data['Answer_2']]);
    //             $updataAudioExist = array("isAudioExist"=>1);
    //             DB::table("CCL_ExamScore")->where("ExamID","=",$examID)->update($updataAudioExist);
    //             DB::commit();
    //         }
    //         else if($data['Answer_1'] != ""){
    //             error_log("Answer_1");
    //                 error_log('enterS1_____');
    //                 $Section1_ = DB::table("CCL_Answer")->where("ExamID","=",$examID)->value("Answer_1");
    //                 DB::table("CCL_Answer")->where("ExamID","=",$examID)->insert(['Answer_1' => $data['Answer_1']]);
    //                 $updataAudioExist = array("isAudioExist"=>1);
    //                  DB::table("CCL_ExamScore")->where("ExamID","=",$examID)->update($updataAudioExist);
    //                 DB::commit();
    //         }
    //     }
    //     catch (\Exception $e)
    //     {
    //         DB::rollBack();
    //         return response()->json(array("msg"=>"Data insert error happened"));
    //     }
    //     if ($data['Answer_2'] != "") {
    //         $UserInfo = DB::table("User")->where("user_ID","=",$userID)->get();
    //         $UserInfo = json_decode($UserInfo,"true");
    //         $Audiotime = $UserInfo[0]["AudioTime"];//获取最多能存储多少次
    //         $deleteAudio=DB::table("CCL_ExamScore")->where("Status","=",1)->where("user_ID","=", $userID)->where("isAudioExist","=",1)->orderByDesc("CreateAt")->limit($Audiotime)->get();
    //         $deleteAudio=json_decode($deleteAudio,"true");
    //         //找出已经改好分的,而且音频是存在的
    //         DB::beginTransaction();
    //         try {
    //             //如果已经改好分的音频存在的个数超过限制
    //             if (sizeof($deleteAudio) > $Audiotime) {
    //                 for ($i = $Audiotime; $i < sizeof($deleteAudio); $i++) {
    //                     //根据路径删除音频文件夹
    //                     $this->deldir("SpeakingAudio/" . $deleteAudio[$i]["ExamID"]);
    //                     $currentUpdateisAudio = array("isAudioExist" => 0);
    //                     DB::table("CCL_ExamScore")->where("ExamID", "=", $deleteAudio[$i]["ExamID"])->update($currentUpdateisAudio);
    //                 }
    //                 DB::commit();

    //             }
    //             return response()->json(array("msg"=>"succeed"));
    //         }
    //         catch (\Exception $e)
    //         {
    //             DB::rollBack();
    //             return response()->json(array("msg"=>"delete error"),400);

    //         }
    //     }
    // }
    
    #刪除文件
    public function deldir($dir) {
        //刪除目錄下的文件：
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

        //删除完整文件夾：
        if(rmdir($dir)) {
            return true;
        } else {
            return false;
        }
    }

}