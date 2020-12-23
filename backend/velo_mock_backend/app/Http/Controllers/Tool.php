<?php


namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;

class Tool extends BaseController
{
    //图片文件上传接口
   public function imageSourceUpload(Request $request)
    {
        try {
            $imgpath = "IMG";
            $files = $request->allFiles();
            $filepath = array();
//            DB::beginTransaction();
            foreach ($files as $key=>$value) {

                $time = time();
                $files[$key]->move($imgpath ,  $time . ".jpg");
//                DB::table("IMGSRC")->insert(["FileName"=>$time . ".jpg","ImgSrc"=>"/".$imgpath . "/" . $time . ".jpg","CreateAt"=>date('Y-m-d H:i:s')]);
                $filepath[$time . ".jpg"]="/".$imgpath . "/" . $time . ".jpg";
                sleep(0.1);
            }
//            DB::commit();

            return response()->json(['msg' =>"succeed","data"=>$filepath]);
        }
        catch (\Exception $e)
        {
//            DB::rollBack();
            return response()->json(['msg'=>"upload error"]);
        }
    }


    //音频上傳
    public function AudioSourceUpload(Request $request)
    {
        try {
            $audiopath = "AUDIO";
            $files = $request->allFiles();
            $filepath = array();
//            DB::beginTransaction();
            foreach ($files as $key=>$value) {

                $time = time();
                $files[$key]->move($audiopath ,  $time . ".mp3");
//                DB::table("AUDIOSRC")->insert(["FileName"=>$time . ".mp3","AudioSrc"=>"/".$audiopath . "/" . $time . ".mp3","CreateAt"=>date('Y-m-d H:i:s')]);
                $filepath[$time . ".mp3"]="/".$audiopath . "/" . $time . ".mp3";
                sleep(0.1);
            }
//            DB::commit();

            return response()->json(['msg' =>"succeed","data"=>$filepath]);
        }
        catch (\Exception $e)
        {
//            DB::rollBack();
            return response()->json(['msg'=>"upload error"]);
        }
    }


    //获取图片文件与路径内容
    public function ImagesDetail(Request $request)
    {
//      $data = $this->get_filenamesbydir("IMG");
        $data = $this->getFileCurrent("IMG");
        return response()->json(["msg"=>"succeed","data"=>$data]);
    }

    //获取音频文件与路径内容
    public function AudiosDetail(Request $request)
    {
//        $data = DB::table("AUDIOSRC")->orderByDesc("CreateAt")->get();
//        $data = $this->get_filenamesbydir("AUDIO");
        $data = $this->getFileCurrent("AUDIO");
        return response()->json(["msg"=>"succeed","data"=>$data]);
    }




    public function DelFile(Request $request)
    {
        $dir = $request->input("filepath");
        $dir = substr(str_replace("..","",$dir),1,strlen($dir));
        unlink($dir);
        return response()->json(["msg"=>"succeed"]);
    }



    //获取所有文件名，包含子目录下，功能函数
    function get_allfiles($path,&$files) {
        if(is_dir($path)){
            $dp = dir($path);
            while ($file = $dp ->read()){
                if($file !="." && $file !=".."){
                    $this->get_allfiles($path."/".$file, $files);
                }
            }
            $dp ->close();
        }
        if(is_file($path)){
            $files[] =  $path;
        }
    }

    //列出当前路径的文件，包含子目录下的
    function get_filenamesbydir($dir){
        $files =  array();
        $this->get_allfiles($dir,$files);
        return $files;
    }

    //列出当前路径的文件，不包含子目录
    function  getFileCurrent($dir)
    {
        //获取某目录下所有文件、目录名（不包括子目录下文件、目录名）
        $files = array();
        $handler = opendir($dir);
        while (($filename = readdir($handler)) !== false) {//务必使用!==，防止目录下出现类似文件名“0”等情况
            if ($filename != "." && $filename != "..") {
                $files[] = "/".$dir."/".$filename ;
            }
        }

        closedir($handler);
        return $files;


    }
}