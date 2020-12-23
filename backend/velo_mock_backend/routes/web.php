<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


$router->get('/', function () use ($router) {
//    $data = DB::table("User")->get();
    return "接口";
});
$router->get("/GetLoginStatus",['middleware'=>'auth:api',function() use ($router)
{     
    $userid =\Illuminate\Support\Facades\Auth::user()['user_ID'];
    $user_info =DB::table("User")->where("user_ID","=",$userid)->get()->first();
    $mytime = date("y-m-d");
    $last_login_dataAdd = date("y-m-d", strtotime("+1 day",strtotime($user_info->last_login)));
                

    if(strtotime($mytime)==strtotime($last_login_dataAdd))
    {

        DB::table('User')->where("user_ID","=",$userid)->update(["last_login"=>$mytime]);
        DB::table('User')->where("user_ID","=",$userid)->increment("loginday");
    }
    else if(strtotime($mytime)>strtotime($last_login_dataAdd))
    {
        DB::table('User')->where("user_ID","=",$userid)->update(["last_login"=>$mytime]);
        DB::table('User')->where("user_ID","=",$userid)->update(["loginday"=>0]);
    }

    
    
    $data["user_ID"] =\Illuminate\Support\Facades\Auth::user()['user_ID'];
    $data["role_ID"] =\Illuminate\Support\Facades\Auth::user()['role_ID'];
    $data["username"] = \Illuminate\Support\Facades\Auth::user()['username'];
     $data["loginday"] = \Illuminate\Support\Facades\Auth::user()['loginday'];
    return response()->json(["msg"=>"succeed","data"=>$data],200);
}]);
//登出
$router->get("/User/Logout",['middleware'=>'auth:api',function() use ($router)
{

    Auth::invalidate(true);

    return response()->json(["msg"=>"log out"]);
//    return response()->json(["msg"=>"succeed","data"=>$data],200);
}]);




//主页
