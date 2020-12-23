import React, {Component} from 'react';
import {Button, Col, Divider, Modal, Row, Switch} from 'antd';
import {Link} from "react-router-dom";
import {logout, removeLocalCCLExam, removeLocalIELTSExam, giveup, submitError, doubleArr, upArr,downArr} from "../Utility";
import axios from "axios";
import hint from "../../img/Hint.png";
import {MDBCol, MDBIcon, MDBRow, MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import testAudio from "../../sound/testAudio.wav";
import beep from "../../sound/beep.mp3";
import {ReactMic} from "react-mic";

class CCLPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pass: [false, false, false],
            record: false,
            showModal: false,
            okText: '请先测试音频输入输出',
            loading: true,
            checkIsFree: false,
            paperData: [],  //展示的试卷数据
            paperDataOriginal: [],  //所有试卷数据
            isFree: '全部',   //免费过滤
            isComplete: '全部',   //完成过滤
            paperID: '',
            paperName: ''
        }
        this.sortState = [0, 0, -1, 0, 0];
    }

    componentDidMount() {

        let token = localStorage.getItem('access_token');
        let userID = localStorage.getItem('userID');

        //若没有登录信息或失效，则去引导页
        if (token === null || userID === null) {
            logout();
            return;
        }

        //检查是否有未完成的CCL考试
        let examID = localStorage.getItem('examIDCCL');
        if (examID !== null) {
            let {confirm} = Modal;
            return (
                confirm({
                    title: '您有未完成的CCL考试，是否要继续考试？',
                    content:
                        <div>- 继续考试会从上一次的进度开始。<br/>- 放弃考试会清除考试进度并无法再回到未完成的考试。<br/>- 放弃考试不会删除考试记录。<br/>-
                            放弃付费考试不会退还模考券。<br/><br/>
                            <Button className='mr-4' onClick={() => {
                                this.props.history.push('/CCLExam');
                                Modal.destroyAll();
                            }}>继续考试</Button>
                            <Button onClick={() => {
                                giveup('ccl');
                                // removeLocalCCLExam();
                                // window.location.reload();
                            }}>放弃考试</Button>
                        </div>,
                    cancelText: '取消',
                    // okText: '继续考试',
                    centered: true,
                    // onOk:()=>{
                    //     this.props.history.push('/CCLExam');
                    // },
                    onCancel: () => {
                        this.props.history.push('/Home');
                    },
                    okButtonProps: {style: {display: 'none'}}
                })
            )
        }

        let paperData = [];

        axios.get(`https://www.velocityenglish.com:8080/User/PaperList?userID=` + userID + `&type=ccl`, {
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

    }

    //考前须知通过后，检测能否开始考试
    openPaper = () => {
        if (!this.state.checkIsFree) {
            let {confirm} = Modal;
            return (
                confirm({
                    title: '本次考试将消耗1张CCL模考券，确定开始考试吗？',
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

    startExam = () => {
        // localStorage.setItem('examIDCCL', '?Test');
        // this.props.history.push('/CCLExam');

        let token = localStorage.getItem('access_token');
        let userID = localStorage.getItem('userID');

        if (token === null || userID === null) {
            logout();
            return;
        }

        let formData = new FormData();
        formData.append('userID', userID);
        formData.append('PaperID', parseInt(this.state.paperID));
        formData.append('ExamType', 'CCL');

        axios({
            method: 'post',
            url: global.config.url + `User/CCLExamStart`,
            // url:'http://localhost:8000/User/CCLExamStart',
            data: formData,
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => {
            console.log(res);
            if (typeof res.headers.authorization !== 'undefined') {
                console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
            }
            if (res.data.msg === 'succeed') {
                let examIDCCL = res.data.ExamID;
                localStorage.setItem('examIDCCL', JSON.stringify(examIDCCL));
                window.location.href = '/CCLExam';
            } else {
                submitError('开始考试失败');
            }
        }).catch(err => {
            console.log(err);
            console.log(err.response);
            //Token过期
            if (typeof err.response !== 'undefined' && err.response.status === 401) {
                logout();
            } else if (err.response.status === 400 && err.response.data.msg === 'lack of CCL Voucher') {
                let {confirm} = Modal;
                return (
                    confirm({
                        title: '您的CCL模考券不足',
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

        this.setState({paperID: paperID, paperName: paperName, checkIsFree: checkIsFree, showModal: true});
        localStorage.setItem('addWord', JSON.stringify(this.state.isVIP));
        this.setState({addWord: this.state.isVIP});
    }

    //按免费和完成过滤
    filter = () => {
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
                return (this.sortState[i]);
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
                    title={<div style={{fontSize: '14pt'}}>您即将开始的考试为：
                        {this.state.paperName}
                    </div>}
                    okText={this.state.okText}
                    cancelText={'取消'}
                    onOk={this.openPaper}
                    okButtonProps={{disabled: !(this.state.pass.every((val) => val === true))}}
                    onCancel={() => this.setState({showModal: false, record: false})}
                    visible={this.state.showModal}
                    centered
                    width='688px'
                >
                    <div>
                        <div style={{fontSize: '13pt'}}>考试须知：
                            <br/>
                            1.整个考试需翻译两篇对话，每篇对话就像一个中国人和一个外国人的日常对话。<br/>
                            2.每篇对话大概300字左右，中英各半。大概分成12小节，每小节不超过35字。每小节后听"哔"声后，就要开始翻译。<br/>
                            3.每篇对话前都会有一小段介绍这篇对话发生的背景。好好利用这段介绍，让自己尽早进入考试状态，也做到心里有数，抓住关键词，大概预测接下来的对话会讲些什么内容。<br/><br/>
                            <div style={{color: global.config.red}}>完成每小节的翻译后，请点击"下一节"按钮进行下一部分。</div>
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
                        </Row>
                        <Divider/>
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

export default CCLPage;