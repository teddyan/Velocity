<?php
use Illuminate\Support\Facades\Auth;

//'middleware'=>['auth:api','teacher'], 暂时未开启，前端后续联系我
$router->group(['prefix' => 'Teacher','middleware'=>['auth:api','teacher']], function () use ($router) {
    $router->get('GetIeltsSpeakingAnswer',"TeacherController@GetSpeakingAnswer" );
    $router->get('GetIeltsWritingAnswer',"TeacherController@GetWritingAnswer" );
    $router->get('GetCCLAnswer',"TeacherController@GetCCLAnswer");
    $router->get('GetIeltsScoreList',"TeacherController@GetScore" );
    $router->get('GetCCLScoreList',"TeacherController@GetCCLScore" ); //GET CCL SCROE LIST
    $router->post('UpdateIeltsWriting',"TeacherController@UpdateIeltsWriting" );//用于老师写作提交成绩的接口
    $router->post('UpdateIeltsSpeaking',"TeacherController@UpdateIeltsSpeaking" );//用于老师口语提交成绩的接口
    $router->post('UpdateCCLScore',"TeacherController@UpdateCCLScore" );//用于老师CCL提交成绩的接口
    $router->post('SubmitScoreFinish',"TeacherController@SubmitScoreFinish" );//用于老师最终结果以及发送邮件
    $router->post('SubmitCCLScoreFinish',"TeacherController@SubmitCCLScoreFinish" );//用于老师最终结果以及发送邮件



});
