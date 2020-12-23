<?php


namespace App\Model;


use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table="Product";
    protected $primaryKey = "Product_ID";
    //重写update方法，不需要update时间字段
    public function getUpdatedAtColumn() {
        return null;
    }
    //用户获取商品列表
    function getUserShopStore()
    {
        return $this->where("isActive","=",1)->select("Product_ID","Description","Product_Content","Price")->get();
    }




    //管理员获取商品列表
    function getAdminShopStore()
    {
        return $this->get();
    }

    function setAdminProductActive($productID)
    {
        $productInfo = $this->where("Product_ID","=",$productID)->get()->first();
        $productInfo->isActive=1;
        $productInfo->save(['timestamps' => false]);
    }

    function setAdminProductDeActive($productID)
    {
        $productInfo = $this->where("Product_ID","=",$productID)->get()->first();
        $productInfo->isActive=0;
        $productInfo->save(['timestamps' => false]);
    }

}