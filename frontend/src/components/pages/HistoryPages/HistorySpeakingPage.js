import React, {Component} from 'react';
import axios from 'axios';

import {parseTag, submitError} from './HistoryUtility';
import {MDBCard, MDBCardBody, MDBCardHeader, MDBIcon} from "mdbreact";
import {Button} from "antd";


class HistorySpeakingPage extends Component{

    state={
        loading:true,
        SpeakingQ1:[],
        SpeakingQ1_Audio_Question:[],
        SpeakingQ1_Audio_Answer:[],
        SpeakingQ2:'',
        SpeakingQ2_Audio_Answer:'',
        SpeakingQ3:[],
        SpeakingQ3_Audio_Question:[],
        SpeakingQ3_Audio_Answer:[],
        SpeakingScore:'',
        SpeakingComment:'',



        // Speaking Section Display Hidden
        Speaking_Section_1_Hidden:false,
        Speaking_Section_2_Hidden:true,
        Speaking_Section_3_Hidden:true,


        NewGlobalUrl:global.config.url.slice(0,-1)
    }

    componentDidMount() {

        /*
            To fetch data from backend and load to state
         */

        // access Token
        let token = localStorage.getItem('access_token');

        axios.get(global.config.url + 'User/IELTSSpeakingHistoryAnswer?examID=' + this.props.location.search.slice(1), {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res=>{
            console.log(res.data)

            this.setState({
                loading:false,
                SpeakingQ1:res.data.data.SQ1TextArray,
                SpeakingQ1_Audio_Question:res.data.data.SQ1Audio,
                SpeakingQ1_Audio_Answer:res.data.data.SA1Audio,
                SpeakingQ2:parseTag(res.data.data.SQ2Text),
                SpeakingQ2_Audio_Answer:res.data.data.SA2Audio,
                SpeakingQ3:res.data.data.SQ3TextArray,
                SpeakingQ3_Audio_Question:res.data.data.SQ3Audio,
                SpeakingQ3_Audio_Answer:res.data.data.SA3Audio,
                SpeakingScore:res.data.data.SS,
                SpeakingComment:res.data.data.SC,
            })

            /*
                Use Document GetElement By ID to Insert Data into HTML
             */

            // SpeakingQuestion_1 Insert Audio
                // Check whether user audio Deleted
            if(this.state.SpeakingQ1_Audio_Answer.length!='0') {
                for (let i = 0; i < res.data.data.SA1Audio.length; i++) {
                    document.getElementById('UserAudioA1' + i).innerHTML = 'User: <audio controls><source src=' + this.state.NewGlobalUrl + res.data.data.SA1Audio[i] + '><br/>'
                }
            }

            // SpeakingQuestion_2 Insert Audio
                // Check whether user audio deleted
            if(this.state.SpeakingQ2_Audio_Answer!='') {
                document.getElementById('UserAudioA2').innerHTML = 'User: <audio controls><source src=' + this.state.NewGlobalUrl + this.state.SpeakingQ2_Audio_Answer + '></audio><br/>'
            }

            // SpeakingQuestion_3 Insert Audio
                // Check whether user audio Deleted
            if (this.state.SpeakingQ3_Audio_Answer.length!='0') {
                for(let i=0;i<this.state.SpeakingQ3_Audio_Answer.length;i++) {
                    document.getElementById('UserAudioA3' + i).innerHTML = 'User: <audio controls><source src=' + this.state.NewGlobalUrl + res.data.data.SA3Audio[i] + '></audio><br/>'
                }
            }
        })
    }

    render(){
        return(
            <React.Fragment>
                {/*<div style={{paddingBottom:'30px'}}>*/}
                {/*    <button name='Speaking_Section_1_Display' onClick={this.Speaking_Hidden_Display}>Section 1</button>&nbsp;*/}
                {/*    <button name='Speaking_Section_2_Display' onClick={this.Speaking_Hidden_Display}>Section 2</button>&nbsp;*/}
                {/*    <button name='Speaking_Section_3_Display' onClick={this.Speaking_Hidden_Display}>Section 3</button>&nbsp;*/}
                {/*</div>*/}
                <MDBCard className='mt-5' style={{borderRadius: '20px'}}>
                    <MDBCardHeader style={cardHeader}>
                        <MDBIcon icon="arrow-left" onClick={()=>this.props.history.push('/HistoryPage')} className="mr-3" style={{cursor: 'pointer'}}/>
                        雅思口语答案
                        <div style={{float: 'right'}}>
                            <Button onClick={()=>this.Speaking_Hidden_Display(1)}>Section 1</Button>
                            <Button onClick={()=>this.Speaking_Hidden_Display(2)}>Section 2</Button>
                            <Button onClick={()=>this.Speaking_Hidden_Display(3)}>Section 3</Button>
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

                                    <div hidden={this.state.Speaking_Section_1_Hidden}>
                                        <h4>Speaking Section 1</h4>
                                        {
                                            // load the audio from the state (array)
                                            this.state.SpeakingQ1.map((record, i)=>{
                                                return(
                                                    <div key={i} >
                                                        <h5>{record}</h5>
                                                        <span>
                                        Origin:
                                        <audio controls><source src={this.state.NewGlobalUrl+this.state.SpeakingQ1_Audio_Question[i]} /></audio><br/>
                                        <span id={'UserAudioA1'+i}></span>
                                    </span>
                                                        <br/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                    <div hidden={this.state.Speaking_Section_2_Hidden}>
                                        <h4>Speaking Section 2</h4>
                                        <h6 dangerouslySetInnerHTML={{ __html: this.state.SpeakingQ2 }}></h6>
                                        <span id={'UserAudioA2'}></span>
                                    </div>

                                    <div hidden={this.state.Speaking_Section_3_Hidden}>
                                        <h4>Speaking Section 3</h4>
                                        {
                                            // load the audio from the state (array)
                                            this.state.SpeakingQ3.map((record, i)=>{
                                                return(
                                                    <div key={i} style={{paddingBottom:'10px'}}>
                                                        <h6>{record}</h6>
                                                        <span>
                                        Origin:
                                    <audio controls><source src={this.state.NewGlobalUrl+this.state.SpeakingQ3_Audio_Question[i]} /></audio><br/>
                                    </span>
                                                        <span id={'UserAudioA3'+i}></span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                    <div>
                                        <br/>
                                        <h3>{this.state.SpeakingScore!=''?'Speaking Score: '+this.state.SpeakingScore+'': ''}</h3>
                                        <h3>{this.state.SpeakingComment!=''?'Speaking Comment: '+this.state.SpeakingComment+'': ''}</h3>
                                        {this.state.SpeakingComment!=''?<br/>: ''}
                                    </div>

                                </React.Fragment>
                        }
                    </MDBCardBody>
                </MDBCard>

            </React.Fragment>
        )
    }

    Speaking_Hidden_Display=(i)=>{
        if(i===1){
            this.setState({
                Speaking_Section_1_Hidden:false,
                Speaking_Section_2_Hidden:true,
                Speaking_Section_3_Hidden:true,
            })
        }
        if(i===2){
            this.setState({
                Speaking_Section_1_Hidden:true,
                Speaking_Section_2_Hidden:false,
                Speaking_Section_3_Hidden:true,
            })
        }
        if(i===3){
            this.setState({
                Speaking_Section_1_Hidden:true,
                Speaking_Section_2_Hidden:true,
                Speaking_Section_3_Hidden:false,
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

export default HistorySpeakingPage;