import React, {Component} from 'react';
import axios from 'axios';
import '../../../../css/TeacherPage.css';
import {parseTag} from '../../../Utility'


class TMarkCCLS1 extends Component{

    // init state variable
    state={
        loading: true,
        isExpert: "",
        Answer_1: [],
        Answer_2: [],
        CCLC1: "",
        CCLS1: "",
        CCLC2: "",
        CCLS2: "",
        Scenario_Audio_1: [],
        Scenario_Audio_2: [],
        Section1_Audio: [],
        Section2_Audio: [],
        Exam_ID: "",
        isExpert: "",
        Pardon: [],
        // NewGlobalUrl: "http://localhost:8000"
        NewGlobalUrl: global.config.url.slice(0,-1)
    }
// global.config.url
    // life cycle hook that update change when things
    componentDidMount() {
        let token = localStorage.getItem('access_token');
        axios.get(global.config.url +  'Teacher/GetCCLAnswer'+this.props.location.search,{
            headers: {Authorization: `Bearer ${token}`}
        }).then(res=>{
            console.log(res.data)

            // get the Exam_ID from the URL
            let TExamID = this.props.location.search
            TExamID = TExamID.slice(8,-2)

            // get the last number from location.search to define isExpert
            let isExpert = this.props.location.search.slice(-1)

            console.log(isExpert)

            this.setState({
                // load the respond info to the state
                loading:false,
                Answer_1: res.data.data.Answer_1[0],
                Answer_2:res.data.data.Answer_2[0],
                CCLC1: res.data.data.CCLC1,
                CCLS1: res.data.data.CCLS1,
                CCLC2: res.data.data.CCLC2,
                CCLS2: res.data.data.CCLS2,
                Scenario_Audio_1: res.data.data.Scenario_Audio_1[0],
                Scenario_Audio_2: res.data.data.Scenario_Audio_2[0],
                Section1_Audio: res.data.data.Section1_Audio[0],
                Section2_Audio: res.data.data.Section2_Audio[0],
                ExamID: TExamID,
                isExpert: isExpert,
                Pardon: res.data.data.Pardon1[0],
            })
            console.log(this.state)
        })
    }

    // this Used to update the Score and Comment
    ChangeHandler = e =>{
        this.setState({[e.target.name]:e.target.value})
    }

    // submit handler
    submitHandler = (e) =>{
        e.preventDefault()
        let token = localStorage.getItem('access_token');
        // post request
        axios.post(global.config.url + 'Teacher/UpdateCCLScore', {ExamID:this.state.ExamID, CCLS1:this.state.CCLS1, CCLC1:this.state.CCLC1, CCLS2:this.state.CCLS2, CCLC2:this.state.CCLC2},{
            headers: {Authorization: `Bearer ${token}`}
        }).then(

            // detected whether uploaded successfully
            res =>{
                if(res.data.msg='succeed'){
                    alert('Updated Successfully')
                    window.location.href='/TMarkinglist/TMarkingCCLlist'
                }else{
                    alert("error please check your form")
                }
            }
        )
    }


    render() {
        return (
            <div className='TMarkSpeakingOverAll'>
                <h4 className={'ExamIDShow'}>ExamID: {this.state.ExamID}</h4>
                <div className='TMarkSpeakingAllQuestion'>
                    <div className={"TMarkSpeaking_Question"}>
                        <h1>Section 1:</h1>
                        {
                            this.state.Scenario_Audio_1.map((record, i) => {
                                return(
                                    <div key={i}>
                                        <div>Section1 Briefing:</div>
                                        <audio controls>
                                            <source src={this.state.NewGlobalUrl + record} type={"audio/ogg"}/>
                                        </audio>
                                        <br/>
                                        <br/>
                                    </div>
                                )
                            })
                        }
                        {
                            this.state.Section1_Audio.map((record, i) => {
                                return(
                                    <div key={i}>
                                        <div>{i + 1}:</div>

                                        <div>Origin</div>
                                        <audio controls>
                                            <source src={this.state.NewGlobalUrl + record} type={"audio/ogg"}/>
                                        </audio>

                                        <div>Student Answer:</div>
                                        <audio controls>
                                            <source src={this.state.NewGlobalUrl + this.state.Answer_1[i]} type={"audio/ogg"}/>
                                        </audio>
                                        <br/>
                                        <br/>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>

                <div className={'TMarkSpeakingSForm'}>
                    <form onSubmit={this.submitHandler}>
                        <p>Section1 Score: </p>
                        <input
                            type='number'
                            step="0.01"
                            min="0" 
                            max="45"
                            name="CCLS1"
                            value={this.state.CCLS1}
                            onChange={this.ChangeHandler}
                        />
                        {this.state.isExpert==1?<p>Expert Comment:</p>:''}
                        {this.state.isExpert==1?
                        <textarea
                            placeholder={'Enter some text...'}
                            name='CCLC1'
                            value={this.state.CCLC1}
                            onChange={this.ChangeHandler}
                        />:''
                            }

                        <br />
                        <input
                            className="btn btn–default"
                            type="submit"
                        />
                    </form>
                    <div style={{border: "1px solid black", marginLeft: "150px", marginRight: "150px"}}>
                        <div>Pardon times</div>
                        {
                            this.state.Pardon.map((record, i) => {
                                return(
                                    <div key={i}>
                                        <div>{i + 1 + ": " + record.split('_').pop()}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                {
                    this.state.loading?
                        <center>
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span></div>
                        </center>
                        :''
                }
            </div>
        )
    }
}


export default TMarkCCLS1;