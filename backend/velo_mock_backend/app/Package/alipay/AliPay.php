<?php


namespace App\Package\alipay;

require ('AopSdk.php');
class AliPay
{
    public static function alipays($data)
    {
        if (!$data)
        {
            exit('param is numm');
        }
        $out_trade_no = $data['order_no'];

        //订单名称，必填
        $subject = $data['order_name'];

        //付款金额，必填
        $total_amount = $data['total_num'];

        //商品描述，可空
        $body = $data['body'];

        $payRequestBuilder = new \AlipayTradePagePayContentBuilder();
        $payRequestBuilder->setBody($body);
        $payRequestBuilder->setSubject($subject);
        $payRequestBuilder->setTotalAmount($total_amount);
        $payRequestBuilder->setOutTradeNo($out_trade_no);

        $config = config('alipay');
        $payResponse = new \AlipayTradeService($config);
        $response = $payResponse->pagePay($payRequestBuilder,$config['return_url'],$config['notify_url']);

        return $response;
    }

    public static function notify($data)
    {
        $config = config('alipay');
        $alipaySevice = new \AlipayTradeService($config);
        $alipaySevice->writeLog(var_export($data,true));
        $result = $alipaySevice->check($data);

        if($result) {
            //验证成功
            //商户订单号
            $out_trade_no = $_POST['out_trade_no'];

            //支付宝交易号
            $trade_no = $_POST['trade_no'];

            //交易状态
            $trade_status = $_POST['trade_status'];

            if($_POST['trade_status'] == 'TRADE_FINISHED') {
                //根据业务需求返回
                return true;
            }
            else if ($_POST['trade_status'] == 'TRADE_SUCCESS') {
                //根据业务需求返回
                return true;
            }
            return true;
        }else {
            return false;
        }
    }

}