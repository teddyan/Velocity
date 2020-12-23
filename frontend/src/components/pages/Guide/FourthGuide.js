import React, {Component} from 'react';
import {Button, Col, Row, Divider} from "antd";
// import velocityEdu from '../../../img/Velocity.png';
import logo from '../../../img/logo.png';
import map from'../../../img/Map.png';
import { YoutubeOutlined, StarFilled, StarTwoTone } from '@ant-design/icons';
class FourthGuide extends Component{

    render(){
        return(
            
            <div className='p-4' style={{flex: '1', height: '120vh',marginTop:"55px"}}>
                <div id="videobox" style={{margin:"0", width: "100%", height: "375px", overflow: "hidden",backgroundColor: 'rgba(0, 0, 0, 0.02)'}}>
            <Row justify='space-around' align='middle' style={{/*backgroundColor: 'rgba(0, 0, 0, 0.02)',*/ height: '57%', paddingTop: '120px'}}>
               
                {/* <Col flex='0 1 400px' className="d-flex justify-content-center align-items-center pr-4"> */}
                <Col flex='0 1 400px' className="d-flex justify-content-center align-items-center ">
                {/* <div><img src={velocityEdu} style={{height: '170px', width: 'auto',zIndex:'-100',float:'left'}} /></div> */}
                    {/* <video id='video2' style={{maxHeight:'40vh',height:'500px',width:'1440px',borderRadius:'20px'}} src={global.config.introVideoURL} type="video/mp4" controls/> */}
                    <video id='video2' style={{width:'1700px',borderRadius:'20px'}} src={global.config.introVideoURL} type="video/mp4" controls/>

                </Col>
             
            </Row>
            </div>
            {/* <Row justify='space-around' align='middle' style={{backgroundColor: 'rgba(0, 0, 0, 0.02)', height: '3%'}}> */}
{/* </Row>    */}
  
            <Row justify='space-around' align='middle' style={{marginBottom:'10px',backgroundColor: '#FFB5333f', height: '40%'}}>
            <Col flex={1} style={{flexDirection: 'column' }} className="d-flex justify-content-center align-items-center pl-4 pr-4">
         
                            <img src={logo} style={{width: '240px'}}/>
                       
                        <h6 style={{marginTop:'-10px',color:'rgb(191 154 98)'}}>Copyright © 2020 Velocity English.</h6>
                    </Col>
                    <Col flex={2} style={{flexDirection: 'column'}} className="d-flex justify-content-center align-items-center pl-4 pr-4">
                        <h3 style={{color:'rgb(188 149 93)'}}>联繫讯达</h3>
                           <h6 style={{minWidth:'100px',maxWidth:'300px',color:'rgb(191 154 98)'}}>
                           电话: +61 450 686 824 <br/>
                        邮箱: velocityenglish@hotmail.com<br/>
                        地址: Level 21 207 Kent Street,Sydney NSW 2000 Australia <br/>
                        （距离Wynyard火车站3分钟）<br/>
                               </h6>
                        <Divider/>
                    
                      
                    </Col>
                    <Col flex={1} style={{flexDirection: 'column',marginRight:'80px'}} className="d-flex justify-content-center align-items-center pl-4 pr-4">
                        <h3 style={{color:'rgb(188 149 93)',marginBottom:'1em'}}>讯达在哪</h3>
                        <a target="_blank" href="https://www.google.com.au/maps/dir//%E6%9C%80%E5%BC%BA%E5%9F%B9%E8%AE%AD+%E8%BF%85%E8%BE%BE%E6%95%99%E8%82%B2+PTE%2F%E9%9B%85%E6%80%9D%2F%E7%BF%BB%E8%AF%91+%E8%A1%A5%E4%B9%A0%E8%AF%BE%E7%A8%8B%E6%9C%BA%E6%9E%84+%E6%82%89%E5%B0%BC%E6%A0%A1%E5%8C%BA+Velocity+English+PTE%2FIELTS%2FCCL+PTE+Tutorial+Study+Training+Education+Center+Sydney,+Level+21%2F207+Kent+St,+Sydney+NSW+2000/@-33.8636867,151.2014389,17z/data=!3m1!5s0x6b12ae46e98160c7:0xb60b812e29d8e27c!4m8!4m7!1m0!1m5!1m1!1s0x6b12afc857425349:0xf9c6881b8c962b5e!2m2!1d151.2036276!2d-33.8636867">
                            <img src={map} style={{width: '240px'}}/> 
                        </a>
                    
                    </Col>
              
           </Row>
        
        </div>
        );
    }
}

export default FourthGuide;