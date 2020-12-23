import React from 'react';
import {MDBCol, MDBRow} from 'mdbreact';
import AdminCardSection1 from './sections/AdminCardSection1';
import AdminCardSection2 from './sections/AdminCardSection2';
import TableSection from './sections/TableSection';
import BreadcrumSection from './sections/BreadcrumSection';
import ChartSection1 from './sections/ChartSection1';
import ChartSection2 from './sections/ChartSection2';
import MapSection from './sections/MapSection';
import ModalSection from './sections/ModalSection';
import SideNavigation from "../sideNavigation";
import Routes from "../Routes";
import {Switch} from "react-router-dom";
import TopNavigation from "../topNavigation";
import '../Global';
import Sider from "../Sider";
import {Row,Col} from 'antd'
import RectBackground from "../RectBackground";

//主页模板
const DashboardPage = () => {

    return (
        <React.Fragment>
            {/*<SideNavigation/>*/}
            <main id="content" className="p-5 m-0" style={{backgroundColor:'transparent'}}>
                <Row>
                    <Col span={5}>
                        <Sider/>
                    </Col>
                    <Col span={19} className='pl-5'>
                        <TopNavigation/>
                        <Routes/>
                    </Col>
                </Row>
            </main>
        </React.Fragment>
    )
}


export default DashboardPage;





