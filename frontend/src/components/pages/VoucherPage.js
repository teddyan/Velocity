import React, {Component} from 'react';
import {MDBCard, MDBCardBody, MDBCardHeader, MDBCardImage, MDBCardTitle, MDBIcon} from "mdbreact";
import {logout, removeLocalUserInfo} from "../Utility";
import axios from "axios";
import {Row, Col, Divider, Button, Cascader, Modal} from 'antd';
import {Link} from "react-router-dom";
import reactStringReplace from "react-string-replace";
import pteTest from '../../img/PTETest.png';
import pteVoucher from '../../img/PTEVoucher.png';
import ieltsTest from '../../img/IeltsTest.png';
import ieltsVoucher from '../../img/IeltsVoucher.png';
import cclTest from '../../img/CCLTest.png';
import cclVoucher from '../../img/CCLVoucher.png';

class VoucherPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            loading2: true,
            uploading: false,
            gift_pack_uploading: false,
            IELTS1: 0,   //雅思模考券
            IELTS2: 0,   //雅思点评券
            PTE1: 0,     //PTE模考券
            PTE2: 0,     //PTE点评券
            CCL1: 0,     //CCL模考券
            CCL2: 0,    //CCL点评券
            isVIP: false,
            VIPStart: '',
            VIPEnd: '',    
            discount: []
        }
    }

    componentDidMount() {

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
                this.setState({
                    IELTS1: json['ielts_Voucher'],   //雅思模考券
                    IELTS2: json['expert_ielts_Voucher'],   //雅思点评券
                    PTE1: json['pte_Voucher'],     //PTE模考券
                    PTE2: json['expert_pte_Voucher'],     //PTE点评券
                    CCL1: json['ccl_Voucher'],     //CCL模考券
                    CCL2: json['expert_ccl_Voucher'],     //CCL点评券
                    isVIP: json['isVIP'] === 1,
                    VIPStart: json['VIPStart'],
                    VIPEnd: json['VIPEnd'],
                    VIPDay:Math.ceil((Date.parse(json['VIPEnd'])-Date.parse(json['VIPStart']))/86400000)
                })
            }
            this.setState({loading: false});
        }).catch(err => {
            console.log(err);
            console.log(err.response);
            //Token过期
            if (typeof err.response !== 'undefined' && err.response.status === 401) {
                console.log('token过期或失效');
                logout();
            }
        })

        axios.get(global.config.url + `User/GetPromotionInfo?userID=` + userID, {
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
                console.log(json);
                let discount = [];
                for (let discountType in json) {
                    for (let i = 0; i < json[discountType].length; i++) {
                        let voucher = json[discountType][i];
                        discount.push([discountType, voucher.value, voucher.CreateAt.split(' ')[0], Math.ceil(((Date.parse(voucher.CreateAt) + voucher.duration * 24 * 60 * 60 * 1000) - Date.now()) / 86400000)]);
                    }
                }
                console.log(discount);
                this.setState({discount: discount, loading2: false})
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

    activate = (e) => {
        e.preventDefault();
        let activate = document.getElementById('activate');
        if(activate.value===''){
            activate.classList.remove('is-valid');
            activate.classList.add('is-invalid');
        }else{
            let token = localStorage.getItem('access_token');
            let userID = localStorage.getItem('userID');

            //若没有登录信息或失效，则去引导页
            if (token === null || userID === null) {
                logout();
                return;
            }

            let formData = new FormData();
            formData.append('userID',userID);
            formData.append('code',activate.value);

            this.setState({uploading:true});
            axios.post(global.config.url +  `User/ActivateCode`, formData,{
                headers: {Authorization: `Bearer ${token}`}
            }).then(res => {
                console.log(res);
                //console.log(res.headers);
                //更新Token
                if (typeof res.headers.authorization !== 'undefined') {
                    console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                    localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
                }
                if (res.data.msg === 'succeed') {
                    this.setState({uploading: false});
                    let {confirm} = Modal;
                    return (
                        confirm({
                            title: '激活成功',
                            // content: '请在“哔”声后开始答题',
                            cancelText: '取消',
                            okText: '确定',
                            centered: true,
                            onOk:()=>{
                                window.location.reload();
                            },
                            onCancel:()=>{
                                window.location.reload();
                            }
                        })
                    )
                } else if(res.data.msg === 'code has been activated'){
                    activate.classList.remove('is-valid');
                    activate.classList.add('is-invalid');
                }
                this.setState({uploading: false});
            }).catch(err => {
                console.log(err);
                console.log(err.response);
                this.setState({uploading: false});
                //Token过期
                if (typeof err.response !== 'undefined' && err.response.status === 401) {
                    console.log('token过期或失效');
                    logout();
                } else if (err.response.status === 400){
                    activate.classList.remove('is-valid');
                    activate.classList.add('is-invalid');
                }
            })

        }

    }

    gift_pack = (e) => {
        e.preventDefault();
        let activate = document.getElementById('activate_gift');
        if (activate.value===''){
            activate.classList.remove('is-valid');
            activate.classList.add('is-invalid');
        }
        else {
            let token = localStorage.getItem('access_token');
            let userID = localStorage.getItem('userID');

            //若没有登录信息或失效，则去引导页
            if (token === null || userID === null) {
                logout();
                return;
            }

            let formData = new FormData();
            formData.append('userID',userID);
            formData.append('code',activate.value);

            this.setState({gift_pack_uploading:true});
            axios.post(global.config.url +  `User/ActivateGiftCode`, formData,{
                headers: {Authorization: `Bearer ${token}`}
            }).then(res => {
                //console.log(res.headers);
                //更新Token
                if (typeof res.headers.authorization !== 'undefined') {
                    console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                    localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
                }
                if (res.data.msg === 'succeed') {
                    this.setState({gift_pack_uploading: false});
                    let {confirm} = Modal;
                    return (
                        confirm({
                            title: '激活成功',
                            // content: '请在“哔”声后开始答题',
                            cancelText: '取消',
                            okText: '确定',
                            centered: true,
                            onOk:()=>{
                                window.location.reload();
                            },
                            onCancel:()=>{
                                window.location.reload();
                            }
                        })
                    )
                } 
                else if(res.data.msg === 'Event is expired') {
                    activate.classList.remove('is-valid');
                    activate.classList.add('is-invalid');
                }
                else if(res.data.msg === 'Event is not start yet!') {
                    activate.classList.remove('is-valid');
                    activate.classList.add('is-invalid');
                }
                else if(res.data.msg === 'error happened,please contact IT support') {
                    activate.classList.remove('is-valid');
                    activate.classList.add('is-invalid');
                }
                this.setState({gift_pack_uploading: false});
            }).catch(err => {
                console.log(err);
                console.log(err.response);
                this.setState({gift_pack_uploading: false});
                //Token过期
                if (typeof err.response !== 'undefined' && err.response.status === 401) {
                    console.log('token过期或失效');
                    logout();
                } else if (err.response.status === 400){
                    activate.classList.remove('is-valid');
                    activate.classList.add('is-invalid');
                }
            })
        }
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
                    <MDBCard className='mt-5' style={{borderRadius: '20px'}}>
                        <MDBCardHeader style={cardHeader}>
                            模考券信息
                        </MDBCardHeader>
                        <MDBCardBody style={cardBody}>
                            <Row>
                                <Col style={{width: '300px'}}>
                                    <div>雅思模考券</div>
                                    <div>雅思点评券</div>
                                    <Divider/>
                                    <div>PTE模考券</div>
                                    <div>PTE点评券</div>
                                    <Divider/>
                                    <div>CCL模考券</div>
                                    <div>CCL点评券</div>
                                </Col>
                                <Col>
                                    <div>  <img src={ieltsTest} style={{width: '20px'}}/> × {this.state.IELTS1}</div>
                                    <div><img src={ieltsVoucher} style={{width: '20px'}}/> × {this.state.IELTS2}</div>
                                    <Divider/>
                                    <div><img src={pteTest} style={{width: '20px'}}/> × {this.state.PTE1}</div>
                                    <div><img src={pteVoucher} style={{width: '20px'}}/> × {this.state.PTE2}</div>
                                    <Divider/>
                                    <div><img src={cclTest} style={{width: '20px'}}/> × {this.state.CCL1}</div>
                                    <div><img src={cclVoucher} style={{width: '20px'}}/> × {this.state.CCL2}</div>
                                </Col>
                            </Row>
                            <Link to='VIP'><Button style={{float: 'right'}}>购买券</Button></Link>
                        </MDBCardBody>
                    </MDBCard>
                    <MDBCard className='mt-5' style={{borderRadius: '20px'}}>
                        <MDBCardHeader style={cardHeader}>
                            VIP信息
                        </MDBCardHeader>
                        <MDBCardBody style={cardBody}>
                            <Row>
                                <Col style={{width: '300px'}}>
                                    <div>VIP</div>
                                    {
                                        this.state.isVIP
                                            ?
                                            <React.Fragment>
                                                <div>VIP开始时间</div>
                                                <div>VIP结束时间</div>
                                                <div>剩余天数</div>
                                            </React.Fragment>
                                            :
                                            ''
                                    }
                                </Col>
                                <Col>
                                    <div>{this.state.isVIP ?
                                        <React.Fragment>{vipIcon}您是VIP</React.Fragment> : '您还不是VIP会员'}</div>
                                    {
                                        this.state.isVIP
                                            ?
                                            <React.Fragment>
                                                <div>{this.state.VIPStart}</div>
                                                <div>{this.state.VIPEnd}</div>
                                                <div>{this.state.VIPDay}</div>
                                            </React.Fragment>
                                            :
                                            ''
                                    }
                                </Col>
                            </Row>
                            <Link to='VIP'><Button style={{float: 'right'}}>续费</Button></Link>
                        </MDBCardBody>
                    </MDBCard>

                    <MDBCard className='mt-5' style={{borderRadius: '20px'}}>
                        <MDBCardHeader style={cardHeader}>
                            激活优惠券
                        </MDBCardHeader>
                        <MDBCardBody style={cardBody}>
                            <form
                                className="needs-validation"
                                onSubmit={this.activate}
                                noValidate
                            >
                                <Row>
                                    <Col style={{width: '300px'}}>
                                        <div>激活码</div>
                                    </Col>
                                    <Col flex='1 1 200px'>
                                        <Row justify='space-between'>
                                            <Col>
                                                <input id='activate' autoComplete='off'
                                                       className='form-control'
                                                       style={{width: '200px', height: '32px', display: 'inline'}}
                                                       onInput={(e) => {
                                                           e.target.classList.remove('is-invalid');
                                                       }}
                                                       required/>
                                                <div className="invalid-feedback">
                                                    无效激活码
                                                </div>
                                            </Col>
                                            <Col className='d-flex justify-content-center align-items-start'>
                                                {
                                                    this.state.uploading
                                                        ?
                                                        <div className="spinner-border mr-3" role="status"
                                                             style={{height: '30px', width: '30px'}}>
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                        : ''
                                                }
                                                <Button htmlType='submit'>激活</Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </form>
                        </MDBCardBody>
                    </MDBCard>
                    <MDBCard className='mt-5' style={{borderRadius: '20px'}}>
                        <MDBCardHeader style={cardHeader}>
                            优惠券信息
                        </MDBCardHeader>
                        <MDBCardBody style={cardBody}>
                            {
                                this.state.loading2
                                    ?
                                    <div className="d-flex justify-content-center align-items-center mt-5">
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                    :
                                    <Row>
                                        {
                                            this.state.discount.length===0
                                                ?
                                                '您没有优惠券'
                                                :
                                                this.state.discount.map((voucher, i) => {
                                                    return (
                                                        <MDBCard key={i} style={{width: '380px'}} className='m-3'>
                                                            <Row>
                                                                <Col style={{width: '150px', backgroundColor: '#E0E0E0'}}
                                                                     className='d-flex justify-content-center align-items-center'>
                                                                    <MDBIcon size='4x' icon="percent"/>
                                                                </Col>
                                                                <Col style={{width: '230px'}} className='p-4'>
                                                                    <div>类型：{voucher[0]}</div>
                                                                    <div>价值：{voucher[1]}元</div>
                                                                    <div>获取时间：{voucher[2]}</div>
                                                                    <div>剩余天数：{voucher[3]}</div>
                                                                    <Link to='VIP'><Button
                                                                        className='mt-2'>去使用</Button></Link>
                                                                </Col>
                                                            </Row>
                                                        </MDBCard>
                                                    )
                                                })
                                        }
                                    </Row>
                            }
                        </MDBCardBody>
                    </MDBCard>

                    <MDBCard className='mt-5' style={{borderRadius: '20px'}}>
                        <MDBCardHeader style={cardHeader}>
                            礼包
                        </MDBCardHeader>
                        <MDBCardBody style={cardBody}>
                            <form
                                className="needs-validation"
                                onSubmit={this.gift_pack}
                                noValidate
                            >
                                <Row>
                                    <Col style={{width: '300px'}}>
                                        <div>礼包码</div>
                                    </Col>
                                    <Col flex='1 1 200px'>
                                        <Row justify='space-between'>
                                            <Col>
                                                <input id='activate_gift' autoComplete='off'
                                                       className='form-control'
                                                       style={{width: '200px', height: '32px', display: 'inline'}}
                                                       onInput={(e) => {
                                                           e.target.classList.remove('is-invalid');
                                                       }}
                                                       required/>
                                                <div className="invalid-feedback">
                                                    无效礼包码
                                                </div>
                                            </Col>
                                            <Col className='d-flex justify-content-center align-items-start'>
                                                {
                                                    this.state.gift_pack_uploading
                                                        ?
                                                        <div className="spinner-border mr-3" role="status"
                                                             style={{height: '30px', width: '30px'}}>
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                        : ''
                                                }
                                                <Button htmlType='submit'>激活</Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </form>
                        </MDBCardBody>
                    </MDBCard>

                </React.Fragment>
        );
    }
}

