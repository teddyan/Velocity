import React, {Component} from 'react';
import {
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCardImage,
    MDBCardTitle,
    MDBTable,
    MDBTableBody,
    MDBTableHead,
    MDBIcon
} from "mdbreact";
import {logout} from "../Utility";
import axios from "axios";
import {Row, Col, Divider, Collapse} from 'antd';
// import vip from '../../img/VIP.png';
// import vip6 from '../../img/vip6.png';
// import vip2 from '../../img/vip2.png';
// import vip1 from '../../img/vip1.png';
// import vip3 from '../../img/vip3.png';
// import vip4 from '../../img/vip4.png';
// import vip5 from '../../img/vip5.png';
import HelpPage from "./HelpPage";

const {Panel} = Collapse;
//  let images ={vip,vip1,vip2,vip3,vip4,vip5,vip6};

class VIPPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product: [],
            loading: true
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

        axios.get(global.config.url + `User/GetShopStore`, {
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
                this.setState({product: res.data.data, loading: false});
            }
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

    render() {
        return (
            // <MDBCard style={{minHeight:'80vh',borderRadius:'30px',marginTop:'30px'}} className='p-5'>
            //     123
            // </MDBCard>

            // <MDBCard style={{minHeight: '80vh', borderRadius: '30px', marginTop: '30px'}} className='pl-5 pr-5 pb-5'>
            //     {

            this.state.loading
                ?
                <div className="d-flex justify-content-center align-items-center mt-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
                :
                <React.Fragment>
                    <Row style={{marginLeft:'-24px',marginRight:'-24px'}}>
                        {
                            this.state.product.map((product, i) => {
                              
                                return (
                                        <MDBCard key={i} className='mt-5 ml-4 mr-4'
                                             style={{
                                                 cursor: 'pointer',
                                                 borderRadius: '20px',
                                                 height: '400px',
                                                 width: '300px'
                                             }}>
                                                
                                        <MDBCardImage className="img-fluid"
                                                    //  src={vip}
                                                     src={require('../../img/vip'+product['Product_ID']+'.png')}

                                                    //  src={('vip') +product['Product_ID']}
                                                    // src ={images[2]}
                                                
                                                      waves style={{
                                            borderRadius: '20px 20px 0px 0px',
                                            marginLeft: 'auto',
                                            marginRight: 'auto'
                                        }}/>
                                        <MDBCardBody>
                                            <MDBCardTitle>{product['Description']}</MDBCardTitle>
                                            <Divider/>
                                            <div style={{display: 'inline'}}>价格：{product['Price']}元</div>
                                            <del
                                                style={{float: 'right'}}>{(parseFloat(product['Price']) * 1.2).toFixed(2)}元
                                            </del>

                                            {/*<MDBCardText>Some quick example text to build on the card title and make up the bulk of the card's content.</MDBCardText>*/}
                                        </MDBCardBody>
                                    </MDBCard>
                                )
                            })
                        }
                    </Row>
                    <MDBCard style={{borderRadius: '20px'}} className='mt-5'>
                        <MDBCardHeader style={cardHeader}>VIP特权</MDBCardHeader>
                        <MDBCardBody>
                            <MDBTable hover bordered style={{marginBottom:'0px',backgroundColor: 'rgba(0, 0, 0, 0.02)'}}>
                                <MDBTableBody style={{textAlign: 'center'}}>
                                    <tr style={{backgroundColor: 'rgba(0, 0, 0, 0.04)'}}>
                                        <td style={{fontSize:'14pt',verticalAlign:'middle'}}>特权</td>
                                        <td style={{fontSize:'14pt',verticalAlign:'middle'}}>普通会员</td>
                                        <td style={{fontSize: '16pt', color:'green'}}>
                                            <svg aria-hidden="true" className='icon' style={{width:'35px',height:'35px'}}>
                                                <use xlinkHref="#iconVIP1"></use>
                                            </svg>VIP会员</td>
                                    </tr>
                                    <tr>
                                        <td style={size12}>免费模考券和点评券</td>
                                        <td style={size12}>无</td>
                                        <td style={VIP}><MDBIcon icon="check" className="mr-3"/>每个月免费雅思模考券和雅思点评各两张</td>
                                    </tr>
                                    <tr>
                                        <td style={size12}>单词本功能</td>
                                        <td style={size12}>无</td>
                                        <td style={VIP}><MDBIcon icon="check" className="mr-3"/>开启单词本功能</td>
                                    </tr>
                                    <tr>
                                        <td style={size12}>雅思录音答案储存次数</td>
                                        <td style={size12}>3次</td>
                                        <td style={{fontSize: '14pt', color:'green', borderRadius:'0 0 20px 0'}}><MDBIcon icon="check" className="mr-3"/>5次</td>
                                    </tr>
                                    <tr>
                                        <td style={size12}>雅思写作模板</td>
                                        <td style={size12}>无</td>
                                        <td style={{fontSize: '14pt', color:'green'}}><MDBIcon icon="check" className="mr-3"/>有</td>
                                    </tr>
                                </MDBTableBody>
                            </MDBTable>
                        </MDBCardBody>
                    </MDBCard>

                    <HelpPage/>

                </React.Fragment>

            // }
            // </MDBCard>
        );
    }
}

const VIP = {
    fontSize: '14pt',
    color:'green'
}

const size12 = {
    fontSize: '12pt',
}

const cardHeader = {
    backgroundColor: global.config.brown,
    color: 'white',
    fontSize: '14pt',
    borderRadius: '20px 20px 0 0'
}

export default VIPPage;