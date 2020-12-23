import React, {Component} from 'react';
import {
    MDBRow,
    MDBListGroup,
    MDBListGroupItem,
    MDBCol,
    MDBContainer,
    MDBCard,
    MDBCardHeader,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBIcon,
    MDBNotification,
    MDBBtn
} from "mdbreact";
import TopNavigation from "../../topNavigation";
import Axios from "axios";
import {CountdownCircleTimer} from "react-countdown-circle-timer";
import $ from 'jquery';
import '../../Global';
import {ReactMic} from 'react-mic';
import axios from 'axios';
import {Modal, Input, Button, Col, Row, Switch} from 'antd';
import {NavLink, Link, Redirect} from "react-router-dom";
import reactStringReplace from "react-string-replace";
import JsxParser from 'react-jsx-parser';
import {parseTag, submitError, renderTime, askAddWord} from '../../Utility';


// const renderTime = ({remainingTime}) => {
//     if (remainingTime === 0) {
//         return <div className="timer" style={{fontSize: '20pt', color: 'orange'}}>
//             <center>等待读题</center>
//         </div>;
//     }
//
//     const minute = Math.floor(remainingTime/60);
//
//     return (
//         <div className="timer">
//             <div className="text">还剩</div>
//             <div className="value" style={{fontSize: '25pt'}}>{minute===0?(remainingTime+'秒'):(minute+'分钟')}</div>
//         </div>
//     );
// };

