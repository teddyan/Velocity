import React, {Component} from 'react';
import {MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import {logout} from "../Utility";
import axios from "axios";
import {Row, Col, Divider, Button, Modal} from 'antd';
import vip from "../../img/VIP.png";

class WordPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            loadingPanel:true,
            panelContent:[],
            wordList: [],
            showWordPanel: false,
            currWord:''
        }
        this.sortState = [1, 1, 1, 1];
    }

    componentDidMount() {
        this.getWordList();
    }

    getWordList = () => {
        let token = localStorage.getItem('access_token');
        let userID = localStorage.getItem('userID');

        //若没有登录信息或失效，则去引导页
        if (token === null || userID === null) {
            logout();
            return;
        }

        axios.get(global.config.url + `User/UserInfo?userID=` + userID, {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => {
            //console.log(res);
            //console.log(res.headers);
            //更新Token
            if (typeof res.headers.authorization !== 'undefined') {
                console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
            }
            if (res.data.msg === 'succeed') {
                let json = res.data.data;
                //console.log(json);
                if(json['isVIP']===1){

                    let formData = new FormData();
                    formData.append('userID', userID);

                    axios({
                        method: 'post',
                        url: global.config.url + `User/GetWordList?`,
                        data: formData,
                        headers: {Authorization: `Bearer ${token}`}
                    }).then(res => {
                        //onsole.log(res);
                        //更新Token
                        if (typeof res.headers.authorization !== 'undefined') {
                            console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                            localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
                        }
                        if (res.data.msg === 'succeed') {
                            let json = res.data.data.wordlist;
                            console.log(json);
                            let wordList = [];
                            for (let key in json) {
                                wordList.push([key, json[key]]);
                            }
                            this.setState({wordList: wordList, loading: false})
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

                }else{

                    let {confirm} = Modal;
                    return (
                        confirm({
                            title: <div>单词本是VIP功能<Button href='/VIP' className='ml-3'>购买VIP</Button></div>,
                            // content: '请在“哔”声后开始答题',
                            cancelText: '取消',
                            okText: '确定',
                            centered: true,
                            onOk:()=>{
                                this.props.history.push('/Home');
                            },
                            onCancel:()=>{
                                this.props.history.push('/Home');
                            }
                        })
                    )

                }
            }
            this.setState({loading:false});
            //this.setState({loading: false, paperData: paperData, paperDataOriginal: paperData});
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

    //点击单词查询例句
    checkWord = (e) => {
        const word = e.currentTarget.innerHTML;
        console.log('checking ' + word);

        let token = localStorage.getItem('access_token');
        let userID = localStorage.getItem('userID');

        //若没有登录信息或失效，则去引导页
        if (token === null || userID === null) {
            logout();
            return;
        }

        this.setState({currWord:'',showWordPanel:true, loadingPanel:true});
        axios.get(global.config.url + `User/CheckWord?word=` + word, {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => {
            console.log(res);
            //更新Token
            if (typeof res.headers.authorization !== 'undefined') {
                console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
            }
            if (res.data.msg === 'succeed') {
                let json = res.data.data;
                //console.log('成功拿到词');
                let panelContent = [];
                panelContent.push(json['pronun']);
                panelContent.push(json['exp']);
                panelContent.push(json['sentence']);
                console.log(panelContent);
                this.setState({loadingPanel:false,currWord:json['word'],panelContent:panelContent});
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

    //询问是否要删除
    askDelWord = (word) => {
        let {confirm} = Modal;
        return (
            confirm({
                title: '确定要从单词本中删除'+word+'吗？',
                // content: '',
                cancelText: '取消',
                okText: '确定',
                centered: true,
                onOk: () => {
                    this.delWord(word);
                }
            })
        )
    }

    //删除单词
    delWord = (word) => {
        console.log(word);
        let token = localStorage.getItem('access_token');
        let userID = localStorage.getItem('userID');

        //若没有登录信息或失效，则去引导页
        if (token === null || userID === null) {
            logout();
            return;
        }

        axios.post(
            global.config.url + `User/DelWord`,
            {
                userID:userID,
                word:word
            }, {
                headers: {Authorization: `Bearer ${token}`}
        }).then(res => {
            console.log(res);
            //更新Token
            if (typeof res.headers.authorization !== 'undefined') {
                console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
            }
            if (res.data.msg === 'succeed') {
                this.getWordList();
                let {confirm} = Modal;
                return (
                    confirm({
                        title: '删除成功',
                        // content: '',
                        cancelText: '取消',
                        okText: '确定',
                        centered: true
                    })
                )
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

    //按列正倒序排序
    sortColumn = (i) => {
        let tmp = this.state.wordList;
        tmp.sort((a, b) => {
            if (a[i] < b[i]) {
                return (-1 * this.sortState[i]);
            }
            if (a[i] > [i]) {
                return (1 * this.sortState[i]);
            }
            return 0;
        })
        this.sortState[i] = -this.sortState[i];
        this.setState({wordList: tmp});
    }

    render() {
        return (
            this.state.loading
                ?
                <div className="d-flex justify-content-center align-items-center mt-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
                :
                <React.Fragment>
                    <div className='mt-4'>点击单词查看更多信息</div>
                    <MDBTable hover className='mt-4 finalRound'>
                        <MDBTableHead style={{backgroundColor: global.config.brown}} textWhite>
                            <tr style={{cursor: 'pointer'}}>
                                <th onClick={() => this.sortColumn(0)}
                                    style={{fontSize: '16pt', borderRadius: '20px 0 0 0'}}>单词▲▼
                                </th>
                                <th style={{fontSize: '16pt'}}>解释</th>
                                <th style={{fontSize: '16pt', borderRadius: '0 20px 0 0'}}>删除</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody color='white'>
                            {
                                this.state.wordList.map((record, i) => {
                                    return (
                                        <tr key={record[0]}>
                                            <td style={{fontSize: '16pt', cursor: 'pointer'}}
                                                onClick={this.checkWord}>{record[0]}</td>
                                            <td style={{fontSize: '16pt'}}>{record[1]}</td>
                                            <td style={{fontSize: '16pt'}}><Button
                                                onClick={() => this.askDelWord(record[0])}>删除</Button></td>
                                        </tr>
                                    );
                                })
                            }
                        </MDBTableBody>
                    </MDBTable>
                    <Modal
                        title={this.state.currWord}
                        visible={this.state.showWordPanel}
                        onCancel={()=>{this.setState({showWordPanel:false})}}
                        cancelButtonProps={{ style: { display: 'none' } }}
                        okButtonProps={{ style: { display: 'none' } }}
                        centered
                    >
                        {
                            this.state.loadingPanel
                                ?
                                <div className="d-flex justify-content-center align-items-center mt-5">
                                    <div className="spinner-border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                                :
                                <React.Fragment>
                                    <div>音标:  {this.state.panelContent[0]}</div><br/>
                                    <div>词性&中文解释:  {this.state.panelContent[1]}</div><br/>
                                    <div>例句:  {this.state.panelContent[2]}</div>
                                </React.Fragment>
                        }
                    </Modal>
                </React.Fragment>
        );
    }
}

export default WordPage;