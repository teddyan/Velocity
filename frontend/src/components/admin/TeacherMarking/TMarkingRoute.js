// import library
import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';

//import TMarking Component
import TMarkPendingList from './TMarkingPages/TMarkPendingList';
import TMarkCCLPendingList from './TMarkingPages/TMarkCCLPendingList';
import TMarkSpeaking from './TMarkingPages/TMarkSpeaking';
import TMarkWriting from './TMarkingPages/TMarkWriting';
import TMarkCCLS1 from './TMarkingPages/TMarkCCLS1';
import TMarkCCLS2 from './TMarkingPages/TMarkCCLS2';

class TMarkingRoute extends Component{
    render(){
        return(
            <Switch>
                {/*IELTS*/}
                <Route exact path='/TMarkinglist' component={TMarkPendingList} />
                <Route path='/TMarkinglist/GetIeltsWritingAnswer' component={TMarkWriting}/>
                <Route path='/TMarkinglist/GetIeltsSpeakingAnswer' component={TMarkSpeaking}/>

                {/*CCL*/}
                <Route exact path='/TMarkinglist/TMarkingCCLlist' component={TMarkCCLPendingList}/>
                <Route path='/TMarkinglist/TMarkingCCLlist/GetCCLS1Answer' component={TMarkCCLS1} />
                <Route path='/TMarkinglist/TMarkingCCLlist/GetCCLS2Answer' component={TMarkCCLS2} />
            </Switch>
        )
    }
}

export default TMarkingRoute;