<?php
$router->group(['prefix' => 'Main'], function () use ($router) {
    $router->post('SendVerifyCode',"MainController@SendVerifyCode" );
    $router->post('MatchVerifyCode',"MainController@MatchVerifyCode" );
    $router->post("LoginEmail","MainController@LoginEmail");
    $router->post("SignUpEmail","MainController@SignUpEmail");
    $router->get("ExistEmail","MainController@ExistEmail");
    $router->post('OldPasswordReset',"MainController@OldPasswordReset");
    $router->post('EmailPasswordReset',"MainController@EmailPasswordReset");
    $router->get('GetImageVerifyCode',"MainController@getImageVerifyCode");
    $router->get("clearCache","MainController@clearCache");
    $router->get("ModelTest","MainController@ModelTest");
    $router->get("FreeIELTS","MainController@FreeIELTS");

    $router->get('weixin', 'MainController@weixin');
    $router->get('weixin/callback', 'MainController@weixinlogin');


    $router->get('weibo', 'MainController@weibo');
});
