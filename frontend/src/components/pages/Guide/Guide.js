import React, {Component} from 'react';
import {Button, Row, Col, Space, Modal, Popover} from "antd";
import {MDBCard, MDBCardBody, MDBCardHeader, MDBIcon} from "mdbreact";
import axios from "axios";
import r from '../../../img/Register.png';
import l from '../../../img/Login.png';
import qr from '../../../img/wechat01.png';
import {logout} from "../../Utility";

class Guide extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emailLogin: '',
            passwordLogin: '',
            imgCodeLogin: '',
            username: '',
            password: '',
            password2: '',
            country: "中国",
            city: '上海',
            email: '',
            emailCode: '',
            imgCode: '',
            isRepeat: false,
            showLogin: true,
            validEmail: false,
            sendingEmail: false,
            loading: false,
            showPanel: false,
            freeLoginLoading: false,
            thirdContent:''
        };
        this.lastEmail = '';
        this.lastSend = '';
    }


    submitRegister = event => {

        event.preventDefault();

        if (this.state.loading) {
            return;
        }

        //event.target.className += " was-validated";
        //let idArr = ['username','password','country','city','email','emailCode','imgCode'];
        let idArr = ['username', 'password', 'password2', 'email', 'emailCode', 'imgCode'];
        //let regArr = [/^[a-zA-Z0-9_-]{4,16}$/, /[\S]{6,16}/, /.*/, /.*/, /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, /.*/, /.*/];
        let regArr = [/^[a-zA-Z0-9_-]{4,16}$/, /[\S]{6,16}/, /[\S]{6,16}/, /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, /.*/, /.*/, /.*/];
        let validArr = [];
        let elementArr = [];


        for (let i = 0; i < idArr.length; i++) {
            validArr.push(false);
            elementArr.push(document.getElementById(idArr[i]));
        }

        for (let i = 0; i < idArr.length; i++) {
            let value = this.state[idArr[i]];
            console.log(value);
            if (value === "") {
                elementArr[i].classList.add('is-invalid');
                elementArr[i].classList.remove('is-valid');
            } else {
                if (regArr[i].test(value)) {
                    elementArr[i].classList.add('is-valid');
                    elementArr[i].classList.remove('is-invalid');

                    validArr[i] = true;
                } else {
                    elementArr[i].classList.add('is-invalid');
                    elementArr[i].classList.remove('is-valid');

                }
            }
        }

        if (this.state.isRepeat) {
            validArr[3] = false;
            elementArr[3].classList.add('is-invalid');
            elementArr[3].classList.remove('is-valid');
        }

        if (this.state.password !== this.state.password2) {
            validArr[2] = false;
            elementArr[2].classList.add('is-invalid');
            elementArr[2].classList.remove('is-valid');
        }

        if (validArr.every((val, i, arr) => val === true)) {
            console.log('all pass');

            let formData = new FormData();
            formData.append('username', this.state.username);
            formData.append('password', this.state.password);
            formData.append('country', this.state.country);
            formData.append('city', this.state.city);
            formData.append('email', this.state.email);
            formData.append('verifycode', this.state.emailCode);
            formData.append('imgcode', this.state.imgCode);
            formData.append('key', JSON.parse(localStorage.getItem('imgKey')));

            //console.log(JSON.parse(localStorage.getItem('imgKey')));

            this.setState({loading: true});

            axios.post(global.config.url + `Main/SignUpEmail`, formData).then(res => {
                console.log(res);
                if (res.data.data !== null) {
                    console.log('注册成功');
                    localStorage.removeItem('imgKey');
                    localStorage.setItem('access_token', res.data.data.access_token);
                    localStorage.setItem('userID', res.data.data.user_ID);
                    localStorage.setItem('username', res.data.data.username);
                    window.location.href = '/Home';
                }
                this.setState({loading: false});
            }).catch(err => {
                console.log(err.response);
                if (err.response.data.msg === 'email verify code error') {
                    let emailCode = document.getElementById('emailCode');
                    if (emailCode !== null) {
                        emailCode.classList.add('is-invalid');
                        emailCode.classList.remove('is-valid');
                    }
                } else if (err.response.data.msg === 'register error') {
                    let {confirm} = Modal;
                    confirm({
                        title: '注册失败，请重试',
                        cancelButtonProps: {style: {display: 'none'}},
                        okText: '确定',
                        centered: true,
                        onOk: () => {
                            window.location.href = '/';
                        }
                    })
                } else if (err.response.data.msg === 'img code error') {
                    let imgCode = document.getElementById('imgCode');
                    if (imgCode !== null) {
                        imgCode.classList.add('is-invalid');
                        imgCode.classList.remove('is-valid');
                    }
                }
                this.refreshImg();
                this.setState({loading: false});

            });


            // axios({
            //     method: 'post',
            //     url:global.config.url + `Main/SignUpEmail`,
            //     data: formData
            // }).then(res => {
            //     console.log(res);
            //     if(res.data.msg==='succeed'){
            //         console.log('注册成功');
            //     }
            // }).catch(err=>{
            //     console.log(err);
            // });

        }

    };


    submitLogin = event => {

        event.preventDefault();

        if (this.state.loading) {
            return;
        }

        //event.target.className += " was-validated";
        //let idArr = ['username','password','country','city','email','emailCode','imgCode'];
        let idArr = ['emailLogin', 'passwordLogin', 'imgCodeLogin'];
        //let regArr = [/^[a-zA-Z0-9_-]{4,16}$/, /[\S]{6,16}/, /.*/, /.*/, /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, /.*/, /.*/];
        let regArr = [/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, /[\S]{6,16}/, /.*/];
        let validArr = [];
        let elementArr = [];

        for (let i = 0; i < idArr.length; i++) {
            validArr.push(false);
            elementArr.push(document.getElementById(idArr[i]));
        }

        for (let i = 0; i < idArr.length; i++) {
            let value = this.state[idArr[i]];
            console.log(value);
            if (value === "") {
                elementArr[i].classList.add('is-invalid');
                elementArr[i].classList.remove('is-valid');
            } else {
                if (regArr[i].test(value)) {
                    elementArr[i].classList.add('is-valid');
                    elementArr[i].classList.remove('is-invalid');
                    validArr[i] = true;
                } else {
                    elementArr[i].classList.add('is-invalid');
                    elementArr[i].classList.remove('is-valid');

                }
            }
        }


        if (validArr.every((val, i, arr) => val === true)) {
            console.log('login all pass');

            let formData = new FormData();
            formData.append('email', this.state.emailLogin);
            formData.append('password', this.state.passwordLogin);
            formData.append('imgcode', this.state.imgCodeLogin);
            formData.append('key', JSON.parse(localStorage.getItem('imgKey')));

            //console.log(JSON.parse(localStorage.getItem('imgKey')));
            this.setState({loading: true});

            axios.post(global.config.url + `Main/LoginEmail`, formData).then(res => {
                console.log(res);
                if (res.data.code === '5002') {
                    this.refreshImg();
                    let input = document.getElementById('emailLogin');
                    if (input !== null) {
                        input.classList.remove('is-invalid');
                        input.classList.remove('is-valid');
                    }
                    input = document.getElementById('passwordLogin');
                    if (input !== null) {
                        input.classList.remove('is-invalid');
                        input.classList.remove('is-valid');
                    }
                    input = document.getElementById('imgCodeLogin');
                    if (input !== null) {
                        input.classList.remove('is-invalid');
                        input.classList.remove('is-valid');
                    }
                    let {confirm} = Modal;
                    confirm({
                        title: '邮箱/密码错误或不存在',
                        cancelButtonProps: {style: {display: 'none'}},
                        okText: '确定',
                        centered: true
                    })
                } else if (res.data.data !== null) {
                    console.log('登录成功');
                    localStorage.removeItem('imgKey');
                    localStorage.setItem('access_token', res.data.data.access_token);
                    localStorage.setItem('userID', res.data.data.user_ID);
                    localStorage.setItem('username', res.data.data.username);
                    if (res.data.data.role_ID == 2) {
                        window.location.href = '/Home';
                    } else if (res.data.data.role_ID == 1) {
                        window.location.href = '/TMarkinglist';
                    }
                }
                this.setState({loading: false});
            }).catch(err => {
                console.log(err.response);
                if (err.response.data.msg === 'image verify code error') {
                    this.refreshImg();
                    let imgCodeLogin = document.getElementById('imgCodeLogin');
                    if (imgCodeLogin !== null) {
                        imgCodeLogin.classList.add('is-invalid');
                        imgCodeLogin.classList.remove('is-valid');
                    }
                }
                this.setState({loading: false});
            })


            // axios({
            //     method: 'post',
            //     url:global.config.url + `Main/LoginEmail`,
            //     data: formData
            // }).then(res => {
            //     console.log(res);
            //     if(res.data.msg==='succeed'){
            //         console.log('登录成功');
            //     }
            // }).catch(err=>{
            //     console.log(err.response);
            // });

        }

    };


    changeHandler = event => {
        this.setState({[event.target.name]: event.target.value});

    };

    refreshImg = () => {
        console.log('refreshing img');

        axios.get(global.config.url + `Main/GetImageVerifyCode`).then(res => {
            console.log(res.data);
            if (document.getElementById('img') !== null) {
                document.getElementById('img').src = res.data.data.img;
                localStorage.setItem('imgKey', JSON.stringify(res.data.data.key));
            }
        });

    }

    getEmailCode = () => {
        console.log('getting email code');
        if (document.getElementById('email') !== null) {
            let email = document.getElementById('email').value;
            if (/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email)) {

                let formData = new FormData();
                formData.append('email', email);

                let {confirm} = Modal;

                confirm({
                    title: '验证邮件已发送到' + email + '，请注意查收',
                    content: 'QQ邮箱请检查垃圾箱',
                    cancelButtonProps: {style: {display: 'none'}},
                    okText: '确定',
                    centered: true
                })

                this.setState({sendingEmail: true});
                axios({
                    method: 'post',
                    url: global.config.url + `Main/SendVerifyCode`,
                    data: formData
                }).then(res => {
                    console.log(res);
                    if (res.data.msg === 'succeed') {
                        this.setState({sendingEmail: false});
                    } else {
                        this.setState({sendingEmail: false});
                        confirm({
                            title: '邮件发送失败，请再次发送或更换邮箱',
                            // content: '不建议使用QQ邮箱',
                            cancelButtonProps: {style: {display: 'none'}},
                            okText: '确定',
                            centered: true
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    this.setState({sendingEmail: false});
                    confirm({
                        title: '邮件发送失败，请再次发送或更换邮箱',
                        // content: '不建议使用QQ邮箱',
                        cancelButtonProps: {style: {display: 'none'}},
                        okText: '确定',
                        centered: true
                    });
                });

                // axios.get(global.config.url + `Main/SendVerifyCode`).then(res => {
                //     console.log(res.data);
                //     document.getElementById('img').src = res.data.data.img;
                //     localStorage.setItem('imgKey', JSON.stringify(res.data.data.key));
                // });


            }
        }


    }

    componentWillUnmount() {
        clearInterval(this.timer);
        // document.removeEventListener("click", this.checkClick);
    }

    componentDidMount() {
        // document.addEventListener("click", this.checkClick);
        this.refreshImg();

        //邮箱格式正确且和上次检查的邮箱不一样，每3秒检查是否重复
        this.timer = setInterval(() => {
            if (!this.state.showLogin) {
                let email = document.getElementById('email').value;
                if (/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email)) {
                    this.setState({validEmail: true});
                    if (email !== this.lastEmail) {
                        this.lastEmail = email;

                        console.log('checking email');
                        axios.get(global.config.url + `Main/ExistEmail?email=` + email).then(res => {
                            console.log(res.data);
                            if (res.data.msg === 'succeed') {
                                this.setState({isRepeat: false})
                            }
                        }).catch(err => {
                            console.log(err);
                            console.log('email repeated');
                            this.setState({isRepeat: true});
                        })

                    }
                } else {
                    this.setState({validEmail: false});
                }
            }
        }, 3000);

    }

    login = () => {

        let token = localStorage.getItem('access_token');
        let userID = localStorage.getItem('userID');
        let username = localStorage.getItem('username');

        if (!(token === null || userID === null || username === null)) {

            this.setState({freeLoginLoading: true});
            axios.get(global.config.url + `GetLoginStatus`, {
                headers: {Authorization: `Bearer ${token}`}
            }).then(res => {
                console.log(res);
                //更新Token
                if (typeof res.headers.authorization !== 'undefined') {
                    console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                    localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
                }
                if (res.data.msg === 'succeed') {
                    console.log('登陆成功');
                    localStorage.setItem('userID', res.data.data.user_ID);
                    localStorage.setItem('username', res.data.data.username);
                    if (res.data.data.role_ID === 2) {
                        window.location.href = '/Home';
                    } else if (res.data.data.role_ID === 1) {
                        window.location.href = '/TMarkinglist';
                    }
                } else {
                    this.showLoginPanel();
                }
            }).catch(err => {
                console.log(err);
                console.log(err.response);
                //Token过期
                if (typeof err.response !== 'undefined' && err.response.status === 401 && err.response.data.message === 'Token has expired and can no longer be refreshed') {
                    console.log('Token过期');
                }
                this.showLoginPanel();
            })
        } else {
            this.showLoginPanel();
        }
    }

    showLoginPanel = () => {
        this.setState({
            showLogin: true,
            showPanel: true
        }, () => {
            this.refreshImg();
            document.getElementById('panelCol').classList.add('moveColLeft');
            document.getElementById('loginPanel').classList.add('showPanel');
        });
    }

    register = () => {
        this.setState({
            showLogin: false,
            showPanel: true
        }, () => {
            this.refreshImg();
            document.getElementById('panelCol').classList.add('moveColLeft');
            document.getElementById('registerPanel').classList.add('showPanel');
        });
    }

    showThird = (id) => {
        console.log(id);
        let content = '';
        if(id===1){
            content = '此处应有微信二维码';
        }else if(id===2){
            content = '此处应有QQ二维码';
        }else if(id===3){
            content = '此处应有微博二维码';
        }
        this.setState({
            thirdContent: content
        });

        let third = document.getElementById('thirdPanel');
        // third.classList.remove('moveThirdRight');
        //third.classList.add('moveThirdLeft');

        third.classList.remove('hideThird');
        third.classList.add('showThird');
        third.style.removeProperty('display');
        third.style.marginLeft = '-405px';
        // third.addEventListener('focus',(e=>{
        //     // third.classList.remove('moveThirdLeft');
        //     // third.classList.add('moveThirdRight');
        //     console.log('blue');
        // }));

    }

    hideThird = () =>{
        let third = document.getElementById('thirdPanel');
        third.classList.remove('showThird');
        third.style.display = 'none';
    }

    render() {
        return (

            <div className='p-5' style={{flex: '1', height: '100vh'}}>
                <Row align='middle' style={{backgroundColor: 'rgba(0, 0, 0, 0.1)', height: '100%'}}>
                    <Col flex='1 1 400px' style={{flexDirection: 'column'}}
                         className="d-flex justify-content-center align-items-center">引导页 (未完成)<br/><br/>
                        <div>
                            <Button type="primary" href='/Home'>主页</Button>
                            <Button type="primary" style={{marginLeft: '15px'}} onClick={this.login}>登录</Button>
                            <Button type="primary" style={{marginLeft: '15px'}} onClick={this.register}>注册</Button>
                        </div>
                    </Col>
                    <Col id='panelCol' flex='400px' style={{marginLeft: '-450px', marginRight: '50px'}}>
                        {
                            this.state.showPanel
                                ?
                                this.state.showLogin
                                    ?
                                    <React.Fragment>
                                        <MDBCard id='loginPanel' style={{width:'400px'}}>
                                            <MDBCardHeader style={cardHeader}>
                                                <Row justify='space-between' align='middle'>
                                                    <Col>登录</Col>
                                                    <Col><img style={{width: '50px', cursor: 'pointer'}} src={r}
                                                              onClick={() => this.setState({showLogin: false}, () => this.refreshImg())}/></Col>
                                                </Row>
                                            </MDBCardHeader>
                                            <div className="card-body d-flex justify-content-center">

                                                <form
                                                    className="needs-validation"
                                                    onSubmit={this.submitLogin}
                                                    noValidate
                                                    key={1}
                                                >
                                                    <div className='mb-3'>
                                                        <input
                                                            value={this.state.emailLogin}
                                                            onChange={this.changeHandler}
                                                            type="email"
                                                            id="emailLogin"
                                                            className="form-control"
                                                            name="emailLogin"
                                                            placeholder="邮箱"
                                                            style={inputWidth}
                                                            required
                                                        />
                                                        <div className="invalid-feedback">
                                                            请提供正确邮箱
                                                        </div>
                                                        {/*<div className="valid-feedback">Looks good!</div>*/}
                                                    </div>
                                                    <div className='mb-3'>
                                                        <input
                                                            value={this.state.passwordLogin}
                                                            name="passwordLogin"
                                                            onChange={this.changeHandler}
                                                            type="password"
                                                            id="passwordLogin"
                                                            className="form-control"
                                                            placeholder="密码"
                                                            required
                                                        />
                                                        <div className="invalid-feedback">
                                                            密码由6到16位非空格字符组成
                                                        </div>
                                                    </div>


                                                    <div className='mb-3'>
                                                        <br/>
                                                        <input
                                                            value={this.state.imgCodeLogin}
                                                            onChange={this.changeHandler}
                                                            type="text"
                                                            id="imgCodeLogin"
                                                            className="form-control"
                                                            name="imgCodeLogin"
                                                            placeholder="图形验证码"
                                                            style={{width: '230px', display: 'inline'}}
                                                            autoComplete='off'
                                                            required
                                                        />
                                                        {/*<Button type="primary" style={{display:'inline',marginLeft:'20px'}}>获取验证码</Button>*/}
                                                        <img id='img' onClick={this.refreshImg}
                                                             style={{
                                                                 maxWidth: '100px',
                                                                 marginLeft: '20px',
                                                                 cursor: 'pointer'
                                                             }}/>
                                                        <div className="invalid-feedback">
                                                            请提供正确图形验证码
                                                        </div>
                                                        {/*<div className="valid-feedback">Looks good!</div>*/}
                                                    </div>
                                                    {
                                                        this.state.loading ?
                                                            <div className="spinner-border" role="status" style={{float:'left'}}>
                                                                <span className="sr-only">Loading...</span>
                                                            </div>
                                                            : ''
                                                    }
                                                    {/*<div style={{float:'left',cursor:'pointer'}} onClick={()=>this.setState({showLogin:false})}>注册</div>*/}
                                                    <Button type="primary" htmlType="submit" style={{float: 'right'}}>
                                                        登录
                                                    </Button>
                                                    <hr className="solid" style={{marginTop: '70px'}}/>
                                                    <Row justify="space-around">
                                                        <Col>
                                                            {/*<Popover placement="leftBottom" content={this.state.content} trigger="click">*/}
                                                            <svg t="1597897941471" className="icon"
                                                                 viewBox="0 0 1024 1024"
                                                                 version="1.1" xmlns="http://www.w3.org/2000/svg"
                                                                 p-id="1523" width="40" height="40"
                                                                 style={{cursor: 'pointer'}}
                                                                 onClick={() => this.showThird(1)}>
                                                                <path
                                                                    d="M544.059897 959.266898h-64.949141c-228.633593 0-415.697442-187.063849-415.697442-415.697442v-64.949141c0-228.633593 187.063849-415.697442 415.697442-415.697442h64.949141c228.633593 0 415.697442 187.063849 415.697442 415.697442v64.949141C959.756315 772.203049 772.692466 959.266898 544.059897 959.266898z"
                                                                    fill="#2DC100" p-id="1524"/>
                                                                <path
                                                                    d="M618.871102 424.812069c-52.6789 2.760395-98.49572 18.754507-135.696546 54.89766-37.587854 36.50356-54.743053 81.262707-50.047514 136.728622-20.586238-2.580191-39.34177-5.366183-58.19969-6.965492-6.552866-0.516038-14.292415 0.258019-19.786584 3.353224-18.316285 10.318716-35.858512 22.030941-56.703793 35.085479 3.818068-17.284208 6.294847-32.505287 10.680148-47.029101 3.173021-10.732366 1.702721-16.691379-8.152175-23.65687-63.256659-44.73355-89.905323-111.652647-69.963108-180.584703 18.470891-63.720479 63.798295-102.417201 125.376806-122.539619 84.100917-27.500536 178.52055 0.567232 229.651335 67.409538 18.733006 24.012159 30.112467 52.935895 32.763306 83.275665L618.871102 424.812069zM737.231222 753.7854c-16.691379-7.429312-31.989249-18.574304-48.241381-20.302622-16.252132-1.702721-33.330539 7.687331-50.305534 9.416673-51.724639 5.288368-98.0319-9.132033-136.263778-44.526725-72.646712-67.331723-62.275777-170.522981 21.799542-225.730878 74.736462-49.015438 184.324956-32.659894 237.003856 35.342474 45.971427 59.386373 40.55405 138.198922-15.55589 188.066232-16.252132 14.447022-22.108756 26.313853-11.686627 45.32638 1.909546 3.508855 2.140944 7.94535 3.250836 12.382869L737.231222 753.7854zM376.397651 403.348361c0.516038-12.640888-10.422129-23.991681-23.373254-24.353112-13.025869-0.533444-24.017278 9.593805-24.550722 22.619674-0.003072 0.078839-0.006143 0.158702-0.008191 0.237542-0.512967 12.869215 9.503704 23.719327 22.372918 24.232294 0.238565 0.009215 0.477131 0.015358 0.715696 0.017406C364.663926 426.584415 375.730078 416.448974 376.397651 403.348361zM502.909946 378.995249c-13.00232 0.258019-23.991681 11.350793-23.733662 23.99168 0.280545 13.104708 11.131681 23.50124 24.23639 23.220696 0.038908-0.001024 0.077815-0.002048 0.116723-0.003072 12.865119 0.104436 23.379398-10.239877 23.483834-23.104996 0.002048-0.278497 0-0.556994-0.008192-0.835491-0.109556-12.96546-10.708817-23.386565-23.673252-23.277009C503.191515 378.989105 503.050218 378.991153 502.909946 378.995249zM547.334283 569.640648c10.628954 0 19.348361-8.332379 19.760986-18.832323 0.384981-10.920761-8.15627-20.086582-19.077031-20.471563-0.176108-0.006143-0.352217-0.010239-0.529349-0.011262-11.041579 0.069624-19.937095 9.076743-19.867471 20.118322 0.001024 0.08703 0.002048 0.175084 0.003072 0.262115C528.092406 561.263219 536.764714 569.595597 547.334283 569.640648zM669.743869 530.351097c-10.452845 0.086006-19.011503 8.337498-19.477371 18.781128-0.570304 10.670933 7.617707 19.782488 18.28864 20.352793 0.310237 0.016382 0.620475 0.025597 0.930712 0.027645 10.654551 0 19.090342-8.07436 19.47737-18.703314 0.528325-10.772298-7.776409-19.934023-18.548706-20.462348-0.223207-0.011263-0.447438-0.01843-0.670645-0.021501V530.351097z"
                                                                    fill="#FFFFFF" p-id="1525"/>
                                                            </svg>
                                                            {/*</Popover>*/}
                                                        </Col>
                                                        <Col>
                                                            <svg t="1597897999097" className="icon"
                                                                 viewBox="0 0 1024 1024"
                                                                 version="1.1" xmlns="http://www.w3.org/2000/svg"
                                                                 p-id="1782" width="40" height="40"
                                                                 style={{cursor: 'pointer'}}
                                                                 onClick={() => this.showThird(2)}>
                                                                <path
                                                                    d="M511.999 1024a512 512 0 1 0-512-512 512 512 0 0 0 512 512z"
                                                                    fill="#23A0F0" p-id="1783"/>
                                                                <path
                                                                    d="M735.765 604.422c-3.55-49.47-36.192-90.932-55.09-112.47a70.383 70.383 0 0 0-15.577-67.003v-1.718c0-97.235-68.028-167.254-153.35-167.55-85.333 0.342-153.35 70.315-153.35 167.55v1.718a70.383 70.383 0 0 0-15.576 67.003c-18.898 21.413-51.54 62.874-55.09 112.47a75.39 75.39 0 0 0 7.554 40.425c7.555 10.308 28.513-2.06 43.406-34.93a210.33 210.33 0 0 0 35.499 67.914c-36.307 8.477-46.729 44.897-34.475 64.853 8.59 14.086 28.445 25.657 62.419 25.657 60.473 0 87.267-16.611 99.18-28.057a16.259 16.259 0 0 1 20.844 0c11.913 11.57 38.684 28.057 99.18 28.057 34.02 0 53.715-11.57 62.419-25.657 12.253-19.922 1.831-56.342-34.475-64.853a211.627 211.627 0 0 0 35.499-67.914c14.893 32.87 35.85 45.124 43.406 34.93a76.493 76.493 0 0 0 7.577-40.425z"
                                                                    fill="#FFFFFF" p-id="1784"/>
                                                            </svg>
                                                        </Col>
                                                        <Col>
                                                            <svg t="1597897981021" className="icon"
                                                                 viewBox="0 0 1024 1024"
                                                                 version="1.1" xmlns="http://www.w3.org/2000/svg"
                                                                 p-id="1653" width="40" height="40"
                                                                 style={{cursor: 'pointer'}}
                                                                 onClick={() => this.showThird(3)}>
                                                                <path
                                                                    d="M512 1024C229.2224 1024 0 794.7776 0 512 0 229.2224 229.2224 0 512 0c282.7776 0 512 229.2224 512 512 0 282.7776-229.2224 512-512 512z m175.684267-547.072c-9.0112-2.781867-15.2576-4.625067-10.478934-16.810667 10.24-26.333867 11.332267-49.1008 0.187734-65.314133-20.8896-30.464-77.9776-28.791467-143.428267-0.8192 0 0-20.5312 9.181867-15.274667-7.458133 10.069333-33.041067 8.533333-60.7232-7.1168-76.6976-35.498667-36.266667-129.9456 1.365333-210.926933 84.002133C240.0256 455.765333 204.8 521.386667 204.8 578.082133c0 108.544 136.328533 174.506667 269.704533 174.506667 174.830933 0 291.140267-103.68 291.140267-186.026667 0-49.7152-41.045333-77.960533-77.960533-89.634133z m-212.821334 236.765867c-106.410667 10.717867-198.2976-38.365867-205.2096-109.704534-6.912-71.304533 73.7792-137.8304 180.189867-148.565333 106.4448-10.734933 198.314667 38.3488 205.2096 109.653333 6.894933 71.338667-73.7792 137.898667-180.189867 148.616534z m5.802667-198.007467c-50.875733-13.909333-108.3904 12.6976-130.491733 59.8016-22.528 48.008533-0.733867 101.2736 50.653866 118.7328 53.248 18.005333 116.036267-9.6256 137.847467-61.3888 21.538133-50.705067-5.341867-102.8608-58.026667-117.1456z m-4.778667 76.680533c-3.720533 6.7072-11.997867 9.9328-18.466133 7.168-6.382933-2.781867-8.379733-10.274133-4.7616-16.896 3.7376-6.5536 11.6736-9.728 18.0224-7.099733 6.4512 2.491733 8.789333 10.069333 5.205333 16.827733zM441.821867 638.293333c-10.359467 17.288533-32.477867 24.8832-49.152 16.896-16.469333-7.850667-21.316267-27.989333-10.973867-44.885333 10.205867-16.7936 31.624533-24.32 48.1792-17.032533 16.759467 7.509333 22.101333 27.4944 11.946667 45.021866z m363.9296-354.816c-40.277333-46.592-99.669333-64.375467-154.487467-52.224h-0.017067c-12.680533 2.850133-20.770133 15.872-18.056533 29.098667 2.696533 13.226667 15.172267 21.7088 27.8528 18.8416 39.0144-8.618667 81.220267 4.027733 109.858133 37.12 28.586667 33.1264 36.352 78.267733 24.1152 117.845333v0.017067c-3.9936 12.9024 2.747733 26.6752 15.121067 30.839467 12.305067 4.181333 25.565867-2.884267 29.5424-15.701334v-0.136533c17.237333-55.671467 6.331733-119.125333-33.928533-165.700267z m-59.528534 67.293867c-20.992-22.1184-51.968-30.532267-80.571733-24.746667-11.707733 2.3552-19.165867 13.294933-16.622933 24.405334 2.474667 11.093333 13.994667 18.210133 25.617066 15.803733v0.017067c13.994667-2.816 29.149867 1.297067 39.424 12.066133 10.274133 10.820267 13.038933 25.582933 8.618667 38.5024h0.017067c-3.669333 10.8032 2.56 22.391467 13.909333 25.9072 11.400533 3.447467 23.586133-2.440533 27.255467-13.2608 8.994133-26.453333 3.3792-56.558933-17.646934-78.677333z"
                                                                    fill="#E6172D" p-id="1654"/>
                                                            </svg>
                                                        </Col>
                                                    </Row>
                                                </form>
                                            </div>
                                        </MDBCard>
                                        <MDBCard id='thirdPanel' className='p-4' style={{display:'none',marginTop:'-410px',height: '410px',width:'400px'}}>
                                            <div style={{float:'right'}}><MDBIcon icon="times"  style={{cursor:'pointer'}} onClick={this.hideThird}/></div>
                                            <div style={{flex:'1',height:'100%'}}>
                                                <Row justify='center' align='middle' style={{height:'100%'}}>
                                                    {this.state.thirdContent}
                                                    <img src={qr} style={{height:'300px',width:'auto'}}/>
                                                </Row>
                                            </div>
                                        </MDBCard>
                                    </React.Fragment>
                                    // </Col>


                                    :
                                    // <Col flex='400px' style={{marginLeft: '50px'}}>
                                    <MDBCard id='registerPanel' style={{width:'400px',marginLeft:'0px'}}>
                                        <MDBCardHeader style={cardHeader}>
                                            <Row justify='space-between' align='middle'>
                                                <Col>注册</Col>
                                                <Col><img style={{width: '50px', cursor: 'pointer'}} src={l}
                                                          onClick={() => this.setState({showLogin: true}, () => {
                                                              this.refreshImg();
                                                              document.getElementById('thirdPanel').classList.remove('showThird');
                                                          })}/></Col>
                                            </Row>
                                        </MDBCardHeader>
                                        <div className="card-body d-flex justify-content-center">

                                            <form
                                                className="needs-validation"
                                                onSubmit={this.submitRegister}
                                                noValidate
                                                key={2}
                                            >
                                                <div className='mb-3'>
                                                    {/*<label*/}
                                                    {/*    htmlFor="defaultFormRegisterNameEx"*/}
                                                    {/*    className="grey-text"*/}
                                                    {/*>*/}
                                                    {/*    用户名*/}
                                                    {/*</label>*/}
                                                    <input
                                                        value={this.state.username}
                                                        name="username"
                                                        onChange={this.changeHandler}
                                                        type="text"
                                                        id="username"
                                                        className="form-control"
                                                        placeholder="用户名"
                                                        style={inputWidth}
                                                        required
                                                    />
                                                    <div className="invalid-feedback">
                                                        用户名由4到16位字母，数字，下划线或减号组成
                                                    </div>
                                                </div>
                                                <div className='mb-3'>
                                                    {/*<label*/}
                                                    {/*    htmlFor="defaultFormRegisterEmailEx2"*/}
                                                    {/*    className="grey-text"*/}
                                                    {/*>*/}
                                                    {/*    密码*/}
                                                    {/*</label>*/}
                                                    <input
                                                        value={this.state.password}
                                                        name="password"
                                                        onChange={this.changeHandler}
                                                        type="password"
                                                        id="password"
                                                        className="form-control"
                                                        placeholder="密码"
                                                        required
                                                    />
                                                    <div className="invalid-feedback">
                                                        密码由6到16位非空格字符组成
                                                    </div>
                                                </div>
                                                <div className='mb-3'>
                                                    {/*<label*/}
                                                    {/*    htmlFor="defaultFormRegisterEmailEx2"*/}
                                                    {/*    className="grey-text"*/}
                                                    {/*>*/}
                                                    {/*    密码*/}
                                                    {/*</label>*/}
                                                    <input
                                                        value={this.state.password2}
                                                        name="password2"
                                                        onChange={this.changeHandler}
                                                        type="password"
                                                        id="password2"
                                                        className="form-control"
                                                        placeholder="重复密码"
                                                        required
                                                    />
                                                    <div className="invalid-feedback">
                                                        两次密码输入不一致
                                                    </div>
                                                </div>
                                                {/*<div className='mb-3'>*/}
                                                {/*    <label*/}
                                                {/*        htmlFor="defaultFormRegisterConfirmEx3"*/}
                                                {/*        className="grey-text"*/}
                                                {/*    >*/}
                                                {/*        国家*/}
                                                {/*    </label>*/}
                                                {/*    <input*/}
                                                {/*        value={this.state.country}*/}
                                                {/*        onChange={this.changeHandler}*/}
                                                {/*        type="text"*/}
                                                {/*        id="country"*/}
                                                {/*        className="form-control"*/}
                                                {/*        name="country"*/}
                                                {/*        placeholder="国家"*/}
                                                {/*        required*/}
                                                {/*    />*/}
                                                {/*    /!*<small id="emailHelp" className="form-text text-muted">*!/*/}
                                                {/*    /!*    We'll never share your email with anyone else.*!/*/}
                                                {/*    /!*</small>*!/*/}
                                                {/*    <div className="invalid-feedback">*/}
                                                {/*        请提供国家*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                                {/*<div className='mb-3'>*/}
                                                {/*    <label*/}
                                                {/*        htmlFor="defaultFormRegisterPasswordEx4"*/}
                                                {/*        className="grey-text"*/}
                                                {/*    >*/}
                                                {/*        城市*/}
                                                {/*    </label>*/}
                                                {/*    <input*/}
                                                {/*        value={this.state.city}*/}
                                                {/*        onChange={this.changeHandler}*/}
                                                {/*        type="text"*/}
                                                {/*        id="city"*/}
                                                {/*        className="form-control"*/}
                                                {/*        name="city"*/}
                                                {/*        placeholder="城市"*/}
                                                {/*        required*/}
                                                {/*    />*/}
                                                {/*    <div className="invalid-feedback">*/}
                                                {/*        请提供城市*/}
                                                {/*    </div>*/}
                                                {/*    /!*<div className="valid-feedback">Looks good!</div>*!/*/}
                                                {/*</div>*/}
                                                <div className='mb-3'>
                                                    {/*<label*/}
                                                    {/*    htmlFor="defaultFormRegisterPasswordEx4"*/}
                                                    {/*    className="grey-text"*/}
                                                    {/*>*/}
                                                    {/*    邮箱*/}
                                                    {/*</label>*/}
                                                    <input
                                                        value={this.state.email}
                                                        onChange={this.changeHandler}
                                                        type="email"
                                                        id="email"
                                                        className="form-control"
                                                        name="email"
                                                        placeholder="邮箱"
                                                        required
                                                    />
                                                    <div className="invalid-feedback">
                                                        请提供正确邮箱
                                                    </div>
                                                    {
                                                        this.state.isRepeat ?
                                                            <div style={{color: '#DC3545'}}>
                                                                该邮箱已注册，请直接登录
                                                            </div>
                                                            : ''
                                                    }
                                                    {/*<div className="valid-feedback">Looks good!</div>*/}
                                                </div>
                                                <div className='mb-3'>
                                                    {/*<label*/}
                                                    {/*    htmlFor="defaultFormRegisterPasswordEx4"*/}
                                                    {/*    className="grey-text"*/}
                                                    {/*>*/}
                                                    {/*    邮箱验证码*/}
                                                    {/*</label>*/}
                                                    <br/>
                                                    <input
                                                        value={this.state.emailCode}
                                                        onChange={this.changeHandler}
                                                        type="text"
                                                        id="emailCode"
                                                        className="form-control"
                                                        name="emailCode"
                                                        placeholder="邮箱验证码"
                                                        style={{width: '230px', display: 'inline'}}
                                                        autoComplete='off'
                                                        required
                                                    />
                                                    {
                                                        (!this.state.isRepeat && this.state.validEmail && !this.state.sendingEmail)
                                                            ? <Button type="primary"
                                                                      style={{display: 'inline', marginLeft: '20px'}}
                                                                      onClick={this.getEmailCode}>获取验证码</Button>
                                                            : <Button type="primary"
                                                                      style={{display: 'inline', marginLeft: '20px'}}
                                                                      disabled>获取验证码</Button>
                                                    }
                                                    <div className="invalid-feedback">
                                                        请提供正确邮箱验证码
                                                    </div>
                                                    {/*<div className="valid-feedback">Looks good!</div>*/}
                                                </div>

                                                {/*<div className='mb-3'>*/}
                                                {/*    /!*<label*!/*/}
                                                {/*    /!*    htmlFor="defaultFormRegisterPasswordEx4"*!/*/}
                                                {/*    /!*    className="grey-text"*!/*/}
                                                {/*    /!*>*!/*/}
                                                {/*    /!*    图形验证码*!/*/}
                                                {/*    /!*</label>*!/*/}
                                                {/*    <br/>*/}
                                                {/*    <input*/}
                                                {/*        value={this.state.imgCode}*/}
                                                {/*        onChange={this.changeHandler}*/}
                                                {/*        type="text"*/}
                                                {/*        id="imgCode"*/}
                                                {/*        className="form-control"*/}
                                                {/*        name="imgCode"*/}
                                                {/*        placeholder="图形验证码"*/}
                                                {/*        style={{width: '230px', display: 'inline'}}*/}
                                                {/*        required*/}
                                                {/*    />*/}
                                                {/*    /!*<Button type="primary" style={{display:'inline',marginLeft:'20px'}}>获取验证码</Button>*!/*/}
                                                {/*    <img id='img' onClick={this.refreshImg}*/}
                                                {/*         style={{maxWidth: '100px', marginLeft: '20px', cursor: 'pointer'}}/>*/}
                                                {/*    <div className="invalid-feedback">*/}
                                                {/*        请提供正确图形验证码*/}
                                                {/*    </div>*/}
                                                {/*    /!*<div className="valid-feedback">Looks good!</div>*!/*/}
                                                {/*</div>*/}
                                                {/*<div style={{float:'left',cursor:'pointer'}} onClick={()=>this.setState({showLogin:true})}>已有账号登录</div>*/}

                                                <div className='mb-3'>
                                                    <br/>
                                                    <input
                                                        value={this.state.imgCode}
                                                        onChange={this.changeHandler}
                                                        type="text"
                                                        id="imgCode"
                                                        className="form-control"
                                                        name="imgCode"
                                                        placeholder="图形验证码"
                                                        style={{width: '230px', display: 'inline'}}
                                                        autoComplete='off'
                                                        required
                                                    />
                                                    {/*<Button type="primary" style={{display:'inline',marginLeft:'20px'}}>获取验证码</Button>*/}
                                                    <img id='img' onClick={this.refreshImg}
                                                         style={{
                                                             maxWidth: '100px',
                                                             marginLeft: '20px',
                                                             cursor: 'pointer'
                                                         }}/>
                                                    <div className="invalid-feedback">
                                                        请提供正确图形验证码
                                                    </div>
                                                    {/*<div className="valid-feedback">Looks good!</div>*/}
                                                </div>
                                                {
                                                    this.state.loading ?
                                                        <div className="spinner-border" role="status">
                                                            <span className="sr-only">Loading...</span></div>
                                                        : ''
                                                }
                                                <Button type="primary" htmlType="submit" style={{float: 'right'}}>
                                                    注册
                                                </Button>
                                            </form>
                                        </div>
                                    </MDBCard>

                                : ''
                        }
                    </Col>
                </Row>
            </div>

        );
    }
}

const cardHeader = {
    backgroundColor: '#1890ff',
    color: 'white',
    fontSize: '16pt',
    fontWeight: 'bold',
    verticalAlign: 'center'
}

const inputWidth = {
    width: '350px'
}

export default Guide;