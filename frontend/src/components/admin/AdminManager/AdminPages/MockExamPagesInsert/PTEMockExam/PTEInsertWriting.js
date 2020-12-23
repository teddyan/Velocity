import React, {Component} from 'react';
import axios from 'axios';

class PTEInsertWriting extends Component{

    componentDidMount() {

        console.log(this.props.location.search.slice(1))

        axios.get(global.config.url + 'AdminHappy/GetIeltsWritingInfo?paperid=' + this.props.location.search.slice(1)).then(res=>{
            console.log(res.data)

        })
    }

    render(){
        return(
            <React.Fragment>
                PTEWriting
            </React.Fragment>
        )
    }
}
export default PTEInsertWriting;