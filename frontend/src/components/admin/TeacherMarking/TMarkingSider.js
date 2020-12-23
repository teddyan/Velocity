import React from 'react';
import {Menu, Divider} from 'antd';
import {AppstoreOutlined, MailOutlined, SettingOutlined} from '@ant-design/icons';

import {MDBCard, MDBIcon} from "mdbreact"; // or 'antd/dist/antd.less'
import {NavLink, Link, withRouter} from "react-router-dom";

const {SubMenu} = Menu;

class TMarkingSider extends React.Component {

    constructor() {
        super();
        this.state = {
            pageKey: '1'
        }
        this.lastKey='';
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (document.location.pathname !== prevProps.location.pathname) {
            this.updateMenu();
        }
    }

    componentWillMount() {
        this.updateMenu();
    }

    updateMenu=()=>{
        const path = document.location.pathname.toLowerCase();
        if(path==='/Home'&&this.state.pageKey!=='1'){
            this.setState({pageKey:'1'},);
        }else if(path==='/ielts'&&this.state.pageKey!=='2'){
            this.setState({pageKey:'2'},);
        }
    }

    handleClick = e => {
        //console.log('click ', e);
    };

    render() {
        return (
            <React.Fragment>
                <MDBCard
                    style={{width: '100%', height: '250px',borderRadius: '30px'}} className='mb-4'>
                </MDBCard>
                <MDBCard
                    style={{width: '100%', minHeight: '615px',paddingTop:'22px',paddingBottom:'20px',borderRadius: '30px',fontWeight:'bold'}}
                >
                    <Menu
                        onClick={this.handleClick}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        //defaultSelectedKeys={[this.state.pageKey]}
                        style={{fontSize:'16pt'}}
                        selectedKeys={this.state.pageKey}
                    >
                        <SubMenu
                            key="sub1"
                            title={
                                  <span><MDBIcon icon="edit" className="mr-3"/>改卷</span>
                            }
                        >
                            <Menu.Item key="1" style={{fontSize:'14pt'}}><Link to="/TMarkinglist"><MDBIcon icon="pen" className="mr-3"/>雅思</Link></Menu.Item>
                            <Menu.Item key="2" style={{fontSize:'14pt'}}><MDBIcon icon="pen" className="mr-3"/>PTE</Menu.Item>
                            <Menu.Item key="3" style={{fontSize:'14pt'}}><MDBIcon icon="pen" className="mr-3"/>CCL</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={
                                <span><MDBIcon icon="edit" className="mr-3"/>已完成</span>
                            }
                        >
                            <Menu.Item key="4" style={{fontSize:'14pt'}}><MDBIcon icon="pen" className="mr-3"/>雅思</Menu.Item>
                            <Menu.Item key="5" style={{fontSize:'14pt'}}><MDBIcon icon="pen" className="mr-3"/>PTE</Menu.Item>
                            <Menu.Item key="6" style={{fontSize:'14pt'}}><MDBIcon icon="pen" className="mr-3"/>CCL</Menu.Item>
                        </SubMenu>

                    </Menu>
                </MDBCard>

            </React.Fragment>
        );
    }
}

export default withRouter(props => <TMarkingSider {...props}/>);