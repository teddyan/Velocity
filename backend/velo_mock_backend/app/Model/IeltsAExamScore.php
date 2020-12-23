<?php


namespace App\Model;


use Illuminate\Database\Eloquent\Model;

class IeltsAExamScore extends Model
{
    protected $table="Ielts_A_ExamScore";



    public function GetUserExamData($userID)
    {
       return $this->where("user_ID", "=" , $userID)->get();
    }

}