import React, {Component} from 'react';
import axios from 'axios';

import {parseTag} from '../../Utility'
import {MDBCard, MDBCardBody, MDBCardHeader, MDBIcon} from "mdbreact";
import {Button} from "antd";

class HistoryWritingPage extends Component{
    state={
        loading:true,
        WQ1:'',
        WA1:'',
        WC1:'',
        WS1:'',
        WQ2:'',
        WA2:'',
        WC2:'',
        WS2:'',

        // Writing Section Display Hidden
        Writing_Section_1_Hidden:false,
        Writing_Section_2_Hidden:true,
    }

    componentDidMount() {
        // access token
        let token = localStorage.getItem('access_token');

        axios.get(global.config.url + 'User/IELTSWritingHistoryAnswer?examID=' + this.props.location.search.slice(1), {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res=>{

            console.log(res.data.data.WritingAnswer.WA1)

            console.log(res.data)
            this.setState({
                loading:false,
                WQ1:parseTag(res.data.data.WritingQuestion.WQ1),
                WA1:res.data.data.WritingAnswer.WA1,
                WC1:res.data.data.WritingComment.WC1,
                WS1:res.data.data.WritingComment.WS1,
                WQ2:parseTag(res.data.data.WritingQuestion.WQ2),
                WA2:res.data.data.WritingAnswer.WA2,
                WC2:res.data.data.WritingComment.WC2,
                WS2:res.data.data.WritingComment.WS2,
            })
            console.log(this.state)
        })

    }

    render(){
        return(
            <React.Fragment>
                {/*<div name='Button_Hidden_Control'>*/}
                {/*    <button name='Writing_Section_1_Hidden' onClick={this.Writing_Section_Hidden_Control}>Section 1</button>&nbsp;*/}
                {/*    <button name='Writing_Section_2_Hidden' onClick={this.Writing_Section_Hidden_Control}>Section 2</button>&nbsp;*/}
                {/*</div>*/}
                <MDBCard className='mt-5' style={{borderRadius: '20px'}}>
                    <MDBCardHeader style={cardHeader}>
                        <MDBIcon icon="arrow-left" onClick={()=>this.props.history.push('/HistoryPage')} className="mr-3" style={{cursor: 'pointer'}}/>
                        雅思写作答案
                        <div style={{float: 'right'}}>
                            <Button onClick={()=>this.Writing_Section_Hidden_Control(1)}>Section 1</Button>
                            <Button onClick={()=>this.Writing_Section_Hidden_Control(2)}>Section 2</Button>
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
                                    <div className={"HistoryWriting"} hidden={this.state.Writing_Section_1_Hidden}>
                                        <h5>{this.state.WS1!=''?'Writing Score: '+this.state.WS1+'': ''}</h5>
                                        <br/>
                                        <div dangerouslySetInnerHTML={{ __html: this.state.WQ1 }}></div><br/>
                                        <p><b>Answer: </b>{this.state.WA1}</p><br/>
                                        {this.state.WC1==''?'':<p><b>Expert Comment: </b>{this.state.WC1}</p>}
                                    </div>

                                    <div className={"HistoryWriting"} hidden={this.state.Writing_Section_2_Hidden}>
                                        <h5>{this.state.WS2!=''?'Writing Score: '+this.state.WS2+'': ''}</h5>
                                        <br/>
                                        <div dangerouslySetInnerHTML={{ __html: this.state.WQ2 }}></div><br/>
                                        <p><b>Answer: </b>{this.state.WA2}</p><br/>
                                        {this.state.WC2===""?'':<p><b>Expert Comment: </b>{this.state.WC2}</p>}
                                    </div>
                                </React.Fragment>
                        }
                    </MDBCardBody>
                </MDBCard>

            </React.Fragment>
        )
    }

    Writing_Section_Hidden_Control=(i)=>{
        if(i===1){
            this.setState({
                Writing_Section_1_Hidden:false,
                Writing_Section_2_Hidden:true,
            })
        }
        if(i===2){
            this.setState({
                Writing_Section_1_Hidden:true,
                Writing_Section_2_Hidden:false,
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

export default HistoryWritingPage;