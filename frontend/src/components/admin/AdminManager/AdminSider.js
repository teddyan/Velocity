import React from 'react';
import {Menu, Divider} from 'antd';
import {AppstoreOutlined, MailOutlined, SettingOutlined} from '@ant-design/icons';

import {MDBCard, MDBIcon} from "mdbreact"; // or 'antd/dist/antd.less'
import {NavLink, Link, withRouter} from "react-router-dom";

const {SubMenu} = Menu;

class AdminSider extends React.Component {

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
        if(path==='/AdminManagement'&&this.state.pageKey!=='1'){
            this.setState({pageKey:'1'},);
        }else if(path==='/AdminManagement/AdminUserManagement'&&this.state.pageKey!=='2'){
            this.setState({pageKey:'2'},);
        }else if(path==='/AdminManagement/AdminVoucherManagement'&&this.state.pageKey!=='3'){
            this.setState({pageKey:'3'},);
        }else if(path==='/AdminManagement/AdminProductManagement'&&this.state.pageKey!=='4'){
            this.setState({pageKey:'4'},);
        }
    }

    handleClick = e => {
        console.log('click ', e.key);
        this.setState({pageKey:e.key})
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
                        <Menu.Item key="1">
                            <Link to="/AdminManagement"><MDBIcon icon="home" className="mr-3"/>主页</Link>
                        </Menu.Item>
                        <hr className="solid"/>
                        <Menu.Item key="2">
                            <Link to="/AdminManagement/AdminUserManagement"><MDBIcon icon="home" className="mr-3"/>用户管理</Link>
                        </Menu.Item>
                        <hr className="solid"/>
                        <Menu.Item key="3">
                            <Link to="/AdminManagement/AdminVoucherManagement"><MDBIcon icon="home" className="mr-3"/>优惠劵管理</Link>
                        </Menu.Item>
                        <hr className="solid"/>
                        <Menu.Item key="4">
                            <Link to="/AdminManagement/AdminProductManagement"><MDBIcon icon="home" className="mr-3"/>商城管理</Link>
                        </Menu.Item>
                        <hr className="solid"/>
                        <SubMenu
                            key="sub1"
                            title={
                                <span><MDBIcon icon="edit" className="mr-3"/>考卷管理</span>
                            }
                        >
                            <Menu.Item key="5" style={{fontSize:'14pt'}}><Link to="/AdminManagement/AdminIletsExamManagement"><MDBIcon icon="pen" className="mr-3"/>雅思</Link></Menu.Item>
                            <Menu.Item key="6" style={{fontSize:'14pt'}}><Link to="/AdminManagement/AdminPTEExamManagement"><MDBIcon icon="pen" className="mr-3"/>PTE</Link></Menu.Item>
                            <Menu.Item key="7" style={{fontSize:'14pt'}}><MDBIcon icon="pen" className="mr-3"/>CCL</Menu.Item>
                        </SubMenu>
                        <hr className="solid"/>
                        <Menu.Item key="8">
                            <Link to="/AdminManagement/AdminFileManagement"><MDBIcon icon="home" className="mr-3"/>文件管理</Link>
                        </Menu.Item>

                        <hr className="solid"/>
                        <Menu.Item key="9">
                            <Link to="/AdminManagement/AdminBannerManagement"><MDBIcon icon="home" className="mr-3"/>Banner管理</Link>
                        </Menu.Item>

                        <hr className="solid"/>
                        <Menu.Item key="10">
                            <Link to="/AdminManagement/AdminExamVoucher"><MDBIcon icon="home" className="mr-3"/>礼包管理</Link>
                        </Menu.Item>


                    </Menu>
                </MDBCard>

            </React.Fragment>
        );
    }
}

export default withRouter(props => <AdminSider {...props}/>);