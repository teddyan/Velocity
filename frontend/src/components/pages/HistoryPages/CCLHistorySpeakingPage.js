import React, { Component } from 'react';
import axios from 'axios';

import { parseTag, submitError } from './HistoryUtility';
import { MDBCard, MDBCardBody, MDBCardHeader, MDBIcon } from "mdbreact";
import { Button } from "antd";


class CCLHistorySpeakingPage extends Component {

    state = {
        loading: true,
        SpeakingQ1: [],
        SpeakingQ1_Audio_Question: [],
        SpeakingQ1_Audio_Answer: [],
        SpeakingQ2: [],
        SpeakingQ2_Audio_Question: [],
        SpeakingQ2_Audio_Answer: '',
        SpeakingScore1: '',
        SpeakingComment1: '',
        SpeakingScore2: '',
        SpeakingComment2: '',
        Pardon:'',



        // Speaking Section Display Hidden
        Speaking_Section_1_Hidden: false,
        Speaking_Section_2_Hidden: true,



        NewGlobalUrl: global.config.url.slice(0, -1)
    }

    componentDidMount() {

        /*
            To fetch data from backend and load to state
         */

        // access Token
        let token = localStorage.getItem('access_token');

        axios.get(global.config.url + 'User/CCLSpeakingHistoryAnswer?examID=' + this.props.location.search.slice(1), {
            // axios.get('http://localhost:8000/User/CCLSpeakingHistoryAnswer?examID=' + this.props.location.search.slice(1), {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            console.log(res.data)

            this.setState({
                loading: false,
                SpeakingQ1: res.data.data.Q1ScenarioAudio,
                SpeakingQ1_Audio_Question: res.data.data.Q1Audio,
                SpeakingQ1_Audio_Answer: res.data.data.SA1Audio,
                SpeakingQ2: res.data.data.Q2ScenarioAudio,
                SpeakingQ2_Audio_Question: res.data.data.Q2Audio,
                SpeakingQ2_Audio_Answer: res.data.data.SA2Audio,
                Pardon:res.data.data.Pardon,
                SpeakingScore1: res.data.data.CCLS1,
                SpeakingComment1: res.data.data.CCLC1,
                SpeakingScore2: res.data.data.CCLS2,
                SpeakingComment2: res.data.data.CCLC2
                
            })

            /*
                Use Document GetElement By ID to Insert Data into HTML
             */

            // SpeakingQuestion_1 Insert Audio
            // Check whether user audio Deleted
            if (this.state.SpeakingQ1_Audio_Answer.length != '0') {
                for (let i = 0; i < res.data.data.SA1Audio.length; i++) {
                    document.getElementById('UserAudioA1' + i).innerHTML = 'User: <audio controls><source src=' + this.state.NewGlobalUrl + res.data.data.SA1Audio[i] + '><br/>'
                }
            }

            // SpeakingQuestion_2 Insert Audio
            // Check whether user audio deleted
            // if(this.state.SpeakingQ2_Audio_Answer!='') {
            //     document.getElementById('UserAudioA2').innerHTML = '<audio controls><source src=' + this.state.NewGlobalUrl + this.state.SpeakingQ2_Audio_Answer + '></audio><br/>'
            // }

            // SpeakingQuestion_2 Insert Audio
            // Check whether user audio Deleted
            if (this.state.SpeakingQ2_Audio_Answer.length != '0') {
                for (let i = 0; i < this.state.SpeakingQ2_Audio_Answer.length; i++) {
                    document.getElementById('UserAudioA2' + i).innerHTML = 'User: <audio controls><source src=' + this.state.NewGlobalUrl + res.data.data.SA2Audio[i] + '></audio><br/>'
                }
            }
        })
    }

