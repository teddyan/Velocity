import React, {Component} from 'react';
import axios from 'axios';

class PTEInsertReading extends Component{

    componentDidMount() {

        console.log(this.props.location.search.slice(1))

        axios.get(global.config.url + 'AdminHappy/GetIeltsReadingInfo?paperid=' + this.props.location.search.slice(1)).then(res=>{
            console.log(res.data)

        })
    }

    render(){
        return(
            <React.Fragment>
                PTEInsertReading
            </React.Fragment>
        )
    }
}
export default PTEInsertReading;