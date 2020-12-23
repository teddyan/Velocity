import React from 'react';
import { Menu, Divider, Row, Button, Modal, Col } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

import { MDBCard, MDBCardBody, MDBIcon } from "mdbreact"; // or 'antd/dist/antd.less'
import { NavLink, Link, withRouter } from "react-router-dom";
import axios from "axios";
import { logout, removeLocalCCLExam, removeLocalIELTSExam, giveup } from "./Utility";
import user from '../img/user.jpg';


const { SubMenu } = Menu;

//主页的侧边栏
class Sider extends React.Component {

    constructor() {
        super();
        this.state = {
            pageKey: '0',   //当前高亮的项
            username: '',
            isVIP: false,
            VIPDay: 0,      //VIP剩余天数
            loading: true,
            continueDay: '',
            isDoingIELTS: false,
            isDoingCCL: false
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (document.location.pathname !== prevProps.location.pathname) {
            this.updateMenu();
        }
    }

    componentWillMount() {
        this.updateMenu();
    }

    //设置用户信息面板
    componentDidMount() {
        let username = localStorage.getItem('username');
        if (username !== null) {
            this.setState({ username: username });
            this.getUserInfo();
        } else {
            this.setState({ username: '未登录' });
        }
    }

    //获取用户面板数据
    getUserInfo = () => {
        let token = localStorage.getItem('access_token');
        let userID = localStorage.getItem('userID');

        //若没有登录信息或失效，则去引导页
        if (token === null || userID === null) {
            logout();
            return;
        }

        this.setState({ loading: true })
        axios.get(global.config.url + `User/UserInfo?userID=` + userID, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            console.log(res);
            //console.log(res.headers);
            //更新Token
            if (typeof res.headers.authorization !== 'undefined') {
                console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
            }
            if (res.data.msg === 'succeed') {
                let json = res.data.data;
                //console.log(json);
                if (json['isVIP'] === 1) {
                    let VIPDay = Math.ceil((Date.parse(json['VIPEnd']) - Date.parse(json['VIPStart'])) / 86400000);
                    this.setState({ isVIP: true, VIPDay: VIPDay });
                }
                this.setState({ continueDay: json['loginday'] + '天' });
            }
            this.setState({ loading: false });
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

    //更新侧边栏高亮的项，每加一个都要来这里设置
    updateMenu = () => {
        const path = document.location.pathname.toLowerCase();
        //console.log(path);
        if (path === '/home' && this.state.pageKey !== '1') {
            this.setState({ pageKey: '1' },);
        } else if (path === '/ielts' && this.state.pageKey !== '2') {
            this.setState({ pageKey: '2' },);
        } else if (path === '/pte' && this.state.pageKey !== '3') {
            this.setState({ pageKey: '3' },);
        } else if (path === '/ccl' && this.state.pageKey !== '4') {
            this.setState({ pageKey: '4' },);
        } else if (/historypage/.test(path) && this.state.pageKey !== '5') {
            this.setState({ pageKey: '5' },);
        } else if (/ptehistorypage/.test(path) && this.state.pageKey !== '6') {
            this.setState({ pageKey: '6' },);
        } else if (/cclhistorypage/.test(path) && this.state.pageKey !== '7') {
            this.setState({ pageKey: '7' },);
        } else if (path === '/person' && this.state.pageKey !== '8') {
            this.setState({ pageKey: '8' },);
        } else if (path === '/word' && this.state.pageKey !== '9') {
            this.setState({ pageKey: '9' },);
        } else if (path === '/vip' && this.state.pageKey !== '10') {
            this.setState({ pageKey: '10' },);
        } else if (path === '/free' && this.state.pageKey !== '11') {
            this.setState({ pageKey: '11' },);
        } else if (path === '/help' && this.state.pageKey !== '12') {
            this.setState({ pageKey: '12' },);
        } else if (path === '/about' && this.state.pageKey !== 'a') {
            this.setState({ pageKey: 'a' },);
        }

        //检查是否有未完成的考试以更新侧边栏
        let examID = localStorage.getItem('examID');
        if (examID !== null) {
            this.setState({ isDoingIELTS: true });
        }

        let examIDCCL = localStorage.getItem('examIDCCL');
        if (examIDCCL !== null) {
            this.setState({ isDoingCCL: true });
        }
    }

    handleClick = e => {
        console.log('click ', e.key);
        this.setState({ pageKey: e.key })
    }

    goWord = () => {
        if (this.state.isVIP) {
            this.props.history.push('/Word');
        } else {
            let { confirm } = Modal;
            return (
                confirm({
                    title: <div>单词本是VIP功能<Button href='/VIP' className='ml-3'>购买VIP</Button></div>,
                    // content: '请在“哔”声后开始答题',
                    cancelText: '取消',
                    okText: '确定',
                    centered: true,
                    onOk: () => {
                        this.updateMenu();
                    },
                    onCancel: () => {
                        this.updateMenu();
                    }
                })
            )
        }
    }

    deselectMenu = () => {
        this.setState({ pageKey: '0' });
    }

    //显示放弃继续考试面板
    showContinueOrGiveup = (i) => {
        let data = [
            ['雅思', '/IELTSExam', giveup, '/IELTS', 'ielts'],
            ['PTE', '/PTEExam', giveup, '/PTE', 'pte'],
            ['CCL', '/CCLExam', giveup, '/CCL', 'ccl'],
        ]
        let { confirm } = Modal;
        return (
            confirm({
                title: '您有未完成的' + data[i][0] + '考试，是否要继续考试？',
                content:
                    <div>- 继续考试会从上一次的进度开始。<br />- 放弃考试会清除考试进度并无法再回到未完成的考试。<br />- 放弃考试不会删除考试记录。<br />- 放弃付费考试不会退还模考券。<br /><br />
                        <Button className='mr-4' onClick={() => {
                            this.props.history.push(data[i][1]);
                            Modal.destroyAll();
                        }}>继续考试</Button>
                        <Button onClick={() => {
                            data[i][2](data[i][4]);
                            //window.location.href = data[i][3];
                        }}>放弃考试</Button>
                    </div>,
                cancelText: '取消',
                // okText: '继续考试',
                centered: true,
                // onOk:()=>{
                //     this.props.history.push(data[i][1]);
                // },
                onCancel: () => {
                    this.updateMenu();
                },
                okButtonProps: { style: { display: 'none' } },
            })
        )
    }

    render() {
        return (
            <React.Fragment>
                <MDBCard
                    style={{
                        minWidth: '260px',
                        width: '100%',
                        borderRadius: '30px',
                        flexDirection: 'column'
                    }} className='mb-5 d-flex justify-content-center align-items-center'>
                    <MDBCardBody style={{ width: '100%', textAlign: 'center' }}>
                        <div style={{ position: 'absolute', right: '20px', cursor: 'pointer' }} onClick={() => { this.props.history.push('/Person'); this.deselectMenu() }}>
                            <svg aria-hidden="true" className='icon' style={{ width: '30px', height: '30px' }}>
                                <use xlinkHref="#iconshezhi" />
                            </svg>
                        </div>
                        <div>
                            {/*<MDBIcon icon="user-alt" size='5x' className="mb-3"/>*/}
                            {/*<svg t="1598333004713" viewBox="0 0 1024 1024" version="1.1"*/}
                            {/*     xmlns="http://www.w3.org/2000/svg" p-id="1528" width="100" height="100" className='mb-3 mr-3 icon'>*/}
                            {/*    <path*/}
                            {/*        d="M586.945923 513.581008c55.067176-27.962865 92.91211-85.125773 92.91211-150.998039 0-93.338828-75.937506-169.276335-169.277358-169.276335s-169.275311 75.937506-169.275311 169.276335c0 65.872267 37.844933 123.034151 92.911086 150.998039-95.652524 32.016181-164.778904 122.45496-164.778904 228.743728 0 11.31572 9.17394 20.491707 20.491707 20.491707s20.491707-9.174963 20.491707-20.491707c0-110.36869 89.791026-200.160739 200.160739-200.160739S710.741413 631.956046 710.741413 742.324736c0 11.31572 9.17394 20.491707 20.491707 20.491707s20.491707-9.174963 20.491707-20.491707C751.723803 636.035968 682.598446 545.598212 586.945923 513.581008zM382.287753 362.582969c0-70.742181 57.552787-128.293945 128.292921-128.293945 70.742181 0 128.293945 57.552787 128.293945 128.293945 0 70.741157-57.552787 128.292921-128.293945 128.292921C439.84054 490.876913 382.287753 433.324126 382.287753 362.582969zM827.871087 196.127889C743.498468 111.757317 631.320573 65.290005 512 65.290005S280.500509 111.756293 196.128913 196.127889C111.756293 280.501532 65.291029 392.678404 65.291029 511.998977s46.465265 231.499491 130.837884 315.872111 196.550515 130.837884 315.871087 130.837884 231.498468-46.465265 315.871087-130.837884S958.708971 631.319549 958.708971 511.998977 912.243707 280.500509 827.871087 196.127889zM512 917.726581c-223.718271 0-405.726581-182.007287-405.726581-405.727605 0-223.718271 182.00831-405.726581 405.726581-405.726581s405.726581 182.007287 405.726581 405.726581C917.726581 735.719294 735.718271 917.726581 512 917.726581z"*/}
                            {/*        p-id="1529"/>*/}
                            {/*</svg>*/}
                            {/*<svg aria-hidden="true" className='icon mb-3 mr-3' style={{width:'100px',height:'100px'}}>*/}
                            {/*    <use xlinkHref="#icongeren"/>*/}
                            {/*</svg>*/}
                            <img src={user} style={{ width: '87px', height: '87px', borderRadius: '43px', boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16)' }} className='mr-3' />
                            <div style={{ fontSize: '22px', display: 'inline', width: '100%' }}>
                                {
                                    this.state.isVIP ? <div style={{ display: 'inline', marginLeft: '-50px', verticalAlign: '-20px' }} className='mr-2'>{vipIcon}</div> : ''
                                }
                                {this.state.username}
                            </div>
                        </div>
                        {/*{*/}
                        {/*    (this.state.username===''||this.state.username==='未登录')*/}
                        {/*        ?*/}
                        {/*        ''*/}
                        {/*        :*/}
                        {/*        this.state.loading*/}
                        {/*        ?*/}
                        {/*        <div className="d-flex justify-content-center align-items-center mt-2">*/}
                        {/*            <div className="spinner-border"  role="status">*/}
                        {/*                <span className="sr-only">Loading...</span>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*        :*/}
                        {/*        this.state.isVIP*/}
                        {/*            ?*/}
                        {/*            <div>您的VIP会员还剩{this.state.VIPDay}天<Link to='/VIP'><Button className='ml-2'>续费</Button></Link></div>*/}
                        {/*            :*/}
                        {/*            <div>您是普通会员<Link to='/VIP'><Button className='ml-3'>购买VIP券</Button></Link></div>*/}

                        {/*}*/}
                        <Row justify='space-around' className='mt-4' style={{ width: '100%' }}>
                            <Col>
                                <div onClick={() => { this.goWord(); this.deselectMenu() }} style={{ cursor: 'pointer' }}>
                                    <div className='hoverGrey pl-2 pr-2 pt-2' style={{ borderRadius: '10px' }}>单词本<br />
                                        <svg aria-hidden="true" className='icon' style={{ width: '50px', height: '50px' }}>
                                            <use xlinkHref="#iconshuben" />
                                        </svg>
                                    </div>
                                </div>
                            </Col>
                            <Col>
                                <center><div className='pl-2 pr-2 pt-2'>已连续登陆</div><div style={{ lineHeight: '40px' }}>{this.state.continueDay}</div></center>
                            </Col>
                            <Col>
                                <div style={{ cursor: 'pointer' }} onClick={() => { this.props.history.push('/Voucher'); this.deselectMenu() }}>
                                    <div className='hoverGrey pl-2 pr-2 pt-2' style={{ borderRadius: '10px' }}>我的券<br />
                                        <svg aria-hidden="true" className='icon' style={{ width: '50px', height: '50px' }}>
                                            <use xlinkHref="#icon-" />
                                        </svg>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </MDBCardBody>
                </MDBCard>
                <MDBCard
                    style={{
                        minWidth: '260px',
                        width: '100%',
                        minHeight: '615px',
                        paddingTop: '22px',
                        paddingBottom: '20px',
                        borderRadius: '30px'
                    }}
                >
                    <Menu
                        onClick={this.handleClick}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        //defaultSelectedKeys={[this.state.pageKey]}
                        style={{ fontSize: '22px' }}
                        selectedKeys={this.state.pageKey}
                    >
                        <Menu.Item key="1">
                            <Link to="/Home" style={{ textDecoration: "none" }}>
                                {/*<MDBIcon icon="home" className="mr-3"/>*/}
                                {/*<svg t="1598332882081" className="icon" viewBox="0 0 1024 1024" version="1.1"*/}
                                {/*     xmlns="http://www.w3.org/2000/svg" p-id="1393" width="42" height="42"*/}
                                {/*     className='mr-3'>*/}
                                {/*    <path*/}
                                {/*        d="M849.92 503.808 530.432 188.416c-6.144-6.144-16.384-6.144-22.528 0L268.288 425.984c0 0 0 0 0 0l-79.872 77.824c-6.144 6.144-6.144 16.384 0 22.528 6.144 6.144 16.384 6.144 22.528 0l53.248-51.2 0 262.144c0 34.816 28.672 63.488 63.488 63.488l112.64 0c8.192 0 16.384-6.144 16.384-16.384l0-141.312 143.36 0c8.192 0 16.384-6.144 16.384-16.384 0-8.192-6.144-16.384-16.384-16.384l-159.744 0c-8.192 0-16.384 6.144-16.384 16.384l0 141.312L327.68 768c-18.432 0-32.768-14.336-32.768-30.72L294.912 442.368l223.232-221.184 307.2 303.104c4.096 4.096 8.192 4.096 12.288 4.096s8.192-2.048 12.288-4.096C856.064 520.192 856.064 509.952 849.92 503.808zM757.76 546.816c-8.192 0-16.384 6.144-16.384 16.384l0 174.08c0 16.384-14.336 30.72-32.768 30.72l-112.64 0c-8.192 0-16.384 6.144-16.384 16.384 0 8.192 6.144 16.384 16.384 16.384l112.64 0c34.816 0 63.488-28.672 63.488-63.488l0-174.08C774.144 552.96 768 546.816 757.76 546.816z"*/}
                                {/*        p-id="1394"/>*/}
                                {/*</svg>*/}
                                <svg aria-hidden="true" className='icon mr-3' style={{ width: '42px', height: '42px' }}>
                                    <use xlinkHref="#iconshouye" />
                                </svg>
                                主页</Link>
                        </Menu.Item>
                        <hr className="solid" />
                        <SubMenu
                            key="sub1"
                            title={
                                <span>
                                    {/*<MDBIcon icon="edit" className="mr-3"/>*/}
                                    <div className='mr-3' style={{ display: 'inline' }}>{examIcon}</div>
                                    模考</span>
                            }
                        >
                            <Menu.Item key="2" style={{ fontSize: '14pt' }}>
                                {
                                    this.state.isDoingIELTS
                                        ?
                                        <div style={{ paddingLeft: '35px' }} onClick={() => this.showContinueOrGiveup(0)}>雅思<MDBIcon icon="spinner" className="ml-3" /></div>
                                        :
                                        <Link to="/IELTS">
                                            <div style={{ paddingLeft: '35px' }}>雅思</div>
                                        </Link>
                                }
                            </Menu.Item>
                            <Menu.Item key="3" style={{ fontSize: '14pt' }}>
                                {/*<MDBIcon icon="pen" className="mr-3"/>*/}
                                {/*{examIcon}*/}
                                <Link to="/PTE">
                                    <div style={{ paddingLeft: '35px' }}>PTE</div>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="4" style={{ fontSize: '14pt' }}>
                                {
                                    this.state.isDoingCCL
                                        ?
                                        <div style={{ paddingLeft: '35px' }} onClick={() => this.showContinueOrGiveup(2)}>CCL<MDBIcon icon="spinner" className="ml-3" /></div>
                                        :
                                        <Link to="/CCL">
                                            <div style={{ paddingLeft: '35px' }}>CCL</div>
                                        </Link>
                                }
                            </Menu.Item>
                        </SubMenu>
                        <hr className="solid" />
                        <SubMenu
                            key="sub2"
                            title={
                                <span>
                                    {/*<MDBIcon icon="edit" className="mr-3"/>*/}
                                    <div className='mr-3' style={{ display: 'inline' }}> <svg aria-hidden="true" className='icon mr-3' style={{ width: '35px', height: '35px' }}>
                                        <use xlinkHref="#iconlishi" />
                                    </svg></div>
                                模考记录</span>
                            }
                        >
                            <Menu.Item key="5">
                                <Link to="/HistoryPage" style={{ fontSize: '14pt' }}>
                                    {/*<MDBIcon icon="clock" className="mr-3"/>*/}
                                    {/*<svg t="1598333498111" className="icon mr-3" viewBox="0 0 1024 1024" version="1.1"*/}
                                    {/*     xmlns="http://www.w3.org/2000/svg" p-id="1913" width="35" height="35">*/}
                                    {/*    <path*/}
                                    {/*        d="M420.352 926.037C217.771 875.52 94.037 669.696 144.555 467.115c32.597-130.731 133.461-235.179 262.997-272.384a34.185 34.185 0 0 0 23.381-42.155 34.27 34.27 0 0 0-42.154-23.381C235.86 173.227 116.907 296.448 78.336 450.73c-59.563 238.933 86.357 481.962 325.461 541.696a34.202 34.202 0 0 0 41.472-24.918c4.438-18.261-6.656-36.864-24.917-41.472zM505.515 179.2h8.533c18.603 0 33.792-14.848 34.133-33.45 0.342-18.774-14.677-34.475-33.45-34.817h-9.216a34.133 34.133 0 1 0 0 68.267zM658.09 904.533c-4.95 2.219-10.07 4.267-15.19 6.315-17.578 6.827-26.282 26.624-19.456 44.203a34.03 34.03 0 0 0 44.203 19.285c6.144-2.39 12.117-4.95 17.92-7.51a34.133 34.133 0 0 0 17.408-45.055 33.963 33.963 0 0 0-44.885-17.238zM642.389 204.8c5.12 2.048 10.24 4.096 15.36 6.315 4.438 2.048 9.216 2.901 13.654 2.901a34.133 34.133 0 0 0 31.232-20.48c7.509-17.237-0.342-37.376-17.579-45.056-5.973-2.56-11.947-5.12-18.09-7.51-17.58-6.826-37.377 1.878-44.203 19.457-6.656 17.749 2.048 37.546 19.626 44.373z m216.064 215.552a34.03 34.03 0 0 0 44.203 19.285c17.579-6.826 26.283-26.624 19.456-44.202-2.39-6.144-4.779-12.118-7.51-17.92a34.133 34.133 0 1 0-62.463 27.648c2.218 4.949 4.266 10.069 6.314 15.189z m-79.53-124.416c6.656 6.997 15.701 10.41 24.576 10.41a34.202 34.202 0 0 0 24.746-57.855 514.945 514.945 0 0 0-13.653-13.654c-13.653-12.97-35.157-12.458-48.299 1.024-12.97 13.654-12.629 35.158 1.024 48.299 3.755 3.925 7.68 7.68 11.606 11.776z m123.904 379.563c-17.579-6.827-37.376 1.877-44.203 19.456-2.048 5.12-4.096 10.24-6.315 15.189a34.133 34.133 0 0 0 31.232 47.957c13.142 0 25.6-7.509 31.232-20.309 2.731-5.973 5.12-12.117 7.51-18.09 6.826-17.58-1.878-37.377-19.456-44.203zM952.32 547.84c-0.341-18.773-15.19-33.963-34.816-33.45-18.773 0.34-33.792 16.042-33.45 34.815 0 2.731 0.17 5.462 0 8.534v8.021c-0.513 18.773 14.506 34.475 33.28 34.816h0.853c18.432 0 33.621-14.848 34.133-33.28 0-3.243 0.17-6.315 0.17-9.387 0-3.242-0.17-6.656-0.17-10.069zM779.093 819.541a383.037 383.037 0 0 1-11.776 11.776c-13.653 13.142-13.994 34.646-1.024 48.299 6.656 6.997 15.702 10.41 24.576 10.41 8.534 0 17.067-3.242 23.723-9.557a514.944 514.944 0 0 0 13.653-13.653c12.971-13.653 12.63-35.157-1.024-48.299-13.482-12.97-34.986-12.458-48.128 1.024zM513.195 936.448h-7.68c-18.774 0-34.134 15.36-34.134 34.133s15.36 34.134 34.134 34.134c3.072 0 6.314 0 9.386-0.171 18.774-0.512 33.792-16.043 33.28-34.987s-16.042-34.304-34.986-33.109zM660.82 736.085c13.312-13.312 13.312-34.986 0-48.298L539.99 566.955V366.933c0-18.773-15.36-34.133-34.133-34.133s-34.133 15.36-34.133 34.133v228.352l140.8 140.8a34.014 34.014 0 0 0 48.298 0z"*/}
                                    {/*        fill="#543E3E" p-id="1914"/>*/}
                                    {/*</svg>*/}
                                    <div style={{ paddingLeft: '35px' }} >雅思记录</div>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="6">
                                <Link to="/HistoryPage" style={{ fontSize: '14pt' }}>
                                    {/*<MDBIcon icon="clock" className="mr-3"/>*/}
                                    {/*<svg t="1598333498111" className="icon mr-3" viewBox="0 0 1024 1024" version="1.1"*/}
                                    {/*     xmlns="http://www.w3.org/2000/svg" p-id="1913" width="35" height="35">*/}
                                    {/*    <path*/}
                                    {/*        d="M420.352 926.037C217.771 875.52 94.037 669.696 144.555 467.115c32.597-130.731 133.461-235.179 262.997-272.384a34.185 34.185 0 0 0 23.381-42.155 34.27 34.27 0 0 0-42.154-23.381C235.86 173.227 116.907 296.448 78.336 450.73c-59.563 238.933 86.357 481.962 325.461 541.696a34.202 34.202 0 0 0 41.472-24.918c4.438-18.261-6.656-36.864-24.917-41.472zM505.515 179.2h8.533c18.603 0 33.792-14.848 34.133-33.45 0.342-18.774-14.677-34.475-33.45-34.817h-9.216a34.133 34.133 0 1 0 0 68.267zM658.09 904.533c-4.95 2.219-10.07 4.267-15.19 6.315-17.578 6.827-26.282 26.624-19.456 44.203a34.03 34.03 0 0 0 44.203 19.285c6.144-2.39 12.117-4.95 17.92-7.51a34.133 34.133 0 0 0 17.408-45.055 33.963 33.963 0 0 0-44.885-17.238zM642.389 204.8c5.12 2.048 10.24 4.096 15.36 6.315 4.438 2.048 9.216 2.901 13.654 2.901a34.133 34.133 0 0 0 31.232-20.48c7.509-17.237-0.342-37.376-17.579-45.056-5.973-2.56-11.947-5.12-18.09-7.51-17.58-6.826-37.377 1.878-44.203 19.457-6.656 17.749 2.048 37.546 19.626 44.373z m216.064 215.552a34.03 34.03 0 0 0 44.203 19.285c17.579-6.826 26.283-26.624 19.456-44.202-2.39-6.144-4.779-12.118-7.51-17.92a34.133 34.133 0 1 0-62.463 27.648c2.218 4.949 4.266 10.069 6.314 15.189z m-79.53-124.416c6.656 6.997 15.701 10.41 24.576 10.41a34.202 34.202 0 0 0 24.746-57.855 514.945 514.945 0 0 0-13.653-13.654c-13.653-12.97-35.157-12.458-48.299 1.024-12.97 13.654-12.629 35.158 1.024 48.299 3.755 3.925 7.68 7.68 11.606 11.776z m123.904 379.563c-17.579-6.827-37.376 1.877-44.203 19.456-2.048 5.12-4.096 10.24-6.315 15.189a34.133 34.133 0 0 0 31.232 47.957c13.142 0 25.6-7.509 31.232-20.309 2.731-5.973 5.12-12.117 7.51-18.09 6.826-17.58-1.878-37.377-19.456-44.203zM952.32 547.84c-0.341-18.773-15.19-33.963-34.816-33.45-18.773 0.34-33.792 16.042-33.45 34.815 0 2.731 0.17 5.462 0 8.534v8.021c-0.513 18.773 14.506 34.475 33.28 34.816h0.853c18.432 0 33.621-14.848 34.133-33.28 0-3.243 0.17-6.315 0.17-9.387 0-3.242-0.17-6.656-0.17-10.069zM779.093 819.541a383.037 383.037 0 0 1-11.776 11.776c-13.653 13.142-13.994 34.646-1.024 48.299 6.656 6.997 15.702 10.41 24.576 10.41 8.534 0 17.067-3.242 23.723-9.557a514.944 514.944 0 0 0 13.653-13.653c12.971-13.653 12.63-35.157-1.024-48.299-13.482-12.97-34.986-12.458-48.128 1.024zM513.195 936.448h-7.68c-18.774 0-34.134 15.36-34.134 34.133s15.36 34.134 34.134 34.134c3.072 0 6.314 0 9.386-0.171 18.774-0.512 33.792-16.043 33.28-34.987s-16.042-34.304-34.986-33.109zM660.82 736.085c13.312-13.312 13.312-34.986 0-48.298L539.99 566.955V366.933c0-18.773-15.36-34.133-34.133-34.133s-34.133 15.36-34.133 34.133v228.352l140.8 140.8a34.014 34.014 0 0 0 48.298 0z"*/}
                                    {/*        fill="#543E3E" p-id="1914"/>*/}
                                    {/*</svg>*/}
                                    <div style={{ paddingLeft: '35px' }} >PTE记录</div>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="7">
                                <Link to="/CCLHistoryPage" style={{ fontSize: '14pt' }}>
                                    {/*<MDBIcon icon="clock" className="mr-3"/>*/}
                                    {/*<svg t="1598333498111" className="icon mr-3" viewBox="0 0 1024 1024" version="1.1"*/}
                                    {/*     xmlns="http://www.w3.org/2000/svg" p-id="1913" width="35" height="35">*/}
                                    {/*    <path*/}
                                    {/*        d="M420.352 926.037C217.771 875.52 94.037 669.696 144.555 467.115c32.597-130.731 133.461-235.179 262.997-272.384a34.185 34.185 0 0 0 23.381-42.155 34.27 34.27 0 0 0-42.154-23.381C235.86 173.227 116.907 296.448 78.336 450.73c-59.563 238.933 86.357 481.962 325.461 541.696a34.202 34.202 0 0 0 41.472-24.918c4.438-18.261-6.656-36.864-24.917-41.472zM505.515 179.2h8.533c18.603 0 33.792-14.848 34.133-33.45 0.342-18.774-14.677-34.475-33.45-34.817h-9.216a34.133 34.133 0 1 0 0 68.267zM658.09 904.533c-4.95 2.219-10.07 4.267-15.19 6.315-17.578 6.827-26.282 26.624-19.456 44.203a34.03 34.03 0 0 0 44.203 19.285c6.144-2.39 12.117-4.95 17.92-7.51a34.133 34.133 0 0 0 17.408-45.055 33.963 33.963 0 0 0-44.885-17.238zM642.389 204.8c5.12 2.048 10.24 4.096 15.36 6.315 4.438 2.048 9.216 2.901 13.654 2.901a34.133 34.133 0 0 0 31.232-20.48c7.509-17.237-0.342-37.376-17.579-45.056-5.973-2.56-11.947-5.12-18.09-7.51-17.58-6.826-37.377 1.878-44.203 19.457-6.656 17.749 2.048 37.546 19.626 44.373z m216.064 215.552a34.03 34.03 0 0 0 44.203 19.285c17.579-6.826 26.283-26.624 19.456-44.202-2.39-6.144-4.779-12.118-7.51-17.92a34.133 34.133 0 1 0-62.463 27.648c2.218 4.949 4.266 10.069 6.314 15.189z m-79.53-124.416c6.656 6.997 15.701 10.41 24.576 10.41a34.202 34.202 0 0 0 24.746-57.855 514.945 514.945 0 0 0-13.653-13.654c-13.653-12.97-35.157-12.458-48.299 1.024-12.97 13.654-12.629 35.158 1.024 48.299 3.755 3.925 7.68 7.68 11.606 11.776z m123.904 379.563c-17.579-6.827-37.376 1.877-44.203 19.456-2.048 5.12-4.096 10.24-6.315 15.189a34.133 34.133 0 0 0 31.232 47.957c13.142 0 25.6-7.509 31.232-20.309 2.731-5.973 5.12-12.117 7.51-18.09 6.826-17.58-1.878-37.377-19.456-44.203zM952.32 547.84c-0.341-18.773-15.19-33.963-34.816-33.45-18.773 0.34-33.792 16.042-33.45 34.815 0 2.731 0.17 5.462 0 8.534v8.021c-0.513 18.773 14.506 34.475 33.28 34.816h0.853c18.432 0 33.621-14.848 34.133-33.28 0-3.243 0.17-6.315 0.17-9.387 0-3.242-0.17-6.656-0.17-10.069zM779.093 819.541a383.037 383.037 0 0 1-11.776 11.776c-13.653 13.142-13.994 34.646-1.024 48.299 6.656 6.997 15.702 10.41 24.576 10.41 8.534 0 17.067-3.242 23.723-9.557a514.944 514.944 0 0 0 13.653-13.653c12.971-13.653 12.63-35.157-1.024-48.299-13.482-12.97-34.986-12.458-48.128 1.024zM513.195 936.448h-7.68c-18.774 0-34.134 15.36-34.134 34.133s15.36 34.134 34.134 34.134c3.072 0 6.314 0 9.386-0.171 18.774-0.512 33.792-16.043 33.28-34.987s-16.042-34.304-34.986-33.109zM660.82 736.085c13.312-13.312 13.312-34.986 0-48.298L539.99 566.955V366.933c0-18.773-15.36-34.133-34.133-34.133s-34.133 15.36-34.133 34.133v228.352l140.8 140.8a34.014 34.014 0 0 0 48.298 0z"*/}
                                    {/*        fill="#543E3E" p-id="1914"/>*/}
                                    {/*</svg>*/}
                                    <div style={{ paddingLeft: '35px' }} >CCL记录</div>
                                </Link>
                            </Menu.Item>
                        </SubMenu>

                        {/*<hr className="solid"/>*/}
                        {/*<Menu.Item key="6">*/}
                        {/*    <Link to="/Person">*/}
                        {/*        /!*<MDBIcon icon="user-alt" className="mr-3"/>*!/*/}
                        {/*        /!*<svg t="1598333004713" className="icon mr-3" viewBox="0 0 1024 1024" version="1.1"*!/*/}
                        {/*        /!*     xmlns="http://www.w3.org/2000/svg" p-id="1528" width="34" height="34">*!/*/}
                        {/*        /!*    <path*!/*/}
                        {/*        /!*        d="M586.945923 513.581008c55.067176-27.962865 92.91211-85.125773 92.91211-150.998039 0-93.338828-75.937506-169.276335-169.277358-169.276335s-169.275311 75.937506-169.275311 169.276335c0 65.872267 37.844933 123.034151 92.911086 150.998039-95.652524 32.016181-164.778904 122.45496-164.778904 228.743728 0 11.31572 9.17394 20.491707 20.491707 20.491707s20.491707-9.174963 20.491707-20.491707c0-110.36869 89.791026-200.160739 200.160739-200.160739S710.741413 631.956046 710.741413 742.324736c0 11.31572 9.17394 20.491707 20.491707 20.491707s20.491707-9.174963 20.491707-20.491707C751.723803 636.035968 682.598446 545.598212 586.945923 513.581008zM382.287753 362.582969c0-70.742181 57.552787-128.293945 128.292921-128.293945 70.742181 0 128.293945 57.552787 128.293945 128.293945 0 70.741157-57.552787 128.292921-128.293945 128.292921C439.84054 490.876913 382.287753 433.324126 382.287753 362.582969zM827.871087 196.127889C743.498468 111.757317 631.320573 65.290005 512 65.290005S280.500509 111.756293 196.128913 196.127889C111.756293 280.501532 65.291029 392.678404 65.291029 511.998977s46.465265 231.499491 130.837884 315.872111 196.550515 130.837884 315.871087 130.837884 231.498468-46.465265 315.871087-130.837884S958.708971 631.319549 958.708971 511.998977 912.243707 280.500509 827.871087 196.127889zM512 917.726581c-223.718271 0-405.726581-182.007287-405.726581-405.727605 0-223.718271 182.00831-405.726581 405.726581-405.726581s405.726581 182.007287 405.726581 405.726581C917.726581 735.719294 735.718271 917.726581 512 917.726581z"*!/*/}
                        {/*        /!*        p-id="1529"/>*!/*/}
                        {/*        /!*</svg>*!/*/}
                        {/*        <svg aria-hidden="true" className='icon mr-3' style={{width:'34px',height:'34px'}}>*/}
                        {/*            <use xlinkHref="#icongeren"/>*/}
                        {/*        </svg>*/}
                        {/*        个人中心*/}
                        {/*    </Link>*/}
                        {/*</Menu.Item>*/}
                        {/*<hr className="solid"/>*/}
                        {/*<Menu.Item key="7">*/}
                        {/*    <div onClick={this.goWord}>*/}
                        {/*        /!*<MDBIcon icon="cart-plus" className="mr-3"/>*!/*/}
                        {/*        {examIcon}*/}
                        {/*        单词本*/}
                        {/*    </div>*/}
                        {/*</Menu.Item>*/}
                        <hr className="solid" />
                        <Menu.Item key="8">
                            <Link to="/VIP" style={{ textDecoration: "none" }}>
                                {/*<MDBIcon icon="cart-plus" className="mr-3"/>*/}
                                {/*<svg t="1598333862330" className="icon mr-3" viewBox="0 0 1024 1024" version="1.1"*/}
                                {/*     xmlns="http://www.w3.org/2000/svg" p-id="2186" width="35" height="35">*/}
                                {/*    <path*/}
                                {/*        d="M441.6 270.933c-17.067-6.4-34.133 0-42.667 17.067L249.6 642.133 100.267 288c-6.4-17.067-25.6-23.467-42.667-17.067-14.933 6.4-21.333 25.6-14.933 42.667l179.2 422.4c0 2.133 2.133 4.267 4.266 6.4l2.134 2.133 6.4 6.4h2.133c2.133 0 2.133 2.134 4.267 2.134h4.266c2.134 0 6.4 2.133 8.534 2.133 2.133 0 6.4 0 8.533-2.133h4.267c2.133 0 2.133-2.134 4.266-2.134h2.134l6.4-6.4 2.133-2.133c2.133-2.133 2.133-4.267 4.267-6.4l179.2-422.4c0-17.067-6.4-36.267-23.467-42.667z"*/}
                                {/*        fill="#543E3E" p-id="2187"/>*/}
                                {/*    <path*/}
                                {/*        d="M435.2 755.2c-4.267 0-8.533 0-12.8-2.133-17.067-6.4-23.467-25.6-17.067-42.667l179.2-422.4c6.4-17.067 25.6-23.467 42.667-17.067 17.067 6.4 23.467 25.6 17.067 42.667L465.067 736c-6.4 12.8-17.067 19.2-29.867 19.2z"*/}
                                {/*        fill="#FFBB12" p-id="2188"/>*/}
                                {/*    <path*/}
                                {/*        d="M797.867 268.8c-12.8 0-25.6 6.4-29.867 19.2L588.8 710.4c-6.4 17.067 0 34.133 17.067 42.667 4.266 2.133 8.533 2.133 12.8 2.133 12.8 0 23.466-6.4 29.866-19.2l51.2-123.733C729.6 629.333 761.6 640 797.867 640c102.4 0 185.6-83.2 185.6-185.6s-83.2-185.6-185.6-185.6z m0 307.2c-25.6 0-51.2-8.533-72.534-23.467l91.734-217.6c57.6 8.534 102.4 59.734 102.4 119.467 0 68.267-53.334 121.6-121.6 121.6z"*/}
                                {/*        fill="#543E3E" p-id="2189"/>*/}
                                {/*</svg>*/}
                                <svg aria-hidden="true" className='icon mr-3' style={{ width: '35px', height: '35px' }}>
                                    <use xlinkHref="#iconVIP" />
                                </svg>
                                VIP商城
                            </Link>
                        </Menu.Item>
                        <hr className="solid" />
                        <Menu.Item key="9">
                            <Link to="/Free" style={{ textDecoration: "none" }}>
                                <div className='mr-2' style={{ display: 'inline' }}>
                                    <svg aria-hidden="true" className='icon mr-3' style={{ width: '35px', height: '35px' }}>
                                        <use xlinkHref="#iconshoudaoziliao" />
                                    </svg>
                                </div>
                                免费资料
                            </Link>
                        </Menu.Item>
                        <hr className="solid" />
                        <Menu.Item key="10">
                            {/*<MDBIcon icon="question-circle" className="mr-3"/>*/}
                            {/*<svg t="1598333917430" className="icon mr-3" viewBox="0 0 1024 1024" version="1.1"*/}
                            {/*     xmlns="http://www.w3.org/2000/svg" p-id="2317" width="33" height="33">*/}
                            {/*    <path*/}
                            {/*        d="M512 972.8c253.952 0 460.8-206.848 460.8-460.8s-206.848-460.8-460.8-460.8S51.2 258.048 51.2 512s206.848 460.8 460.8 460.8z m20.48-317.44c0 12.288-8.192 20.48-20.48 20.48s-20.48-8.192-20.48-20.48c0-59.392 22.528-102.4 61.44-141.312 8.192-8.192 40.96-36.864 47.104-43.008 16.384-20.48 26.624-45.056 26.624-71.68 0-61.44-51.2-112.64-112.64-112.64s-112.64 51.2-112.64 112.64c0 12.288-8.192 20.48-20.48 20.48s-20.48-8.192-20.48-20.48c0-83.968 69.632-153.6 153.6-153.6s153.6 69.632 153.6 153.6c0 36.864-12.288 69.632-34.816 98.304-6.144 8.192-43.008 38.912-49.152 45.056-34.816 32.768-51.2 65.536-51.2 112.64z m-20.48 163.84c-16.384 0-30.72-14.336-30.72-30.72s14.336-30.72 30.72-30.72 30.72 14.336 30.72 30.72-14.336 30.72-30.72 30.72z"*/}
                            {/*        p-id="2318"/>*/}
                            {/*</svg>*/}
                            <Link to="/Help" style={{ textDecoration: "none" }}>
                                <svg aria-hidden="true" className='icon mr-3' style={{ width: '33px', height: '33px' }}>
                                    <use xlinkHref="#iconbangzhu-yin" />
                                </svg>
                                帮助中心
                            </Link>
                        </Menu.Item>
                        <hr className="solid" />
                        <Menu.Item key="a">
                            <Link to="/About" style={{ textDecoration: "none" }}>
                                <svg aria-hidden="true" className='icon mr-3' style={{ width: '33px', height: '33px' }}>
                                    <use xlinkHref="#iconicon_kefu" />
                                </svg>
                                关于我们
                            </Link>
                        </Menu.Item>
                    </Menu>
                </MDBCard>

            </React.Fragment>
        );
    }
}

const examIcon =
    <svg aria-hidden="true" className='icon' style={{ width: '40px', height: '40px' }}>
        <use xlinkHref="#iconceshi" />
    </svg>;

const vipIcon =
    <svg aria-hidden="true" className='icon' style={{ width: '40px', height: '40px' }}>
        <use xlinkHref="#iconVIP1"></use>
    </svg>;

export default withRouter(props => <Sider {...props} />);