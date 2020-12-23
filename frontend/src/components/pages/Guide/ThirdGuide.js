import React, {Component} from 'react';
import {Col, Row} from "antd";
import FreePage from "../FreePage";

class ThirdGuide extends Component {
    render() {
        return (
            <div className='p-4' style={{flex: '1', height: '100vh'}}>
                <div className='p-4 d-flex justify-content-center align-items-center' style={{backgroundColor: 'rgba(0, 0, 0, 0.02)', height: '100%'}}>
                    <div style={{marginTop:'-48px'}}><FreePage/></div>
                </div>
            </div>
        );
    }
}

export default ThirdGuide;