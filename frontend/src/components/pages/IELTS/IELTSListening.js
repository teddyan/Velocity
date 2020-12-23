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
import beep from '../../../sound/beep.mp3';
import {ReactMic} from 'react-mic';
import axios from 'axios';
import {Modal, Input, Table, Select, Col, Row} from 'antd';
import {NavLink, Link, Redirect} from "react-router-dom";
import reactStringReplace from "react-string-replace";
import JsxParser from 'react-jsx-parser';
import {parseTag, submitError, escapeHTML, renderTime, logout, askAddWord} from "../../Utility";
import {Button, Layout, Card, Switch} from "antd";


class IELTSListening extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,  //是否正在加载题目
            key: 0, //计时环用的key
            duration: 0,    //计时环剩余时间
            formData: new FormData(),
            tick: [],   //小题打钩，true打钩，false不打
            uploading: false,   //是否正在上传答案
            isCollapsed: false,  //侧边栏是否收缩
            addWord: false
        }
        this.listening = [];    //听力题目
        this.curr = 0;  //听Section进度
        this.exit = false;
        this.audio = [];    //听力题目音频
        this.beep = new Audio(beep);    //“哔”声
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

    //获取听力题目
    getListening = () => {
        //let jsonData = {"msg":"succeed","data":{"Paper_ID":1,"Section_1_AudioArray":["https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav"],"Section_2_Question":"\u6211\u662f\u56fd\u670d\u7b2c\u4e00\u674e\u767d\uff0c\u4e0d\u5bb9\u53cd\u9a73","Section_2_Image":"","Section_3_AudioArray":["https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav"]}};
        let jsonData = {
            // "msg": "succeed",
            // "data": [{
            //     "Paper_ID": 1,
            //     "R_Section1_Text": "[PART]first table\\n<table><tbody><tr><td>[TABLE-1]<\/td><td>some table texts<\/td><\/tr><tr><td>[IMG]https:\/\/velocityenglish.com.au\/newpro\/img\/banner-top666.jpg[IMG]<\/td><td>[TABLE-2]<\/td><\/tr><\/tbody><\/table>\\nMultiple choice single choice question:[MCSC-3]\\nA. xxx\\nB. xxx\\nC. xxx\\n\\nMultiple choice multiple choices question:[MCMC-4]\\nA. xxx\\nB. xxx\\nC. xxx\\n\\nFill the blank question: some text before [FTB-5] some texts after.\\n\\nsecond table\\n<table><tbody><tr><td>some table texts<\/td><td>[TABLE-6]<\/td><\/tr><tr><td>some texts before [TABLE-7] some texts after<\/td><td>some other table texts<\/td><\/tr><\/tbody><\/table>\\nFill the blank question: some text before [FTB-8] some texts after.\\n\\nMultiple choice multiple choices question:[MCMC-9]\\nA. xxx\\nB.xxx\\nC.xxx\\n\\nTFN: [TFN-10][PART]",
            //     "R_Section1_ImageSrc": "https:\/\/velocityenglish.com.au\/newpro\/img\/banner-top666.jpg",
            //     "R_Section2_Text": "[PART]Section 2 Content[PART]",
            //     "R_Section2_ImageSrc": "https:\/\/velocityenglish.com.au\/newpro\/img\/banner-top666.jpg",
            //     "R_Section3_Text": "[PART]Section 3 Content[PART]",
            //     "R_Section3_ImageSrc": "https:\/\/velocityenglish.com.au\/newpro\/img\/banner-top666.jpg"
            // }]
        }
        console.log('Getting listening data');
// global.config.url
        axios.get(global.config.url + `Ielts/ListenQuestion?ExamID=` + global.config.examID).then(res => {
            console.log(res.data);
            jsonData = res.data;

            if (jsonData.msg === 'succeed') {
                console.log('original ' + jsonData);

                this.listening = [];
                this.audio = [];
                //获取听力题目和音频
                this.listening.push(parseTag(jsonData.data[0].L_Section1_Text));
                this.listening.push(parseTag(jsonData.data[0].L_Section2_Text));
                this.listening.push(parseTag(jsonData.data[0].L_Section3_Text));
                this.listening.push(parseTag(jsonData.data[0].L_Section4_Text));
                this.audio.push(new Audio(global.config.url+jsonData.data[0].L_Section1_AudioSrc.slice(1)));
                this.audio.push(new Audio(global.config.url+jsonData.data[0].L_Section2_AudioSrc.slice(1)));
                this.audio.push(new Audio(global.config.url+jsonData.data[0].L_Section3_AudioSrc.slice(1)));
                this.audio.push(new Audio(global.config.url+jsonData.data[0].L_Section4_AudioSrc.slice(1)));

                //设置打钩
                let localAnswer = JSON.parse(localStorage.getItem('IELTSListeningAnswer' + global.config.examID));
                let tmp = [];
                for (let i = 0; i < localAnswer.length; i++) {
                    if (localAnswer[i] === '') {
                        tmp[i] = false;
                    } else {
                        tmp[i] = true;
                    }
                }
                this.curr = parseInt(JSON.parse(localStorage.getItem('IELTSProgress' + global.config.examID)).curr);

                this.setState({
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


                    if (this.curr === 4) {
                        this.upload();
                        return;
                    }
                    setTimeout(() => {
                        //获取到的音频可能会获取不到时长，所以一定要每个音频都能获取到时长再开始播放，不然就重新请求
                        let start = true;
                        for (let i = 0; i < this.audio.length; i++) {
                            if (isNaN(this.audio[i].duration)) {
                                console.log(this.audio[i].duration);
                                console.log(typeof (this.audio[i].duration));
                                start = false;
                            }
                        }
                        if (start) {

                            this.setState({loading: false}, () => {
                                document.getElementById('section1').innerHTML = this.listening[0];
                                document.getElementById('section2').innerHTML = this.listening[1];
                                document.getElementById('section3').innerHTML = this.listening[2];
                                document.getElementById('section4').innerHTML = this.listening[3];

                                document.getElementById('section1').addEventListener('click', this.onWordSelect);
                                document.getElementById('section2').addEventListener('click', this.onWordSelect);
                                document.getElementById('section3').addEventListener('click', this.onWordSelect);
                                document.getElementById('section4').addEventListener('click', this.onWordSelect);

                                document.addEventListener("input", this.onInput);
                                this.setInput();

                                this.doSection(this.curr);
                            })
                        } else {
                            this.getListening();
                        }
                        //this.playCounter((global.config.IELTSListeningTime * 1000 - this.curr) / 1000);
                    }, 2000);
                });

            } else {
                console.log('Fail to get listening data');
            }
        });
    }

    doSection = (i) => {
        //播放音频
        this.audio[i].play();
        console.log(this.audio[i].duration);
        // if((this.audio[i].duration.isNaN)){
        //     console.log('not a number');
        // }
        setTimeout(() => {
            //过了当前Section音频时长的时间后，播放下一Section或者开始计时答题
            if (i === 3) {
                this.playCounter(global.config.IELTSListeningTime);
            } else {
                this.curr++;
                localStorage.setItem('IELTSProgress' + global.config.examID, JSON.stringify({
                    'examID': global.config.examID,
                    'Section': 'Listening',
                    'curr': JSON.stringify(this.curr)
                }));
                this.doSection(i + 1);
            }
        }, ((this.audio[i].duration * 1000) + 500));
        // this.audio[i].duration * 1000) + 500
    }

    //销毁前移除input监测，停止音频播放
    componentWillUnmount() {
        let idArr = ['section1', 'section2', 'section3', 'section4'];
        for (let i = 0; i < idArr.length; i++) {
            let section = document.getElementById(idArr[i]);
            if (section !== null) {
                section.removeEventListener('click', this.onWordSelect);
            }
        }
        // document.getElementById('section1').removeEventListener('click',this.onWordSelect);
        // document.getElementById('section2').removeEventListener('click',this.onWordSelect);
        // document.getElementById('section3').removeEventListener('click',this.onWordSelect);
        // document.getElementById('section4').removeEventListener('click',this.onWordSelect);

        document.removeEventListener("input", this.onInput);
        for (let i = 0; i < this.audio.length; i++) {
            this.audio[i].pause();
        }
        this.beep.pause();
    }

    componentDidMount() {

        //const highlighter = new Highlighter();
        // highlighter.on('selection:hover', ({id}) => {
        //     // display different bg color when hover
        //     highlighter.addClass('highlight-wrap-hover', id);
        // }).on('selection:hover-out', ({id}) => {
        //     // remove the hover effect when leaving
        //     highlighter.removeClass('highlight-wrap-hover', id);
        // }).on('selection:create', ({sources}) => {
        //     sources = sources.map(hs => ({hs}));
        // }).on('selection:click', ({id}) => {
        //     // remove the hover effect when leaving
        //     highlighter.remove(id);
        // }).on(Highlighter.event.CREATE, (e) => {
        //     console.log('creating');
        // })
        //highlighter.run();

        const addWord = JSON.parse(localStorage.getItem('addWord'));
        if (addWord !== null) {
            this.setState({addWord: addWord});
        }

        const local = JSON.parse(localStorage.getItem('IELTSProgress' + global.config.examID));

        if (local !== null && local.examID === global.config.examID && local.Section === 'Listening') {
            console.log('听力意外退出重新加载');
            this.exit = true;

            //this.curr = Date.now() - parseInt(JSON.parse(localStorage.getItem('IELTSProgress' + global.config.examID)).curr);
            //console.log('from last time access '+curr);

            // if (this.curr > global.config.IELTSListeningTime * 1000) {
            //     this.upload();
            //     return;
            // }

            let {confirm} = Modal;
            return (
                confirm({
                    title: '检测到您之前意外退出，考试将从上次的进度开始。开始考试之前请检查语音输入输出设备以确保它们运作正常。',
                    content: '请在“哔”声后开始答题',
                    cancelButtonProps: {style: {display: 'none'}},
                    okText: '开始考试',
                    centered: true,
                    onOk: () => {
                        this.getListening();
                    }
                })
            )

            return;
        }

        let {confirm} = Modal;
        return (
            confirm({
                title: '开始考试之前请检查语音输入输出设备以确保它们运作正常',
                content: '请在“哔”声后开始答题',
                cancelButtonProps: {style: {display: 'none'}},
                okText: '开始考试',
                centered: true,
                onOk: () => {

                    if (local === null) {
                        console.log('local null and enter');
                        //测试用
                        localStorage.setItem('IELTSProgress' + global.config.examID, JSON.stringify({
                            'examID': global.config.examID,
                            'Section': 'Listening',
                            //'curr': JSON.stringify(Date.now())
                            'curr': '0'
                        }));
                        let answer = [];
                        for (let i = 0; i < 40; i++) {
                            answer[i] = '';
                        }
                        localStorage.setItem('IELTSListeningAnswer' + global.config.examID, JSON.stringify(answer));
                    }
                        // else if (local.examID === global.config.examID && local.Section === 'Listening') {
                        //     console.log('正常从列表跳转至本页');
                        //     localStorage.setItem('IELTSProgress' + global.config.examID, JSON.stringify({
                        //         'examID': global.config.examID,
                        //         'Section': 'Listening',
                        //         'curr': JSON.stringify(Date.now())
                        //     }));
                        //     let answer = [];
                        //     for (let i = 0; i < 40; i++) {
                        //         answer[i] = '';
                        //     }
                        //     localStorage.setItem('IELTSListeningAnswer' + global.config.examID, JSON.stringify(answer));
                    // }
                    else if (local.examID !== global.config.examID) {
                        console.log('有其他考试未完成就来到这个考试' + local.examID + ' ' + global.config.examID);
                    }

                    this.getListening();
                }
            })
        )
    }

    onWordSelect = () => {
        // let s = window.getSelection();
        // let range = s.getRangeAt(0);
        // let node = s.anchorNode;
        // while(range.toString().indexOf(' ') !== 0) {
        //     console.log(range.toString());
        //     range.setStart(node,(range.startOffset -1));
        // }
        // range.setStart(node, range.startOffset +1);
        // do{
        //     console.log(range.toString());
        //     range.setEnd(node,range.endOffset + 1);
        //
        // }while(range.toString().indexOf(' ') === -1 && range.toString().trim() !== '');
        // let str = range.toString().trim();
        // alert(str);

        let range = window.getSelection() || document.getSelection() || document.selection.createRange();
        let word = $.trim(range.toString());
        word = word.split(' ');
        if (word.length === 1) {
            word = word[0];
            if (word !== '' && /^[\w-]+$/.test(word) && this.state.addWord) {
                askAddWord(word);
            }
        }
    }

    //计时完成后，上传答案
    completeCounter = (i) => {
        // if(this.curr<3&&i!==0){
        //     this.curr++;
        //     localStorage.setItem('IELTSProgress'+global.config.examID,JSON.stringify({'examID':global.config.examID,'Section':'Listening','curr':JSON.stringify(this.curr)}));
        //     this.doSection(this.curr);
        // }else if(this.curr===3){
        if (i !== 0) {
            console.log('Time\'s up');

            this.upload();
        }
        // }
    }

    //上传答案
    upload = () => {
        let formData = new FormData();
        let answer = JSON.parse(localStorage.getItem('IELTSListeningAnswer' + global.config.examID));

        formData.append('examID', global.config.examID);
        for (let i = 0; i < answer.length; i++) {
            if (answer[i] === '') {
                formData.append('LA' + (i + 1), '');
            } else {
                formData.append('LA' + (i + 1), escapeHTML(answer[i]));
            }
        }

        // for (let pair of formData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        console.log('uploading');
        this.setState({loading: true, uploading: true});

        axios({
            method: 'post',
            url: global.config.url + `Ielts/ListeningSubmit`,
            data: formData
        }).then(res => {
            console.log(res);
            if (res.data.msg === 'succeed') {
                console.log('提交成功');
                localStorage.removeItem('IELTSListeningAnswer' + global.config.examID);
                // window.location.href = '/IELTSReading';
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

    //开始计时
    playCounter = (answerTime) => {
        this.beep.play();
        setTimeout(() => {
            this.setState({key: this.state.key + 1, duration: answerTime});
        }, 1000);
    }

    //意外退出后，从localstorage读取历史input
    setInput = () => {
        for (let i = 0; i < 40; i++) {
            let value = JSON.parse(localStorage.getItem('IELTSListeningAnswer' + global.config.examID))[i];
            if (value !== null) {
                let input = document.getElementById('answer' + (i + 1));
                if (input !== null) {
                    input.value = value;
                }
            }
        }
    }

    //将最新的input存入localstorage
    onInput = (e) => {
        let prefix = e.target.id.substring(0, 6);
        if (prefix === 'answer') {
            let inputID = e.target.id.substring(6);
            //console.log('onInput' + inputID+' '+e.target.value);

            let answer = JSON.parse(localStorage.getItem('IELTSListeningAnswer' + global.config.examID));
            answer[inputID - 1] = e.target.value;
            localStorage.setItem('IELTSListeningAnswer' + global.config.examID, JSON.stringify(answer));

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

    //点击小题框跳转对应答题框
    goQuestion = (id) => {
        if(document.getElementById(id)!==null){
            document.getElementById(id).focus();
        }
    }

    //侧边栏收缩
    toggleSidebar = () => {
        if (this.state.isCollapsed) {
            document.getElementById('sidebar').classList.remove('sidebarCollapse');
            document.getElementById('sidebar').classList.add('sidebarShow');
            this.setState({
                isCollapsed: false
            });
        } else {
            document.getElementById('sidebar').classList.remove('sidebarShow');
            document.getElementById('sidebar').classList.add('sidebarCollapse');
            this.setState({
                isCollapsed: true
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
                                <div style={{color: 'green', fontSize: '20pt'}}><MDBIcon far icon="caret-square-right"
                                                                                         className="mr-3"/>听力
                                </div>
                                <div>
                                    {
                                        this.state.tick.map((bool, i) => {
                                            if (bool) {
                                                return (
                                                    <div key={i} style={{color: 'green', display: 'inline'}}><MDBIcon
                                                        far icon="check-square" className="mr-1 ml-1"
                                                        style={{cursor: 'pointer'}}
                                                        title={i+1}
                                                        onClick={() => this.goQuestion('answer' + (i + 1))}/>
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div key={i} style={{display: 'inline'}}><MDBIcon far icon="square"
                                                                                                      className="mr-1 ml-1"
                                                                                                      title={i+1}
                                                                                                      style={{cursor: 'pointer'}}
                                                                                                      onClick={() => this.goQuestion('answer' + (i + 1))}/>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                                <hr/>
                                <div><MDBIcon far icon="square" className="mr-3"/>阅读
                                </div>

                                <hr/>
                                <div><MDBIcon far icon="square" className="mr-3"/>写作
                                </div>
                                <hr/>
                                <div><MDBIcon far icon="square" className="mr-3"/>口语</div>
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
                    <Col flex='1 1 200px'>
                        <MDBCard style={{height: '85vh',borderRadius:'20px'}}>
                            <MDBCardHeader style={cardHeader}>
                                {
                                    this.state.isCollapsed
                                        ?
                                        <MDBIcon icon="angle-double-right" onClick={this.toggleSidebar} className="mr-3"
                                                 style={{cursor: 'pointer'}}/>
                                        :
                                        <MDBIcon icon="angle-double-left" onClick={this.toggleSidebar} className="mr-3"
                                                 style={{cursor: 'pointer'}}/>
                                }
                                听力题目
                                <Button onClick={this.props.highlight} className='ml-3 mr-3'>高亮</Button>
                                <Button onClick={this.props.nextSection}>下一部分（测试用）</Button>
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
                                                    '听力时间已用完，正在提交答案，下一部分是阅读，请做好准备！'
                                                    : ''
                                            }
                                        </center>
                                        :
                                        <div>
                                            <div style={{fontWeight: 'bold'}}>Section 1 Question</div>
                                            <br/>
                                            {/*<JsxParser*/}
                                            {/*    components={{MDBBtn, Select}}*/}
                                            {/*    jsx={this.reading[0]}*/}
                                            {/*/>*/}
                                            <div id='section1' className='word_split' style={{cursor: 'pointer'}}/>
                                            <br/>
                                            <div style={{fontWeight: 'bold'}}>Section 2 Question</div>
                                            <br/>
                                            <div id='section2' className='word_split' style={{cursor: 'pointer'}}/>
                                            <br/>
                                            <div style={{fontWeight: 'bold'}}>Section 3 Question</div>
                                            <br/>
                                            <div id='section3' className='word_split' style={{cursor: 'pointer'}}/>
                                            <br/>
                                            <div style={{fontWeight: 'bold'}}>Section 4 Question</div>
                                            <br/>
                                            <div id='section4' className='word_split' style={{cursor: 'pointer'}}/>
                                        </div>
                                }
                            </div>
                        </MDBCard>
                    </Col>
                </Row>
                <center>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '10px',
                        width: '350px',
                        position: 'absolute',
                        fontSize: '14pt',
                        top: '15px',
                        left: '50%',
                        right: '50%',
                        marginLeft: '-175px'
                    }}>
                        听力剩余作答时间：
                        <div id='remain' style={{display: 'inline'}}/>
                    </div>
                </center>
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

export default IELTSListening;