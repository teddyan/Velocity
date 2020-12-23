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
import {Modal, Input, Table, Select, Button, Col, Row, Switch} from 'antd';
import {NavLink, Link, Redirect} from "react-router-dom";
import reactStringReplace from "react-string-replace";
import JsxParser from 'react-jsx-parser';
import {escapeHTML, parseTag, submitError, renderTime, askAddWord} from "../../Utility";




class IELTSReading extends Component {

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
        this.reading = [];
        this.curr = 0;
        this.exit = false;
    }

    // renderTime = ({remainingTime}) => {
    //
    //     const minute = Math.floor(remainingTime / 60);
    //     let remain = document.getElementById('remain');
    //
    //     if (remainingTime === 0) {
    //         if(remain!==null){
    //             remain.innerHTML = '等待读题';
    //         }
    //         return <div className="timer" style={{fontSize: '20pt', color: 'orange'}}>
    //             <center>等待读题</center>
    //         </div>;
    //     }
    //
    //     const timeString = minute === 0 ? (remainingTime + '秒') : (minute + '分钟');
    //     if(remain!==null){
    //         remain.innerHTML = timeString;
    //     }
    //
    //     return (
    //         <div className="timer">
    //             <div className="text">还剩</div>
    //             <div className="value"
    //                  style={{fontSize: '25pt'}}>{timeString}</div>
    //         </div>
    //     );
    // };

    //获取阅读答案
    getReading = () => {
        //let jsonData = {"msg":"succeed","data":{"Paper_ID":1,"Section_1_AudioArray":["https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav"],"Section_2_Question":"\u6211\u662f\u56fd\u670d\u7b2c\u4e00\u674e\u767d\uff0c\u4e0d\u5bb9\u53cd\u9a73","Section_2_Image":"","Section_3_AudioArray":["https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav"]}};
        let jsonData = {
            "msg": "succeed",
            "data": [{
                "Paper_ID": 1,
                "R_Section1_Text": "[PART]first table\\n<table><tbody><tr><td>[TABLE-1]<\/td><td>some table texts<\/td><\/tr><tr><td>[IMG]https:\/\/velocityenglish.com.au\/newpro\/img\/banner-top666.jpg[IMG]<\/td><td>[TABLE-2]<\/td><\/tr><\/tbody><\/table>\\nMultiple choice single choice question:[MCSC-3]\\nA. xxx\\nB. xxx\\nC. xxx\\n\\nMultiple choice multiple choices question:[MCMC-4]\\nA. xxx\\nB. xxx\\nC. xxx\\n\\nFill the blank question: some text before [FTB-5] some texts after.\\n\\nsecond table\\n<table><tbody><tr><td>some table texts<\/td><td>[TABLE-6]<\/td><\/tr><tr><td>some texts before [TABLE-7] some texts after<\/td><td>some other table texts<\/td><\/tr><\/tbody><\/table>\\nFill the blank question: some text before [FTB-8] some texts after.\\n\\nMultiple choice multiple choices question:[MCMC-9]\\nA. xxx\\nB.xxx\\nC.xxx\\n\\nTFN: [TFN-10][PART]",
                "R_Section1_ImageSrc": "https:\/\/velocityenglish.com.au\/newpro\/img\/banner-top666.jpg",
                "R_Section2_Text": "[PART]Section 2 Content[PART]",
                "R_Section2_ImageSrc": "https:\/\/velocityenglish.com.au\/newpro\/img\/banner-top666.jpg",
                "R_Section3_Text": "[PART]Section 3 Content[PART]",
                "R_Section3_ImageSrc": "https:\/\/velocityenglish.com.au\/newpro\/img\/banner-top666.jpg"
            }]
        }
        console.log('Getting reading data');

        axios.get(global.config.url + `Ielts/ReadQuestion?ExamID=` + global.config.examID).then(res => {
            console.log(res.data);
            jsonData = res.data;

            if (jsonData.msg === 'succeed') {
                console.log('original ' + jsonData);

                this.reading.push(parseTag(jsonData.data[0].R_Section1_Text));
                this.reading.push(parseTag(jsonData.data[0].R_Section2_Text));
                this.reading.push(parseTag(jsonData.data[0].R_Section3_Text));
                let localAnswer = JSON.parse(localStorage.getItem('IELTSReadingAnswer' + global.config.examID));
                let tmp = [];
                for (let i = 0; i < localAnswer.length; i++) {
                    if (localAnswer[i] === '') {
                        tmp[i] = false;
                    } else {
                        tmp[i] = true;
                    }
                }

                this.setState({
                    loading: false,
                    tick: tmp
                }, () => {
                    // let self = this;
                    //
                    // //手动设置输入检测,阅读固定40题
                    // for(let i=1;i<41;i++){
                    //     let answer = document.getElementById('answer'+i);
                    //     if(answer!==null){
                    //         console.log('adding'+i);
                    //         document.getElementById('answer'+i).addEventListener('input', function (e) {
                    //             self.onInput(i,e.target.value);
                    //         });
                    //     }else{
                    //         break;
                    //     }
                    // }

                    //[Question]是雅思阅读独有的Tag，用string.split('[Question]')[0]来得到文章，[1]来得到题目
                    document.getElementById('article1').innerHTML = this.reading[0].split('[Question]')[0];
                    document.getElementById('article2').innerHTML = this.reading[1].split('[Question]')[0];
                    document.getElementById('article3').innerHTML = this.reading[2].split('[Question]')[0];
                    document.getElementById('question1').innerHTML = this.reading[0].split('[Question]')[1];
                    document.getElementById('question2').innerHTML = this.reading[1].split('[Question]')[1];
                    document.getElementById('question3').innerHTML = this.reading[2].split('[Question]')[1];

                    document.getElementById('article1').addEventListener('click',this.onWordSelect);
                    document.getElementById('article2').addEventListener('click',this.onWordSelect);
                    document.getElementById('article3').addEventListener('click',this.onWordSelect);
                    document.getElementById('question1').addEventListener('click',this.onWordSelect);
                    document.getElementById('question2').addEventListener('click',this.onWordSelect);
                    document.getElementById('question3').addEventListener('click',this.onWordSelect);

                    document.addEventListener("input", this.onInput);
                    this.setInput();

                    //document.getElementById('WA1').value = JSON.parse(localStorage.getItem('IELTSWritingAnswer'+global.config.examID)).WA1;
                    //document.getElementById('WA2').value = JSON.parse(localStorage.getItem('IELTSWritingAnswer'+global.config.examID)).WA2;


                    setTimeout(() => {

                        this.playCounter((global.config.IELTSReadingTime * 1000 - this.curr) / 1000);

                    }, 1000);
                });

            } else {
                console.log('Fail to get reading data');
            }
        });
    }

    componentDidMount() {
        const addWord = JSON.parse(localStorage.getItem('addWord'));
        if(addWord!==null){
            this.setState({addWord:addWord});
        }

        const local = JSON.parse(localStorage.getItem('IELTSProgress' + global.config.examID));

        if (local === null) {
            console.log('local null');
            //测试用
            localStorage.setItem('IELTSProgress' + global.config.examID, JSON.stringify({
                'examID': global.config.examID,
                'Section': 'Reading',
                'curr': JSON.stringify(Date.now())
            }));
            let answer = [];
            for (let i = 0; i < 40; i++) {
                answer[i] = '';
            }
            localStorage.setItem('IELTSReadingAnswer' + global.config.examID, JSON.stringify(answer));
        } else if (local.examID === global.config.examID && local.Section === 'Listening') {
            console.log('正常从听力跳转至本页');
            localStorage.setItem('IELTSProgress' + global.config.examID, JSON.stringify({
                'examID': global.config.examID,
                'Section': 'Reading',
                'curr': JSON.stringify(Date.now())
            }));
            let answer = [];
            for (let i = 0; i < 40; i++) {
                answer[i] = '';
            }
            localStorage.setItem('IELTSReadingAnswer' + global.config.examID, JSON.stringify(answer));
        } else if (local.examID === global.config.examID && local.Section === 'Reading') {
            console.log('阅读意外退出重新加载');
            this.exit = true;

            this.curr = Date.now() - parseInt(JSON.parse(localStorage.getItem('IELTSProgress' + global.config.examID)).curr);
            //console.log('from last time access '+curr);

            if (this.curr > global.config.IELTSReadingTime * 1000) {
                this.upload();
                return;
            }

        } else if (local.examID !== global.config.examID) {
            console.log('有其他考试未完成就来到这个考试' + local.examID + ' ' + global.config.examID);
        }

        this.getReading();
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
        if (i !== 0) {
            console.log('Time\'s up');
            this.upload();
        }
    }

    upload = () => {
        let formData = new FormData();
        let answer = JSON.parse(localStorage.getItem('IELTSReadingAnswer' + global.config.examID));

        formData.append('examID', global.config.examID);
        for (let i = 0; i < answer.length; i++) {
            if (answer[i] === '') {
                formData.append('RA' + (i + 1), '');
            } else {
                formData.append('RA' + (i + 1), escapeHTML(answer[i]));
            }
        }


        // for (let pair of formData.entries()) {
        //     console.log(pair[0]+ ', ' + pair[1]);
        // }

        console.log('uploading');
        this.setState({loading: true, uploading: true});

        // fetch(global.config.url + 'Ielts/ReadingSubmit', {
        //     method: 'post',
        //     body: formData
        //     //body: this.state.formData,
        // })

        axios({
            method: 'post',
            url: global.config.url + `Ielts/ReadingSubmit`,
            data: formData
        }).then(res => {
            console.log(res);
            if (res.data.msg === 'succeed') {
                localStorage.removeItem('IELTSReadingAnswer' + global.config.examID);
                //window.location.href = '/IELTSWriting';
                this.props.nextSection();
            } else {
                console.log('submit fail');
                submitError('答案提交失败');
            }
        }).catch(err => {
            console.log(err);
            console.log('submit fail');
            submitError('答案提交失败');
        })
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

    componentWillUnmount() {
        let idArr = ['article1','article2','article3','question1','question2','question3'];
        for(let i=0;i<idArr.length;i++){
            let section = document.getElementById(idArr[i]);
            if(section!==null){
                section.removeEventListener('click',this.onWordSelect);
            }
        }
        // document.getElementById('article1').removeEventListener('click',this.onWordSelect);
        // document.getElementById('article2').removeEventListener('click',this.onWordSelect);
        // document.getElementById('article3').removeEventListener('click',this.onWordSelect);
        // document.getElementById('question1').removeEventListener('click',this.onWordSelect);
        // document.getElementById('question2').removeEventListener('click',this.onWordSelect);
        // document.getElementById('question3').removeEventListener('click',this.onWordSelect);

        document.removeEventListener("input", this.onInput);
    }

    playCounter = (answerTime) => {
        setTimeout(() => {
            this.setState({key: this.state.key + 1, duration: answerTime});
        }, 1000);
    }

    setInput = () => {
        for (let i = 0; i < 40; i++) {
            let value = JSON.parse(localStorage.getItem('IELTSReadingAnswer' + global.config.examID))[i];
            if (value !== null) {
                let input = document.getElementById('answer' + (i + 1));
                if (input !== null) {
                    input.value = value;
                }
            }
        }
    }

    onInput = (e) => {
        let prefix = e.target.id.substring(0, 6);
        if (prefix === 'answer') {
            let inputID = e.target.id.substring(6);
            //console.log('onInput' + inputID+' '+e.target.value);

            let answer = JSON.parse(localStorage.getItem('IELTSReadingAnswer' + global.config.examID));
            answer[inputID - 1] = e.target.value;
            localStorage.setItem('IELTSReadingAnswer' + global.config.examID, JSON.stringify(answer));

            let tmp = this.state.tick;
            if (e.target.value !== '') {
                tmp[inputID - 1] = true;
            } else {
                tmp[inputID - 1] = false;
            }
            this.setState({
                tick: tmp
            })
        }
    }

    showSection = (sec) => {
        if(!this.state.loading) {
            for (let i = 1; i < 4; i++) {
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

    //点击侧边栏小题框，跳转去对应输入框
    goQuestion=(id)=>{
        let realID = parseInt(id.substring(6,8));
        if(realID<14){
            this.showSection(1);
        }else if(realID>13&&realID<27){
            this.showSection(2);
        }else if(realID>26){
            this.showSection(3);
        }
        if(document.getElementById(id)!==null){
            document.getElementById(id).focus();
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
                    <Col id='sidebar' flex='190px' style={{marginRight: '30px'}}>
                        <MDBCard style={{height: '85vh',borderRadius: '20px'}}>
                            <MDBCardHeader style={cardHeader}>
                                考试进度
                            </MDBCardHeader>
                            <MDBCardBody style={{fontSize: '14pt', fontWeight: 'bold',overflowY: 'auto'}}>
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
                                <div style={{color: 'green', fontSize: '20pt'}}><MDBIcon far icon="caret-square-right"
                                                                                         className="mr-3"/>阅读
                                </div>
                                <div>
                                    {
                                        this.state.tick.map((bool, i) => {
                                            if (bool) {
                                                return (
                                                    <div key={i} style={{color: 'green', display: 'inline'}}><MDBIcon
                                                        far
                                                        icon="check-square"
                                                        title={i+1}
                                                        className="mr-1 ml-1" style={{cursor:'pointer'}} onClick={()=>this.goQuestion('answer'+(i+1))}/>
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div key={i} style={{display: 'inline'}}><MDBIcon far icon="square"
                                                                                                      title={i+1}
                                                                                                      className="mr-1 ml-1" style={{cursor:'pointer'}} onClick={()=>this.goQuestion('answer'+(i+1))}/>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                                <hr/>
                                <div><MDBIcon far icon="square" className="mr-3"/>写作
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
                                阅读文章
                                <Button onClick={this.props.highlight} className='ml-3 mr-3'>高亮</Button>
                                <Button onClick={this.props.nextSection}>下一部分（测试用）</Button>
                                <div style={{float: 'right'}}>
                                    <Button style={{backgroundColor:global.config.grey}} id={'btn1'} onClick={() => this.showSection(1)}>Section 1</Button>
                                    <Button id={'btn2'} onClick={() => this.showSection(2)}>Section 2</Button>
                                    <Button id={'btn3'} onClick={() => this.showSection(3)}>Section 3</Button>
                                </div>
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
                                                    '阅读时间已用完，正在提交答案，下一部分是写作，请做好准备！'
                                                    : ''
                                            }
                                        </center>
                                        :
                                        <div>
                                            <div className='section1' style={{cursor:'pointer'}}>
                                                <div style={{fontWeight: 'bold'}}>Section 1 Article</div>
                                                <br/>
                                                <div id='article1'/>
                                                <br/>
                                            </div>
                                            <div className='section2' style={{display:'none',cursor:'pointer'}}>
                                                <div style={{fontWeight: 'bold'}}>Section 2 Article</div>
                                                <br/>
                                                <div id='article2'/>
                                                <br/>
                                            </div>
                                            <div className='section3' style={{display:'none',cursor:'pointer'}}>
                                                <div style={{fontWeight: 'bold'}}>Section 3 Article</div>
                                                <br/>
                                                <div id='article3'/>
                                            </div>
                                        </div>
                                }
                            </div>
                        </MDBCard>
                    </Col>
                    <Col flex='1 1 200px'>
                        <MDBCard style={{height: '85vh',borderRadius: '20px'}}>
                            <MDBCardHeader style={cardHeader}>
                                阅读题目
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
                                                    '阅读时间已用完，正在提交答案，下一部分是写作，请做好准备！'
                                                    : ''
                                            }
                                        </center>
                                        :
                                        <div>
                                            <div className='section1' style={{cursor:'pointer'}}>
                                                <div style={{fontWeight: 'bold'}}>Section 1 Question</div>
                                                <br/>
                                                <div id='question1'/>
                                                <br/></div>
                                            <div className='section2' style={{display:'none',cursor:'pointer'}}>
                                                <div style={{fontWeight: 'bold'}}>Section 2 Question</div>
                                                <br/>
                                                <div id='question2'/>
                                                <br/></div>
                                            <div className='section3'style={{display:'none',cursor:'pointer'}}>
                                                <div style={{fontWeight: 'bold'}}>Section 3 Question</div>
                                                <br/>
                                                <div id='question3'/>
                                            </div>
                                        </div>
                                }
                            </div>
                        </MDBCard>
                    </Col>
                </Row>
                <center><div style={{backgroundColor:'white',padding:'10px',width:'350px',position:'absolute',fontSize:'14pt',top:'15px',left:'50%',right:'50%',marginLeft:'-175px'}} >
                    阅读剩余作答时间：<div id='remain' style={{display:'inline'}}/>
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

export default IELTSReading;