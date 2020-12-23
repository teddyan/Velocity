import React, {Component} from 'react';
import {MDBCard, MDBCardBody, MDBCardHeader, MDBCardImage} from "mdbreact";
import {Row,Col,Button, Space, Modal, Popover, Divider} from 'antd';
import pic from '../../img/Carousel03.png'
import axios from "axios";

class FreePage extends Component {

    constructor(props) {
        super(props);
            this.state={
            setDateMonth: new Date().getMonth()+1,
        }
    }
    componentDidMount() {
        
         //公開影片
         let videoTmp ='';
         let videos =["保过班公开课",
                      "押题班公开课",
                      "阅读公开课",
                      "听力公开课",
                      "王子直播间"];
         for(let i = 0; i<videos.length;i++){

             videoTmp+=`<a class="hoverUnderline" href="https://velocityenglish.com.au/" style="color: inherit"><div>${videos[i]}</div></a>`;    
         }
        //  document.getElementById('VideoList').innerHTML = videoTmp + videoTmp;
        //PTE
        let tmp = '';
        for(let i=1;i<10;i++){
            tmp+=`<a class="hoverUnderline" href="https://velocityenglish.com.au/" style="color: inherit"><div >2020年${i}月-PTE高频机经</div></a>`;
        }
        document.getElementById('PTEList').innerHTML = tmp + tmp;
       
   
        //IELTS寫作
        axios.get(global.config.url + `Main/FreeIELTS`).then(res => {
            console.log(res);
            if (res.data.msg === 'succeed') {
                console.log(res.data.data);
                let arr = res.data.data;
                let tmp ='';
                for(let i=0;i<arr.length;i++){
                    let url = 'https://velocityenglish.com.au/storage/ielts/'+arr[i]+'#toolbar=0';
                    tmp+=`<a class="hoverUnderline" href=${url} target="_blank" style="color: inherit"><div >IELTS写作 - ${arr[i].split('.')[0]}</div></a>`;
                }
                document.getElementById('IELTSList').innerHTML = tmp + tmp;
                this.setState({});
            }
            //this.setState({loading: false, paperData: paperData, paperDataOriginal: paperData});
        }).catch(err => {
            console.log(err);
        })

        let ielts = ['https://velocityenglish.com.au/storage/ielts/媒体类.pdf#toolbar=0',
                     'https://velocityenglish.com.au/storage/ielts/教育类.pdf#toolbar=0',
                     'https://velocityenglish.com.au/storage/ielts/环境类.pdf#toolbar=0',
                     'https://velocityenglish.com.au/storage/ielts/科技类.pdf#toolbar=0',
                     'https://velocityenglish.com.au/storage/ielts/城市化.pdf#toolbar=0',
                     'https://velocityenglish.com.au/storage/ielts/犯罪类.pdf#toolbar=0',
                     'https://velocityenglish.com.au/storage/ielts/女性类.pdf#toolbar=0',
                     'https://velocityenglish.com.au/storage/ielts/全球化.pdf#toolbar=0',
                     'https://velocityenglish.com.au/storage/ielts/价值观.pdf#toolbar=0'];
        tmp = '';
        for(let i=0;i<ielts.length;i++){
            let name = ielts[i].slice(45,48);
            tmp+=`<a class="hoverUnderline" href=${ielts[i]} style="color: inherit" target="_blank"><div >IELTS写作 - ${name}</div></a>`;
            // tmp+=`<a class="hoverUnderline" href="https://velocityenglish.com.au/" style="color: inherit"><div >IELTS - 技巧${i}</div></a>`;
        }
        document.getElementById('IELTSList').innerHTML = tmp + tmp;
    }

