<?php


namespace App\Model;


use Illuminate\Database\Eloquent\Model;

class CCLExamScore extends Model
{
    protected $table="CCL_ExamScore";



    public function GetUserExamData($userID)
    {
       return $this->where("user_ID", "=" , $userID)->get();
    }

}