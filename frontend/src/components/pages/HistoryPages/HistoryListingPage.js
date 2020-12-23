import React, {Component} from 'react';
import axios from 'axios';

import {parseTag, submitError} from './HistoryUtility';
import {MDBCard, MDBCardBody, MDBCardHeader, MDBIcon, MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import {Button, Col, Row} from "antd";
import {Link} from "react-router-dom";

// import {parseTag, submitError} from '../../Utility';

class HistoryListingPage extends Component{

    state={
        loading:true,
        ListeningSection_1:'',
        ListeningSection_2:'',
        ListeningSection_3:'',
        ListeningSection_4:''
    }



    componentDidMount() {
        let token = localStorage.getItem('access_token');

        axios.get(global.config.url + 'User/IELTSListeningHistoryAnswer?examID=' + this.props.location.search.slice(1), {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res=>{
            console.log(res.data)

            this.setState({
                loading:false,
                ListeningSection_1:parseTag(res.data.data.ListeningQuestion.LQ1),
                ListeningSection_2:parseTag(res.data.data.ListeningQuestion.LQ2),
                ListeningSection_3:parseTag(res.data.data.ListeningQuestion.LQ3),
                ListeningSection_4:parseTag(res.data.data.ListeningQuestion.LQ4)
            })

            // use for loop to loop the answer and insert to the HTML
            for(let i=1; i<=40;i++){
                // Temp var
                let LisUser=''
                let LisStandard=''

                // if answer match with Standard
                if(res.data.data.ListeningAnswer["LA"+i.toString()].toLowerCase() == res.data.data.ListeningStandard["LA"+i.toString()].toLowerCase()) {

                    LisUser = res.data.data.ListeningAnswer["LA" + i.toString()]
                    document.getElementById('answer' + i).innerHTML='<input id="CorrectAnswer"  style="border: 1px solid green;" value='+LisUser+'  />'

                }else{
                    //else display User's answer and Standard answer
                    LisUser=res.data.data.ListeningAnswer["LA"+i.toString()]
                    LisStandard = res.data.data.ListeningStandard["LA" + i.toString()]
                    document.getElementById('answer' + i).innerHTML='<input id="WrongAnswer" style="border: 1px solid red;"   value='+LisUser+'>' +
                        ' <span style="color: green" id="CorrectAnswer">' + LisStandard + '</span>'

                }
            }
        }).catch(err => {console.log(err);console.log(err.response);})

    }

    render(){
        return(
            <MDBCard className='mt-5' style={{borderRadius: '20px'}}>
                <MDBCardHeader style={cardHeader}>
                    <MDBIcon icon="arrow-left" onClick={()=>this.props.history.push('/HistoryPage')} className="mr-3" style={{cursor: 'pointer'}}/>
                    雅思听力答案
                </MDBCardHeader>
                <MDBCardBody style={cardBody}>
                    {
                        this.state.loading
                        ?
                        <center>
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span></div>
                        </center>
                        :
                        <React.Fragment>
                            <div dangerouslySetInnerHTML={{__html: this.state.ListeningSection_1}}></div><br/><hr/>
                            <div dangerouslySetInnerHTML={{__html: this.state.ListeningSection_2}}></div><br/><hr/>
                            <div dangerouslySetInnerHTML={{__html: this.state.ListeningSection_3}}></div><br/><hr/>
                            <div dangerouslySetInnerHTML={{__html: this.state.ListeningSection_4}}></div><br/>
                        </React.Fragment>
                    }
                    </MDBCardBody>
            </MDBCard>

        )
    }
}

const cardHeader = {
    backgroundColor: global.config.brown,
    color: 'white',
    fontSize: '14pt',
    borderRadius: '20px 20px 0 0',
    lineHeight:'32px'
}

const cardBody = {
    fontSize: '12pt'
}

export default HistoryListingPage;