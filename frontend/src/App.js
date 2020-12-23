import React, {Component} from 'react';
import Routes from '../src/components/Routes';
import TopNavigation from './components/topNavigation';
import SideNavigation from './components/sideNavigation';
import Footer from './components/Footer';
import './index.css';
import Background from "./components/Background";
import logo from './img/logo.jpeg';
import RectBackground from "./components/RectBackground";
import { Route, Switch } from 'react-router-dom';
import DashboardPage from "./components/pages/DashboardPage";
import MapsPage from "./components/pages/MapsPage";
import IELTSSpeaking from "./components/pages/IELTS/IELTSSpeaking";
import './components/Global';
import Sider from "./components/Sider";
import 'antd/dist/antd.css';
import IELTSWriting from "./components/pages/IELTS/IELTSWriting";
import IELTSReading from "./components/pages/IELTS/IELTSReading";
import IELTSListening from "./components/pages/IELTS/IELTSListening";
import TMarkingDashboardPage from './components/admin/TeacherMarking/TMarkingDashboardPage';
import AdminDashboard from './components/admin/AdminManager/AdminDashboard';
import IELTSExam from "./components/pages/IELTS/IELTSExam";
import FirstGuide from "./components/pages/Guide/FirstGuide";
import FullGuide from "./components/pages/Guide/FullGuide";
import CCLExam from "./components/pages/CCL/CCLExam";

//Route层级：引导页单独Route，雅思考试页面单独Route，老师页面单独Route，其他的在主页下面Route
class App extends Component {
    render() {
        return (
            <div>
                <RectBackground/>
                <Switch>
                    {/*<Route exact path='/IELTSSpeaking' component={IELTSSpeaking} />*/}
                    {/*<Route path='/IELTSListening' component={IELTSListening} />*/}
                    {/*<Route path='/IELTSWriting' component={IELTSWriting} />*/}
                    {/*<Route path='/IELTSReading' component={IELTSReading} />*/}

                    <Route exact path='/' component={FullGuide} />
                    {/*<Route exact path='/' component={FirstGuide} />*/}


                    {/*<Route path='/Login' component={Login} />*/}
                    {/*<Route path='/Register' component={Register} />*/}
                    <Route path='/IELTSExam' component={IELTSExam} />
                    <Route path='/CCLExam' component={CCLExam} />
                    <Route path={'/TMarkinglist'} component={TMarkingDashboardPage}/>
                    <Route path={'/AdminManagement'} component={AdminDashboard}/>
                    <Route component={DashboardPage} />
                </Switch>
            </div>
        );
    }
}

export default App;