    render() {
        return (
            
            <div className='mt-5'>
                <div className='d-flex justify-content-center' style={{paddingTop:'120px'}}>
                    <MDBCard style={{borderRadius:'20px', width:'72vw',height:'35vh',maxWidth:'750px',maxHeight:'360px',overflow:'hidden'}}>
                        <a href='https://velocityenglish.com.au/studentlogin' target='_blank'><MDBCardImage className="img-fluid" src={pic} waves/></a>
                    </MDBCard>
                </div>
                <Row className='mt-5'>
                    <Col span={8} style={{paddingRight: '32px'}}>
                        <MDBCard style={border20AndHeight}>
                            <MDBCardHeader style={borderTop20}>PTE机经<br/>2020年1月-{this.state.setDateMonth}月</MDBCardHeader>
                            <MDBCardBody style={flexContainer}>
        {/* <div id='PTElatest' style={{fontSize:'14pt'}}>2020年{this.state.setDateMonth}月PTE最新机经</div> 
                                    <hr className="solid"/>*/}
                                    <div style={{flex:'1',overflow:'hidden',fontSize:'12pt',cursor:'pointer'}}>
                                        <div className='textLoop' id='PTEList'/>
                                    </div>
                            </MDBCardBody>
                        </MDBCard>
                    </Col>
                    <Col span={8} style={{paddingLeft: '16px', paddingRight: '16px'}}>
                        <MDBCard style={border20AndHeight}>
                            <MDBCardHeader style={borderTop20}>日常/商务<br/>英语公开课</MDBCardHeader>
                            {/* <MDBCardBody className='d-flex justify-content-center align-items-center'>
                                <video id='video1' style={{width: '100%',height:'auto',borderRadius:'20px'}} src={global.config.introVideoURL} type="video/mp4" controls/>
                            </MDBCardBody>
                             */}
                              <MDBCardBody style={flexContainer}>
                            
                                <div style={{flex:'1',overflow:'hidden',fontSize:'12pt',cursor:'pointer'}}>
                                    <div className='textLoop' id='VideoList'/>
                                    <a className="hoverUnderline" href="#" style={{color: 'inherit'}} onClick={()=>{this.setState({Guaranteed:true})}}><div>保过班公开课</div></a>
                                    <a className="hoverUnderline" href="#"  style={{color: 'inherit'}}onClick={()=>{this.setState({Guess:true})}}><div>押题班公开课</div></a>
                                    <a className="hoverUnderline" href="#"  style={{color: 'inherit'}}onClick={()=>{this.setState({Reading:true})}}><div>阅读公开课</div></a>
                                    <a className="hoverUnderline" href="#"  style={{color: 'inherit'}}onClick={()=>{this.setState({Listening:true})}}><div>听力公开课</div></a>
                                    <a className="hoverUnderline" href="#"  style={{color: 'inherit'}}onClick={()=>{this.setState({Live:true})}}><div>王子直播间</div></a>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </Col>
                    <Col span={8} style={{paddingLeft: '32px'}}>
                        <MDBCard style={border20AndHeight}>
                            <MDBCardHeader style={borderForIelts}>雅思全套宝典</MDBCardHeader>
                            <MDBCardBody style={flexContainer}>
                                <div style={{flex:'1',overflow:'hidden',fontSize:'12pt',cursor:'pointer'}}>
                                    <div className='textLoop' id='IELTSList'/>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </Col>
                </Row>
{/*region Modal*/}
                <Modal  
                    title={<h3>保过班公开课</h3>}
                    visible={this.state.Guaranteed}
                    onCancel={()=>{this.setState({Guaranteed:false})}}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    okButtonProps={{ style: { display: 'none' } }}
                    width={1000}
                    centered
                   bodyStyle={{paddingLeft:'200px'}}
                   style={{fontSize:'25px'}}
                >
                <video id='video2' style={{maxHeight:'40vh',height:'500px',borderRadius:'20px'}} src={global.config.introVideoURL} type="video/mp4" controls/>
                </Modal>
                <Modal  
                    title={<h3>押题班公开课</h3>}
                    visible={this.state.Guess}
                    onCancel={()=>{this.setState({Guess:false})}}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    okButtonProps={{ style: { display: 'none' } }}
                    width={1000}
                    centered
                    bodyStyle={{paddingLeft:'200px'}}
                >
                <video id='video2' style={{maxHeight:'40vh',height:'500px',borderRadius:'20px'}} src={global.config.introVideoURL} type="video/mp4" controls/>
                </Modal>
                <Modal  
                    title={<h3>阅读公开课</h3>}
                    visible={this.state.Reading}
                    onCancel={()=>{this.setState({Reading:false})}}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    okButtonProps={{ style: { display: 'none' } }}
                    width={1000}
                    centered
                    bodyStyle={{paddingLeft:'200px'}}
                >
                <video id='video2' style={{maxHeight:'40vh',height:'500px',borderRadius:'20px'}} src={global.config.introVideoURL} type="video/mp4" controls/>
                </Modal>
                <Modal  
                    title={<h3>听力公开课</h3>}
                    visible={this.state.Listening}
                    onCancel={()=>{this.setState({Listening:false})}}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    okButtonProps={{ style: { display: 'none' } }}
                    width={1000}
                    centered
                    bodyStyle={{paddingLeft:'200px'}}
                >
                <video id='video2' style={{maxHeight:'40vh',height:'500px',borderRadius:'20px'}} src={global.config.introVideoURL} type="video/mp4" controls/>
                </Modal>
                <Modal  
                    title={<h3>王子直播间</h3>}
                    visible={this.state.Live}
                    onCancel={()=>{this.setState({Live:false})}}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    okButtonProps={{ style: { display: 'none' } }}
                    width={1000}
                    centered
                    bodyStyle={{paddingLeft:'200px'}}
                >
                <video id='video2' style={{maxHeight:'40vh',height:'500px',borderRadius:'20px'}} src={global.config.introVideoURL} type="video/mp4" controls/>
                </Modal>
{/*End region Modal*/}
            </div>
         
        );
    }
}

const border20AndHeight = {
    borderRadius:'20px',
    height:'35vh',
    maxHeight:'330px'
}

const borderTop20 = {
    borderRadius: '20px 20px 0 0',
    textAlign:'center',
    fontSize: '16pt'
}

const borderForIelts = {
    borderRadius: '20px 20px 0 0',
    padding:'29px',
    textAlign:'center',
    fontSize: '16pt'
}

const flexContainer = {
    display:'flex',
    flexFlow:'column',
    textAlign: 'center'
}

export default FreePage;