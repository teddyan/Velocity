import React, {Component} from "react";
import {
    MDBCarousel,
    MDBCarouselInner,
    MDBCarouselItem,
    MDBView,
    MDBMask,
    MDBContainer,
    MDBCarouselCaption,
    MDBCol,
    MDBCard,
    MDBCardImage,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBBtn, MDBRow, MDBIcon, MDBPopover, MDBNavItem, MDBPopoverBody, MDBNavLink, MDBNavbarNav, MDBCardHeader
} from "mdbreact";
import {Row, Col, Carousel, Button, Modal, Popover} from 'antd';
import c1 from '../../img/Carousel01.png';
import c2 from '../../img/Carousel02.png';
import c3 from '../../img/Carousel03.png';
import Background from "../Background";
import '../../css/Background.css';
import TopNavigation from "../topNavigation";
import 'antd/dist/antd.css';
import '../Global';
import {NavLink, Link} from "react-router-dom";
import w1 from "../../img/wechat01.png";
import startButton from '../../img/startButton.png';
import historyButton from '../../img/historyButton.png';
import {logout, removeLocalUserInfo} from "../Utility";
import axios from "axios";


class HomePage extends Component {

    constructor(props) {
        super(props);
        this.videoArr = [
            ['https://www.youtube.com/embed/videoseries?list=PLp0Id_Xdn1hdQZV6XHt4f4ss6YgeTOCNI','实用英语|商务英语|小王子思维公开课'],
            ['https://www.youtube.com/embed/videoseries?list=PLp0Id_Xdn1hfTDkN3Iq2tyrZ83MD_oc3M','小王子聊澳洲实事'],
            ['https://www.youtube.com/embed/videoseries?list=PLp0Id_Xdn1hfl2GjydcOkU2REkreB9RMo','英语讲座'],
            ['https://www.youtube.com/embed/videoseries?list=PLp0Id_Xdn1hdl9NikBc7M3df7JkRGEgHF','迅达英语|雅思在线课程'],
            ['https://www.youtube.com/embed/videoseries?list=PLp0Id_Xdn1hd2JprDn3yI4f3XnB2O5G_y','CCL专业解析'],
            ['https://www.youtube.com/embed/videoseries?list=PLp0Id_Xdn1hc-bTdvB6Er-8wr8HJQLwa7','30 秒聊 PTE 雅思'],
            ['https://www.youtube.com/embed/videoseries?list=PLp0Id_Xdn1hfxFJMb8NTuv5J7ZsYw3o4f','小王子聊个人经历'],
            ['https://www.youtube.com/embed/videoseries?list=PLp0Id_Xdn1hess2si8RyEtxL_6bux4hEU','小王子走心说'],
            ['https://www.youtube.com/embed/videoseries?list=PLp0Id_Xdn1hd2ZkaXmsvMA-KQNTDln_F4','迅达英语|学高分往期学生 独家经验分享'],
            ['https://www.youtube.com/embed/videoseries?list=PLp0Id_Xdn1hcQKktg--TDhEsu03Zgk1QX','迅达英语 | PTE 听力'],
            ['https://www.youtube.com/embed/videoseries?list=PLp0Id_Xdn1hcOmTP_rzcFNn_P8UaRFQzK','迅达英语 | Speaking Read Aloud Tutorials'],
            ['https://www.youtube.com/embed/videoseries?list=PLp0Id_Xdn1hczQKBiWjNBf1Q1kd14qeLo','迅达英语 | Speaking Repeat Sentence Exercises'],
            ['https://www.youtube.com/embed/videoseries?list=PLp0Id_Xdn1hc-_QEgAWA4njQFLz7-V8-e','迅达英语 ｜ PTE Speaking Describe Image Practice'],
            ['https://www.youtube.com/embed/videoseries?list=PLp0Id_Xdn1heMpIVSqyZ7GKiYJsUZcU-M','迅达英语 ｜ PTE 听力练习'],
            ['https://www.youtube.com/embed/videoseries?list=PLp0Id_Xdn1hf4GQ7FdDhXB_Gk50MRNohg','迅达英语 | PTE 在线讲座'],
            ['https://www.youtube.com/embed/videoseries?list=PLp0Id_Xdn1hdXV80QMlIiC-88cfBMipZO','迅达英语 ｜William 老师带你读 WFD'],
        ];
        this.state = {
            showModal: false, //考试类型弹框显示
            username: '未登录',
            isLogin: false,
            candidateInfo: [],
            candidateReady: false,
            leftBanner: [],  //左banner图片src
            rightBanner: [], //右banner图片src
            leftBannerLink:[],
            rightBannerLink:[],
            currVideo:0
        }
    }


