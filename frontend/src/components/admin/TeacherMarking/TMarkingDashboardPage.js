// import library
import React from 'react';
import {MDBCol, MDBRow} from "mdbreact";

// import route
import TMarkingRoute from './TMarkingRoute'

// import UI
import TopNavigation from "../../topNavigation";
import TMarkingSider from './TMarkingSider'

const TMarkingDashboardPage = () => {
    return (
        <React.Fragment>
            {/*<SideNavigation/>*/}
            <main id="content" className="p-4 m-0" style={{backgroundColor: 'rgba(0, 0, 0, 0)'}}>
                <MDBRow>
                    <MDBCol md='2'>
                        <TMarkingSider/>
                    </MDBCol>
                    <MDBCol md='10'>
                        <TopNavigation/>
                        <TMarkingRoute/>
                    </MDBCol>
                </MDBRow>
            </main>
        </React.Fragment>
    )
}

export default TMarkingDashboardPage;
