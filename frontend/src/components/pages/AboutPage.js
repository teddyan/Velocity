import React, {Component} from 'react';
import {MDBCard, MDBCardBody, MDBCardHeader} from "mdbreact";
import $ from 'jquery';
import {Row, Col} from 'antd';
import wechat from '../../img/wechat02.png';
import GoogleMapReact from "google-map-react";

class AboutPage extends Component {

    componentDidMount() {
        $(window).scrollTop(0);
    }

    render() {
        return (
            <MDBCard className='mt-5' style={{borderRadius: '20px'}}>
                <MDBCardHeader style={cardHeader}>
                    联系我们
                </MDBCardHeader>
                <MDBCardBody style={cardBody}>
                    <Row className='mb-4'>
                        <Col className='mr-5'>
                            <div>电话</div>
                            <div>邮箱</div>
                            <div>地址</div>
                        </Col>
                        <Col>
                            <div>+61 450 686 824</div>
                            <div>velocityenglish@hotmail.com</div>
                            <div>Level 21 207 Kent Street, Sydney NSW 2000 Australia (距离Wynyard火车站3分钟)</div>
                        </Col>
                        <Col flex='auto' style={{textAlign:'right'}}>
                            <img src={wechat} height='105px'/>
                        </Col>
                    </Row>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3313.008096045178!2d151.20143891492233!3d-33.86368222622403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12afc857425349%3A0xf9c6881b8c962b5e!2s%E6%82%89%E5%B0%BCPTE%20Sydney%20-%20Velocity%20English!5e0!3m2!1sen!2sau!4v1572396030953!5m2!1sen!2sau"
                         frameBorder="0" style={{borderRadius:'20px',flex:'1'}} allowFullScreen={true}
                    />
                </MDBCardBody>
            </MDBCard>
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
    lineHeight: '35px',
    minHeight: '70vh',
    display:'flex',
    flexFlow:'column'
}

export default AboutPage;