    handleClose = (e) => {
        this.setState({
            showModal: false,
        });
    };

    componentDidMount() {
        document.getElementById('navbar').style.display = 'none';
        let username = localStorage.getItem('username');
        if (username !== null) {
            this.setState({username: '你好！' + username});
            this.setState({isLogin: true});
            this.getBannerImg();
            this.getCandidateInfo();
        } else {
            this.setState({username: '未登录'});
            this.setState({isLogin: false});
        }
    }

    //获取banner图片
    getBannerImg = () => {
        let token = localStorage.getItem('access_token');

        //若没有登录信息或失效，则返回（使用默认banner）
        if (token === null) {
            return;
        }

        axios.get(global.config.url + `User/GetBannerImg`, {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => {
            console.log(res);
            //更新Token
            if (typeof res.headers.authorization !== 'undefined') {
                console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
            }
            if (res.data.msg === 'succeed') {
                console.log(res.data.data);
                let json = res.data.data;
                let tmp = [];
                for (let i = 0; i < json['left_banner'].length; i++) {
                    tmp.push(global.config.url + json['left_banner'][i].slice(1));
                    this.setState({leftBanner: tmp});
                }
                tmp = [];
                for (let i = 0; i < json['right_banner'].length; i++) {
                    tmp.push(global.config.url + json['right_banner'][i].slice(1));
                    this.setState({rightBanner: tmp});
                }
                this.setState({leftBannerLink:json['left_banner_link'],rightBannerLink:json['right_banner_link']});
            }
            //this.setState({loading: false, paperData: paperData, paperDataOriginal: paperData});
        }).catch(err => {
            console.log(err);
            console.log(err.response);
            //Token过期
            if (typeof err.response !== 'undefined' && err.response.status === 401) {
                console.log('token过期或失效');
            }
        })
    }


    //实时考生信息
    getCandidateInfo = () => {
        let token = localStorage.getItem('access_token');

        //若没有登录信息或失效，则返回
        if (token === null) {
            return;
        }

        axios.get(global.config.url + `User/GetUserExamDoing`, {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => {
            //console.log(res);
            //更新Token
            if (typeof res.headers.authorization !== 'undefined') {
                console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
            }
            if (res.data.msg === 'succeed') {
                //console.log(res.data.data);
                let tmp = [];
                let json = res.data.data[0];
                for (let name in json) {
                    //考生名字，考试类型，已考时间
                    tmp.push([name, json[name].split('|')[0], json[name].split('|')[1]]);
                }
                //加两遍循环
                for (let name in json) {
                    tmp.push([name, json[name].split('|')[0], json[name].split('|')[1]]);
                }
                let tmp10 = [];
                let finalTmp = [];
                for (let i = 0; i < tmp.length; i++) {
                    if (i > 0 && i % 10 === 0) {
                        finalTmp.push(tmp10);
                        tmp10 = [];
                    }
                    tmp10.push(tmp[i]);
                }
                finalTmp.push(tmp10);
                //console.log(finalTmp);
                this.setState({candidateInfo: finalTmp, candidateReady: true});
            }
            //this.setState({loading: false, paperData: paperData, paperDataOriginal: paperData});
        }).catch(err => {
            console.log(err);
            console.log(err.response);
            //Token过期
            if (typeof err.response !== 'undefined' && err.response.status === 401) {
                console.log('token过期或失效');
                this.setState({isLogin: false})
                //logout();
            }
        })
    }

    //要让顶部导航栏在其他页面显示正常
    componentWillUnmount() {
        document.getElementById('navbar').style.display = 'flex';
    }

    //处理登陆登出
    log = () => {
        if (this.state.isLogin) {
            let token = localStorage.getItem('access_token');
            if (token === null) {
                logout();
                return;
            }
            axios.get(global.config.url + `User/Logout`, {
                headers: {Authorization: `Bearer ${token}`}
            }).then(res => {
                console.log(res);
                if (res.data.msg === 'log out') {
                    console.log('成功登出');
                }
                window.location.href = '/';
            }).catch(err => {
                console.log(err);
                if (err.response.message === 'Token has expired') {
                    console.log('token过期')
                }
                window.location.href = '/';
            });
        } else {
            window.location.href = '/';
        }
        removeLocalUserInfo();
    }

    nextVideo = (i) => {
        let curr = this.state.currVideo;
        curr = curr+ i;
        if(curr===this.videoArr.length){
            curr=0;
        }else if(curr===-1){
            curr=this.videoArr.length-1;
        }
        this.setState({currVideo:curr});
    }

    render() {
        return (
            <React.Fragment>
                <Row justify='space-between'>
                    <div style={{fontSize: '40px'}}>
                        {this.state.username}
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <Popover placement="bottomRight" title='添加客服微信' content={() => {
                            return (
                                <img src={w1} style={{height: '170px', width: 'auto'}}/>
                            )
                        }
                        } trigger="click">
                            <Button size='large'
                                    style={{marginRight: '25px', height: '50px', width: '50px', padding: '0'}}>
                                {/*<svg t="1599272930857" className="icon" viewBox="0 0 1024 1024" version="1.1"*/}
                                {/*     xmlns="http://www.w3.org/2000/svg" p-id="1393" width="40" height="40">*/}
                                {/*    <path*/}
                                {/*        d="M832 426.666667h-1.066667C819.84 260.266667 681.173333 128 512 128S204.16 260.266667 193.066667 426.666667h-2.133334C156.16 426.666667 128 454.826667 128 489.6V618.666667c0 35.2 28.8 64 64 64h42.666667c35.2 0 64-28.8 64-64v-128a63.786667 63.786667 0 0 0-62.933334-63.786667C246.613333 283.733333 366.293333 170.666667 512 170.666667s265.386667 113.066667 276.266667 256.213333A63.786667 63.786667 0 0 0 725.333333 490.666667v128c0 26.026667 15.786667 48.426667 38.186667 58.453333-11.093333 34.346667-46.08 104.533333-148.906667 111.573333C605.44 764.16 582.186667 746.666667 554.666667 746.666667h-85.333334c-35.2 0-64 28.8-64 64s28.8 64 64 64h85.333334c28.16 0 51.626667-18.346667 60.373333-43.52 135.466667-8.106667 178.773333-106.88 191.146667-148.48H832c35.2 0 64-28.8 64-64v-128c0-35.2-28.8-64-64-64z m-576 64v128c0 11.733333-9.6 21.333333-21.333333 21.333333H192c-11.733333 0-21.333333-9.6-21.333333-21.333333v-129.066667c0-11.093333 9.173333-20.266667 20.266666-20.266667H234.666667c11.733333 0 21.333333 9.6 21.333333 21.333334z m298.666667 341.333333h-85.333334c-11.733333 0-21.333333-9.6-21.333333-21.333333s9.6-21.333333 21.333333-21.333334h85.333334c11.733333 0 21.333333 9.6 21.333333 21.333334s-9.6 21.333333-21.333333 21.333333z m298.666666-213.333333c0 11.733333-9.6 21.333333-21.333333 21.333333h-42.666667c-11.733333 0-21.333333-9.6-21.333333-21.333333v-128c0-11.733333 9.6-21.333333 21.333333-21.333334h42.666667c11.733333 0 21.333333 9.6 21.333333 21.333334v128z"*/}
                                {/*        p-id="1394"/>*/}
                                {/*</svg>*/}
                                <svg aria-hidden="true" className='icon' style={{width: '40px', height: '40px'}}>
                                    <use xlinkHref="#iconicon_kefu"/>
                                </svg>
                                {/*<MDBIcon icon="comments" className="mr-3"/>客服微信*/}
                            </Button>
                        </Popover>
                        <Button size='large' style={{height: '50px', width: '50px', padding: '0'}} onClick={this.log}>
                            {/*<MDBIcon icon="sign-out-alt" className="mr-3"/>*/}
                            {/*                        <svg t="1599273083182" className="icon" viewBox="0 0 1024 1024" version="1.1"*/}
                            {/*                             xmlns="http://www.w3.org/2000/svg" p-id="1522" width="30" height="30">*/}
                            {/*                            <path*/}
                            {/*d="M640 1024H128c-70.656 0-128-57.344-128-128V128C0 57.344 57.344 0 128 0h512c70.656 0 128 57.344 128 128v128c0 14.336-11.264 25.6-25.6 25.6s-25.6-11.264-25.6-25.6V128c0-42.496-34.304-76.8-76.8-76.8H128c-42.496 0-76.8 34.304-76.8 76.8v768c0 42.496 34.304 76.8 76.8 76.8h512c42.496 0 76.8-34.304 76.8-76.8v-128c0-14.336 11.264-25.6 25.6-25.6s25.6 11.264 25.6 25.6v128c0 70.656-57.344 128-128 128z"*/}
                            {/*fill="" p-id="1523"/>*/}
                            {/*                            <path*/}
                            {/*d="M998.4 537.6H435.2c-14.336 0-25.6-11.264-25.6-25.6s11.264-25.6 25.6-25.6h563.2c14.336 0 25.6 11.264 25.6 25.6s-11.264 25.6-25.6 25.6z"*/}
                            {/*fill="" p-id="1524"/>*/}
                            {/*                            <path*/}
                            {/*d="M998.4 537.6c-6.656 0-13.312-2.56-17.92-7.68l-153.6-153.6c-10.24-10.24-10.24-26.112 0-36.352s26.112-10.24 36.352 0l153.6 153.6c10.24 10.24 10.24 26.112 0 36.352-5.12 5.12-11.776 7.68-18.432 7.68z"*/}
                            {/*fill="" p-id="1525"/>*/}
                            {/*                            <path*/}
                            {/*d="M844.8 691.2c-6.656 0-13.312-2.56-17.92-7.68-10.24-10.24-10.24-26.112 0-36.352l153.6-153.6c10.24-10.24 26.112-10.24 36.352 0s10.24 26.112 0 36.352l-153.6 153.6c-5.12 5.12-11.776 7.68-18.432 7.68z"*/}
                            {/*fill="" p-id="1526"/>*/}
                            {/*                        </svg>*/}
                            <svg aria-hidden="true" className='icon' style={{width: '30px', height: '30px'}}>
                                <use xlinkHref="#icontuichu"/>
                            </svg>
                            {/*{*/}
                            {/*    this.state.isLogin ? '退出登录' : '登录'*/}
                            {/*}*/}
                        </Button>
                    </div>
                </Row>
                <Row justify='space-between' style={{marginTop: '30px'}}>
                    <Col span={12} style={{paddingRight: '24px'}}>
                        <center>
                            {
                                this.state.leftBanner.length === 0
                                    ?
                                    <MDBCarousel
                                        activeItem={1}
                                        length={3}
                                        interval={5000}
                                        showControls={true}
                                        showIndicators={true}
                                        className="z-depth-1"
                                        style={carousel}
                                    >
                                        <MDBCarouselInner>
                                            <MDBCarouselItem itemId='1'>
                                                <MDBView>
                                                    <img
                                                        className="d-block w-100"
                                                        src={c1}
                                                    />
                                                </MDBView>
                                            </MDBCarouselItem>
                                            <MDBCarouselItem itemId='2'>
                                                <MDBView>
                                                    <img
                                                        className="d-block w-100"
                                                        src={c2}
                                                    />
                                                </MDBView>
                                            </MDBCarouselItem>
                                            <MDBCarouselItem itemId='3'>
                                                <MDBView>
                                                    <img
                                                        className="d-block w-100"
                                                        src={c3}
                                                    />
                                                </MDBView>
                                            </MDBCarouselItem>
                                        </MDBCarouselInner>
                                    </MDBCarousel>
                                    // <Carousel autoplay style={carousel}>
                                    //     <img
                                    //         className="d-block"
                                    //         src={c1}
                                    //         style={carouselImg}
                                    //         alt="First slide"
                                    //     />
                                    //     <img
                                    //         className="d-block"
                                    //         src={c2}
                                    //         style={carouselImg}
                                    //         alt="First slide"
                                    //     />
                                    //     <img
                                    //         className="d-block"
                                    //         src={c3}
                                    //         style={carouselImg}
                                    //         alt="First slide"
                                    //     />
                                    // </Carousel>
                                    :

                                    <MDBCarousel
                                        activeItem={1}
                                        length={this.state.leftBanner.length}
                                        interval={5000}
                                        showControls={true}
                                        showIndicators={true}
                                        className="z-depth-1"
                                        style={carousel}
                                    >
                                        <MDBCarouselInner>
                                            {
                                                this.state.leftBanner.map((img, i) => {
                                                    return (
                                                        <MDBCarouselItem key={i} itemId={i+1}>
                                                            <MDBView>
                                                                <a href={this.state.leftBannerLink[i]} target="_blank">
                                                                    <img
                                                                        className="d-block w-100"
                                                                        src={img}
                                                                    />
                                                                </a>
                                                            </MDBView>
                                                        </MDBCarouselItem>
                                                    )
                                                })
                                            }
                                        </MDBCarouselInner>
                                    </MDBCarousel>

                                    // <Carousel autoplay style={carousel}>{
                                    //     this.state.leftBanner.map((img, i) => {
                                    //         return (
                                    //             <img
                                    //                 className="d-block"
                                    //                 src={img}
                                    //                 style={carouselImg}
                                    //                 key={i}
                                    //             />
                                    //         )
                                    //     })}
                                    // </Carousel>
                            }
                        </center>
                    </Col>
                    <Col span={12} style={{paddingLeft: '24px'}}>
                        <center>
                            {
                                this.state.rightBanner.length === 0
                                    ?
                                    <MDBCarousel
                                        activeItem={1}
                                        length={3}
                                        interval={5000}
                                        showControls={true}
                                        showIndicators={true}
                                        className="z-depth-1"
                                        style={carousel}
                                    >
                                        <MDBCarouselInner>
                                            <MDBCarouselItem itemId='1'>
                                                <MDBView>
                                                    <img
                                                        className="d-block w-100"
                                                        src={c3}
                                                    />
                                                </MDBView>
                                            </MDBCarouselItem>
                                            <MDBCarouselItem itemId='2'>
                                                <MDBView>
                                                    <img
                                                        className="d-block w-100"
                                                        src={c1}
                                                    />
                                                </MDBView>
                                            </MDBCarouselItem>
                                            <MDBCarouselItem itemId='3'>
                                                <MDBView>
                                                    <img
                                                        className="d-block w-100"
                                                        src={c2}
                                                    />
                                                </MDBView>
                                            </MDBCarouselItem>
                                        </MDBCarouselInner>
                                    </MDBCarousel>
                                    :
                                    <MDBCarousel
                                        activeItem={1}
                                        length={this.state.rightBanner.length}
                                        interval={5000}
                                        showControls={true}
                                        showIndicators={true}
                                        className="z-depth-1"
                                        style={carousel}
                                    >
                                        <MDBCarouselInner>
                                            {
                                                this.state.rightBanner.map((img, i) => {
                                                    return (
                                                        <MDBCarouselItem key={i} itemId={i+1}>
                                                            <MDBView>
                                                                <a href={this.state.rightBannerLink[i]} target="_blank">
                                                                    <img
                                                                        className="d-block w-100"
                                                                        src={img}
                                                                    />
                                                                </a>
                                                            </MDBView>
                                                        </MDBCarouselItem>
                                                    )
                                                })
                                            }
                                        </MDBCarouselInner>
                                    </MDBCarousel>
                            }
                        </center>
                    </Col>
                </Row>
                <Row justify='space-around' style={{marginTop: '40px'}}>
                    <Button onClick={() => this.setState({showModal: true})} style={{
                        height: '114px',
                        width: '40%',
                        minWidth: '450px',
                        fontSize: '40px',
                        color: global.config.black,
                        backgroundColor: '#FFF3C8',
                        boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16)',
                        borderRadius: '20px',
                        display: 'inline'
                    }}>
                        <img src={startButton} style={{height: '108px', width: 'auto', marginRight: '15px'}}/>
                        开始模考
                        {/*<MDBIcon icon="play-circle" className="ml-3"/>*/}
                        {/*<svg t="1598336893006" className="icon ml-4" viewBox="0 0 1024 1024" version="1.1"*/}
                        {/*     xmlns="http://www.w3.org/2000/svg" p-id="1393" width="60" height="60">*/}
                        {/*    <path*/}
                        {/*        d="M772.7 217.7a32.2 32.1 0 1 0 64.4 0 32.2 32.1 0 1 0-64.4 0zM415.8 679.9c5.9 0 11.5-1.6 16.2-4.5l231.1-134.6c10.9-5.2 18.5-16.3 18.5-29.2 0-11.9-6.4-22.3-16-27.8L439.7 352.2c-5.8-6.7-14.4-10.9-23.9-10.9-17.6 0-31.8 14.4-31.8 32.1 0 0.6 0 1.2 0.1 1.8l-0.4 0.2 0.5 269c-0.1 1.1-0.2 2.2-0.2 3.4 0 17.7 14.3 32.1 31.8 32.1z"*/}
                        {/*        fill="#543E3E" p-id="1394"/>*/}
                        {/*    <path*/}
                        {/*        d="M909.8 306.6c-5.4-10.5-16.3-17.8-28.9-17.8-17.8 0-32.2 14.4-32.2 32.1 0 6 1.7 11.7 4.6 16.5l-0.1 0.1c26.9 52.4 42.1 111.8 42.1 174.7 0 211.6-171.6 383.2-383.2 383.2S128.8 723.8 128.8 512.2 300.4 129.1 512 129.1c62.5 0 121.5 15 173.6 41.5l0.2-0.4c4.6 2.6 10 4.1 15.7 4.1 17.8 0 32.2-14.4 32.2-32.1 0-13.1-7.9-24.4-19.3-29.4C653.6 81.9 584.9 64.5 512 64.5 264.7 64.5 64.3 265 64.3 512.2S264.7 959.9 512 959.9s447.7-200.4 447.7-447.7c0-74.1-18-144-49.9-205.6z"*/}
                        {/*        fill="#543E3E" p-id="1395"/>*/}
                        {/*</svg>*/}
                        <svg aria-hidden="true" className='icon ml-4' style={{width: '60px', height: '60px'}}>
                            <use xlinkHref="#iconbofang"/>
                        </svg>
                    </Button>
                    <Button style={{
                        height: '114px',
                        width: '40%',
                        minWidth: '450px',
                        fontSize: '40px',
                        color: global.config.black,
                        backgroundColor: '#FFCA28',
                        boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16)',
                        borderRadius: '20px'
                    }}><Link to="/HistoryPage" style={{textDecoration: "none"}}>
                        {/*<MDBIcon icon="clock" className="mr-3"/>*/}
                        <img src={historyButton} style={{height: '108px', width: 'auto', marginRight: '15px'}}/>
                        模考记录
                        {/*<svg t="1598338230463" className="icon ml-4" viewBox="0 0 1024 1024" version="1.1"*/}
                        {/*     xmlns="http://www.w3.org/2000/svg" p-id="1519" width="60" height="60">*/}
                        {/*    <path*/}
                        {/*        d="M420.352 926.037C217.771 875.52 94.037 669.696 144.555 467.115c32.597-130.731 133.461-235.179 262.997-272.384a34.185 34.185 0 0 0 23.381-42.155 34.27 34.27 0 0 0-42.154-23.381C235.86 173.227 116.907 296.448 78.336 450.73c-59.563 238.933 86.357 481.962 325.461 541.696a34.202 34.202 0 0 0 41.472-24.918c4.438-18.261-6.656-36.864-24.917-41.472zM505.515 179.2h8.533c18.603 0 33.792-14.848 34.133-33.45 0.342-18.774-14.677-34.475-33.45-34.817h-9.216a34.133 34.133 0 1 0 0 68.267zM658.09 904.533c-4.95 2.219-10.07 4.267-15.19 6.315-17.578 6.827-26.282 26.624-19.456 44.203a34.03 34.03 0 0 0 44.203 19.285c6.144-2.39 12.117-4.95 17.92-7.51a34.133 34.133 0 0 0 17.408-45.055 33.963 33.963 0 0 0-44.885-17.238zM642.389 204.8c5.12 2.048 10.24 4.096 15.36 6.315 4.438 2.048 9.216 2.901 13.654 2.901a34.133 34.133 0 0 0 31.232-20.48c7.509-17.237-0.342-37.376-17.579-45.056-5.973-2.56-11.947-5.12-18.09-7.51-17.58-6.826-37.377 1.878-44.203 19.457-6.656 17.749 2.048 37.546 19.626 44.373z m216.064 215.552a34.03 34.03 0 0 0 44.203 19.285c17.579-6.826 26.283-26.624 19.456-44.202-2.39-6.144-4.779-12.118-7.51-17.92a34.133 34.133 0 1 0-62.463 27.648c2.218 4.949 4.266 10.069 6.314 15.189z m-79.53-124.416c6.656 6.997 15.701 10.41 24.576 10.41a34.202 34.202 0 0 0 24.746-57.855 514.945 514.945 0 0 0-13.653-13.654c-13.653-12.97-35.157-12.458-48.299 1.024-12.97 13.654-12.629 35.158 1.024 48.299 3.755 3.925 7.68 7.68 11.606 11.776z m123.904 379.563c-17.579-6.827-37.376 1.877-44.203 19.456-2.048 5.12-4.096 10.24-6.315 15.189a34.133 34.133 0 0 0 31.232 47.957c13.142 0 25.6-7.509 31.232-20.309 2.731-5.973 5.12-12.117 7.51-18.09 6.826-17.58-1.878-37.377-19.456-44.203zM952.32 547.84c-0.341-18.773-15.19-33.963-34.816-33.45-18.773 0.34-33.792 16.042-33.45 34.815 0 2.731 0.17 5.462 0 8.534v8.021c-0.513 18.773 14.506 34.475 33.28 34.816h0.853c18.432 0 33.621-14.848 34.133-33.28 0-3.243 0.17-6.315 0.17-9.387 0-3.242-0.17-6.656-0.17-10.069zM779.093 819.541a383.037 383.037 0 0 1-11.776 11.776c-13.653 13.142-13.994 34.646-1.024 48.299 6.656 6.997 15.702 10.41 24.576 10.41 8.534 0 17.067-3.242 23.723-9.557a514.944 514.944 0 0 0 13.653-13.653c12.971-13.653 12.63-35.157-1.024-48.299-13.482-12.97-34.986-12.458-48.128 1.024zM513.195 936.448h-7.68c-18.774 0-34.134 15.36-34.134 34.133s15.36 34.134 34.134 34.134c3.072 0 6.314 0 9.386-0.171 18.774-0.512 33.792-16.043 33.28-34.987s-16.042-34.304-34.986-33.109zM660.82 736.085c13.312-13.312 13.312-34.986 0-48.298L539.99 566.955V366.933c0-18.773-15.36-34.133-34.133-34.133s-34.133 15.36-34.133 34.133v228.352l140.8 140.8a34.014 34.014 0 0 0 48.298 0z"*/}
                        {/*        fill="#543E3E" p-id="1520"/>*/}
                        {/*</svg>*/}
                        <svg aria-hidden="true" className='icon ml-4' style={{width: '60px', height: '60px'}}>
                            <use xlinkHref="#iconlishi"/>
                        </svg>
                    </Link></Button>
                    {/*<MDBCarousel*/}
                    {/*    activeItem={1}*/}
                    {/*    length={3}*/}
                    {/*    showControls={true}*/}
                    {/*    showIndicators={true}*/}
                    {/*    className="z-depth-1"*/}
                    {/*>*/}
                    {/*    <MDBCarouselInner>*/}
                    {/*        <MDBCarouselItem itemId="1">*/}
                    {/*            <MDBView>*/}
                    {/*                <img*/}
                    {/*                    className="d-block"*/}
                    {/*                    src={c1}*/}
                    {/*                    style={carouselImg}*/}
                    {/*                    alt="First slide"*/}
                    {/*                />*/}
                    {/*            </MDBView>*/}
                    {/*            <MDBCarouselCaption>*/}
                    {/*                <p>文字描述1</p>*/}
                    {/*            </MDBCarouselCaption>*/}
                    {/*        </MDBCarouselItem>*/}
                    {/*        <MDBCarouselItem itemId="2">*/}
                    {/*            <MDBView>*/}
                    {/*                <img*/}
                    {/*                    style={carouselImg}*/}
                    {/*                    className="d-block"*/}
                    {/*                    src={c2}*/}
                    {/*                    alt="Second slide"*/}
                    {/*                />*/}
                    {/*            </MDBView>*/}
                    {/*            <MDBCarouselCaption>*/}
                    {/*                <p>文字描述2</p>*/}
                    {/*            </MDBCarouselCaption>*/}
                    {/*        </MDBCarouselItem>*/}
                    {/*        <MDBCarouselItem itemId="3">*/}
                    {/*            <MDBView>*/}
                    {/*                <img*/}
                    {/*                    style={carouselImg}*/}
                    {/*                    className="d-block"*/}
                    {/*                    src={c3}*/}
                    {/*                    alt="Third slide"*/}
                    {/*                />*/}
                    {/*            </MDBView>*/}
                    {/*            <MDBCarouselCaption>*/}
                    {/*                <p>文字描述3</p>*/}
                    {/*            </MDBCarouselCaption>*/}
                    {/*        </MDBCarouselItem>*/}
                    {/*    </MDBCarouselInner>*/}
                    {/*</MDBCarousel>*/}

                </Row>
                <Row style={{marginTop: '48px'}}>
                    <Col span={8} style={{paddingRight: '32px'}}>
                        <MDBCard style={{borderRadius: '20px', height: '352px', width: '100%'}}>
                            <MDBCardHeader style={{
                                backgroundColor: global.config.amber,
                                color: global.config.black,
                                borderRadius: '20px 20px 0px 0px',
                                fontSize: '16pt',
                                textAlign:'center'
                            }}>
                                实时考生考试信息
                            </MDBCardHeader>
                            <MDBCardBody>
                                {
                                    this.state.isLogin
                                        ?
                                        <React.Fragment>
                                            <center><Row justify='space-between'
                                                         style={{textAlign: 'center', fontSize: '13pt', width: '17vw'}}>
                                                <Col span={8}>考生</Col>
                                                <Col span={8}>考试类型</Col>
                                                <Col span={8}>进行时间</Col>
                                            </Row>
                                                {this.state.candidateReady ?
                                                    // <TextLoop interval='5000'>
                                                    //     {
                                                    <div style={{overflow: "hidden", height: '235px'}}>
                                                        <div className='textLoop'>
                                                            {
                                                                this.state.candidateInfo.map((every12, i) => {
                                                                    return (
                                                                        <div key={i} style={{width: '17vw'}}>
                                                                            {
                                                                                every12.map((record, i) => {
                                                                                    return (
                                                                                        <Row key={i}
                                                                                             justify='space-between'
                                                                                             style={{
                                                                                                 textAlign: 'center'
                                                                                             }}>
                                                                                            <Col
                                                                                                span={8}>{record[0]}</Col>
                                                                                            <Col
                                                                                                span={8}>{record[1]}</Col>
                                                                                            <Col
                                                                                                span={8}>{record[2]}分钟</Col>
                                                                                        </Row>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                    //     }
                                                    // </TextLoop>
                                                    :
                                                    <div className="d-flex justify-content-center align-items-center"
                                                         style={{height: '100%', width: '100%'}}>
                                                        <div className="spinner-border" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div>
                                                }
                                            </center>
                                        </React.Fragment>
                                        : <React.Fragment><Button size='large' className='mr-3' onClick={this.log}>
                                            登录
                                        </Button>以查看实时考生信息</React.Fragment>
                                }
                            </MDBCardBody>
                        </MDBCard>
                    </Col>
                    <Col span={8} style={{paddingLeft: '16px', paddingRight: '16px'}}>
                        <MDBCard style={{borderRadius: '20px', height: '352px', width: '100%'}}>
                            <MDBCardHeader style={{
                                backgroundColor: '#FFF3C8',
                                color: global.config.black,
                                borderRadius: '20px 20px 0px 0px',
                                fontSize: '16pt',
                                textAlign:'center'
                            }}>
                                教学视频
                            </MDBCardHeader>
                            <MDBCardBody style={{flexDirection:'column'}} className='d-flex justify-content-center align-items-center'>
                                {/*<video style={{width: '100%',height:'auto',borderRadius:'20px'}} src={this.videoArr[0]} type="video/mp4" controls/>*/}
                                <div className='mb-2' style={{fontSize:'14pt',textAlign:'center'}}>{this.videoArr[this.state.currVideo][1]}</div>
                                <iframe
                                    width="80%" height="auto" src={this.videoArr[this.state.currVideo][0]}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{borderRadius:'20px'}}
                                /><br/>
                                <div>
                                    <svg aria-hidden="true" className='icon' style={{width:'40px',height:'40px',transform: 'rotate(-90deg)',cursor:'pointer'}} onClick={()=>this.nextVideo(-1)}>
                                        <use xlinkHref="#iconicon-1"/>
                                    </svg>
                                    <svg aria-hidden="true" className='icon' style={{width:'40px',height:'40px',transform: 'rotate(90deg)',cursor:'pointer'}} onClick={()=>this.nextVideo(1)}>
                                        <use xlinkHref="#iconicon-1"/>
                                    </svg>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </Col>
                    <Col span={8} style={{paddingLeft: '32px'}}><CardExample/></Col>
                </Row>
                <Modal
                    title="选择考试类型"
                    visible={this.state.showModal}
                    onCancel={this.handleClose}
                    cancelButtonProps={{style: {display: 'none'}}}
                    okButtonProps={{style: {display: 'none'}}}
                    centered
                    width='auto'
                >
                    <Row>
                        <Col>
                            <Link to='/IELTS'><Button style={{
                                height: '250px',
                                width: '250px',
                                fontSize: '45px',
                                backgroundColor: '#FFCA28',
                                boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16)',
                                borderRadius: '20px'
                            }}><MDBIcon icon="pen" className="mr-3"/>雅思</Button></Link>
                        </Col>
                        <Col className='ml-5 mr-5'>
                            <Button style={{
                                height: '250px',
                                width: '250px',
                                fontSize: '45px',
                                backgroundColor: '#FFF3C8',
                                boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16)',
                                borderRadius: '20px'
                            }}><MDBIcon icon="pen" className="mr-3"/>PTE</Button>
                        </Col>
                        <Col>
                            <Button style={{
                                height: '250px',
                                width: '250px',
                                fontSize: '45px',
                                backgroundColor: '#FFCA28',
                                boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16)',
                                borderRadius: '20px'
                            }}><MDBIcon icon="pen" className="mr-3"/>CCL</Button>
                        </Col>
                    </Row>
                </Modal>
                {/*<Background/>*/}
            </React.Fragment>
        );
    }
}


const CardExample = () => {
    return (
        <MDBCard style={{borderRadius: '20px', height: '352px'}}>
            <MDBCardImage className="img-fluid"
                          src="https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(67).jpg"
                          waves style={{borderRadius: '20px 20px 0px 0px'}}/>
            <MDBCardBody>
                <MDBCardTitle>广告位招租</MDBCardTitle>
                {/*<MDBCardText>Some quick example text to build on the card title and make up the bulk of the card's content.</MDBCardText>*/}
            </MDBCardBody>
        </MDBCard>
    )
}


const carouselImg = {
    //display: 'block',
    // height: '380px',
    // width: '851px',
    width: 'auto',
    height: 'auto',
    maxWidth: '30vw',
    borderRadius: '20px'
}

const carousel = {
    width: 'auto',
    height: 'auto',
    // maxWidth:'30vw',
    borderRadius: '20px',
    overflow: 'hidden'
}

export default HomePage;