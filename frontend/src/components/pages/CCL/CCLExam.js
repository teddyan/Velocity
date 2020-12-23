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
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import $ from 'jquery';
import '../../Global';
import beep from '../../../sound/beep.mp3';
import { ReactMic } from 'react-mic';
import axios from 'axios';
import { Col, Modal, Row, Button } from 'antd';
import speaker1 from '../../../img/speaking1.gif';
import speaker2 from '../../../img/speaking2.gif';
import Sample from "../../../img/Sample.png";
import { NavLink, Link } from "react-router-dom";
import TopNavigation from "../../topNavigation";
import { escapeHTML, logout, parseTag, removeLocalCCLExam, checkCCLExpert, submitError, renderTime } from "../../Utility";

class CCLExam extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            key: 0,
            duration: 0,
            record: false,
            _checkPardon: false,
            formData: new FormData(),
            tick: [],   //口语的tick不再按照小题，而是Section
            asking: false,
            uploading: false,
            isCollapsed: false,
            toggle: true,
            userStartRecording: false,
            pardonTime: 0
            // section2_Counter: 0
        }
        this.speaking = []; //this.speaking是二维数组，每一个元素都是一个array，[<Audio>，<上传时的field name>]
        this.dialog = [];
        this.split = 0;     //第一篇和第二篇的分割点（第二篇第一个audio的index）
        this.beep = new Audio(beep);
        this.curr = 0;
        this.exit = false;
        this.genderArr = [];
        //this.speaker1 = '';
        //this.speaker2 = '';
        //this.speaker = require('../../../img/speaking1.gif');
    }

    //获取CCL题目
    getSpeaking = () => {
        let jsonData={};
        // let jsonData = {
        //     "msg": "succeed",
        //     "data": {
        //         "Paper_ID": 1,
        //         "Gender_Array": [1, 0, 0, 1],
        //         "CCL_AudioArray": [
        //             "/AUDIO/PAPER1/Speaking/Section1/question1.mp3",
        //             "/AUDIO/PAPER1/Speaking/Section1/question1.mp3",
        //             "/AUDIO/PAPER1/Speaking/Section1/question1.mp3",
        //             "/AUDIO/PAPER1/Speaking/Section1/question1.mp3"
        //         ],
        //         "Section_1_AudioArray": [
        //             "/AUDIO/PAPER1/Speaking/Section1/question1.mp3",
        //             "/AUDIO/PAPER1/Speaking/Section1/question2.mp3",
        //             "/AUDIO/PAPER1/Speaking/Section1/question3.mp3",
        //             "/AUDIO/PAPER1/Speaking/Section1/question4.mp3",
        //             "/AUDIO/PAPER1/Speaking/Section1/question5.mp3"
        //         ],
        //         "Section_2_AudioArray": [
        //             "/AUDIO/PAPER1/Speaking/Section3/question1.mp3",
        //             "/AUDIO/PAPER1/Speaking/Section3/question2.mp3",
        //             "/AUDIO/PAPER1/Speaking/Section3/question3.mp3"
        //         ]
        //     }
        // };
        console.log('Getting data');

        //api先用假的，之后有了再换掉
        // axios.get(`https://jsonplaceholder.typicode.com/todos/1`).then(res => {
            axios.get(global.config.url + `CCL/SpeakQuestion?ExamID=` + global.config.examID).then(res => {
            console.log(res.data);
            jsonData = res.data;

            if (jsonData.msg === 'succeed') {
                console.log(jsonData);

                this.speaking = [];
                this.dialog = [];
                //Section1题目
                jsonData.data.Section_1_AudioArray.map((audio, i) => {
                    this.speaking.push([new Audio(global.config.url + audio.slice(1)), 'Section1_' + (i + 1)]);
                });

                //第一篇和第二篇的分割点（第二篇第一个audio的index）
                this.split = this.speaking.length;

                //Section2题目
                jsonData.data.Section_2_AudioArray.map((audio, i) => {
                    this.speaking.push([new Audio(global.config.url + audio.slice(1)), 'Section2_' + (i + 1)]);
                });
                console.log(this.speaking);

                jsonData.data.CCL_AudioArray.map((audio, i) => {
                    this.dialog.push(new Audio(global.config.url + audio.slice(1)));
                });

                //初始化头像图片性别
                // this.genderArr = jsonData.data.Gender_Array;
                //let i = 0;
                if (this.curr >= this.split) {
                    //i = 2;
                    if ((this.curr - this.split) % 2 === 1) {
                        this.setState({ toggle: false });
                    }
                } else {
                    if (this.curr % 2 === 1) {
                        this.setState({ toggle: false });
                    }
                }
                // if(this.genderArr[i]===1){
                //     this.speaker1 = require('../../../img/speaker1m.jpg');
                // }else{
                //     this.speaker1 = require('../../../img/speaker1f.jpg');
                // }
                // if(this.genderArr[i+1]===1){
                //     this.speaker2 = require('../../../img/speaker2m.jpg');
                // }else{
                //     this.speaker2 = require('../../../img/speaker2f.jpg');
                // }

                console.log(this.dialog);

                //针对意外退出，设置打钩
                let tmpTick = [false, false];
                let currSection = this.speaking[this.curr][1].split('_')[0];
                if (currSection === 'Section2') {
                    tmpTick[0] = true;
                }

                this.setState({
                    tick: tmpTick
                }, () => {
                    let { confirm } = Modal;
                    return (
                        confirm({
                            title: (this.exit ? '检测到您之前意外退出，考试将从上次的进度开始。' : '') + '开始考试之前请检查语音输入输出设备以确保它们运作正常',
                            content: '请在“哔”声后开始答题',
                            cancelButtonProps: { style: { display: 'none' } },
                            okText: '开始考试',
                            centered: true,
                            onOk: () => {
                                setTimeout(() => {

                                    let start = true;

                                    //检查考试录音是否加载成功
                                    for (let i = 0; i < this.speaking.length; i++) {
                                        if (isNaN(this.speaking[i][0].duration)) {
                                            console.log('detect isNaN');
                                            start = false;
                                        }
                                    }

                                    for (let i = 0; i < this.dialog.length; i++) {
                                        if (isNaN(this.dialog[i].duration)) {
                                            console.log('detect isNaN');
                                            start = false;
                                        }
                                    }

                                    if (start) {
                                        let duration = (global.config.CCLTime * 1000 - (Date.now() - parseInt(JSON.parse(localStorage.getItem('CCLProgress' + global.config.examID)).startTime))) / 1000;
                                        this.setState({ loading: false, key: this.state.key + 1, duration: duration }, () => {

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
                console.log('Fail to get data');
            }
        });

    }


    doQuestion = (i) => {
        if (i >= this.speaking.length) {
            console.log('speaking done');
            return;
        }

        //播放前言和结束言
        if (i === 0) {
            //第一篇前言
            this.setState({ asking: true });
            this.dialog[0].play();
            setTimeout(() => {
                this.playQuestion(i);
            }, ((this.dialog[0].duration * 1000) + 500));
        } else if (i === this.split) {
            //第一篇结束语和第二篇前言
            this.setState({ asking: true, toggle: true });
            this.dialog[1].play();
            setTimeout(() => {
                //初始化第二段对话的头像性别
                //this.speaker = require('../../../img/speaking1.gif');
                // if(this.genderArr[2]===1){
                //     this.speaker1 = require('../../../img/speaker1m.jpg');
                // }else{
                //     this.speaker1 = require('../../../img/speaker1f.jpg');
                // }
                // if(this.genderArr[3]===1){
                //     this.speaker2 = require('../../../img/speaker2m.jpg');
                // }else{
                //     this.speaker2 = require('../../../img/speaker2f.jpg');
                // }

                this.forceUpdate();

                //开始第二段对话
                this.dialog[2].play();
                setTimeout(() => {
                    this.playQuestion(i);
                }, ((this.dialog[2].duration * 1000) + 500));

            }, ((this.dialog[1].duration * 1000) + 500));
        } else {
            this.playQuestion(i);
        }

    }

    playQuestion = (i) => {
        this.setState({ userStartRecording: false });
        let question = this.speaking[i];
        console.log('doing q' + (i + 1));
        //音频题目
        this.setState({ asking: true });
        question[0].play();
        setTimeout(() => {
            this.setState({ asking: false, _checkPardon: true });
            setTimeout(() => {
                this.setState({ _checkPardon: false, userStartRecording: true })
            }, 3000);
            if (this._checkPardon == false) {
                // setTimeout(() => {

                //     this.beep.play();
                //     this.setState({
                //         _checkPardon: false,
                //         record: true,
                //     });

                //     //this.setState({key: this.state.key + 1, duration: answerTime});
                //     // setTimeout(() => {
                //     //     this.setState({record: false});
                //     // }, answerTime * 1000);
                // }, 1000);
            } else {
                // return this._checkPardon == true;
                return;
            }
            //this.playCounter(question[2], i + 1);
        }, ((question[0].duration * 1000) + 500));
    }

    // playQuestion = (i) => {
    //     let question = this.speaking[i];
    //     console.log('doing q' + (i + 1));
    //     //音频题目
    //     this.setState({ asking: true });
    //     question[0].play();
    //     setTimeout(() => {
    //         this.setState({ asking: false , _checkPardon:true});
    //         // this.pardonChange();

    //         //this.playCounter(question[2], i + 1);
    //     }, 100000);
    //     // }, ((question[0].duration * 1000) + 500));
    //     setTimeout(() => {
    //         this.beep.play();
    //         this.setState({ 
    //             record: true,
    //            });

    //         //this.setState({key: this.state.key + 1, duration: answerTime});
    //         // setTimeout(() => {
    //         //     this.setState({record: false});
    //         // }, answerTime * 1000);
    //     }, 1000);
    // }



    componentDidMount() {
        let examIDCCL = JSON.parse(localStorage.getItem('examIDCCL'));
        if (examIDCCL === null) {
            //若没有正在进行的考试，说明用户是手动来到这个页面的，直接返回主页
            window.location.href = '/CCL';
        } else {
            global.config.examID = examIDCCL;
        }

        const local = JSON.parse(localStorage.getItem('CCLProgress' + global.config.examID));

        if (local === null) {
            console.log('正常从考卷列表进入');
            //初始化本地进度和答案
            localStorage.setItem('CCLProgress' + global.config.examID, JSON.stringify({ 'examID': global.config.examID, 'startTime': JSON.stringify(Date.now()), 'curr': '0' }));
            localStorage.setItem('CCLAnswer_1' + global.config.examID, JSON.stringify({}));
            localStorage.setItem('CCLAnswer_2' + global.config.examID, JSON.stringify({}));
            localStorage.setItem("Pardontime", "");
            // localStorage.setItem('CCLPardon' + global.config.examID.JSON.stringify({}));

        } else if (local.examID === global.config.examID) {
            console.log('意外退出重新加载');
            //检查如果已经超时，则直接上传答案
            let remainTime = Date.now() - parseInt(JSON.parse(localStorage.getItem('CCLProgress' + global.config.examID)).startTime);
            if (remainTime > global.config.CCLTime * 1000) {
                this.upload();
                return;
            }
            this.exit = true;
        }
        this.curr = parseInt(JSON.parse(localStorage.getItem('CCLProgress' + global.config.examID)).curr);

        this.getSpeaking();
    }

    componentWillUnmount() {
        for (let i = 0; i < this.speaking.length; i++) {
            this.speaking[i].pause();
        }
        // this.checkPardon();
        this.beep.pause();
    }

    completeCounter = (i) => {
        if (i !== 0) {
            console.log('Time\'s up');
            this.upload();
        }
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

    //录音转换base64为blob
    b64toBlob = (dataURI) => {
        console.log('DataURI是' + dataURI)
        let byteString = atob(dataURI.split(',')[1]);

        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'audio/mpeg' });
    }

    //上传答案，两种途径触发，时间结束或考生已完成最后一题
    upload = () => {
        if (this.state.uploading) {
            return;
        }
        this.setState({
            record: false
        });

        localStorage.removeItem('CCLProgress' + global.config.examID);
        localStorage.removeItem('CCLAnswer_1' + global.config.examID);
        localStorage.removeItem('CCLAnswer_2' + global.config.examID);
        let { confirm } = Modal;
        return (
            confirm({
                title: '所有答案已上传完成，老师正在奋力改分。是否使用点评券？',
                content: '使用点评券可获得考试点评分析，不使用则只有分数。',
                cancelText: '放弃',
                okText: '使用点评券',
                centered: true,
                onCancel: () => {
                    removeLocalCCLExam();
                    window.location.href = '/CCLHistoryPage';
                },
                onOk: () => {
                    checkCCLExpert((global.config.examID));
                }
            })
        )
    }
    // let formData1 = new FormData();
    // let formData2 = new FormData();
    // let answer1 = JSON.parse(localStorage.getItem('CCLAnswer_1' + global.config.examID));
    // let answer2 = JSON.parse(localStorage.getItem('CCLAnswer_2' + global.config.examID));

    // for (let key in answer1) {
    //     formData1.append(key, this.b64toBlob(answer1[key]));
    // }
    // for (let key in answer2) {
    //     formData2.append(key, this.b64toBlob(answer2[key]));
    // }
    // formData1.append('examID', global.config.examID);
    // formData2.append('examID', global.config.examID);
    // console.log('uploading');
    // this.setState({ loading: true, uploading: true });

    // //等待CCL提交API
    // axios({
    //     method: 'post',
    //     // url: global.config.url + `CCL/SpeakingSubmit`,
    //     url: `http://localhost:8000/CCL/SpeakingSubmit`,
    //     data: formData1
    // }).then(res => {
    //     console.log(res);
    //     if (res.data.msg === 'succeed') {
    //         localStorage.removeItem('CCLProgress' + global.config.examID);
    //         localStorage.removeItem('CCLAnswer_1' + global.config.examID);
    //         localStorage.removeItem('CCLAnswer_2' + global.config.examID);
    //         let { confirm } = Modal;
    //         return (
    //             confirm({
    //                 title: '所有答案已上传完成，老师正在奋力改分。是否使用点评券？',
    //                 content: '使用点评券可获得考试点评分析，不使用则只有分数。',
    //                 cancelText: '放弃',
    //                 okText: '使用点评券',
    //                 centered: true,
    //                 onCancel: () => {
    //                     removeLocalCCLExam();
    //                     window.location.href = '/CCLHistoryPage';
    //                 },
    //                 onOk: () => {
    //                     checkCCLExpert((global.config.examID));
    //                 }
    //             })
    //         )

    //     } else {
    //         submitError('答案提交失败');
    //     }
    // }).catch(err => {
    //     console.log(err);
    //     submitError('答案提交失败');
    // })

    // let tmp = this.checkTick();

    // this.setState({
    //     tick: tmp
    // });
    // }
    //pardon

    checkPardon = (i) => {
        if (!this.state._checkPardon) {
            this.setState({
                userStartRecording: false,
            });
        } else {

            this.setState({
                _checkPardon: false,
            });

            this.playQuestion(i);
            this.state.pardonTime += 1;
            console.log(this.state.pardonTime);
            // this.setState({
            //     userStartRecording: true
            // });
        }
    }

    //每当录音停止时
    onStop(recordedBlob) {

        //Speaker头像toggle
        let toggle = this.state.toggle;
        if (this.curr + 1 !== this.split && this.curr + 1 !== this.speaking.length) {
            this.setState({ toggle: !toggle });
        }
        //判斷做題前是否超時
        let remainTime = Date.now() - parseInt(JSON.parse(localStorage.getItem('CCLProgress' + global.config.examID)).startTime);
        if (remainTime > global.config.CCLTime * 1000) {
            this.upload();
            return;
        }
        let reader = new FileReader();
        reader.addEventListener('loadend', function (e) {
            //将录音数据以base64的格式存到localstorage
            let base = e.target.result;
            console.log(base);

            var str = this.speaking[this.curr][1];



            console.log('-----' + this.speaking[this.curr][1].length + '---------')
            // localStorage.setItem('CCLAnswer1'+global.config.examID,JSON.stringify(answer));
            console.log('數據' + base);

            console.log("Str是" + str);
            console.log('我是' + this.speaking[this.curr][1]);
            if (str.substring(0, 8) == "Section1") {
                let answer = JSON.parse(localStorage.getItem('CCLAnswer_1' + global.config.examID));
                answer[this.speaking[this.curr][1]] = base;
                console.log('進入section1')
                localStorage.setItem('CCLAnswer_1' + global.config.examID, JSON.stringify(answer))
                localStorage.setItem("Pardontime", str + "_" + "第" + this.state.pardonTime + "次" + "/");
                let formData = new FormData();
                for (let key in answer) {
                    formData.append(key, this.b64toBlob(answer[key]));
                }
                formData.append('examID', global.config.examID);
                formData.append('Pardontime', str + "_" + this.state.pardonTime + "次" + "/");
                axios({
                    method: 'post',
                    url: global.config.url + `CCL/SpeakingSubmit`,
                    // url: `http://localhost:8000/CCL/SpeakingSubmit`,
                    data: formData
                }).then(res => {
                    console.log(res);

                }).catch(err => {
                    console.log(err);
                    console.log('submit fail');
                    submitError('答案提交失败');
                })
                localStorage.removeItem('CCLAnswer_1' + global.config.examID, JSON.stringify({}));
                localStorage.setItem('CCLAnswer_1' + global.config.examID, JSON.stringify({}));
                console.log("delete1");
            }

            if (str.substring(0, 8) == "Section2") {

                localStorage.removeItem('CCLAnswer_1' + global.config.examID, JSON.stringify({}));

                let answer = JSON.parse(localStorage.getItem('CCLAnswer_2' + global.config.examID));
                answer[this.speaking[this.curr][1]] = base;
                localStorage.setItem('CCLAnswer_2' + global.config.examID, JSON.stringify(answer))
                localStorage.setItem("Pardontime", str + "_" + "第" + this.state.pardonTime + "次" + "/");
                let formData = new FormData();
                // let answer = JSON.parse(localStorage.getItem('CCLAnswer1' + global.config.examID));

                for (let key in answer) {
                    formData.append(key, this.b64toBlob(answer[key]));
                }
                formData.append('examID', global.config.examID);
                formData.append('Pardontime', str + "_" + this.state.pardonTime + "次" + "/");
                axios({
                    method: 'post',
                    url: global.config.url + `CCL/SpeakingSubmit`,
                    // url: `http://localhost:8000/CCL/SpeakingSubmit`,
                    data: formData
                }).then(res => {
                    console.log(res);
                    // section2_Counter+=1;
                }).catch(err => {
                    console.log(err);
                    console.log('submit fail');
                    submitError('答案提交失败');
                })
                localStorage.removeItem('CCLAnswer_2' + global.config.examID, JSON.stringify({}));
                console.log("delete1");
                localStorage.setItem('CCLAnswer_2' + global.config.examID, JSON.stringify({}));

            }

            //若已完成全部两篇，播放结束语并提交答案
            if (this.curr + 1 >= this.speaking.length) {
                // localStorage.removeItem('CCLAnswer_2' + global.config.examID, JSON.stringify({}));
                this.dialog[3].play();
                this.upload();
                // return;
                this.setState({ loading: true, uploading: true });
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
                                            <td style={cardTitle}>CCL点评券<br />功能介绍</td>
                                            <td>
                                                口语：<br />1. 分别给出整体点评 <br />2. 指出语法逻辑错误 <br />3. 指点可提升的地方
                                                            </td>
                                        </tr>
                                    </MDBTableBody>
                                </MDBTable>
                                <div style={{ color: '#DC3545' }}>不使用则只無分数。</div>
                                <hr />
                                <div>CCL写作点评样例(部分)：</div>
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
                            removeLocalCCLExam();
                            window.location.href = '/CCLHistoryPage';
                        },
                        onOk: () => {
                            checkCCLExpert(global.config.examID);
                        },
                        width: 600
                    })
                )
            }

            let tmp = this.checkTick();

            this.setState({
                tick: tmp
            }, () => {
                this.curr++;
                let tmp = JSON.parse(localStorage.getItem('CCLProgress' + global.config.examID));
                tmp['curr'] = this.curr;
                localStorage.setItem('CCLProgress' + global.config.examID, JSON.stringify(tmp));
                this.doQuestion(this.curr);
            });
        }.bind(this));
        reader.readAsDataURL(recordedBlob.blob);

    }

    //检查点评券
    // checkExpert = () => {
    //     let { confirm } = Modal;
    //     return (
    //         confirm({
    //             title: '本次点评将消耗1张CCL点评券，确定使用吗？',
    //             cancelText: '取消',
    //             okText: '确定',
    //             centered: true,
    //             onCancel: () => {
    //                 removeLocalCCLExam();
    //                 window.location.href = '/CCLHistoryPage';
    //             },
    //             onOk: () => {
    //                 this.useExpert();
    //             }
    //         })
    //     )
    // }

    // useExpert = () => {
    //     let token = localStorage.getItem('access_token');
    //     let userID = localStorage.getItem('userID');
    //     let examIDCCL = JSON.parse(localStorage.getItem('examIDCCL'));

    //     if (token === null || userID === null || examIDCCL === null) {
    //         logout();
    //         return;
    //     }

    //     let formData = new FormData();
    //     formData.append('userID', userID);
    //     formData.append('examID', examIDCCL);

    //     axios({
    //         method: 'post',
    //         // url: global.config.url + `User/UseExpertIeltsTicket`,
    //         url: `http://localhost:8000/User/UseExpertCCLTicket`,
    //         data: formData,
    //         headers: { Authorization: `Bearer ${token}` }
    //     }).then(res => {
    //         console.log(res);
    //         if (typeof res.headers.authorization !== 'undefined') {
    //             console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
    //             localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
    //         }
    //         if (res.data.msg === 'succeed') {
    //             console.log('成功');
    //             let { confirm } = Modal;
    //             return (
    //                 confirm({
    //                     title: '点评券使用成功，老师正在奋力分析。请在模考记录查看进度。',
    //                     okText: '确定',
    //                     centered: true,
    //                     cancelButtonProps: { style: { display: 'none' } },
    //                     onOk: () => {
    //                         removeLocalCCLExam();
    //                         window.location.href = '/CCLHistoryPage';
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
    //             let { confirm } = Modal;
    //             return (
    //                 confirm({
    //                     title: '您的CCL点评券不足',
    //                     content: '购买后请在模考记录使用',
    //                     cancelText: '取消',
    //                     okText: '前往购买',
    //                     centered: true,
    //                     onCancel: () => {
    //                         window.location.href = '/CCLHistoryPage';
    //                     },
    //                     onOk: () => {
    //                         window.location.href = '/VIP';
    //                     }
    //                 })
    //             )
    //         }
    //     });
    //     localStorage.removeItem('examIDCCL');
    // }

    //侧边栏按Section完成度打钩
    checkTick = () => {
        let tmp = this.state.tick;

        if (this.curr + 1 < this.speaking.length) {
            let currSection = this.speaking[this.curr + 1][1].split('_')[0];
            if (currSection === 'Section2') {
                tmp[0] = true;
            }
        } else {
            tmp = [true, true];
        }

        return tmp;
    }

    playCounter = (answerTime, i) => {

        setTimeout(() => {
            this.setState({ record: true, _checkPardon: true });
            this.setState({ key: this.state.key + 1, duration: answerTime });
            setTimeout(() => {
                this.setState({ record: false, _checkPardon: false });

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
        // let sectionText = '';
        // if(!this.state.loading){
        //     const section = this.speaking[this.curr][3].split('_');
        //     sectionText = section[0] + ' Question ' + section[1];
        // }
        return (
            <React.Fragment>
                <TopNavigation />
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
                                        onComplete={this.completeCounter}
                                    >
                                        {/*{({ remainingTime }) => remainingTime}*/}
                                        {renderTime}
                                    </CountdownCircleTimer></center>
                                    {/*<button onClick={() => this.playCounter(3)}>play</button>*/}
                                </div>
                                <hr />
                                {/*<div style={{color:'green',fontSize:'20pt'}}><MDBIcon far icon="caret-square-right" className="mr-3"/>口语</div>*/}
                                <div>
                                    {
                                        this.state.tick.map((bool, i) => {
                                            if (bool) {
                                                return (
                                                    <div key={i} style={{ color: 'green' }}><MDBIcon far icon="check-square" className="mr-1 ml-1" />Section {i + 1}
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div key={i}><MDBIcon far icon="square" className="mr-1 ml-1" />Section {i + 1}
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
                                        ? <MDBIcon icon="angle-double-right" onClick={this.toggleSidebar} className="mr-3" style={{ cursor: 'pointer' }} />
                                        : <MDBIcon icon="angle-double-left" onClick={this.toggleSidebar} className="mr-3" style={{ cursor: 'pointer' }} />
                                }
                                CCL题目
                            </MDBCardHeader>
                            <div className="card-body d-flex justify-content-center align-items-center" style={{ overflowY: 'auto' }}>
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
                                                {
                                                    this.state.toggle
                                                        ?
                                                        <img src={speaker1} style={{
                                                            // borderRadius: '125px',
                                                            width: 'auto',
                                                            height: '200px',
                                                            border: '2px solid',
                                                            boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16)'
                                                        }} />
                                                        :
                                                        <img src={speaker2} style={{
                                                            // borderRadius: '125px',
                                                            width: 'auto',
                                                            height: '200px',
                                                            border: '2px solid',
                                                            boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16)'
                                                        }} />
                                                }

                                                {/*{*/}
                                                {/*    this.state.toggle*/}
                                                {/*        ?*/}
                                                {/*        <React.Fragment>*/}
                                                {/*            <img src={this.speaker1} style={{*/}
                                                {/*                borderRadius: '125px',*/}
                                                {/*                width: '250px',*/}
                                                {/*                height: '250px',*/}
                                                {/*                border: '2px solid',*/}
                                                {/*                boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16)',*/}
                                                {/*                marginRight:'24px'*/}
                                                {/*            }}/>*/}
                                                {/*            <img src={this.speaker2} style={{*/}
                                                {/*                borderRadius: '125px',*/}
                                                {/*                width: '250px',*/}
                                                {/*                height: '250px',*/}
                                                {/*                border: '2px solid',*/}
                                                {/*                marginLeft:'24px',*/}
                                                {/*                opacity:'0.2',*/}
                                                {/*                boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16)'*/}
                                                {/*            }}/>*/}
                                                {/*        </React.Fragment>*/}
                                                {/*        :*/}
                                                {/*        <React.Fragment>*/}
                                                {/*            <img src={this.speaker1} style={{*/}
                                                {/*                borderRadius: '125px',*/}
                                                {/*                width: '250px',*/}
                                                {/*                height: '250px',*/}
                                                {/*                border: '2px solid',*/}
                                                {/*                boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16)',*/}
                                                {/*                opacity:'0.2',*/}
                                                {/*                marginRight:'24px'*/}
                                                {/*            }}/>*/}
                                                {/*            <img src={this.speaker2} style={{*/}
                                                {/*                borderRadius: '125px',*/}
                                                {/*                width: '250px',*/}
                                                {/*                height: '250px',*/}
                                                {/*                border: '2px solid',*/}
                                                {/*                marginLeft:'24px',*/}
                                                {/*                boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16)'*/}
                                                {/*            }}/>*/}
                                                {/*        </React.Fragment>*/}
                                                {/*}*/}

                                            </div>
                                            {/*<div className="d-flex justify-content-center" style={{marginTop:'18px',fontSize:'25pt'}}>*/}
                                            {/*    {*/}
                                            {/*        sectionText*/}
                                            {/*    }*/}
                                            {/*</div>*/}
                                            {
                                                this.state.asking ?
                                                    <div className="d-flex justify-content-center" style={{ marginTop: '18px', fontSize: '18pt' }}>　正在播放题目<br></br>请點擊錄音后答题</div>
                                                    :
                                                    <div className="d-flex justify-content-center" style={{ marginTop: '18px', fontSize: '18pt' }}>       　　您有三秒的Pardon選擇時間<br></br>點擊录音進行錄音,完成请按“下一小节”</div>
                                            }
                                            <div className="d-flex justify-content-center" style={{ marginTop: '20px' }}>考生声波图</div>
                                            <div style={{ marginTop: '10px', marginBottom: '30px' }}>
                                                <ReactMic
                                                    record={this.state.record}
                                                    className="sound-wave"
                                                    onStop={this.onStop.bind(this)}
                                                    // onData={this.onData}
                                                    strokeColor="black"
                                                    backgroundColor='#EEEEEE'
                                                />
                                            </div>
                                            {
                                                this.state._checkPardon
                                                    ?
                                                    <Button style={{ float: 'left' }} onClick={() => { this.checkPardon(this.curr) }}>Pardon?</Button>
                                                    :
                                                    <Button style={{ float: 'left' }} disabled>Pardon</Button>
                                            }

                                            {
                                                this.state.record
                                                    ?
                                                    <Button style={{ float: 'right' }} onClick={() => { this.setState({ record: false, userStartRecording: false }) }}>下一小节</Button>
                                                    :
                                                    <Button style={{ float: 'right' }} disabled>下一小节</Button>
                                            }   {
                                                this.state.userStartRecording
                                                    ?
                                                    <Button style={{ float: 'right' }} onClick={() => { this.setState({ record: true }) }}>使用者開始錄音</Button>
                                                    :
                                                    <Button style={{ float: 'right' }} disabled>使用者開始錄音</Button>
                                            }
                                        </div>

                                }
                            </div>
                        </MDBCard>
                    </Col>
                </Row>
                <center><div style={{ backgroundColor: 'white', padding: '10px', width: '350px', position: 'absolute', fontSize: '14pt', top: '15px', left: '50%', right: '50%', marginLeft: '-175px' }} >
                    剩余作答时间：<div id='remain' style={{ display: 'inline' }} />
                </div></center>
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


export default CCLExam;