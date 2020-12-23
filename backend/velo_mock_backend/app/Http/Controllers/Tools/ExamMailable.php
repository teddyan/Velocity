<?php


namespace App\Http\Controllers\Tools;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;

class ExamMailable extends Mailable
{
    use Queueable, SerializesModels;

    private $mailTo;
    private $mailSubject;
    // the values that shouldnt appear in the mail should be private

    public $content;
    // public properties are accessible from the view

    /**
     * Create a new message instance.
     *
     * @param LayoutMailRawRequest $request
     */
    public function __construct($to, $subject, $content)
    {
        $this->content = $content;
        $this->mailSubject = $subject;
        $this->mailTo = $to;
    }

    /**
     * Build the message.
     *
     * @throws \Exception
     */
    public function build()
    {
        $this->view('emails.ielts_exam_result_mail');

        $this->subject($this->mailSubject)
            ->to($this->mailTo);
    }
}