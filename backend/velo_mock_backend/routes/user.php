<?php
//user_api     ,'middleware'=>['auth:api','student']
$router->group(['prefix' => 'User','middleware'=>['auth:api','student']], function () use ($router) {

    $router->get('PaperList',"User_controller@GetPaperList" );
    $router->get('UserInfo', "User_controller@GetUserInfo");
    $router->get('GetShopStore', "User_controller@GetShopStore");//获取商品信息
    $router->get("GetUserExamDoing", "User_controller@GetUserExamDoing");

    $router->get('GetPromotionInfo', "User_controller@GetPromotionInfo");//获取优惠券信息
    $router->post('IeltsExamStart', "User_controller@IeltsExamStart");//开始Ielts考试接口，userid, ExamType,paperid
    $router->post('CCLExamStart', "User_controller@CCLExamStart");//开始考CCL试接口，userid, ExamType,paperid
    $router->post("ActivateCode","User_controller@ActivateCode");//激活激活码
    $router->post("ActivateGiftCode","User_controller@ActivateGiftCode");//激活禮包码
    $router->post("IELTSTargetSetting","User_controller@IELTSTargetSetting");//个人雅思成绩目标设置
    $router->get("IELTSTargetGet","User_controller@IELTSTargetGet");//个人获取已设定目标成绩
    $router->get("IELTSPaperHistory","User_controller@IELTSPaperHistory");//获取对应考卷的考试历史(根据用户id)
    $router->get("CCLPaperHistory","User_controller@CCLPaperHistory");//获取CCL考卷的考试历史(根据用户id)
    $router->post("SetCountryCity","User_controller@SetCountryCity");//设置个人国家数据

    $router->get("IELTSListeningHistoryAnswer","User_controller@IELTSListeningHistoryAnswer");//学生获取对应考试的听力问题和答案/标答
    $router->get("IELTSReadingHistoryAnswer","User_controller@IELTSReadingHistoryAnswer");//学生获取对应考试的阅读问题和答案/标答
    $router->get("IELTSWritingHistoryAnswer","User_controller@IELTSWritingHistoryAnswer");//学生获取对应考试的写作问题和答案/标答
    $router->get("IELTSSpeakingHistoryAnswer","User_controller@IELTSSpeakingHistoryAnswer");//学生获取对应考试的口语问题和答案/标答
    $router->get("CCLSpeakingHistoryAnswer","User_controller@CCLSpeakingHistoryAnswer");//学生获取对应CCL考试的口语问题和答案/标答


    $router->post("UseExpertIeltsTicket","User_controller@UseExpertIeltsTicket");//消耗expert優惠券
    $router->post("UseExpertCCLTicket","User_controller@UseExpertCCLTicket");//消耗CCLexpert優惠券

    $router->post("GetWordList","User_controller@GetWordList");//获取单词本所有单词列表 userID
    $router->post("AddWord","User_controller@AddWord");//增加单词 userID,word
    $router->post("DelWord","User_controller@DelWord");//减少单词 userID,word
    $router->get("CheckWord","User_controller@CheckWord");//具体单词查询 word


    $router->get("GetBannerImg","User_controller@GetBannerImg");

    $router->post("Giveup","User_controller@Giveup");//放弃考试


});
