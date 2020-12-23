import React, {Component} from 'react';
import axios from 'axios';

import {parseTag, submitError} from './HistoryUtility';


// import css
import '../../../css/HistoryPages.css'
import {MDBCard, MDBCardBody, MDBCardHeader, MDBIcon} from "mdbreact";
import {Button} from "antd";

class HistoryReadingPage extends Component{

    state={
        loading:true,
        // Reading_Questions
        RQ1:'',
        RQ2:'',
        RQ3:'',

        // Reading_Section_Display_Hidden
        Reading_Section_1_Hidden:false,
        Reading_Section_2_Hidden:true,
        Reading_Section_3_Hidden:true,

    }

    componentDidMount() {
        // access token
        let token = localStorage.getItem('access_token');

        axios.get(global.config.url + 'User/IELTSReadingHistoryAnswer?examID=' + this.props.location.search.slice(1), {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res=>{
            console.log(res.data)

            this.setState({
                loading:false,
                RQ1:parseTag(res.data.data.ReadingQuestion.RQ1),
                RQ2:parseTag(res.data.data.ReadingQuestion.RQ2),
                RQ3:parseTag(res.data.data.ReadingQuestion.RQ3),
            })

            console.log(this.state)

            for(let i=1; i<=40;i++){
                let resUser=''
                let resStandard = res.data.data.ReadingStandard["RA" + i.toString()]
                // if answer match with Standard
                if(res.data.data.ReadingAnswer["RA"+i.toString()].toLowerCase() == res.data.data.ReadingStandard["RA"+i.toString()].toLowerCase()) {

                    resUser = res.data.data.ReadingAnswer["RA" + i.toString()]
                    document.getElementById('answer' + i).innerHTML='<input id="CorrectAnswer"  style="border: 1px solid green;" value='+resUser+'  />'

                }else{
                    //else display User's answer and Standard answer
                    resUser=res.data.data.ReadingAnswer["RA"+i.toString()]
                    console.log(resUser)
                    resStandard = res.data.data.ReadingStandard["RA" + i.toString()]

                    document.getElementById('answer' + i).innerHTML='<input id="WrongAnswer" style="border: 1px solid red;"   value='+resUser+'>' +
                        ' <span style="color: green" id="CorrectAnswer">' + resStandard + '</span>'
                    }
            }

        })
    }

    render(){
        return(
            <React.Fragment>
                {/*<div style={{paddingBottom:'30px'}}>*/}
                {/*    <button name='Reading_Section_1_Hidden' onClick={this.Reading_Display_Hidden}>Section 1</button>&nbsp;*/}
                {/*    <button name='Reading_Section_2_Hidden' onClick={this.Reading_Display_Hidden}>Section 2</button>&nbsp;*/}
                {/*    <button name='Reading_Section_3_Hidden' onClick={this.Reading_Display_Hidden}>Section 3</button>&nbsp;*/}
                {/*</div>*/}
                <MDBCard className='mt-5' style={{borderRadius: '20px'}}>
                    <MDBCardHeader style={cardHeader}>
                        <MDBIcon icon="arrow-left" onClick={()=>this.props.history.push('/HistoryPage')} className="mr-3" style={{cursor: 'pointer'}}/>
                        雅思阅读答案
                        <div style={{float: 'right'}}>
                            <Button onClick={()=>this.Reading_Display_Hidden(1)}>Section 1</Button>
                            <Button onClick={()=>this.Reading_Display_Hidden(2)}>Section 2</Button>
                            <Button onClick={()=>this.Reading_Display_Hidden(3)}>Section 3</Button>
                        </div>
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
                                    <div hidden={this.state.Reading_Section_1_Hidden} dangerouslySetInnerHTML={{ __html: this.state.RQ1 }}></div>
                                    <div hidden={this.state.Reading_Section_2_Hidden} dangerouslySetInnerHTML={{ __html: this.state.RQ2 }}></div>
                                    <div hidden={this.state.Reading_Section_3_Hidden} dangerouslySetInnerHTML={{ __html: this.state.RQ3 }}></div>
                                </React.Fragment>
                        }
                    </MDBCardBody>
                </MDBCard>

            </React.Fragment>
        )
    }

    Reading_Display_Hidden=(i)=>{
        if(i===1){
            this.setState({
                Reading_Section_1_Hidden:false,
                Reading_Section_2_Hidden:true,
                Reading_Section_3_Hidden:true,
            })
        }

        if(i===2){
            this.setState({
                Reading_Section_1_Hidden:true,
                Reading_Section_2_Hidden:false,
                Reading_Section_3_Hidden:true,
            })
        }

        if(i===3){
            this.setState({
                Reading_Section_1_Hidden:true,
                Reading_Section_2_Hidden:true,
                Reading_Section_3_Hidden:false,
            })
        }
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

export default HistoryReadingPage;