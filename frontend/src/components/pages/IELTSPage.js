import React, {Component} from 'react';
import {MDBDataTable, MDBTable, MDBTableHead, MDBTableBody, MDBRow, MDBCol, MDBIcon, MDBCardBody} from 'mdbreact';
import axios from 'axios';
import $ from 'jquery';
import '../Global';
import {submitError, logout, removeLocalIELTSExam, giveup, doubleArr, upArr, downArr} from "../Utility";
import {Modal, Button, Row, Col, Divider, Switch} from "antd";
import testAudio from '../../sound/testAudio.wav';
import beep from '../../sound/beep.mp3';
import hint from '../../img/Hint.png';
import {ReactMic} from "react-mic";
import {Link} from "react-router-dom";

//雅思试卷列表
class IELTSPage extends Component {

    state = {
        loading: true,
        paperData: [],  //展示的试卷数据
        paperDataOriginal: [],  //所有试卷数据
        isFree: '全部',   //免费过滤
        isComplete: '全部',   //完成过滤
        showModal: false,   //考前须知弹窗
        paperID: '',
        paperName: '',
        record: false,  //录音状态
        pass: [false, false, false],    //考前须知完成度
        okText: '请先测试音频输入输出',
        checkIsFree: false,   //检测所选试卷是否免费
        addWord: false,
        isVIP: false
    }

    constructor() {
        super();
        //this.paperData.push(['考卷编号','发布日期','是否免费','是否完成']);
        this.sortState = [0, 0, -1, 0, 0];

    }

