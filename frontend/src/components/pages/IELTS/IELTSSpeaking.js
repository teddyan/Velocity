import React, { Component } from 'react';
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
    MDBNotification, MDBTable, MDBTableBody
} from "mdbreact";
import TopNavigation from "../../topNavigation";
import Axios from "axios";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import $ from 'jquery';
import '../../Global';
import beep from '../../../sound/beep.mp3';
import { ReactMic } from 'react-mic';
import axios from 'axios';
import { Col, Modal, Row } from 'antd';
import examiner from '../../../img/examiner.jpg';
import { NavLink, Link } from "react-router-dom";
import { escapeHTML, logout, parseTag, removeLocalIELTSExam, submitError, checkExpert } from "../../Utility";
import Sample from "../../../img/Sample.png";
import { configConsumerProps } from 'antd/lib/config-provider';

const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
        return <div className="timer" style={{ fontSize: '20pt', color: 'orange' }}>
            <center>等待读题</center>
        </div>;
    }

    return (
        <div className="timer">
            <div className="text">还剩</div>
            <div className="value" style={{ fontSize: '25pt' }}>{remainingTime}秒</div>
        </div>
    );
};

class IELTSSpeaking extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            key: 0,
            duration: 0,
            record: false,
            formData: new FormData(),
            tick: [],   //口语的tick不再按照小题，而是Section
            asking: false,
            uploading: false,
            isCollapsed: false
        }
        this.speaking = []; //this.speaking是二维数组，每一个元素都是一个array，[<题目（音频，文字，图片）>，<type（‘audio’,'text','img'）>，<该小题答题时间（秒）>，<上传时的field name>]
        this.beep = new Audio(beep);
        this.curr = 0;
        this.exit = false;
        this.speaker = require('../../../img/speaking1.gif');
    }

    //获取口语题目
    getSpeaking = () => {
        //let jsonData = {"msg":"succeed","data":{"Paper_ID":1,"Section_1_AudioArray":["https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav"],"Section_2_Question":"\u6211\u662f\u56fd\u670d\u7b2c\u4e00\u674e\u767d\uff0c\u4e0d\u5bb9\u53cd\u9a73","Section_2_Image":"","Section_3_AudioArray":["https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav","https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav"]}};
        let jsonData = {};
        //     "msg": "succeed", "data": {
        //         "Paper_ID": 1,
        //         "Section_1_AudioArray": ["https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav", "https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav", "https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav", "https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav"],
        //         "Section_1_TextArray": "\u6211\u662f\u56fd\u670d\u7b2c\u4e00\u674e\u767d\uff0c\u4e0d\u5bb9\u53cd\u9a73;\u6211\u662f\u56fd\u670d\u7b2c\u4e00\u674e\u767d\uff0c\u4e0d\u5bb9\u53cd\u9a73;\u6211\u662f\u56fd\u670d\u7b2c\u4e00\u674e\u767d;\u6211\u662f\u56fd\u670d\u7b2c\u4e00\u674e\u767d\u9a73",
        //         "Section_2_Question": "\u6211\u662f\u56fd\u670d\u7b2c\u4e00\u674e\u767d\uff0c\u4e0d\u5bb9\u53cd\u9a73",
        //         "Section_2_Image": "https:\/\/velocityenglish.com.au\/newpro\/img\/banner-top666.jpg",
        //         "Section_3_AudioArray": ["https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav", "https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav", "https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav", "https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav", "https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav", "https:\/\/velocityenglish.com.au\/storage\/question_audio\/rs\/rs_2_2019-02-12-05-12-00_83103864CB-F689-FF2A.wav"],
        //         "Section_3_TextArray": "\u6211\u662f\u56fd\u670d\u7b2c\u4e00\u674e\u767d\uff0c\u4e0d\u5bb9;\u6211\u662f\u56fd\u670d\u7b2c\u4e00\u674e\u767d\uff0c\u4e0d\u5bb9\u53cd;\u6211\u662f\u56fd\u670d\u7b2c\u4e00\u674e\u767d\uff0c\u4e0d\u5bb9\u53cd\u9a73;\u6211\u662f\u56fd\u670d\u7b2c\u4e00\u674e\u767d\uff0c\u4e0d\u5bb9\u53cd\u9a73"
        //     }
        // };
        console.log('Getting speaking data');

        axios.get(global.config.url + `Ielts/SpeakQuestion?ExamID=` + global.config.examID).then(res => {
            console.log(res.data);
            jsonData = res.data;

            if (jsonData.msg === 'succeed') {
                console.log(jsonData);
                let tmp = this.state.formData;

                tmp.append('examID', global.config.examID);
                tmp = [false, false, false];
                this.speaking = [];
                jsonData.data.Section_1_AudioArray.map((audio, i) => {
                    //this.speaking1.push(new Audio(audio));
                    // tmp.push(false);
                    this.speaking.push([new Audio(global.config.url + audio.slice(1)), 'audio', global.config.speaking1Time, 'Section1_' + (i + 1)]);
                });
                this.speaking.push([jsonData.data.Section_2_Question, 'text', global.config.speaking2AnswerTime, 'Section2_1']);
                // tmp.push(false);
                if (jsonData.data.Section_2_Image !== '') {
                    this.speaking.push([jsonData.data.Section_2_Image, 'img', global.config.speaking2AnswerTime, 'Section2_2']);
                    // tmp.push(false);
                }
                jsonData.data.Section_3_AudioArray.map((audio, i) => {
                    // tmp.push(false);
                    this.speaking.push([new Audio(global.config.url + audio.slice(1)), 'audio', global.config.speaking3Time, 'Section3_' + (i + 1)]);
                });
                console.log(this.speaking);

                // for (let i = 0; i < this.curr; i++) {
                //     tmp[i] = true;
                // }
                let currSection = this.speaking[this.curr][3].split('_')[0];
                if (currSection === 'Section2') {
                    tmp[0] = true;
                } else if (currSection === 'Section3') {
                    tmp[0] = true;
                    tmp[1] = true;
                }


                this.setState({
                    tick: tmp
                }, () => {
                    let { confirm } = Modal;
                    return (
                        confirm({
                            title: (this.exit ? '检测到您之前意外退出，考试将从上次的进度开始。' : '') + '开始口语考试之前请检查语音输入输出设备以确保它们运作正常',
                            content: '请在“哔”声后开始答题',
                            cancelButtonProps: { style: { display: 'none' } },
                            okText: '开始口语考试',
                            centered: true,
                            onOk: () => {
                                setTimeout(() => {

                                    // let out = false;
                                    // while(!out){
                                    //     out = true;
                                    //     for(let i=0;i<this.speaking.length;i++){
                                    //         if(this.speaking[i][1]==='audio'&&isNaN(this.speaking[i][0].duration)){
                                    //             console.log('detect isNaN');
                                    //             out = false;
                                    //         }
                                    //     }
                                    // }

                                    let start = true;
                                    for (let i = 0; i < this.speaking.length; i++) {
                                        if (this.speaking[i][1] === 'audio' && isNaN(this.speaking[i][0].duration)) {
                                            console.log('detect isNaN');
                                            start = false;
                                        }
                                    }
                                    if (start) {
                                        this.setState({ loading: false }, () => {
                                            this.doQuestion(this.curr);
                                        })
                                    } else {
                                        this.getSpeaking();
                                    }


                                }, 2000);
                            }
                        })
                    )
                });


            } else {
                console.log('Fail to get speaking data');
            }
        });

    }

    startTest = () => {
        this.doQuestion(0);
    }

    doQuestion = (i) => {
        if (i >= this.speaking.length) {
            console.log('speaking done');
            return;
        }
        let question = this.speaking[i];
        console.log('doing q' + i + ' start from 0');
        if (question[1] === 'audio') {
            //音频题目
            this.setState({ asking: true });
            this.speaker = require('../../../img/speaking1.gif');
            question[0].play();
            setTimeout(() => {
                //this.speaking[i][3]=true;
                this.setState({ asking: false });
                this.playCounter(question[2], i + 1);
            }, ((question[0].duration * 1000) + 500));
        } else if (question[1] === 'text') {
            console.log(question[0] + ' txt');
            //文字题目
            this.setState({ asking: true });
            setTimeout(() => {
                //this.speaking[i][3]=true;
                this.setState({ asking: false });
                this.playCounter(question[2], i + 1);
            }, global.config.speaking2ReadTime * 1000);
        } else if (question[1] === 'img') {
            console.log(question[0] + ' img');
            //图片题目
            this.setState({ asking: true });
            setTimeout(() => {
                //this.speaking[i][3]=true;
                this.setState({ asking: false });
                this.playCounter(question[2], i + 1);
            }, global.config.speaking2ReadTime * 1000);
        }
    }

    componentDidMount() {

        const local = JSON.parse(localStorage.getItem('IELTSProgress' + global.config.examID));

        if (local === null) {
            console.log('local null');
            //测试用
            localStorage.setItem('IELTSProgress' + global.config.examID, JSON.stringify({
                'examID': global.config.examID,
                'Section': 'Speaking',
                'curr': '0'
            }));
            localStorage.setItem('IELTSSpeakingAnswer1' + global.config.examID, JSON.stringify({}));
            localStorage.setItem('IELTSSpeakingAnswer2' + global.config.examID, JSON.stringify({}));
            localStorage.setItem('IELTSSpeakingAnswer3' + global.config.examID, JSON.stringify({}));
        } else if (local.examID === global.config.examID && local.Section === 'Writing') {
            console.log('正常从写作跳转至本页');
            localStorage.setItem('IELTSProgress' + global.config.examID, JSON.stringify({
                'examID': global.config.examID,
                'Section': 'Speaking',
                'curr': '0'
            }));
            localStorage.setItem('IELTSSpeakingAnswer1' + global.config.examID, JSON.stringify({}));
            localStorage.setItem('IELTSSpeakingAnswer2' + global.config.examID, JSON.stringify({}));
            localStorage.setItem('IELTSSpeakingAnswer3' + global.config.examID, JSON.stringify({}));
        } else if (local.examID === global.config.examID && local.Section === 'Speaking') {
            console.log('意外退出重新加载');
            this.exit = true;
        } else if (local.examID !== global.config.examID) {
            console.log('有其他考试未完成就来到这个考试' + local.examID + ' ' + global.config.examID);
        }
        this.curr = parseInt(JSON.parse(localStorage.getItem('IELTSProgress' + global.config.examID)).curr);

        // /*上傳Writing*/
        // let formData = new FormData();
        // let answer = JSON.parse(localStorage.getItem('IELTSWritingAnswer' + global.config.examID));

        // for (let key in answer) {
        //     formData.append(key, escapeHTML(answer[key]));
        // }

        // formData.append('examID', global.config.examID);
        // console.log('formData ' + formData);

        // console.log('uploading writing');
        // this.setState({ loading: true, uploading: true });

        // axios({
        //     method: 'post',
        //     url: global.config.url + `Ielts/WritingSubmit`,
        //     data: formData
        // }).then(res => {
        //     if (res.data.msg === 'succeed') {
        //         localStorage.removeItem('IELTSWritingAnswer' + global.config.examID);
        //     }
        //     console.log(res);
        // }).catch(err => {
        //     console.log(err);
        //     console.log('submit fail');
        //     submitError('答案提交失败');
        // })
        // /*上傳writing*/


        this.getSpeaking();
    }

    componentWillUnmount() {
        for (let i = 0; i < this.speaking.length; i++) {
            this.speaking[i].pause();
        }
        this.beep.pause();
    }

    // completeCounter = (i) => {
    //     console.log('complete' + i);
    // }

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

    //录音转换base64为blob
    b64toBlob = (dataURI) => {

        let byteString = atob(dataURI.split(',')[1]);
        console.log('dataURI是'+dataURI);
        console.log('bytestring是'+byteString);
        let ab = new ArrayBuffer(byteString.length);

        let ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'audio/mpeg' });
    }

    //每当录音停止时
    onStop(recordedBlob) {

        let reader = new FileReader();
        reader.addEventListener('loadend', function (e) {
            //将录音数据以base64的格式存到localstorage
            let base = e.target.result;

            var str = this.speaking[this.curr][3];

            if (str.substring(0, 8) == "Section1") {
                let answer = JSON.parse(localStorage.getItem('IELTSSpeakingAnswer1' + global.config.examID));
                answer[this.speaking[this.curr][3]] = base;
                localStorage.setItem('IELTSSpeakingAnswer1' + global.config.examID, JSON.stringify(answer))
            }

            else if (str.substring(0, 8) == "Section2") {
                if (str == "Section2_1") {
                    let formData = new FormData();
                    let answer = JSON.parse(localStorage.getItem('IELTSSpeakingAnswer1' + global.config.examID));

                    for (let key in answer) {
                        formData.append(key, this.b64toBlob(answer[key]));
                    }
                    formData.append('examID', global.config.examID);

                    axios({
                        method: 'post',
                        url: global.config.url + `Ielts/SpeakingSubmit`,
                        // url: 'http://localhost:8000/Ielts/SpeakingSubmit',
                        data: formData
                    }).then(res => {
                        console.log(res);
                    }).catch(err => {
                        console.log(err);
                        console.log('submit fail');
                        submitError('答案提交失败');
                    })
                    localStorage.removeItem('IELTSSpeakingAnswer1' + global.config.examID, JSON.stringify({}));
                    console.log("delete1");
                }
                let answer = JSON.parse(localStorage.getItem('IELTSSpeakingAnswer2' + global.config.examID));
                answer[this.speaking[this.curr][3]] = base;
                localStorage.setItem('IELTSSpeakingAnswer2' + global.config.examID, JSON.stringify(answer))
            }
            else if (str.substring(0, 8) == "Section3") {
                if (str == "Section3_1") {
                    let formData = new FormData();
                    let answer = JSON.parse(localStorage.getItem('IELTSSpeakingAnswer2' + global.config.examID));
                    for (let key in answer) {
                        formData.append(key, this.b64toBlob(answer[key]));
                    }
                    formData.append('examID', global.config.examID);
                    console.log('--------------------')
                    console.log(...formData)
                    console.log('haha');
                    console.log('--------------------')
                    axios({
                        method: 'post',
                        url: global.config.url + `Ielts/SpeakingSubmit`,
                        // url: `http://localhost:8000/Ielts/SpeakingSubmit`,
                        data: formData
                    }).then(res => {
                        console.log(res);
                    }).catch(err => {
                        console.log(err);
                        console.log('submit fail');
                        submitError('答案提交失败');
                    })
                    localStorage.removeItem('IELTSSpeakingAnswer2' + global.config.examID, JSON.stringify({}));
                    console.log("delete2");
                }
                let answer = JSON.parse(localStorage.getItem('IELTSSpeakingAnswer3' + global.config.examID));
                answer[this.speaking[this.curr][3]] = base;
                localStorage.setItem('IELTSSpeakingAnswer3' + global.config.examID, JSON.stringify(answer))
            }
            /* Speaking分段上傳 #Endregion*/
            //若已完成全部题目，则提交答案。写作和口语答案是在这里一起提交的。
            if (this.curr + 1 >= this.speaking.length) {
                this.setState({ loading: true, uploading: true });
                let formData = new FormData();
                let answer = JSON.parse(localStorage.getItem('IELTSSpeakingAnswer3' + global.config.examID));
                for (let key in answer) {
                    formData.append(key, this.b64toBlob(answer[key]));
                }
                formData.append('examID', global.config.examID);
                axios({
                    method: 'post',
                    url: global.config.url + `Ielts/SpeakingSubmit`,
                    // url: `http://localhost:8000/Ielts/SpeakingSubmit`,
                    data: formData
                }).then(res => {
                    if (res.data.msg === 'succeed') {
                        console.log(res);
                        localStorage.removeItem('IELTSSpeakingAnswer3' + global.config.examID);

                        /*上傳Writing*/
                        let formData = new FormData();
                        let answer = JSON.parse(localStorage.getItem('IELTSWritingAnswer' + global.config.examID));

                        for (let key in answer) {
                            formData.append(key, escapeHTML(answer[key]));
                        }

                        formData.append('examID', global.config.examID);
                        console.log('formData ' + formData);

                        console.log('uploading writing');
                        this.setState({ loading: true, uploading: true });

                        axios({
                            method: 'post',
                            url: global.config.url + `Ielts/WritingSubmit`,
                            data: formData
                        }).then(res => {
                            if (res.data.msg === 'succeed') {
                                this.setState({ loading: true, uploading: true });
                                /*清除資料及下一步 */
                                localStorage.removeItem('addWord');
                                localStorage.removeItem('IELTSProgress' + global.config.examID);
                                localStorage.removeItem('IELTSWritingAnswer' + global.config.examID);
                                // localStorage.removeItem('IELTSSpeakingAnswer' + global.config.examID);
                                let tmp = this.checkTick();

                                this.setState({
                                    tick: tmp
                                });

                                let { confirm } = Modal;
                                return (
                                    confirm({
                                        title: '所有答案已上传完成，老师正在奋力改分。是否使用点评券？',
                                        content:
                                            <React.Fragment>

                                                <MDBTable hover bordered style={{
                                                    marginBottom: '0px',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                                                }}>
                                                    <MDBTableBody>
                                                        <tr>
                                                            <td style={cardTitle}>雅思点评券<br />功能介绍</td>
                                                            <td>
                                                                写作&口语：<br />1. 分别给出整体点评 <br />2. 指出语法逻辑错误 <br />3. 指点可提升的地方
                                                                            </td>
                                                        </tr>
                                                    </MDBTableBody>
                                                </MDBTable>
                                                <div style={{ color: '#DC3545' }}>不使用则只有听说读写分数。</div>
                                                <hr />
                                                <div>雅思写作点评样例(部分)：</div>
                                                <img src={Sample} style={{
                                                    width: '500px',
                                                    height: 'auto',
                                                    border: 'solid 1px grey'
                                                }} /></React.Fragment>
                                        ,
                                        cancelText: '放弃',
                                        okText: '使用点评券',
                                        centered: true,
                                        onCancel: () => {
                                            removeLocalIELTSExam();
                                            window.location.href = '/HistoryPage';
                                        },
                                        onOk: () => {
                                            checkExpert(global.config.examID);
                                        },
                                        width: 600
                                    })
                                )
                            }
                            console.log(res);
                        }).catch(err => {
                            console.log(err);
                            console.log('submit fail');
                            submitError('答案提交失败');
                        })
                        /*上傳writing*/
                        console.log('uploading speaking and writing');
                    }
                    }
                    )
            }
            let tmp = this.checkTick();

            this.setState({
                tick: tmp
            }, () => {
                this.curr++;
                localStorage.setItem('IELTSProgress' + global.config.examID, JSON.stringify({
                    'examID': global.config.examID,
                    'Section': 'Speaking',
                    'curr': JSON.stringify(this.curr)
                }));
                this.doQuestion(this.curr);
            });
        }.bind(this));
        reader.readAsDataURL(recordedBlob.blob);
    }

    // //检查点评券
    // checkExpert = () => {
    //     let {confirm} = Modal;
    //     return (
    //         confirm({
    //             title: '本次点评将消耗1张雅思点评券，确定使用吗？',
    //             cancelText: '取消',
    //             okText: '确定',
    //             centered: true,
    //             onCancel: () => {
    //                 removeLocalIELTSExam();
    //                 window.location.href = '/HistoryPage';
    //             },
    //             onOk: () => {
    //                 this.useExpert();
    //             }
    //         })
    //     )
    // }
    //
    // useExpert = () => {
    //     let token = localStorage.getItem('access_token');
    //     let userID = localStorage.getItem('userID');
    //     let examID = JSON.parse(localStorage.getItem('examID'));
    //
    //     if (token === null || userID === null || examID === null) {
    //         logout();
    //         return;
    //     }
    //
    //     let formData = new FormData();
    //     formData.append('userID', userID);
    //     formData.append('examID', examID);
    //
    //     axios({
    //         method: 'post',
    //         url: global.config.url + `User/UseExpertIeltsTicket`,
    //         data: formData,
    //         headers: {Authorization: `Bearer ${token}`}
    //     }).then(res => {
    //         console.log(res);
    //         if (typeof res.headers.authorization !== 'undefined') {
    //             console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
    //             localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
    //         }
    //         if (res.data.msg === 'succeed') {
    //             console.log('成功');
    //             let {confirm} = Modal;
    //             return (
    //                 confirm({
    //                     title: '点评券使用成功，老师正在奋力分析。请在模考记录查看进度。',
    //                     okText: '确定',
    //                     centered: true,
    //                     cancelButtonProps: {style: {display: 'none'}},
    //                     onOk: () => {
    //                         removeLocalIELTSExam();
    //                         window.location.href = '/HistoryPage';
    //                     }
    //                 })
    //             )
    //         } else {
    //             submitError('点评券使用失败');
    //         }
    //     }).catch(err => {
    //         console.log(err);
    //         console.log(err.response);
    //         //Token过期
    //         if (typeof err.response !== 'undefined' && err.response.status === 401) {
    //             logout();
    //         } else if (err.response.status === 400 && err.response.data.msg === 'lack of voucher') {
    //             let {confirm} = Modal;
    //             return (
    //                 confirm({
    //                     title: '您的雅思点评券不足',
    //                     content: '购买后请在模考记录使用',
    //                     cancelText: '取消',
    //                     okText: '前往购买',
    //                     centered: true,
    //                     onCancel: () => {
    //                         window.location.href = '/HistoryPage';
    //                     },
    //                     onOk: () => {
    //                         window.location.href = '/VIP';
    //                     }
    //                 })
    //             )
    //         }
    //     });
    //     localStorage.removeItem('examID');
    // }

    //侧边栏按Section完成度打钩
    checkTick = () => {
        let tmp = this.state.tick;

        if (this.curr + 1 < this.speaking.length) {
            let currSection = this.speaking[this.curr + 1][3].split('_')[0];
            if (currSection === 'Section2') {
                tmp[0] = true;
            } else if (currSection === 'Section3') {
                tmp[1] = true;
            }
        } else {
            tmp = [true, true, true];
        }

        return tmp;
    }

    playCounter = (answerTime, i) => {
        this.beep.play();
        setTimeout(() => {
            this.setState({ record: true });
            this.speaker = require('../../../img/speaking2.gif');
            this.setState({ key: this.state.key + 1, duration: answerTime });
            setTimeout(() => {
                this.setState({ record: false });

            }, answerTime * 1000);
        }, 1000);

    }

    // audioEnded=(i)=>{
    //     //console.log('audio'+i+'end');
    // }
    //
    // playAudio = (i) =>{
    //     // let tmp = this.state.isPlaying;
    //     // tmp[i] = true;
    //     // this.setState({isPlaying:tmp});
    //     // console.log(this.audioList[i].duration);
    //     // this.audioList[i].play();
    //     let audio = document.getElementById("audio"+i);
    //     console.log(audio.duration);
    //     audio.play();
    //     //$("#audio"+i).play();
    // }

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
        let sectionText = '';
        if (!this.state.loading) {
            const section = this.speaking[this.curr][3].split('_');
            sectionText = section[0] + ' Question ' + section[1];
        }
        return (
            <React.Fragment>
                {/*<TopNavigation/>*/}
                <Row style={{ margin: '30px', height: '85vh' }}>
                    <Col id='sidebar' flex="190px" style={{ marginRight: '30px' }}>
                        <MDBCard style={{ height: '85vh', borderRadius: '20px' }}>
                            <MDBCardHeader style={cardHeader}>
                                考试进度
                            </MDBCardHeader>
                            <MDBCardBody style={{ fontSize: '14pt', fontWeight: 'bold' }}>
                                <div>
                                    <center><CountdownCircleTimer
                                        key={this.state.key}
                                        size={150}
                                        strokeWidth={15}
                                        // isPlaying={this.state.isPlaying[1]}
                                        isPlaying
                                        duration={this.state.duration}
                                        colors={[["#4caf50", 0.75], ["#ff9800", 0.85], ["#f44336"]]}
                                    //onComplete={() => this.completeCounter(1)}
                                    >
                                        {/*{({ remainingTime }) => remainingTime}*/}
                                        {renderTime}
                                    </CountdownCircleTimer></center>
                                    {/*<button onClick={() => this.playCounter(3)}>play</button>*/}
                                </div>
                                <hr />
                                <div style={{ color: 'green' }}><MDBIcon far icon="check-square" className="mr-3" />听力
                                </div>
                                <hr />
                                <div style={{ color: 'green' }}><MDBIcon far icon="check-square" className="mr-3" />阅读
                                </div>
                                <hr />
                                <div style={{ color: 'green' }}><MDBIcon far icon="check-square" className="mr-3" />写作
                                </div>
                                <hr />
                                <div style={{ color: 'green', fontSize: '20pt' }}><MDBIcon far icon="caret-square-right"
                                    className="mr-3" />口语
                                </div>
                                <div>
                                    {
                                        this.state.tick.map((bool, i) => {
                                            if (bool) {
                                                return (
                                                    <div key={i} style={{ color: 'green' }}><MDBIcon far
                                                        icon="check-square"
                                                        className="mr-1 ml-1" />Section {i + 1}
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div key={i}><MDBIcon far icon="square"
                                                        className="mr-1 ml-1" />Section {i + 1}
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                                {/*<button onClick={this.startTest}>Start Exam</button>*/}
                            </MDBCardBody>
                        </MDBCard>
                    </Col>
                    <Col flex='1 1 200px'>
                        <MDBCard style={{ height: '85vh', borderRadius: '20px' }}>
                            <MDBCardHeader style={cardHeader}>
                                {
                                    this.state.isCollapsed
                                        ?
                                        <MDBIcon icon="angle-double-right" onClick={this.toggleSidebar} className="mr-3"
                                            style={{ cursor: 'pointer' }} />
                                        :
                                        <MDBIcon icon="angle-double-left" onClick={this.toggleSidebar} className="mr-3"
                                            style={{ cursor: 'pointer' }} />
                                }
                                口语题目
                            </MDBCardHeader>
                            <div className="card-body d-flex justify-content-center" style={{ overflowY: 'auto' }}>
                                {
                                    this.state.loading ?
                                        <center>
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            <br />
                                            {
                                                this.state.uploading ?
                                                    <div style={{ fontSize: '14pt' }}>本次考试已完成，正在提交答案！请勿刷新！</div>
                                                    : ''
                                            }
                                        </center>
                                        :
                                        <div>
                                            <div className="d-flex justify-content-center" style={{ marginTop: '30px' }}>
                                                <img src={this.speaker} style={{
                                                    //borderRadius: '150px',
                                                    width: 'auto',
                                                    height: '300px',
                                                    border: '2px solid',
                                                    boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16)'
                                                }} />
                                            </div>
                                            <div className="d-flex justify-content-center"
                                                style={{ marginTop: '18px', fontSize: '25pt' }}>
                                                {
                                                    sectionText
                                                }
                                            </div>
                                            {
                                                this.speaking[this.curr][1] === 'text' ?
                                                    <div className="d-flex justify-content-center"
                                                        style={{ marginTop: '18px', fontSize: '15pt' }}
                                                        dangerouslySetInnerHTML={{ __html: parseTag(this.speaking[this.curr][0]) }} /> :
                                                    ''
                                            }
                                            {
                                                this.speaking[this.curr][1] === 'img' ?
                                                    <div className="d-flex justify-content-center"
                                                        style={{ marginTop: '18px', fontSize: '15pt' }}>
                                                        <img src={this.speaking[this.curr][0]} style={{
                                                            width: '550px',
                                                            height: 'auto',
                                                            border: '2px solid',
                                                            boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16)'
                                                        }} />
                                                    </div> :
                                                    ''
                                            }
                                            {
                                                this.state.asking ?
                                                    <div className="d-flex justify-content-center"
                                                        style={{ marginTop: '18px', fontSize: '25pt' }}>考官正在提问</div>
                                                    :
                                                    <div className="d-flex justify-content-center"
                                                        style={{ marginTop: '18px', fontSize: '25pt' }}>请在“哔”声后答题</div>
                                            }
                                            <div className="d-flex justify-content-center"
                                                style={{ marginTop: '20px' }}>考生声波图
                                            </div>
                                            <div style={{ marginTop: '10px', marginBottom: '30px' }}>
                                                <ReactMic
                                                    record={this.state.record}
                                                    className="sound-wave"
                                                    onStop={this.onStop.bind(this)}
                                                    // onData={this.onData}
                                                    strokeColor="black"
                                                    backgroundColor='#EEEEEE'
                                                />

                                                {/*<button onClick={this.startRecording} type="button">Start</button>*/}
                                                {/*<button onClick={this.stopRecording} type="button">Stop</button>*/}
                                            </div>
                                        </div>

                                }
                            </div>
                        </MDBCard>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

const cardHeader = {
    backgroundColor: global.config.brown,
    color: 'white',
    fontSize: '16pt',
    borderRadius: '20px 20px 0 0'
    // fontWeight: 'bold'
}

const cardTitle = {
    verticalAlign: 'middle',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    width: '120px'
}

export default IELTSSpeaking;