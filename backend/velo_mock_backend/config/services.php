<?php
return [
    'weixinweb' => [
        'client_id'     => env('WEIXINWEB_CLIENT_ID'),
        'client_secret' => env('WEIXINWEB_CLIENT_SECRET'),
        'redirect'      => env('WEIXINWEB_REDIRECT_URI'),

        # 这一行配置非常重要，必须要写成这个地址。
//        'auth_base_uri' => 'https://open.weixin.qq.com/connect/qrconnect',
    ],
    'weibo' => [
        'client_id' => env('WEIBO_KEY'),
        'client_secret' => env('WEIBO_SECRET'),
        'redirect' => env('WEIBO_REDIRECT_URI'),
    ],


];