class IELTSWriting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            key: 0,
            duration: 0,
            formData: new FormData(),
            tick: [],
            uploading: false,
            isCollapsed:false,
            addWord: false
        }
        this.writing = [];
        this.curr = 0;
        this.exit = false;
    }


    //获取写作题目
    getWriting = () => {
        //let jsonData = {"msg":"succeed","data":{"Paper_ID":1,"Section_1_AudioArray":["https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav"],"Section_2_Question":"\u6211\u662f\u56fd\u670d\u7b2c\u4e00\u674e\u767d\uff0c\u4e0d\u5bb9\u53cd\u9a73","Section_2_Image":"","Section_3_AudioArray":["https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav"]}};
        let jsonData = {
            "msg": "succeed",
            "data": [{
                "Paper_ID": 1,
                "W_Section_1_Text": "[PART]IELTS Writing Section 1 Question\\n\\nSample image:\\n[IMG]https:\/\/velocityenglish.com.au\/newpro\/img\/banner-top666.jpg[IMG]\\n\\nSome ending text.[PART]",
                "W_Section_1_Imgpath": "https:\/\/velocityenglish.com.au\/newpro\/img\/banner-top666.jpg",
                "W_Section_2_Text": "[PART]IELTS Writing Section 2 Quesiotn description. Text-only.[PART]",
                "W_Section_2_Imgpath": "https:\/\/velocityenglish.com.au\/newpro\/img\/banner-top666.jpg"
            }]
        }
        console.log('Getting writing data');

        axios.get(global.config.url + `Ielts/WriteQuestion?ExamID=`+global.config.examID).then(res => {
            console.log(res.data);
            jsonData = res.data;

            if (jsonData.msg === 'succeed') {
                console.log('original ' + jsonData);
                //this.writing.push(parseTag(jsonData.data[0].W_Section_1_Text));

                this.writing.push(parseTag(jsonData.data[0].W_Section_1_Text));
                this.writing.push(parseTag(jsonData.data[0].W_Section_2_Text));

                //this.writing.push(jsonData.data[0].W_Section_1_Text);
                //console.log(this.writing);



                this.setState({
                    loading: false,
                }, () => {
                    let self = this;

                    let img = document.getElementById('img1');
                    if(img!==null) {
                        img.addEventListener('click', function () {
                            self.onClick(1);
                        });
                    }


                    document.getElementById('question1').innerHTML = this.writing[0];
                    document.getElementById('question2').innerHTML = this.writing[1];

                    document.getElementById('question1').addEventListener('click',this.onWordSelect);
                    document.getElementById('question2').addEventListener('click',this.onWordSelect);

                    document.getElementById('WA1').value = JSON.parse(localStorage.getItem('IELTSWritingAnswer'+global.config.examID)).WA1;
                    document.getElementById('WA2').value = JSON.parse(localStorage.getItem('IELTSWritingAnswer'+global.config.examID)).WA2;

                    setTimeout(() => {

                        this.playCounter((global.config.IELTSWritingTime*1000-this.curr)/1000);

                    }, 1000);
                });

            } else {
                console.log('Fail to get writing data');
            }
        });
    }

    //意外退出检测
    componentDidMount() {
        const addWord = JSON.parse(localStorage.getItem('addWord'));
        if(addWord!==null){
            this.setState({addWord:addWord});
        }

        const local = JSON.parse(localStorage.getItem('IELTSProgress'+global.config.examID));

        if(local===null){
            console.log('local null');
            //测试用
            localStorage.setItem('IELTSProgress'+global.config.examID,JSON.stringify({'examID':global.config.examID,'Section':'Writing','curr':JSON.stringify(Date.now())}));
            localStorage.setItem('IELTSWritingAnswer'+global.config.examID,JSON.stringify({'WA1':'','WA2':''}));
        }else if(local.examID===global.config.examID&&local.Section==='Reading'){
            console.log('正常从阅读跳转至本页');
            localStorage.setItem('IELTSProgress'+global.config.examID,JSON.stringify({'examID':global.config.examID,'Section':'Writing','curr':JSON.stringify(Date.now())}));
            localStorage.setItem('IELTSWritingAnswer'+global.config.examID,JSON.stringify({'WA1':'','WA2':''}));
        }else if(local.examID===global.config.examID&&local.Section==='Writing'){
            console.log('写作意外退出重新加载');
            this.exit = true;

            this.curr = Date.now() - parseInt(JSON.parse(localStorage.getItem('IELTSProgress'+global.config.examID)).curr);
            //console.log('from last time access '+curr);

            if(this.curr>global.config.IELTSWritingTime*0.1){
                this.upload();
                return;
            }

        }else if(local.examID!==global.config.examID){
            console.log('有其他考试未完成就来到这个考试'+local.examID+' '+global.config.examID);
        }

        this.getWriting();
    }

    componentWillUnmount() {
        let idArr = ['question1','question2'];
        for(let i=0;i<idArr.length;i++){
            let section = document.getElementById(idArr[i]);
            if(section!==null){
                section.removeEventListener('click',this.onWordSelect);
            }
        }

        // document.getElementById('question1').removeEventListener('click',this.onWordSelect);
        // document.getElementById('question2').removeEventListener('click',this.onWordSelect);
    }

    onWordSelect = () => {
        let range = window.getSelection() || document.getSelection() || document.selection.createRange();
        let word = $.trim(range.toString());
        word = word.split(' ');
        if(word.length===1){
            word = word[0];
            if(word!==''&& /^[\w-]+$/.test(word) && this.state.addWord){
                askAddWord(word);
            }
        }
    }

    completeCounter = (i) => {
        if(i!==0){
            console.log('Time\'s up');

            this.upload();

        }
    }

    upload=()=>{
        //写作和口语一起上传，这里不上传
        this.setState({loading:true,uploading:true});
        this.props.nextSection();

        // let formData = new FormData();
        // let answer = JSON.parse(localStorage.getItem('IELTSWritingAnswer'+global.config.examID));
        //
        // for(let key in answer){
        //     formData.append(key, answer[key]);
        // }
        //
        // formData.append('examID', global.config.examID);
        // console.log('formData '+formData);
        //
        // console.log('uploading writing');
        // this.setState({loading:true,uploading:true});
        //
        // axios({
        //     method: 'post',
        //     url:global.config.url + `Ielts/WritingSubmit`,
        //     data: formData
        // }).then(res => {
        //     console.log(res);
        //     if (res.data.msg === 'succeed') {
        //         localStorage.removeItem('IELTSWritingAnswer'+global.config.examID);
        //         //window.location.href = '/IELTSSpeaking';
        //         this.props.nextSection();
        //     }else {
        //         console.log('submit fail');
        //         submitError('答案提交失败');
        //     }
        // }).catch(err=>{
        //     console.log(err);
        //     console.log('submit fail');
        //     submitError('答案提交失败');
        // })
    }

    // startRecording = () => {
    //     this.setState({ record: true });
    // }
    //
    // stopRecording = () => {
    //     this.setState({ record: false });
    // }

    // onData(recordedBlob) {
    //     console.log('chunk of real-time data is: ', recordedBlob);
    // }

    playCounter = (answerTime) => {
        setTimeout(() => {
            this.setState({key: this.state.key + 1, duration: answerTime});
        }, 1000);
    }

    onInput = (i,text) => {
        //console.log('onInput' + i+' '+text);
        let answer = JSON.parse(localStorage.getItem('IELTSWritingAnswer'+global.config.examID));
        answer['WA'+i] = text;
        localStorage.setItem('IELTSWritingAnswer'+global.config.examID,JSON.stringify(answer));
    }

    onClick = (i) => {
        console.log('onClick' + i);
    }

    showSection = (sec) => {
        if(!this.state.loading) {
            for (let i = 1; i < 3; i++) {
                if (i === sec) {
                    document.getElementsByClassName('section' + i)[0].style.display = 'block';
                    document.getElementsByClassName('section' + i)[1].style.display = 'block';
                    document.getElementById('btn' + i).style.backgroundColor = global.config.grey;
                } else {
                    document.getElementsByClassName('section' + i)[0].style.display = 'none';
                    document.getElementsByClassName('section' + i)[1].style.display = 'none';
                    document.getElementById('btn' + i).style.backgroundColor = '';
                }
            }
        }
    }

    toggleSidebar = ()=>{
        if(this.state.isCollapsed){
            document.getElementById('sidebar').classList.remove('sidebarCollapse');
            document.getElementById('sidebar').classList.add('sidebarShow');
            this.setState({
                isCollapsed:false
            });
        }else{
            document.getElementById('sidebar').classList.remove('sidebarShow');
            document.getElementById('sidebar').classList.add('sidebarCollapse');
            this.setState({
                isCollapsed:true
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                {/*<TopNavigation/>*/}
                <Row style={{margin: '30px', height: '85vh'}}>
                    <Col id='sidebar' flex="190px" style={{marginRight: '30px'}}>
                        <MDBCard style={{height: '85vh',borderRadius: '20px'}}>
                            <MDBCardHeader style={cardHeader}>
                                考试进度
                            </MDBCardHeader>
                            <MDBCardBody style={{fontSize: '14pt', fontWeight: 'bold'}}>
                                <div>
                                    <center><CountdownCircleTimer
                                        key={this.state.key}
                                        size={150}
                                        strokeWidth={15}
                                        // isPlaying={this.state.isPlaying[1]}
                                        isPlaying
                                        duration={this.state.duration}
                                        colors={[["#4caf50", 0.75], ["#ff9800", 0.85], ["#f44336"]]}
                                        onComplete={this.completeCounter}
                                    >
                                        {/*{({ remainingTime }) => remainingTime}*/}
                                        {renderTime}
                                    </CountdownCircleTimer></center>
                                    {/*<button onClick={() => this.playCounter(3)}>play</button>*/}
                                </div>
                                <hr/>
                                <div style={{color: 'green'}}><MDBIcon far icon="check-square" className="mr-3"/>听力
                                </div>
                                <hr/>
                                <div style={{color: 'green'}}><MDBIcon far icon="check-square" className="mr-3"/>阅读
                                </div>
                                <hr/>
                                <div style={{color: 'green', fontSize: '20pt'}}><MDBIcon far icon="caret-square-right"
                                                                                         className="mr-3"/>写作
                                </div>
                                <hr/>
                                <div><MDBIcon far icon="square" className="mr-3"/>口语</div>
                                {/*{*/}
                                {/*    this.props.isVIP*/}
                                {/*        ?*/}
                                {/*        <div style={{position:'absolute',bottom:'20px',left:'37px'}}>单词本<Switch className='ml-3' checked={this.state.addWord} onChange={(e)=>{this.setState({addWord:e});localStorage.setItem('addWord',JSON.stringify(e))}}/></div>*/}
                                {/*        :*/}
                                {/*        <center><div style={{position:'absolute',bottom:'20px',left:'40.5px',fontSize:'11pt'}}>单词本(VIP功能)<br/><Switch checked={false} disabled={true}/></div></center>*/}

                                {/*}*/}
                                {/*<button onClick={this.startTest}>Start Exam</button>*/}
                            </MDBCardBody>
                            <div className='pt-2 pb-2' style={{fontWeight:'bold',backgroundColor:'#E0E0E0',borderRadius:'0 0 20px 20px'}}>
                                <center>
                                    {
                                        this.props.isVIP
                                            ?
                                            <div style={{fontSize: '14pt'}}>单词本<Switch
                                                className='ml-3' checked={this.state.addWord} onChange={(e) => {
                                                this.setState({addWord: e});
                                                localStorage.setItem('addWord', JSON.stringify(e))
                                            }}/></div>
                                            :
                                            <div style={{fontSize: '11pt'}}>单词本(VIP功能)<br/><Switch checked={false} disabled={true}/></div>
                                    }
                                </center>
                            </div>
                        </MDBCard>
                    </Col>
                    <Col flex='1 1 200px' style={{marginRight:'30px'}}>
                        <MDBCard style={{height: '85vh',borderRadius:'20px'}}>
                            <MDBCardHeader style={cardHeader}>
                                {
                                    this.state.isCollapsed
                                        ? <MDBIcon icon="angle-double-right" onClick={this.toggleSidebar} className="mr-3" style={{cursor:'pointer'}}/>
                                        : <MDBIcon icon="angle-double-left" onClick={this.toggleSidebar} className="mr-3" style={{cursor:'pointer'}}/>
                                }
                                写作题目
                                <Button onClick={this.props.highlight} className='ml-3 mr-3'>高亮</Button>
                                <Button onClick={this.props.nextSection}>下一部分（测试用）</Button>
                                <div style={{float: 'right'}}>
                                    <Button style={{backgroundColor:global.config.grey}} id={'btn1'} onClick={() => this.showSection(1)}>Section 1</Button>
                                    <Button id={'btn2'} onClick={() => this.showSection(2)}>Section 2</Button>
                                </div>
                            </MDBCardHeader>
                            <div className="card-body p-4" style={{fontSize: '14pt',overflowY:'auto'}}>
                                {
                                    this.state.loading ?
                                        <center>
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            <br/>
                                            {
                                                this.state.uploading?
                                                    '写作时间已用完，正在提交答案，下一部分是口语，请做好准备！'
                                                    :''
                                            }
                                        </center>
                                        :
                                        // <div dangerouslySetInnerHTML={{__html:this.writing[0]}} />
                                        // <React.Fragment onClick={this.onChange}>{this.writing[0]}</React.Fragment>
                                        // <Parser str={this.writing[0]} onClick={this.clickclick}/>
                                        // <React.Fragment>{this.writing[0]}</React.Fragment>
                                        <div>

                                            <div className='section1'>
                                                <div style={{fontWeight: 'bold'}}>Section 1 Question</div>
                                                <br/>
                                                <div id='question1' style={{cursor:'pointer'}}/>
                                                <br/>
                                            </div>
                                            <div className='section2' style={{display:'none'}}>
                                                <div style={{fontWeight: 'bold'}}>Section 2 Question</div>
                                                <br/>
                                                <div id='question2' style={{cursor:'pointer'}}/>
                                                <br/>
                                            </div>

                                            {/*<div style={{fontWeight:'bold'}}>Section 1 Question</div>*/}
                                            {/*<br/>*/}
                                            {/*<JsxParser*/}
                                            {/*    components={{MDBBtn}}*/}
                                            {/*    jsx={this.writing[0]}*/}
                                            {/*/>*/}
                                            {/*<br/>*/}
                                            {/*<div className="form-group">*/}
                                            {/*    <label>*/}
                                            {/*        Section 1 Answer Box*/}
                                            {/*    </label>*/}
                                            {/*    <textarea*/}
                                            {/*        className="form-control"*/}
                                            {/*        id='WA1'*/}
                                            {/*        onInput={(e)=>this.onInput(1,e.target.value)}*/}
                                            {/*        rows="10"*/}
                                            {/*    />*/}
                                            {/*</div>*/}
                                            {/*<br/>*/}
                                            {/*<br/>*/}
                                            {/*<div style={{fontWeight:'bold'}}>Section 2 Question</div>*/}
                                            {/*<br/>*/}
                                            {/*<JsxParser*/}
                                            {/*    components={{MDBBtn}}*/}
                                            {/*    jsx={this.writing[1]}*/}
                                            {/*/>*/}
                                            {/*<br/>*/}
                                            {/*<div className="form-group">*/}
                                            {/*    <label>*/}
                                            {/*        Section 2 Answer Box*/}
                                            {/*    </label>*/}
                                            {/*    <textarea*/}
                                            {/*        className="form-control"*/}
                                            {/*        id='WA2'*/}
                                            {/*        onInput={(e)=>this.onInput(2,e.target.value)}*/}
                                            {/*        rows="10"*/}
                                            {/*    />*/}
                                            {/*</div>*/}
                                        </div>
                                }
                            </div>
                        </MDBCard>
                    </Col>
                    <Col flex='1 1 200px'>
                        <MDBCard style={{height: '85vh',borderRadius: '20px'}}>
                            <MDBCardHeader style={cardHeader}>
                                写作答题区
                            </MDBCardHeader>
                            <div className="card-body p-4"
                                 style={{fontSize: '14pt', overflowY: 'auto', overflowX: 'auto'}}>
                                {
                                    this.state.loading ?
                                        <center>
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            <br/>
                                            {
                                                this.state.uploading ?
                                                    '写作时间已用完，正在提交答案，下一部分是口语，请做好准备！'
                                                    : ''
                                            }
                                        </center>
                                        :
                                        <div>
                                            <div className="form-group section1" >
                                                <label style={{fontWeight: 'bold'}}>
                                                    Section 1 Answer Box
                                                </label>
                                                <br/>
                                                <textarea
                                                    className="form-control"
                                                    id='WA1'
                                                    onInput={(e)=>this.onInput(1,e.target.value)}
                                                    rows="20"
                                                />
                                            </div>
                                            <div className="form-group section2" style={{display:'none'}}>
                                                <label style={{fontWeight: 'bold'}}>
                                                    Section 2 Answer Box
                                                </label>
                                                <br/>
                                                <textarea
                                                    className="form-control"
                                                    id='WA2'
                                                    onInput={(e)=>this.onInput(2,e.target.value)}
                                                    rows="20"
                                                />
                                            </div>
                                        </div>
                                }
                            </div>
                        </MDBCard>
                    </Col>
                </Row>
                <center><div style={{backgroundColor:'white',padding:'10px',width:'350px',position:'absolute',fontSize:'14pt',top:'15px',left:'50%',right:'50%',marginLeft:'-175px'}} >
                    写作剩余作答时间：<div id='remain' style={{display:'inline'}}/>
                </div></center>
            </React.Fragment>
        );
    }
}

const cardHeader = {
    backgroundColor: global.config.brown,
    color: 'white',
    fontSize: '16pt',
    borderRadius:'20px 20px 0 0'
    // fontWeight: 'bold'
}

export default IELTSWriting;