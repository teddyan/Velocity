<?php


namespace App\Http\Controllers;
use App\Model\IeltsAExamScore;
use App\Model\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Laravel\Lumen\Routing\Controller as BaseController;
use App\Http\Controllers\Tools\RawMailable;
use Laravel\Socialite\Facades\Socialite;

class MainController extends BaseController
{
    public function clearCache()
    {
        Cache::flush();
        return response()->json(['msg'=>"succeed"]);
    }
    //发送验证码的接口
    public function SendVerifyCode(Request $request)
    {
        $this->validate($request, [
            'email'    => 'required|email'
        ]);

        $email = $request->post("email","-1");
        $subject = "迅达英语模考平台--验证码";
        $time = date('Y-m-d H:i:s');
        $mycode = (string)rand(100000,999999);
        $content = "亲爱的用户你好，你的邮箱验证码是：".$mycode."。请在30分钟内完成操作";
    try {
        Mail::send(new RawMailable($email, $subject, $content));
        $emaildata=DB::table("Email_Valid_Code")->where("email","=",$email)->get();
        if(sizeof($emaildata)==0)
        {
            DB::table("Email_Valid_Code")->insert(array("email"=>$email,"valid_code"=>$mycode,"CreateAt"=>$time));
        }
        else{

            DB::table("Email_Valid_Code")->where("email","=",$email)->update(array("valid_code"=>$mycode,"CreateAt"=>$time));
        }

        return response()->json(array("msg"=>"succeed"));
    }

        catch (\Exception $e)
        {
            return response()->json(array("msg"=>"Failed"),400);
        }

    }


    //验证验证码接口
    public function MatchVerifyCode(Request $request){
        $email = $request->post("email");
        $verifyCode=$request->post("code");
        $verifyinfo = DB::table("Email_Valid_Code")->where("email","=",$email)->where("valid_code","=",$verifyCode)->get();
        $verifyinfo =json_decode($verifyinfo,"true");
        if(sizeof($verifyinfo)>0)
        {
            $expireDate =  date('Y-m-d H:i:s', strtotime("+30 minute", strtotime($verifyinfo[0]["CreateAt"])));
            if(strtotime( date('Y-m-d H:i:s'))<strtotime($expireDate))
            {
                DB::table("Email_Valid_Code")->where("email","=",$email)->delete();
                return response()->json(array("msg"=>"succeed"));
            }
            else
            {
                DB::table("Email_Valid_Code")->where("email","=",$email)->delete();
                return response()->json(array("msg"=>"verify code has expired"),400);
            }

        }
        else{
            return response()->json(array("msg"=>"verify code is incorrect"),400);
        }


    }