    render() {
        return (
            <React.Fragment>
                {/*<div style={{paddingBottom:'30px'}}>*/}
                {/*    <button name='Speaking_Section_1_Display' onClick={this.Speaking_Hidden_Display}>Section 1</button>&nbsp;*/}
                {/*    <button name='Speaking_Section_2_Display' onClick={this.Speaking_Hidden_Display}>Section 2</button>&nbsp;*/}
                {/*    <button name='Speaking_Section_3_Display' onClick={this.Speaking_Hidden_Display}>Section 3</button>&nbsp;*/}
                {/*</div>*/}
                <MDBCard className='mt-5' style={{ borderRadius: '20px' }}>
                    <MDBCardHeader style={cardHeader}>
                        <MDBIcon icon="arrow-left" onClick={() => this.props.history.push('/CCLHistoryPage')} className="mr-3" style={{ cursor: 'pointer' }} />
                        CCL口语答案
                        <div style={{ float: 'right' }}>
                            <Button onClick={() => this.Speaking_Hidden_Display(1)}>Section 1</Button>
                            <Button onClick={() => this.Speaking_Hidden_Display(2)}>Section 2</Button>

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
                                        <h4>CCL Section 1</h4>
                                        {
                                            // load the audio from the state (array)
                                            this.state.SpeakingQ1.map((record, i) => {
                                                return (
                                                    <div key={i} >
                                                        <h5>{record}</h5>
                                                        <span>
                                                            Origin:
                                        <audio controls><source src={this.state.NewGlobalUrl + this.state.SpeakingQ1_Audio_Question[i]} /></audio><br />
                                                            <span id={'UserAudioA1' + i}></span>
                                                        </span>
                                                        <br />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>



                                    <div hidden={this.state.Speaking_Section_2_Hidden}>
                                        <h4>CCL Section 2</h4>
                                        {
                                            // load the audio from the state (array)
                                            this.state.SpeakingQ2.map((record, i) => {
                                                return (
                                                    <div key={i} style={{ paddingBottom: '10px' }}>
                                                        <h6>{record}</h6>
                                                        <span>
                                                            Origin:
                                    <audio controls><source src={this.state.NewGlobalUrl + this.state.SpeakingQ2_Audio_Question[i]} /></audio><br />
                                                        </span>
                                                        <span id={'UserAudioA2' + i}></span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                    <div>
                                        <br />
                                        <h3>{this.state.SpeakingScore1 != '' ? 'Speaking 1 Score: ' + this.state.SpeakingScore1 + '' : ''}</h3>
                                        <h3>{this.state.SpeakingComment1 != '' ? 'Speaking 1 Comment: ' + this.state.SpeakingComment1 + '' : ''}</h3>
                                        {this.state.SpeakingComment1 != '' ? <br /> : ''}
                                    </div>
                                    <div>
                                        <br />
                                        <h3>{this.state.SpeakingScore2 != '' ? 'Speaking 2 Score: ' + this.state.SpeakingScore2 + '' : ''}</h3>
                                        <h3>{this.state.SpeakingComment2 != '' ? 'Speaking 2 Comment: ' + this.state.SpeakingComment2 + '' : ''}</h3>
                                        {this.state.SpeakingComment2 != '' ? <br /> : ''}
                                     
                                    </div>
                                    <div>
                                    <h3>{this.state.Pardon != '' ? 'Pardontime ' + this.state.Pardon + '' : ''}</h3>
                                    {this.state.Pardon != '' ? <br /> : ''}
                                    </div>
                                </React.Fragment>
                        }
                    </MDBCardBody>
                </MDBCard>

            </React.Fragment>
        )
    }

    Speaking_Hidden_Display = (i) => {
        if (i === 1) {
            this.setState({
                Speaking_Section_1_Hidden: false,
                Speaking_Section_2_Hidden: true,
            })
        }
        if (i === 2) {
            this.setState({
                Speaking_Section_1_Hidden: true,
                Speaking_Section_2_Hidden: false,

            })
        }

    }


}

const cardHeader = {
    backgroundColor: global.config.brown,
    color: 'white',
    fontSize: '14pt',
    borderRadius: '20px 20px 0 0',
    lineHeight: '32px'
}

const cardBody = {
    fontSize: '12pt'
}

export default CCLHistorySpeakingPage;