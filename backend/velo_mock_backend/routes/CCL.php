<?php
use Illuminate\Support\Facades\Auth;
$router->group(['prefix' => 'CCL'], function () use ($router) {
   
    $router->get('SpeakQuestion',"CCL_controller@GetSpeakingQuestion" );

    $router->post('SpeakingSubmit', "CCL_controller@SpeakingSubmit");
});