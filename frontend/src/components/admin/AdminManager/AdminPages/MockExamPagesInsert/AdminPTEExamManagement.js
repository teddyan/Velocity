import React, {Component} from 'react';
import axios from 'axios';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';


class AdminPTEExamManagement extends Component{

    componentDidMount() {
        // User Token verification
        let token = localStorage.getItem('access_token');

        // Only Fetch the Ielts paper
        axios.get(global.config.url + 'AdminHappy/PaperInfo?type=pte',{headers: {Authorization: `Bearer ${token}`}}).then(res=>{
            console.log(res.data)
        })
    }

    render() {
        return(
            <React.Fragment>
                <h1>AdminPTEExamPrice</h1>
            </React.Fragment>
        )
    }
}

export default AdminPTEExamManagement;