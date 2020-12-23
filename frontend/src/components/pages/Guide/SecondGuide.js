import React, {Component} from 'react';
import {Button, Col, Row} from "antd";
//import intro from "../../../video/Intro.mp4";

class SecondGuide extends Component {
    render() {
        return (
            <div className='p-4' style={{flex: '1', height: '100vh'}}>
                <Row justify='space-around' align='middle' style={{backgroundColor: 'rgba(0, 0, 0, 0.02)', height: '100%'}}>
                    <Col flex='0 1 400px' style={{flexDirection: 'column'}} className="d-flex justify-content-center align-items-center pl-4 pr-4">
                        <h3>迅达英语公司简介</h3>
                        <h5 style={{minWidth:'500px',maxWidth:'650px'}}>
                            - 迅达英语教你如何掌握自己的命运，无论你在澳大利亚已经学习了一段时间，或是刚踏上这片领土，你都不得不将面对一个问题——语言。所以我们将会用最短的时间和最有效的方法，来为你制定出一份属于你自己的复习计划以应对CCL，雅思，PTE等一系列的移民考试。<br/><br/>
                            - 迅达英语拥有众多优秀教师和教研团队，包括澳洲母语华裔教师，NATTI三级专业口笔译，曾新东方英语助教等，自创了不可复制的教学方式<br/>
                        </h5>
                        <br/>
                    </Col>
                    <Col flex='0 1 400px' className="d-flex justify-content-center align-items-center pr-4">
                        <video id='video2' style={{maxHeight:'30vh',width:'auto',borderRadius:'20px'}} src={global.config.introVideoURL} type="video/mp4" controls/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default SecondGuide;