    //一开始就获取雅思试卷数据
    componentDidMount() {
        console.log('Getting paperList data');

        let paperData = [];
        let token = localStorage.getItem('access_token');
        let userID = localStorage.getItem('userID');

        //若没有登录信息或失效，则去引导页
        if (token === null || userID === null) {
            logout();
            return;
        }

        //检查是否有未完成的考试
        let examID = localStorage.getItem('examID');
        if (examID !== null) {
            let {confirm} = Modal;
            return (
                confirm({
                    title: '您有未完成的雅思考试，是否要继续考试？',
                    content:
                        <div>- 继续考试会从上一次的进度开始。<br/>- 放弃考试会清除考试进度并无法再回到未完成的考试。<br/>- 放弃考试不会删除考试记录。<br/>-
                            放弃付费考试不会退还模考券。<br/><br/>
                            <Button className='mr-4' onClick={() => {
                                this.props.history.push('/IELTSExam');
                                Modal.destroyAll();
                            }}>继续考试</Button>
                            <Button onClick={() => {
                                giveup('ielts');
                            }}>放弃考试</Button>
                        </div>,
                    cancelText: '取消',
                    // okText: '继续考试',
                    centered: true,
                    // onOk:()=>{
                    //     this.props.history.push('/IELTSExam');
                    // },
                    onCancel: () => {
                        this.props.history.push('/Home');
                    },
                    okButtonProps: {style: {display: 'none'}},
                })
            )
        }

        axios.get(global.config.url + `User/PaperList?userID=` + userID + `&type=ielts`, {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => {
            console.log(res);
            //更新Token
            if (typeof res.headers.authorization !== 'undefined') {
                console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
            }
            res.data.map(data => {
                let date = new Date(data.ReleasedDate);
                const month = date.getMonth() + 1;
                const day = date.getDate();
                date = date.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
                paperData.push([data.Paper_ID, data.Paper_Name, date, data.isFree ? '是' : '否', data.isFinish ? '已完成' : '未完成']);
            })
            console.log(paperData);
            this.setState({loading: false, paperData: paperData, paperDataOriginal: paperData});
        }).catch(err => {
            console.log(err);
            console.log(err.response);
            //Token过期
            if (typeof err.response !== 'undefined' && err.response.status === 401) {
                logout();
            }
        })

        axios.get(global.config.url + `User/UserInfo?userID=` + userID, {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => {
            //更新Token
            if (typeof res.headers.authorization !== 'undefined') {
                console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
            }
            if (res.data.msg === 'succeed') {
                let json = res.data.data;
                //console.log(json);
                this.setState({isVIP: json['isVIP'] === 1});
            }
        }).catch(err => {
            console.log(err);
            console.log(err.response);
            //Token过期
            if (typeof err.response !== 'undefined' && err.response.status === 401) {
                console.log('token过期或失效');
                logout();
            }
        })


    }

    //考前须知通过后，检测能否开始考试
    openPaper = () => {

        if (!this.state.checkIsFree) {
            let {confirm} = Modal;
            return (
                confirm({
                    title: '本次考试将消耗1张雅思模考券，确定开始考试吗？',
                    cancelText: '取消',
                    okText: '开始考试',
                    centered: true,
                    onOk: () => {
                        this.startExam();
                    }
                })
            )
        } else {
            this.startExam();
        }

    }

    //发送开始考试请求，检测模考券是否充足
    startExam = () => {
        let token = localStorage.getItem('access_token');
        let userID = localStorage.getItem('userID');

        if (token === null || userID === null) {
            logout();
            return;
        }

        let formData = new FormData();
        formData.append('userID', userID);
        formData.append('PaperID', parseInt(this.state.paperID));
        formData.append('ExamType', 'ielts');

        axios({
            method: 'post',
            url: global.config.url + `User/IeltsExamStart`,
            data: formData,
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => {
            console.log(res);
            if (typeof res.headers.authorization !== 'undefined') {
                console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
            }
            if (res.data.msg === 'succeed') {
                let examID = res.data.ExamID;
                console.log(examID);
                localStorage.setItem('examID', JSON.stringify(examID));
                window.location.href = '/IELTSExam';
            }
                // else if(res.data.msg === 'user has finished this exam'){
                //     //后期改可以做多次
                //     submitError('您已完成该考试，若有问题');
            // }
            else {
                submitError('开始考试失败');
            }
        }).catch(err => {
            console.log(err);
            console.log(err.response);
            //Token过期
            if (typeof err.response !== 'undefined' && err.response.status === 401) {
                logout();
            } else if (err.response.status === 400 && err.response.data.msg === 'lack of Ielts Voucher') {
                let {confirm} = Modal;
                return (
                    confirm({
                        title: '您的雅思模考券不足',
                        cancelText: '取消',
                        okText: '前往购买',
                        centered: true,
                        onOk: () => {
                            window.location.href = '/VIP';
                        }
                    })
                )
            }
        })
    }

    //显示考前须知
    showModal = (e) => {
        const paperID = e.currentTarget.children[1].innerHTML;
        const paperName = e.currentTarget.children[0].innerHTML;
        const checkIsFree = e.currentTarget.children[3].innerHTML === '是';
        console.log(paperID);
        // localStorage.setItem('addWord',JSON.stringify(true));
        // this.setState({addWord:true});
        this.setState({paperID: paperID, paperName: paperName, checkIsFree: checkIsFree, showModal: true});
        localStorage.setItem('addWord', JSON.stringify(this.state.isVIP));
        this.setState({addWord: this.state.isVIP});
    }

    // clearExam = () => {
    //     let {confirm} = Modal;
    //     return (
    //         confirm({
    //             title: '确定要放弃所有未完成的考试吗？',
    //             content: <div>1.考试记录不会删。<br/>2.无法再回到上次考试。<br/>3.付费考试不会退还模考券。</div>,
    //             cancelText: '取消',
    //             okText: '确定',
    //             centered: true,
    //             onOk: () => {
    //                 let regex = /examID|IELTSProgress|IELTSListeningAnswer|IELTSReadingAnswer|IELTSWritingAnswer|IELTSSpeakingAnswer|addWord/;
    //                 let done = false;
    //                 while(!done){
    //                     done = true;
    //                     for(let key in localStorage){
    //                         if(regex.test(key)){
    //                             localStorage.removeItem(key);
    //                             done = false;
    //                             break;
    //                         }
    //                     }
    //                 }
    //
    //                 // for(let i=0;i<localStorage.length;i++){
    //                 //     if(regex.test(localStorage.key(i))){
    //                 //         localStorage.removeItem(localStorage.key(i));
    //                 //         i=i-1;
    //                 //     }
    //                 // }
    //             }
    //         })
    //     )
    // }

    //按免费和完成过滤
    filter = () => {
        // this.paperData.push(['1','2','3','4']);
        // this.forceUpdate();
        //let tmp = [['11','12'],['21',['22']]]
        let tmp = this.state.paperDataOriginal;
        if (this.state.isFree !== "全部") {
            tmp = tmp.filter(row => row[3] === this.state.isFree);
        }
        if (this.state.isComplete !== "全部") {
            tmp = tmp.filter(row => row[4] === this.state.isComplete);
        }
        this.setState({paperData: tmp});
    }

    handleFree = (e) => {
        this.setState({isFree: e.target.value}, () => {
            this.filter()
        });
    }

    handleComplete = (e) => {
        this.setState({isComplete: e.target.value}, () => {
            this.filter()
        });
    }

    //按列正倒序排序
    sortColumn = (i) => {
        for (let m = 0; m < this.sortState.length; m++) {
            if (m !== i) {
                this.sortState[m] = 0;
            }
        }
        if (this.sortState[i] === 0) {
            this.sortState[i] = 1
        } else {
            this.sortState[i] = -this.sortState[i];
        }
        let tmp = this.state.paperData;
        tmp.sort((a, b) => {
            if (a[i] + '' < b[i] + '') {
                return (-1 * this.sortState[i]);
            }
            if (a[i] + '' > b[i] + '') {
                return (1 * this.sortState[i]);
            }
            return 0;
        })
        //this.sortState[i] = -this.sortState[i];
        this.setState({paperData: tmp});
    }

    render() {
        return (
            <React.Fragment>
                <MDBRow className='mt-4'>
                    <MDBCol>
                        <div style={filerTitleStyle}>是否免费</div>
                    </MDBCol>
                    <MDBCol>
                        <div style={filerTitleStyle}>是否完成</div>
                    </MDBCol>
                    {/*<MDBCol className="d-flex justify-content-center align-items-center">*/}
                    {/*    <Link to='IELTSExam'><Button className='ml-2 mr-2'>回到未完成的考试</Button></Link>*/}
                    {/*</MDBCol>*/}
                </MDBRow>
                <MDBRow className='mt-3'>
                    <MDBCol>
                        <select className="browser-default custom-select" onChange={this.handleFree}
                                style={filerTextStyle}>
                            <option value="全部">全部</option>
                            {this.state.loading ? '' :
                                <React.Fragment>
                                    <option value="是">是</option>
                                    <option value="否">否</option>
                                </React.Fragment>
                            }
                        </select>
                    </MDBCol>
                    <MDBCol>
                        <select className="browser-default custom-select" onChange={this.handleComplete}
                                style={filerTextStyle}>
                            <option value="全部">全部</option>
                            {this.state.loading ? '' :
                                <React.Fragment>
                                    <option value="已完成">已完成</option>
                                    <option value="未完成">未完成</option>
                                </React.Fragment>
                            }
                        </select>
                    </MDBCol>
                    {/*<MDBCol className="d-flex justify-content-center align-items-center">*/}
                    {/*    <Button className='ml-2 mr-2' onClick={this.clearExam}>放弃未完成的考试</Button>*/}
                    {/*</MDBCol>*/}
                </MDBRow>
                <MDBTable hover className='mt-4 finalRound' style={{textAlign: 'center'}}>
                    <MDBTableHead style={{backgroundColor: global.config.brown}} textWhite>
                        <tr style={{cursor: 'pointer'}}>
                            <th onClick={() => this.sortColumn(1)} style={{fontSize: '14pt', borderRadius: '20px 0 0 0'}}>考卷 {this.sortState[1] === 0 ? doubleArr : this.sortState[1] === 1 ? upArr : downArr}</th>
                            <th onClick={() => this.sortColumn(2)} style={filerTextStyle}>发布日期 {this.sortState[2] === 0 ? doubleArr : this.sortState[2] === 1 ? upArr : downArr}</th>
                            <th onClick={() => this.sortColumn(3)} style={filerTextStyle}>是否免费 {this.sortState[3] === 0 ? doubleArr : this.sortState[3] === 1 ? upArr : downArr}</th>
                            <th onClick={() => this.sortColumn(4)} style={{fontSize: '14pt', borderRadius: '0 20px 0 0'}}>是否完成 {this.sortState[4] === 0 ? doubleArr : this.sortState[4] === 1 ? upArr : downArr}</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody color='white'>
                        {
                            this.state.paperData.map((record, i) => {
                                return (

                                    <tr style={{cursor: 'pointer'}} onClick={this.showModal} key={record[0]}>

                                        <td style={size12}>{record[1]}</td>
                                        <td style={{display: 'none'}}>{record[0]}</td>
                                        <td style={size12}>{record[2].split()[0]}</td>
                                        <td style={size12}>{record[3]}</td>
                                        <td style={size12}>{record[4]}</td>


                                    </tr>
                                );
                            })
                        }
                    </MDBTableBody>

                </MDBTable>
                {
                    this.state.loading ?
                        <center>
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </center>
                        : ''
                }
                <Modal
                    title={<div style={{fontSize: '14pt'}}>您即将开始的考试为：{this.state.paperName}</div>}
                    okText={this.state.okText}
                    cancelText={'取消'}
                    onOk={this.openPaper}
                    okButtonProps={{disabled: !(this.state.pass.every((val) => val === true))}}
                    onCancel={() => this.setState({showModal: false, record: false})}
                    visible={this.state.showModal}
                    centered
                    width='auto'
                >
                    <div>
                        <div style={{fontSize: '13pt'}}>考试须知：
                            <br/>考试流程：听力->阅读->写作->口语<br/>考试有自动保存答案功能，但是请勿随意关闭刷新页面，以免进度丢失。<br/>
                            {/*<div style={{color:'red'}}>双击或滑动选中单词来将其添加至单词本。</div>*/}
                            {/*<div style={{color:'red'}}>滑动选中文本并点击"高亮"按钮来高亮文本，点击高亮文本可取消高亮。</div>*/}
                            <Divider/>
                            考试界面：<br/>
                            <img src={hint} style={{maxWidth: '640px'}}/>
                            <div className='mt-3' style={{maxWidth: '640px'}}>
                                ①: 考试进度栏(包括计时环，考试进度，小题完成度以及单词本开关)<br/>
                                ②: 题目区<br/>
                                ③: 答题区<br/>
                                听力口语题目答题不分栏，阅读写作分栏<br/>
                                ④: 小题进度框，点击小题框可跳转至对应答题框<br/>
                                ⑤: 侧边栏收缩按钮<br/>
                                ⑥: 滑动选中文本并点击"高亮"按钮来高亮文本，点击高亮文本可取消高亮<br/>
                                ⑦: 阅读写作有Section选择<br/>
                                ⑧: 当前部分剩余时间
                            </div>
                        </div>
                        <Divider/>
                        <Row justify='space-around'>
                            <Col>
                                {
                                    this.state.pass[0]
                                        ? <div style={{color: 'green', display: 'inline'}}><MDBIcon far
                                                                                                    icon="check-square"
                                                                                                    className="mr-3"/>
                                        </div>
                                        : <div style={{display: 'inline'}}><MDBIcon far icon="square" className="mr-3"/>
                                        </div>
                                }
                                <Button type="primary" onClick={() => {
                                    {
                                        document.getElementById('testAudio').play();
                                        let tmp = this.state.pass;
                                        tmp[0] = true;
                                        this.setState({pass: tmp}, () => {
                                            if (this.state.pass.every((val) => val === true)) {
                                                this.setState({okText: '开始考试'})
                                            }
                                        });
                                    }
                                }}>测试音频</Button>
                                <audio src={testAudio} id='testAudio'/>
                            </Col>
                            <Col>
                                {
                                    this.state.pass[1]
                                        ? <div style={{color: 'green', display: 'inline'}}><MDBIcon far
                                                                                                    icon="check-square"
                                                                                                    className="mr-3"/>
                                        </div>
                                        : <div style={{display: 'inline'}}><MDBIcon far icon="square" className="mr-3"/>
                                        </div>
                                }
                                <Button type="primary" onClick={() => {
                                    {
                                        document.getElementById('beep').play();
                                        let tmp = this.state.pass;
                                        tmp[1] = true;
                                        this.setState({pass: tmp}, () => {
                                            if (this.state.pass.every((val) => val === true)) {
                                                this.setState({okText: '开始考试'})
                                            }
                                        });
                                    }
                                }}>测试"哔"声</Button>
                                <audio src={beep} id='beep'/>
                            </Col>
                            <Col>
                                {
                                    this.state.pass[2]
                                        ? <div style={{color: 'green', display: 'inline'}}><MDBIcon far
                                                                                                    icon="check-square"
                                                                                                    className="mr-3"/>
                                        </div>
                                        : <div style={{display: 'inline'}}><MDBIcon far icon="square" className="mr-3"/>
                                        </div>
                                }
                                <Button type="primary" onClick={() => {
                                    this.setState({record: true});
                                    let tmp = this.state.pass;
                                    tmp[2] = true;
                                    this.setState({pass: tmp}, () => {
                                        if (this.state.pass.every((val) => val === true)) {
                                            this.setState({okText: '开始考试'})
                                        }
                                    });
                                }}>测试录音</Button></Col>
                            <Col>
                                {
                                    this.state.isVIP
                                        ?
                                        <div style={{lineHeight: '32px'}}>单词本<Switch className='ml-3'
                                                                                     checked={this.state.addWord}
                                                                                     onChange={(e) => {
                                                                                         this.setState({addWord: e});
                                                                                         localStorage.setItem('addWord', JSON.stringify(e))
                                                                                     }}/></div>
                                        :
                                        <div style={{lineHeight: '32px'}}>单词本(VIP功能)<Switch className='ml-3'
                                                                                            checked={false}
                                                                                            disabled={true}/></div>
                                }
                            </Col>
                        </Row><Divider/>
                        <div>
                            <center>考生音波图，点击“测试录音”以查看是否有声音输入</center>
                            <ReactMic
                                record={this.state.record}
                                className="sound-wave"
                                // onStop={this.onStop.bind(this)}
                                // onData={this.onData}
                                strokeColor="black"
                                backgroundColor='#EEEEEE'
                            />
                        </div>
                    </div>

                </Modal>
            </React.Fragment>

        );
    }

}


const filerTitleStyle = {
    fontSize: '14pt'
}

const filerTextStyle = {
    fontSize: '14pt',
}

const size12 = {
    fontSize: '12pt'
}

const marginTop = {
    marginTop: '25px'
}

export default IELTSPage;