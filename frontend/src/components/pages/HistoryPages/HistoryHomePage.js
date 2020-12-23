import React, {Component} from 'react';
import axios from 'axios';
import {saveAs} from 'file-saver';  // -> download zip & need to npm jszip

import {MDBCol, MDBRow, MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import '../../../css/HistoryPages.css'
import {Button, Modal} from "antd";

import {DownloadZipFile} from './ZipAudioFunction'
import Sample from "../../../img/Sample.png";
import {logout, removeLocalIELTSExam, submitError, checkExpert, doubleArr, upArr, downArr} from "../../Utility";

class HistoryHomePage extends Component {

    constructor(props) {
        super(props);
        // State data
        this.state = {
            loading: true,
            ExamHistory: [],
            originalExamHistory: [],
            UserAudio: [],
            showModal: false,
            examID: '',
            status:'全部',
            comment:'全部'
        }
        this.sortState = [0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0];
    }


    componentDidMount() {
        // Create Temp variable to store data
        let TemExamHistory = []

        let token = localStorage.getItem('access_token');

        // fetch the data from backend
        axios.get(global.config.url + 'User/IELTSPaperHistory?userid=' + localStorage.userID, {
            // axios.get( 'http://localhost:8000/User/IELTSPaperHistory?userid=' + localStorage.userID, {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => {
            console.log(res.data);

            // use map to loop the data out
            res.data.data.map(data => {
                let commentState = 0; //未点评
                if (data.Status === 0 && data.isExpert === 1) {
                    //待点评
                    commentState = 1;
                } else if (data.Status === 1 && data.isExpert === 1) {
                    //点评完
                    commentState = 2
                }
                //放弃的考试
                if (data.Status === -1) {
                    TemExamHistory.push([
                        data.ExamID,
                        data.Paper_Name,
                        data.CreateAt,
                        '-',
                        '-',
                        '-',
                        '-',
                        '-',
                        '已放弃',
                        0,
                        '已放弃'
                    ])
                } else {
                    if ((data.Status === 1 && data.isExpert === 1) || (data.Status === 1 && data.isExpert === 0 && data.isFree === 0)) {
                        //写说分已出
                        TemExamHistory.push([
                            data.ExamID,
                            data.Paper_Name,
                            data.CreateAt,
                            data.Listening_Score,
                            data.Reading_Score,
                            data.Writing_Score,
                            data.Speaking_Score,
                            data.FinishScore,
                            '已出分',
                            data.isAudioExist,
                            commentState
                        ])
                    } else {
                        TemExamHistory.push([
                            data.ExamID,
                            data.Paper_Name,
                            data.CreateAt,
                            data.Listening_Score,
                            data.Reading_Score,
                            '-',
                            '-',
                            '-',
                            '未出分',    //0未出分，1已出分
                            data.isAudioExist,
                            commentState
                        ])
                    }
                }
            })
            // load the data to State
            this.setState({loading: false, ExamHistory: TemExamHistory, originalExamHistory: TemExamHistory})
            //console.log(this.state)
        })

    }

    // Sorting
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
        let tmp = this.state.ExamHistory;
        tmp.sort((a, b) => {
            if (a[i] + '' < b[i] + '') {
                return (-1 * this.sortState[i]);
            }
            if (a[i] + '' > b[i] + '') {
                return (1 * this.sortState[i]);
            }
            return 0;
        })
        //console.log(this.sortState);
        //this.sortState[i] = -this.sortState[i];
        this.setState({ExamHistory: tmp});
    }


    ClickDownloadZip = (e) => {
        let UserExamID = e.currentTarget.id
        DownloadZipFile(UserExamID)
    }

    //按免费和完成过滤
    filter = () => {
        let tmp = this.state.originalExamHistory;
        if (this.state.status !== "全部") {
            tmp = tmp.filter(row => row[8] === this.state.status);
        }
        console.log(this.state.originalExamHistory[10][10]);
        console.log(this.state.comment);
        if (this.state.comment !== "全部") {
            tmp = tmp.filter(row => row[10]+'' === this.state.comment);
        }
        this.setState({ExamHistory: tmp});
    }

    handleStatus = (e) => {
        this.setState({status: e.target.value}, () => {
            this.filter()
        });
    }

    handleComment = (e) => {
        this.setState({comment: e.target.value}, () => {
            this.filter()
        });
    }

    render() {
        return (
            <React.Fragment>
                <MDBRow className='mt-4'>
                    <MDBCol>
                        <div style={size14}>出分状态</div>
                    </MDBCol>
                    <MDBCol>
                        <div style={size14}>点评状态</div>
                    </MDBCol>
                </MDBRow>
                <MDBRow className='mt-3'>
                    <MDBCol>
                        <select className="browser-default custom-select" onChange={this.handleStatus} style={size14}>
                            <option value="全部">全部</option>
                            {this.state.loading ? '' :
                                <React.Fragment>
                                    <option value="未出分">未出分</option>
                                    <option value="已出分">已出分</option>
                                    <option value="已放弃">已放弃</option>
                                </React.Fragment>
                            }
                        </select>
                    </MDBCol>
                    <MDBCol>
                        <select className="browser-default custom-select" onChange={this.handleComment}
                                style={filerTextStyle}>
                            <option value="全部">全部</option>
                            {this.state.loading ? '' :
                                <React.Fragment>
                                    <option value="0">未点评</option>
                                    <option value="1">待点评</option>
                                    <option value="2">已点评</option>
                                </React.Fragment>
                            }
                        </select>
                    </MDBCol>
                </MDBRow>
                <div style={{marginTop: '13px', color: global.config.red}}>点击分数查看点评(写作口语)和各个部分的答案</div>
                <MDBTable hover className='finalRound'
                          style={{borderRadius: '15pt', textAlign: 'center', marginTop: '13px'}}>
                    <MDBTableHead style={{backgroundColor: global.config.brown}} textWhite>
                        <tr style={{cursor: 'pointer'}}>
                            <th onClick={() => this.sortColumn(1)} style={{fontSize: '14pt', borderRadius: '20px 0 0 0', verticalAlign: 'middle'}}>考卷 {this.sortState[1] === 0 ? doubleArr : this.sortState[1] === 1 ? upArr : downArr}</th>
                            <th onClick={() => this.sortColumn(2)} style={filerTextStyle}>完成日期 {this.sortState[2] === 0 ? doubleArr : this.sortState[2] === 1 ? upArr : downArr} </th>
                            <th onClick={() => this.sortColumn(3)} style={filerTextStyle}>听力 {this.sortState[3] === 0 ? doubleArr : this.sortState[3] === 1 ? upArr : downArr}</th>
                            <th onClick={() => this.sortColumn(4)} style={filerTextStyle}>阅读 {this.sortState[4] === 0 ? doubleArr : this.sortState[4] === 1 ? upArr : downArr}</th>
                            <th onClick={() => this.sortColumn(5)} style={filerTextStyle}>写作 {this.sortState[5] === 0 ? doubleArr : this.sortState[5] === 1 ? upArr : downArr}</th>
                            <th onClick={() => this.sortColumn(6)} style={filerTextStyle}>口语 {this.sortState[6] === 0 ? doubleArr : this.sortState[6] === 1 ? upArr : downArr}</th>
                            <th onClick={() => this.sortColumn(7)} style={filerTextStyle}>总分 {this.sortState[7] === 0 ? doubleArr : this.sortState[7] === 1 ? upArr : downArr}</th>
                            <th onClick={() => this.sortColumn(8)} style={filerTextStyle}>分数状态 {this.sortState[8] === 0 ? doubleArr : this.sortState[8] === 1 ? upArr : downArr}</th>
                            <th onClick={() => this.sortColumn(10)} style={filerTextStyle}>点评状态 {this.sortState[10] === 0 ? doubleArr : this.sortState[10] === 1 ? upArr : downArr}</th>
                            <th style={{
                                fontSize: '14pt',
                                borderRadius: '0 20px 0 0',
                                verticalAlign: 'middle'
                            }}>录音下载
                            </th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody color='white'>
                        {
                            this.state.ExamHistory.map((record, i) => {
                                return (
                                    <tr key={record[0]}>
                                        {/*<td style={{display: 'none'}}>{record[0]}</td>*/}
                                        <td style={size12}>{record[1]}</td>
                                        <td style={size12}>{record[2].split(' ')[0]}</td>
                                        <td style={size12} className='LS'>
                                            <a href={'/HistoryPage/ListeningPage?' + record[0]}>{record[3]}</a>
                                        </td>
                                        <td style={size12} className='RS'>
                                            <a href={'/HistoryPage/ReadingPage?' + record[0]}>{record[4]}</a>
                                        </td>
                                        <td style={size12} className='WS'>
                                            <a href={'/HistoryPage/WritingPage?' + record[0]}>{record[5]}</a>
                                        </td>
                                        <td style={size12} className='SS'>
                                            <a href={'/HistoryPage/SpeakingPage?' + record[0]}>{record[6]}</a>
                                        </td>
                                        <td style={size12}>{record[7]}</td>
                                        <td style={size12}>{record[8]}</td>
                                        <td style={size12}>{record[10] === 0 ?
                                            <Button onClick={() => {
                                                this.setState({showModal: true, examID: record[0]});
                                            }}>申请点评</Button> : (record[10] === 1 ? '待点评' : (record[10] === 2 ? '已点评' : '已放弃'))}</td>
                                        <td style={size12}>{record[9] === 1 ?
                                            <Button onClick={this.ClickDownloadZip}
                                                    id={record[0]}>下载录音</Button> :
                                            <Button disabled={true} id='DownloadButton'>已过期</Button>}
                                        </td>
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
                    title={'点评券介绍'}
                    okText={'使用点评券'}
                    cancelText={'取消'}
                    onOk={() => checkExpert(this.state.examID)}
                    onCancel={() => {
                        this.setState({showModal: false})
                    }}
                    visible={this.state.showModal}
                    centered
                    width='600'
                >
                    <React.Fragment>
                        <MDBTable hover bordered style={{
                            marginBottom: '0px',
                            backgroundColor: 'rgba(0, 0, 0, 0.02)'
                        }}>
                            <MDBTableBody>
                                <tr>
                                    <td style={cardTitle}>雅思点评券<br/>功能介绍</td>
                                    <td>
                                        写作&口语：<br/>1. 分别给出整体点评 <br/>2. 指出语法逻辑错误 <br/>3. 指点可提升的地方
                                    </td>
                                </tr>
                            </MDBTableBody>
                        </MDBTable>
                        <div style={{color: '#DC3545'}}>不使用则只有分数。</div>
                        <hr/>
                        <div>雅思写作点评样例(部分)：</div>
                        <img src={Sample} style={{
                            width: '500px',
                            height: 'auto',
                            border: 'solid 1px grey'
                        }}/>
                    </React.Fragment>
                </Modal>
            </React.Fragment>
        )
    }
}

// css
const filerTextStyle = {
    fontSize: '14pt',
    verticalAlign: 'middle'
}

const size12 = {
    fontSize: '12pt',
    verticalAlign: 'middle'
}

const size14 = {
    fontSize: '14pt',
}

const cardTitle = {
    verticalAlign: 'middle',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    width: '120px'
}

export default HistoryHomePage;