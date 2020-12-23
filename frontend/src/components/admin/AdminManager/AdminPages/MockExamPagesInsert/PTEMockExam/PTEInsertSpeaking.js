import React, {Component} from 'react';
import axios from 'axios';

class PTEInsertSpeaking extends Component{

    componentDidMount() {

        console.log(this.props.location.search.slice(1))

        axios.get(global.config.url + 'AdminHappy/GetIeltsSpeakingInfo?paperid=' + this.props.location.search.slice(1)).then(res=>{
            console.log(res.data)

        })
    }

    render(){
        return(
            <React.Fragment>
                PETInsertSpeaking
            </React.Fragment>
        )
    }
}
export default PTEInsertSpeaking;