// import library
import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';

// Component
import AdminHomepage from './AdminPages/AdminHome';
import AdminUserManagement from './AdminPages/AdminUserManagement';
import AdminVoucherManagement from './AdminPages/AdminVoucherManagement';
import AdminProductManagement from './AdminPages/AdminProductManagement';
import AdminExamVoucher from './AdminPages/AdminExamVoucher';

// Function Management
import AdminFileManagement from './AdminPages/AdminFileManagement';
import AdminBannerManagement from './AdminPages/AdminBannerManagement'


// import Ilets Mock Exam component
import AdminIletsExamManagement from './AdminPages/MockExamPagesInsert/AdminIletsExamManagement';
import IletsInsertReading from './AdminPages/MockExamPagesInsert/IletsMockExam/IletsInsertReading';
import IletsInsertSpeaking from './AdminPages/MockExamPagesInsert/IletsMockExam/IletsInsertSpeaking';
import IletsInsertListening from './AdminPages/MockExamPagesInsert/IletsMockExam/IletsInsertListening';
import IletsInsertWriting from './AdminPages/MockExamPagesInsert/IletsMockExam/IletsInsertWriting';

// import PTE Mock Exam component
import AdminPTEExamManagement from './AdminPages/MockExamPagesInsert/AdminPTEExamManagement'
import PTEInsertListening from './AdminPages/MockExamPagesInsert/PTEMockExam/PTEInsertListening';
import PTEInsertReading from './AdminPages/MockExamPagesInsert/PTEMockExam/PTEInsertReading';
import PTEInsertSpeaking from './AdminPages/MockExamPagesInsert/PTEMockExam/PTEInsertSpeaking';
import PTEInsertWriting from './AdminPages/MockExamPagesInsert/PTEMockExam/PTEInsertWriting';


// Testing
import uploadTesting from './AdminPages/MockExamPagesInsert/IletsMockExam/uploadTesting'

class AdminRoute extends Component{
    render(){
        return(
            <React.Fragment>
                <Switch>
                    <Route exact path='/AdminManagement' component={AdminHomepage}/>
                    <Route path='/AdminManagement/AdminUserManagement' component={AdminUserManagement}/>
                    <Route path='/AdminManagement/AdminVoucherManagement' component={AdminVoucherManagement}/>
                    <Route path='/AdminManagement/AdminProductManagement' component={AdminProductManagement}/>
                    <Route path='/AdminManagement/AdminFileManagement' component={AdminFileManagement}/>
                    <Route path='/AdminManagement/AdminBannerManagement' component={AdminBannerManagement}/>
                    <Route path='/AdminManagement/AdminExamVoucher' component={AdminExamVoucher}/>


                    {/*  Ilets Mock Exam Component 4 Section */}
                    <Route exact path='/AdminManagement/AdminIletsExamManagement' component={AdminIletsExamManagement}/>
                    <Route path='/AdminManagement/AdminIletsExamManagement/IletsInsertReading' component={IletsInsertReading}/>
                    <Route path='/AdminManagement/AdminIletsExamManagement/IletsInsertSpeaking' component={IletsInsertSpeaking}/>
                    <Route path='/AdminManagement/AdminIletsExamManagement/IletsInsertListening' component={IletsInsertListening}/>
                    <Route path='/AdminManagement/AdminIletsExamManagement/IletsInsertWriting' component={IletsInsertWriting}/>

                    {/*  PTE Mock Exam Component 4 Section */}
                    <Route exact path='/AdminManagement/AdminPTEExamManagement' component={AdminPTEExamManagement}/>
                    <Route path='/AdminManagement/AdminPTEExamManagement/PTEInsertReading' component={PTEInsertReading}/>
                    <Route path='/AdminManagement/AdminPTEExamManagement/PTEInsertSpeaking' component={PTEInsertSpeaking}/>
                    <Route path='/AdminManagement/AdminPTEExamManagement/IletsInsertListening' component={PTEInsertListening}/>
                    <Route path='/AdminManagement/AdminPTEExamManagement/PTEInsertWriting' component={PTEInsertWriting}/>


                    <Route path='/AdminManagement/AdminIletsExamManagement/Testing' component={uploadTesting}/>

                </Switch>
            </React.Fragment>
        )
    }
}

export default AdminRoute;