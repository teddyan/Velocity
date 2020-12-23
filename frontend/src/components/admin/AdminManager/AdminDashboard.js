// import library
import React from 'react';
import {MDBCol, MDBRow} from "mdbreact";

// import route
import AdminRoute from './AdminRoute'

// import UI
import TopNavigation from "../../topNavigation";
import AdminSider from './AdminSider'

const TMarkingDashboardPage = () => {
    return (
        <React.Fragment>
            {/*<SideNavigation/>*/}
            <main id="content" className="p-4 m-0" style={{backgroundColor: 'rgba(0, 0, 0, 0)'}}>
                <MDBRow>
                    <MDBCol md='2'>
                        <AdminSider/>
                    </MDBCol>
                    <MDBCol md='10'>
                        <TopNavigation/>
                        <AdminRoute/>
                    </MDBCol>
                </MDBRow>
            </main>
        </React.Fragment>
    )
}

export default TMarkingDashboardPage;
