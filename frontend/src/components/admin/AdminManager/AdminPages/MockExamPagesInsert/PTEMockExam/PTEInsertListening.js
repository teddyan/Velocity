import React, {Component} from 'react';
import axios from 'axios';

class PTEInsertListening extends Component{

    componentDidMount() {

        console.log(this.props.location.search.slice(1))

        // axios.get(global.config.url + 'AdminHappy/GetIeltsListeningInfo?paperid=' + this.props.location.search.slice(1)).then(res=>{
        //     console.log(res.data)
        //
        // })
    }
    render(){
        return(
            <React.Fragment>
                PTEInsertListening
            </React.Fragment>
        )
    }
}
export default PTEInsertListening;