import React from 'react';
import { Route, Switch } from 'react-router-dom';
//import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import TablesPage from './pages/TablesPage';
import MapsPage from './pages/MapsPage';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from "./pages/HomePage";
import IELTSPage from "./pages/IELTSPage";
import CCLHistoryHomePage from "./pages/HistoryPages/CCLHistoryHomePage";
import HistoryHomePage from "./pages/HistoryPages/HistoryHomePage";
import HistoryListingPage from "./pages/HistoryPages/HistoryListingPage";
import HistorySpeakingPage from "./pages/HistoryPages/HistorySpeakingPage";
import HistoryReadingPage from "./pages/HistoryPages/HistoryReadingPage";
import HistoryWritingPage from "./pages/HistoryPages/HistoryWritingPage";
import CCLHistorySpeakingPage from "./pages/HistoryPages/CCLHistorySpeakingPage";
import VIPPage from "./pages/VIPPage";
import PersonPage from "./pages/PersonPage";
import WordPage from "./pages/WordPage";
import VoucherPage from "./pages/VoucherPage";
import FreePage from "./pages/FreePage";
import PTEPage from "./pages/PTEPage";
import CCLPage from "./pages/CCLPage";
import HelpPage from "./pages/HelpPage";
import AboutPage from "./pages/AboutPage";

//主页模板下，按侧边栏能显示的页面
class Routes extends React.Component {
    render() {
    return (
      <Switch>
        <Route path='/Home' component={HomePage} />
        <Route path='/IELTS' component={IELTSPage} />
        <Route path='/Person' component={PersonPage} />
        <Route path='/Voucher' component={VoucherPage} />
        <Route path='/VIP' component={VIPPage} />
        <Route path='/Word' component={WordPage} />
        <Route path='/Free' component={FreePage} />
        <Route path='/PTE' component={PTEPage} />
        <Route path='/CCL' component={CCLPage} />
        <Route path='/Help' component={HelpPage} />
        <Route path='/About' component={AboutPage} />

        <Route path='/profile' component={ProfilePage} />
        <Route path='/tables' component={TablesPage} />
        <Route path='/maps' component={MapsPage} />
        <Route path='/404' component={NotFoundPage} />

          <Route exact path='/HistoryPage' component={HistoryHomePage}/>
          <Route path='/HistoryPage/ListeningPage' component={HistoryListingPage}/>
          <Route path='/HistoryPage/SpeakingPage' component={HistorySpeakingPage}/>
          <Route path='/HistoryPage/ReadingPage' component={HistoryReadingPage}/>
          <Route path='/HistoryPage/WritingPage' component={HistoryWritingPage}/>

          <Route exact path='/CCLHistoryPage' component={CCLHistoryHomePage}/>
          <Route path='/CCLHistoryPage/CCLSpeakingPage' component={CCLHistorySpeakingPage}/>
      </Switch>
    );
  }
}

export default Routes;
