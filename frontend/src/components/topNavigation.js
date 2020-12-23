import React, {Component} from 'react';
import {
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarToggler,
    MDBCollapse,
    MDBNavItem,
    MDBNavLink,
    MDBIcon,
    MDBPopover,
    MDBPopoverBody,
    MDBCard
} from 'mdbreact';
import w1 from '../img/wechat01.png'
import {useLocation} from 'react-router-dom';
import $ from 'jquery';
import './Global';
import axios from "axios";
import {logout, removeLocalUserInfo} from "./Utility";
import {Button, Popover} from "antd";

//顶部导航栏
class TopNavigation extends Component {

    constructor() {
        super();
        this.state = {
            collapse: false,
            isLogin: false
        }
    }

    onClick = () => {
        this.setState({
            collapse: !this.state.collapse,
        });
    }

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
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
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('username');
                    localStorage.removeItem('userID');
                }
                window.location.href = '/';
            }).catch(err => {
                console.log(err);
                if (err.response.message === 'Token has expired') {
                    window.location.href = '/';
                }
                window.location.href = '/';
            });
        } else {
            window.location.href = '/';
        }
        removeLocalUserInfo();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateRadius();
    }

    componentDidMount() {
        let token = localStorage.getItem('username');
        if (token !== null) {
            this.setState({isLogin: true});
        } else {
            this.setState({isLogin: false});
        }
        this.updateRadius();
    }

    updateRadius = () => {
        const path = document.location.pathname.toLowerCase();
        let regex = /ieltsexam|cclexam/;

        //console.log(path);
        if (regex.test(path)) {
            document.getElementById('navbar').style.borderRadius = '0px';
        } else {
            document.getElementById('navbar').style.borderRadius = '20px';
        }
    }

    // componentDidMount() {
    //     const path = document.location.pathname;
    //     if(!(path.toLowerCase().includes('test'))){
    //         $('#navbar').css('padding-left','270px');
    //     }
    // }

    render() {
        return (
            <MDBNavbar id='navbar' style={{fontSize: '18pt', backgroundColor: global.config.amber}} dark expand="md"
                       scrolling>
                <MDBNavbarBrand>
                    <div style={{color: 'white', fontSize: '18pt'}}>迅达英语模考系统</div>
                </MDBNavbarBrand>
                {/*<MDBNavbarToggler onClick = { this.onClick } />*/}
                <MDBCollapse isOpen={this.state.collapse} navbar>
                    {/*<MDBNavbarNav left>*/}
                    {/*    <MDBNavItem active className='mr-2'>*/}
                    {/*        <a rel="noopener noreferrer" className="nav-link Ripple-parent" href="https://mdbootstrap.com/docs/react/getting-started/download/" target="_blank"><strong>链接3</strong></a>*/}
                    {/*    </MDBNavItem>*/}
                    {/*    <MDBNavItem active className='mr-2'>*/}
                    {/*        <a rel="noopener noreferrer" className="nav-link Ripple-parent" href="https://mdbootstrap.com/bootstrap-tutorial/" target="_blank"><strong>链接4</strong></a>*/}
                    {/*    </MDBNavItem>*/}
                    {/*</MDBNavbarNav>*/}
                    <MDBNavbarNav right>
                        {/*<MDBPopover*/}
                        {/*    placement="bottom"*/}
                        {/*    popover*/}
                        {/*    domElement*/}
                        {/*>*/}
                        {/*    <span><MDBNavItem>*/}
                        {/*    <a className="nav-link navbar-link" rel="noopener noreferrer" target="_blank" style={textColor}><MDBIcon icon="comments" className="mr-3"/>微信</a>*/}
                        {/*    </MDBNavItem></span>*/}
                        {/*    <span>*/}
                        {/*        <MDBPopoverBody>*/}
                        {/*            <img src={w1} style={{height:'170px',width:'auto'}} />*/}
                        {/*        </MDBPopoverBody>*/}
                        {/*    </span>*/}
                        {/*</MDBPopover>*/}
                        <Popover placement="bottomRight" content={() => {
                            return (
                                <img src={w1} style={{height: '170px', width: 'auto'}}/>
                            )
                        }} trigger="click">
                            <MDBNavItem active className='ml-3 p-2' style={{cursor:'pointer',color:'white'}}>
                                {/*<MDBIcon icon="comments" className="mr-3"/>微信*/}
                                {/*<svg t="1599272930857" className="icon" fill='white' viewBox="0 0 1024 1024" version="1.1"*/}
                                {/*     xmlns="http://www.w3.org/2000/svg" p-id="1393" width="40" height="40">*/}
                                {/*    <path*/}
                                {/*        d="M832 426.666667h-1.066667C819.84 260.266667 681.173333 128 512 128S204.16 260.266667 193.066667 426.666667h-2.133334C156.16 426.666667 128 454.826667 128 489.6V618.666667c0 35.2 28.8 64 64 64h42.666667c35.2 0 64-28.8 64-64v-128a63.786667 63.786667 0 0 0-62.933334-63.786667C246.613333 283.733333 366.293333 170.666667 512 170.666667s265.386667 113.066667 276.266667 256.213333A63.786667 63.786667 0 0 0 725.333333 490.666667v128c0 26.026667 15.786667 48.426667 38.186667 58.453333-11.093333 34.346667-46.08 104.533333-148.906667 111.573333C605.44 764.16 582.186667 746.666667 554.666667 746.666667h-85.333334c-35.2 0-64 28.8-64 64s28.8 64 64 64h85.333334c28.16 0 51.626667-18.346667 60.373333-43.52 135.466667-8.106667 178.773333-106.88 191.146667-148.48H832c35.2 0 64-28.8 64-64v-128c0-35.2-28.8-64-64-64z m-576 64v128c0 11.733333-9.6 21.333333-21.333333 21.333333H192c-11.733333 0-21.333333-9.6-21.333333-21.333333v-129.066667c0-11.093333 9.173333-20.266667 20.266666-20.266667H234.666667c11.733333 0 21.333333 9.6 21.333333 21.333334z m298.666667 341.333333h-85.333334c-11.733333 0-21.333333-9.6-21.333333-21.333333s9.6-21.333333 21.333333-21.333334h85.333334c11.733333 0 21.333333 9.6 21.333333 21.333334s-9.6 21.333333-21.333333 21.333333z m298.666666-213.333333c0 11.733333-9.6 21.333333-21.333333 21.333333h-42.666667c-11.733333 0-21.333333-9.6-21.333333-21.333333v-128c0-11.733333 9.6-21.333333 21.333333-21.333334h42.666667c11.733333 0 21.333333 9.6 21.333333 21.333334v128z"*/}
                                {/*        p-id="1394"/>*/}
                                {/*</svg>*/}
                                <svg aria-hidden="true" className='icon' fill='white' style={{width:'40px',height:'40px'}}>
                                    <use xlinkHref="#iconicon_kefu"/>
                                </svg>
                            </MDBNavItem>
                        </Popover>
                        {/*<MDBNavItem active className='ml-3'>*/}
                        {/*    <MDBNavLink to="#" style={textColor}><MDBIcon icon="question-circle"*/}
                        {/*                                                  className="mr-3"/>帮助</MDBNavLink>*/}
                        {/*</MDBNavItem>*/}
                        <MDBNavItem className='ml-4 mr-2' onClick={this.log}>

                            <MDBNavLink to="#" style={textColor}>
                                {/*<svg t="1599273083182" className="icon" fill='white' viewBox="0 0 1024 1024" version="1.1"*/}
                                {/*     xmlns="http://www.w3.org/2000/svg" p-id="1522" width="30" height="30">*/}
                                {/*    <path*/}
                                {/*        d="M640 1024H128c-70.656 0-128-57.344-128-128V128C0 57.344 57.344 0 128 0h512c70.656 0 128 57.344 128 128v128c0 14.336-11.264 25.6-25.6 25.6s-25.6-11.264-25.6-25.6V128c0-42.496-34.304-76.8-76.8-76.8H128c-42.496 0-76.8 34.304-76.8 76.8v768c0 42.496 34.304 76.8 76.8 76.8h512c42.496 0 76.8-34.304 76.8-76.8v-128c0-14.336 11.264-25.6 25.6-25.6s25.6 11.264 25.6 25.6v128c0 70.656-57.344 128-128 128z"*/}
                                {/*        fill="" p-id="1523"/>*/}
                                {/*    <path*/}
                                {/*        d="M998.4 537.6H435.2c-14.336 0-25.6-11.264-25.6-25.6s11.264-25.6 25.6-25.6h563.2c14.336 0 25.6 11.264 25.6 25.6s-11.264 25.6-25.6 25.6z"*/}
                                {/*        fill="" p-id="1524"/>*/}
                                {/*    <path*/}
                                {/*        d="M998.4 537.6c-6.656 0-13.312-2.56-17.92-7.68l-153.6-153.6c-10.24-10.24-10.24-26.112 0-36.352s26.112-10.24 36.352 0l153.6 153.6c10.24 10.24 10.24 26.112 0 36.352-5.12 5.12-11.776 7.68-18.432 7.68z"*/}
                                {/*        fill="" p-id="1525"/>*/}
                                {/*    <path*/}
                                {/*        d="M844.8 691.2c-6.656 0-13.312-2.56-17.92-7.68-10.24-10.24-10.24-26.112 0-36.352l153.6-153.6c10.24-10.24 26.112-10.24 36.352 0s10.24 26.112 0 36.352l-153.6 153.6c-5.12 5.12-11.776 7.68-18.432 7.68z"*/}
                                {/*        fill="" p-id="1526"/>*/}
                                {/*</svg>*/}
                                <svg aria-hidden="true" className='icon' fill='white' style={{width:'30px',height:'30px'}}>
                                    <use xlinkHref="#icontuichu"/>
                                </svg>
                                {/*<MDBIcon icon="sign-out-alt" className="mr-3"/>*/}
                                {/*{*/}
                                {/*    this.state.isLogin ? '退出登录' : '登录'*/}
                                {/*}*/}
                            </MDBNavLink>
                        </MDBNavItem>
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBNavbar>

        );
    }
}

const textColor = {
    color: 'white'
}

export default TopNavigation;