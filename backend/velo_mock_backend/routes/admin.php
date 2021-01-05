<?php
use Illuminate\Support\Facades\Auth;

$router->group(['prefix' => 'AdminHappy', 'middleware'=>['auth:api','admin']], function () use ($router) {
    //vscode test
    $router->post('GenerateGeneralPromotion',"AdminController@GenerateGeneralPromotion" );//参数是code,name,value,comment,duration,
    $router->post('GenerateSpecialPromotion',"AdminController@GenerateSpecialPromotion" );//参数是code,name,value,comment,user_id,duration
    $router->post('ChangeCodeStatus',"AdminController@ChangeCodeStatus" );
    $router->post('DeleteCode',"AdminController@DeleteCode" );//删除优惠券
    $router->post('BatchActivityCodeGenerate',"AdminController@BatchActivityCodeGenerate");//批量生成雅思优惠券
    $router->post("InsertIeltsPaper","AdminController@InsertIeltsPaper");//插入新雅思试卷
    $router->post("InsertCCLPaper","AdminController@InsertCCLPaper");//插入新CCL试卷
    $router->post("DeActivePaper","AdminController@DeActivePaper");//试卷不激活
    $router->post("ActivePaper","AdminController@ActivePaper");//试卷激活
    $router->post("PaperSetFree","AdminController@PaperSetFree");//试卷设免费
    $router->post("PaperSetUnFree","AdminController@PaperSetUnFree");//试卷设付费
    $router->post("updatePaperName","AdminController@updatePaperName");//修改试卷名字
    //用户操作接口
    $router->post("UserSetActive","AdminController@UserSetActive");//激活用户
    $router->post("UserSetDeActive","AdminController@UserSetDeActive");//不激活用户
    $router->post("addAccount","AdminController@addAccount");//创建用户
    $router->post("SetVIP","AdminController@SetVIP");//设置vip
    $router->post("unSetVIP","AdminController@unSetVIP");//取消vip
    $router->post("setIeltsVoucher","AdminController@setIeltsVoucher");//设置雅思券数目
    $router->post("setPteVoucher","AdminController@setPteVoucher");//设置pte券数目
    $router->post("setCclVoucher","AdminController@setCclVoucher");//设置ccl券数目
    $router->post("setIeltsExpertVoucher","AdminController@setIeltsExpertVoucher");//设置雅思专家券数目
    $router->post("setPteExpertVoucher","AdminController@setPteExpertVoucher");//设置PTE专家券数目
    $router->post("setCclExpertVoucher","AdminController@setCclExpertVoucher");//设置CCL专家券数目
    $router->post("setRoleID","AdminController@setRoleID");//设置role权限
    $router->post("setVIPEnd","AdminController@setVIPEnd");//设置VIP结束时间
    $router->post("setVIPStart","AdminController@setVIPStart");//设置VIP结束时间
    $router->post("setAudioTime","AdminController@setAudioTime");//设置AUDIOTIME次数

    //禮包生成operate table用
    $router->post("SetEPVip_PTE","AdminController@SetEPVip_PTE");
    $router->post("SetEPVip_Expert_PTE","AdminController@SetEPVip_Expert_PTE");
    $router->post("SetEPVip_CCL","AdminController@SetEPVip_CCL");
    $router->post("SetEPVip_Expert_CCL","AdminController@SetEPVip_Expert_CCL");
    $router->post("SetEPVip_IELTS","AdminController@SetEPVip_IELTS");
    $router->post("SetEPVip_Expert_IELTS","AdminController@SetEPVip_Expert_IELTS");
    $router->post("SetEPVip_VIP","AdminController@SetEPVip_VIP");
    $router->post("SetEPVip_Activity","AdminController@SetEPVip_Activity");
    $router->post("SetEPVip_Comment","AdminController@SetEPVip_Comment");
    $router->post("SetEPVip_Start_Day","AdminController@SetEPVip_Start_Day");
    $router->post("SetEPVip_Duration","AdminController@SetEPVip_Duration");
    $router->post("SetEPVip_Status","AdminController@SetEPVip_Status");
    $router->post("DeleteVoucherInfo","AdminController@DeleteVoucherInfo");


    //文件操作型接口
    $router->post("ImgUpload","Tool@imageSourceUpload");//图片上传
    $router->post("AudioUpload","Tool@AudioSourceUpload");//音频上傳
    $router->post("CCL_AudioUpload","Tool@CCL_AudioSourceUpload");//CCL音频上傳
    $router->get("ImgDetail","Tool@ImagesDetail");//获取图像列表
    $router->get("AudioDetail","Tool@AudiosDetail");//获取音频表
    $router->post("DelFile","Tool@DelFile");//删除文件


    //试卷操作插入接口
    $router->get("GetIeltsListeningInfo","AdminController@GetIeltsListeningInfo");
    $router->get("GetIeltsReadingInfo","AdminController@GetIeltsReadingInfo");
    $router->get("GetIeltsWritingInfo","AdminController@GetIeltsWritingInfo");
    $router->get("GetIeltsSpeakingInfo","AdminController@GetIeltsSpeakingInfo");
    $router->get("GetCCLInfo","AdminController@GetCCLInfo");
    $router->post("WritingPaperUpdate","AdminController@WritingPaperUpdate");
    $router->post("ReadingPaperUpdate","AdminController@ReadingPaperUpdate");
    $router->post("SpeakingPaperUpdate","AdminController@SpeakingPaperUpdate");
    $router->post("ListeningPaperUpdate","AdminController@ListeningPaperUpdate");
    $router->post("CCLPaperUpdate","AdminController@CCLPaperUpdate");


    //信息获取类接口
    $router->get("UserInfo","AdminController@UserInfo");
    $router->get("PaperInfo","AdminController@PaperInfo");
    $router->get("ProductInfo","AdminController@ProductInfo");
    $router->post("ProductActive","AdminController@ProductActive");//对产品激活
    $router->post("ProductDeActive","AdminController@ProductDeActive");//对产品反激活
    $router->post("ProductAdd","AdminController@ProductAdd");//增加新产品
    $router->post("ProductEdit","AdminController@ProductEdit");//增加新产品
    $router->get("GetPromoInfo","AdminController@GetPromoInfo");//获取优惠券信息
    $router->post("DelGeneralProActive","AdminController@DelGeneralProActive");//通用优惠券去除激活过的用户
    $router->get("VoucherInfo","AdminController@VoucherInfo"); //禮包table


    //VIP优惠管理
    $router->get("GetAllVipPower","AdminController@GetAllVipPower");
    $router->post("UpdateAllVipPower","AdminController@UpdateAllVipPower");
    $router->post("CreateVipVoucher", "AdminController@CreateVipVoucher"); //禮包



    $router->get("GetBannerImg","AdminController@GetBannerImg");

    $router->post("ChangeBannerImg","AdminController@ChangeBannerImg");




    //








//    $router->get('password',"User_controller@PassWord" );


});