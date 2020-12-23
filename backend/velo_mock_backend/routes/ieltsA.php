<?php
use Illuminate\Support\Facades\Auth;
$router->group(['prefix' => 'Ielts'], function () use ($router) {
    $router->get('ListenQuestion',"Ielts_controller@GetListeningQuestion" );
    $router->get('ReadQuestion',"Ielts_controller@GetReadingQuestion" );
    $router->get('SpeakQuestion',"Ielts_controller@GetSpeakingQuestion" );
    $router->get('WriteQuestion',"Ielts_controller@GetWritingQuestion" );
    $router->post('ReadingSubmit', "Ielts_controller@ReadingSubmit");
    $router->post('ListeningSubmit', "Ielts_controller@ListeningSubmit");

    // Stest
//    $router->post('St', "Ielts_controller@SpeakingAnswerTest");

    $router->post('SpeakingSubmit', "Ielts_controller@SpeakingSubmit");
    $router->post('WritingSubmit', "Ielts_controller@WritingSubmit");

});