const cardHeader = {
    backgroundColor: global.config.brown,
    color: 'white',
    fontSize: '14pt',
    borderRadius: '20px 20px 0 0'
}

const cardBody = {
    fontSize: '12pt',
    lineHeight: '35px'
}

const vipIcon =
    <svg t="1598427452535" className="icon" viewBox="0 0 1024 1024" version="1.1"
         xmlns="http://www.w3.org/2000/svg" p-id="2418" width="35" height="35">
        <path
            d="M510.955102 831.738776c-23.510204 0-45.453061-9.926531-61.64898-27.167347L138.971429 468.114286c-28.734694-31.346939-29.779592-79.412245-1.567347-111.804082l117.55102-135.314286c15.673469-18.285714 38.661224-28.734694 63.216327-28.734694H705.306122c24.032653 0 47.020408 10.44898 62.693878 28.734694l118.073469 135.314286c28.212245 32.391837 27.689796 80.457143-1.567347 111.804082L572.081633 804.571429c-15.673469 17.240816-38.138776 27.167347-61.126531 27.167347z"
            fill="#F2CB51" p-id="2419"/>
        <path
            d="M506.77551 642.612245c-5.22449 0-10.971429-2.089796-15.15102-6.269388l-203.755102-208.979592c-7.836735-8.359184-7.836735-21.420408 0.522449-29.779592 8.359184-7.836735 21.420408-7.836735 29.779592 0.522449l189.12653 193.828572 199.053061-194.351021c8.359184-7.836735 21.420408-7.836735 29.779592 0.522449 7.836735 8.359184 7.836735 21.420408-0.522449 29.779592l-214.204081 208.979592c-4.179592 3.657143-9.404082 5.746939-14.628572 5.746939z"
            fill="#FFF7E1" p-id="2420"/>
    </svg>;

export default VoucherPage;
