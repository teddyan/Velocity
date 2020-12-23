// import library
import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';

//import TMarking Component
import TMarkPendingList from './TMarkingPages/TMarkPendingList';
import TMarkSpeaking from './TMarkingPages/TMarkSpeaking';
import TMarkWriting from './TMarkingPages/TMarkWriting'

class TMarkingRoute extends Component{
    render(){
        return(
            <Switch>
                <Route exact path='/TMarkinglist' component={TMarkPendingList} />
                <Route path='/TMarkinglist/GetIeltsWritingAnswer' component={TMarkWriting}/>
                <Route path='/TMarkinglist/GetIeltsSpeakingAnswer' component={TMarkSpeaking}/>
            </Switch>
        )
    }
}

export default TMarkingRoute;