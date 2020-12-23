import React, {Component} from 'react';
import TopNavigation from "../../topNavigation";
import IELTSListening from "./IELTSListening";
import IELTSReading from "./IELTSReading";
import IELTSWriting from "./IELTSWriting";
import IELTSSpeaking from "./IELTSSpeaking";
import RectBackground from "../../RectBackground";
import axios from "axios";
import {logout} from "../../Utility";
import Highlighter from "web-highlighter";

class IELTSExam extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isVIP: false,
            progress: 0 //记录考试进度, 0空白，1听力，2阅读，3写作，4口语
        }
        this.highlighter = new Highlighter();
        this.highlighter.on('selection:click', ({id}) => {
            this.highlighter.remove(id);
        })
    }

    componentWillMount() {
        //清除所有缓存
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        let examID = JSON.parse(localStorage.getItem('examID'));
        if(examID===null){
            //若没有正在进行的考试，说明用户是手动来到这个页面的，直接返回主页
            window.location.href = '/IELTS';
        }else {

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
                //更新Token
                if (typeof res.headers.authorization !== 'undefined') {
                    console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                    localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
                }
                if (res.data.msg === 'succeed') {
                    let json = res.data.data;
                    //console.log(json);
                    this.setState({isVIP:json['isVIP']===1},()=>{
                        //意外退出后，重新加载的处理
                        global.config.examID=examID;
                        const local = JSON.parse(localStorage.getItem('IELTSProgress' + global.config.examID));
                        if(local===null){
                            this.setState({progress:1});
                        }else{
                            if(local.Section === 'Listening'){
                                this.setState({progress:1});
                            }else if(local.Section === 'Reading'){
                                this.setState({progress:2});
                            }else if(local.Section === 'Writing'){
                                this.setState({progress:3});
                            }else if(local.Section === 'Speaking'){
                                this.setState({progress:4});
                            }
                        }
                    })
                }
            }).catch(err => {
                //Token过期
                if (typeof err.response !== 'undefined' && err.response.status === 401) {
                    console.log('token过期或失效');
                    logout();
                }
            })

        }

    }

    //下一部分
    nextSection(){
        console.log('jinle next');
        let tmp = this.state.progress;
        this.setState({progress:tmp+1});
        this.forceUpdate();
    }

    //渲染对应的部分
    renderSection=(i)=> {
        console.log('jinle render');
        switch(i) {
            case 0:
                return ''
            case 1:
                return <IELTSListening nextSection={this.nextSection.bind(this)} isVIP={this.state.isVIP} highlight={this.highlight}/>;
            case 2:
                return <IELTSReading nextSection={this.nextSection.bind(this)} isVIP={this.state.isVIP} highlight={this.highlight}/>;
            case 3:
                return <IELTSWriting nextSection={this.nextSection.bind(this)} isVIP={this.state.isVIP} highlight={this.highlight}/>;
            case 4:
                return <IELTSSpeaking nextSection={this.nextSection.bind(this)} isVIP={this.state.isVIP} highlight={this.highlight}/>;
        }
    }

    highlight = () =>{
        const selection = window.getSelection();
        if (selection.isCollapsed) {
            console.log('highlight cancel');
            return;
        }
        this.highlighter.fromRange(selection.getRangeAt(0));
        window.getSelection().removeAllRanges();
    }

    render() {
        return (
            <React.Fragment>
                <TopNavigation/>
                {
                    this.renderSection(this.state.progress)
                }
            </React.Fragment>
        );
    }
}

export default IELTSExam;