    //邮箱登陆账号接口
    public function LoginEmail(Request $request){
        $this->validate($request, [
            'email'    => 'required',
            'password' => 'required',
            'key'=>"required",
            'imgcode'=>"required"

        ]);
        $keyimg = $request->input("key");
        $imgcode = $request->input("imgcode");

        if($this->checkImageVerifyCode($keyimg,$imgcode)==false)
        {
            return response()->json(["msg"=>"image verify code error"],400);
        }
        $email    =  $request->input('email');
        $password =  $request->input('password');
        $user_model = new User();
        $user_info = $user_model->where('Email', '=', $email)
            ->where('PassWord', '=', $this->PassWord($password))->where("isActive","=",1)
            ->first();


        if ($user_info) {
            if (!$token = Auth::login($user_info)) {
                $response['code']     = '5000';
                $response['errorMsg'] = '系统错误，无法生成令牌';
            } else {
                $mytime = date("y-m-d");
                $last_login_dataAdd = date("y-m-d", strtotime("+1 day",strtotime($user_info->last_login)));


                if(strtotime($mytime)==strtotime($last_login_dataAdd))
                {

                    DB::table('User')->where("Email","=",$email)->update(["last_login"=>$mytime]);
                    DB::table('User')->where("Email","=",$email)->increment("loginday");
                }
                else if(strtotime($mytime)>strtotime($last_login_dataAdd))
                {
                    DB::table('User')->where("Email","=",$email)->update(["last_login"=>$mytime]);
                    DB::table('User')->where("Email","=",$email)->update(["loginday"=>0]);
                }



                $response['data']['user_ID']      = strval($user_info->user_ID);
                $response['data']['username']      = strval($user_info->username);
                $response['data']['role_ID']      = strval($user_info->role_ID);
                $response['data']['isVIP'] = strval($user_info->isVIP);
                $response['data']['loginday'] = strval($user_info->loginday);

                $response['data']['access_token'] = $token;

            }
        } else {
            $response['code'] = '5002';
            $response['msg']  = '无法响应请求，服务端异常';
        }
        return response()->json($response);




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

//    #邮箱注册账号接口
    public function SignUpEmail(Request $request)
    {
        $this->validate($request, [
            'email'    => 'required|email',
            'password' => 'required',
            'country'  => 'required',
            'city'=>'required',
            'username'=>'required',
            "verifycode"=>'required',
            'key'=>"required",
            'imgcode'=>"required"

        ]);

        $user_id = "velo_".md5($request->input('email').$request->input("username"));
        $Promote_vocher = "{}";
        $email = $request->input("email");
        $username = htmlspecialchars( $request->input("username"), ENT_NOQUOTES, 'UTF-8', false);
        $password = $this->PassWord($request->input("password"));
        $verifycode = $request->input("verifycode");
        $imagecode = $request->input("imgcode");
        $key =$request->input("key");
        if($this->checkImageVerifyCode($key,$imagecode)==false)
        {
            return response()->json(['msg'=>"img code error"],400);
        }

        if ($this->RegisterMatchVerifyCode($email,$verifycode)==false)
        {
            return response()->json(['msg'=>"email verify code error"],400);
        }

        $role_ID = 2;
        $country =htmlspecialchars( $request->input('country'), ENT_NOQUOTES, 'UTF-8', false);
        $city = htmlspecialchars( $request->input('city'), ENT_NOQUOTES, 'UTF-8', false);
        $AudioTime = 3;
        $Pte_voucher = 0;
        $ccl_voucher = 0;
        $ielts_voucher = 0;
        $expert_ccl_voucher= 0;
        $expert_pte_voucher=0;
        $expert_iels_voucher=0;

        $create_At = date('Y-m-d H:i:s');
        $newUser=array("user_ID"=>$user_id,"Email"=>$email,"PassWord"=>$password,"Promo_Voucher"=>$Promote_vocher,"role_ID"=>$role_ID,"Country"=>$country,"City"=>$city,"username"=>$username,"AudioTime"=>$AudioTime,"pte_Voucher"=>$Pte_voucher,"ccl_Voucher"=>$ccl_voucher,"ielts_Voucher"=>$ielts_voucher,"expert_pte_Voucher"=>$expert_pte_voucher,"expert_ccl_Voucher"=>$expert_ccl_voucher,"expert_ielts_Voucher"=>$expert_iels_voucher,"createAt"=>$create_At,"isActive"=>1,"isVIP"=>0,"VIPStart"=>$create_At,"VIPEnd"=>$create_At,"last_login"=>$create_At,"loginday"=>0);
        try{
            DB::beginTransaction();
            DB::table("User")->insert($newUser);
            DB::commit();
            $user_model = new User();
            $user_info = $user_model->where('Email', '=', $email)
                ->where('PassWord', '=', $password)
                ->first();
            if ($user_info) {
                if (!$token = Auth::login($user_info)) {
                    $response['code']     = '5000';
                    $response['errorMsg'] = '系统错误，无法生成令牌';
                } else {




                    $response['data']['user_ID']      = strval($user_info->user_ID);
                    $response['data']['username']      = strval($user_info->username);
                    $response['data']['role_ID']      = strval($user_info->role_ID);
                    $response['data']['isVIP'] =        strval($user_info->isVIP);
                    $response['data']['access_token'] = $token;

                }
            } else {
                $response['code'] = '5002';
                $response['msg']  = '无法响应请求，服务端异常';
            }
            return response()->json($response);
//            return response()->json(["msg"=>"succeed"]);

        }
        catch (\Exception $e)
        {
            return response()->json(["msg"=>"register error"],400);
        }

    }

    #邮箱是否重复验证
    public function ExistEmail(Request $request)
    {
       $email=$request->input("email","");
       try{
          $info= DB::table("User")->where("Email","=",$email)->get("Email");
          if(sizeof($info)>0)
          {
              return response()->json(["msg"=>"exists"],400);
          }
          else
          {
              return response()->json(["msg"=>"succeed"],200);
          }

       }
        catch (\Exception $e)
        {
            return response()->json(["msg"=>"error"],400);
        }

    }



    #利用老密码修改密码
    public function OldPasswordReset(Request $request)
    {
        $this->validate($request, [
            'userID'    => 'required',
            'oldpassword' => 'required',
            'newpassword'=>'required'

        ]);

        $userID = $request->input("userID");
        $oldpassword = $this->PassWord($request->input("oldpassword"));
        $newpassword = $this->PassWord($request->input("newpassword"));
        $isCorrect = DB::table("User")->where("user_ID", "=", $userID)->where("PassWord","=",$oldpassword)->get();
        if(sizeof($isCorrect)>0)
        {
            DB::table("User")->where("user_ID", "=", $userID)->update(array("PassWord"=>$newpassword));
            return response()->json(array("msg"=>"succeed"));
        }
        else{
            return response()->json(array("msg"=>"password incorrect"),400);
        }

    }


    #利用邮箱修改密码//前提是完成发送验证邮件
    public function EmailPasswordReset(Request $request)
    {
        $this->validate($request, [
            'email'    => 'required|email',
            'verifycode' => 'required',
            'newpassword'=>'required'

        ]);

        $email = $request->input("email");
        $verifycode = $request->input("verifycode");
        $newpassword = $this->PassWord($request->input("newpassword"));
        $isVerify = DB::table("Email_Valid_Code")->where("email", "=", $email)->where("valid_code","=",$verifycode)->where("CreateAt",">", date('Y-m-d H:i:s',strtotime("-30 minute",time())))->get();
        if(sizeof($isVerify)>0)
        {
            try {
                DB::beginTransaction();
                DB::table("User")->where("Email", "=", $email)->update(array("PassWord" => $newpassword));
                DB::table("Email_Valid_Code")->where("email", "=", $email)->delete();
                DB::commit();
                return response()->json(array("msg" => "succeed"));

            }
            catch (\Exception $e)
            {
                DB::rollBack();
                return response()->json(array("msg" => "update Error"),400);
            }

        }
        else{

            return response()->json(array("msg"=>"verify code has expired"),400);

        }


    }

    public function getImageVerifyCode()
    {
        $data = app('captcha')->create();
//        Cache::put($data['key'],$data['key'],180);
        if(isset($data['sensitive'])){
            unset($data['sensitive']);
        }
        return response()->json(["data"=>$data]);
    }

    //检测图片验证码
    public function checkImageVerifyCode($key,$captcha)
    {
//       return Cache::get($key);

//      return app('captcha')->check(strtolower($captcha),Cache::get($key));
        return app('captcha')->check(strtolower($captcha),$key);
    }

    public function RegisterMatchVerifyCode( $email,$verifyCode){

        $verifyinfo = DB::table("Email_Valid_Code")->where("email","=",$email)->where("valid_code","=",$verifyCode)->get();
        $verifyinfo =json_decode($verifyinfo,"true");
        if(sizeof($verifyinfo)>0)
        {
            $expireDate =  date('Y-m-d H:i:s', strtotime("+30 minute", strtotime($verifyinfo[0]["CreateAt"])));
            if(strtotime( date('Y-m-d H:i:s'))<strtotime($expireDate))
            {
                DB::table("Email_Valid_Code")->where("email","=",$email)->delete();
                return true;
            }
            else
            {
                DB::table("Email_Valid_Code")->where("email","=",$email)->delete();
                return false;
            }

        }
        else{
            return false;
        }


    }


    public function ModelTest(Request $request)
    {


        $IeltsExamModel = new IeltsAExamScore();
        $examData = $IeltsExamModel->GetUserExamData($request->input("userID"));
        return response()->json(["data"=>$examData]);

    }


    public function weixin(){
        return Socialite::driver('weixinweb')->redirect();
    }

    public function weixinlogin(){
        $user = Socialite::driver('weixinweb')->user();
//        dd($user);
//        $check = User::where('uid', $user->id)->where('provider', 'qq_connect')->first();
//        if (!$check) {
//            $customer = User::create([
//                'uid' => $user->id,
//                'provider' => 'qq_connect',
//                'name' => $user->nickname,
//                'email' => 'qq_connect+' . $user->id . '@example.com',
//                'password' => bcrypt(Str::random(60)),
//                'avatar' => $user->avatar
//            ]);
//        } else {
//            $customer = $check;
//        }

//        Auth::login($customer, true);
        return response()->json(["msg"=>$user]);
    }


    public function weibo() {
        return Socialite::with('weibo')->redirect();
        // return \Socialite::with('weibo')->scopes(array('email'))->redirect();
    }

    public function FreeIELTS(){
        $url = 'https://velocityenglish.com.au/storage/ielts/';

        $html = file_get_contents($url);

        $count = preg_match_all('/<td><a href="[^"]+">([^<]*)<\/a>/i', $html, $files);
        $arr = array();
        for ($i = 1; $i < $count; ++$i) {
            array_push($arr,$files[1][$i]);
        }
        return response()->json(["msg"=>"succeed","data"=>$arr]);


    }











}
