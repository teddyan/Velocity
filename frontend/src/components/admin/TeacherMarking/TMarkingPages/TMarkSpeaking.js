import React, {Component} from 'react';
import axios from 'axios';
import '../../../../css/TeacherPage.css';
import {parseTag} from '../../../Utility'


class TMarkSpeaking extends Component{

    // init state variable
    state={
        loading:true,
        SQ1_text:'',   // Speaking Question 1 In text
        SA1_audio:[],  // Speaking Answer 1
        SQ2_text:'',
        SA2_audio:[],
        SQ3_text:'',
        SA3_audio:[],
        ExamID:'',
        SS:'',
        SC:'',
        isExpert:'',

        NewGlobalUrl: global.config.url.slice(0,-1)
    }
// global.config.url
    // life cycle hook that update change when things
    componentDidMount(){
        let token = localStorage.getItem('access_token');
        axios.get(global.config.url +  'Teacher/GetIeltsSpeakingAnswer'+this.props.location.search,{
            headers: {Authorization: `Bearer ${token}`}
        }).then(res=>{
            console.log(res.data)

            // get the Exam_ID from the URL
            let TExamID=this.props.location.search
            TExamID=TExamID.slice(8,-2)

            // get the last number from location.search to define isExpert
            let isExpert=this.props.location.search.slice(-1)

            console.log(isExpert)

            this.setState({
                // load the respond info to the state
                loading:false,
                SQ1_text: parseTag(res.data.data.SQ1_Text),
                SA1_audio: res.data.data.SA1,
                SQ2_text: parseTag(res.data.data.SQ2_Text),
                SA2_audio: res.data.data.SA2,
                SQ3_text: parseTag(res.data.data.SQ3_Text),
                SA3_audio: res.data.data.SA3,
                ExamID:TExamID,
                isExpert:isExpert,
                SS:res.data.data.SS,
                SC:res.data.data.SC

            })
            console.log(res.data.data.SA1)
            console.log(res.data.data.SA2)

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
        axios.post(global.config.url + 'Teacher/UpdateIeltsSpeaking', {ExamID:this.state.ExamID, SS:this.state.SS, SC:this.state.SC},{
            headers: {Authorization: `Bearer ${token}`}
        }).then(

            // detected whether uploaded successfully
            res =>{
                if(res.data.msg='succeed'){
                    alert('Updated Successfully')
                    window.location.href='/TMarkinglist'
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
                        <div dangerouslySetInnerHTML={{ __html: this.state.SQ1_text}}></div><br/>
                        {
                            // load the audio from the state (array)
                            this.state.SA1_audio.map((record, i)=>{
                                return(
                                    <div key={i}>
                                        <audio controls>
                                            <source src={this.state.NewGlobalUrl+record} type={"audio/ogg"}/>
                                        </audio>
                                        <br />
                                    </div>
                                )
                            })
                        }

                    </div>

                    <div className={"TMarkSpeaking_Question"}>
                        <h1>Section 2:</h1>
                        <div dangerouslySetInnerHTML={{ __html: this.state.SQ2_text }}></div><br/>
                        {
                            this.state.SA2_audio.map((record, i)=>{
                                return(
                                    <div key={i}>
                                        <audio controls>
                                            <source src={this.state.NewGlobalUrl+record} type={"audio/ogg"}/>
                                        </audio>
                                        <br />
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className={"TMarkSpeaking_Question"}>
                        <h1>Section 3:</h1>
                        <div dangerouslySetInnerHTML={{ __html: this.state.SQ3_text }}></div><br/>
                        {
                            // load the audio from the state (array)
                            this.state.SA3_audio.map((record, i)=>{
                                return(
                                    <audio controls key={i}>
                                        <source src={this.state.NewGlobalUrl+record} type={"audio/ogg"}/>
                                    </audio>
                                )
                            })
                        }
                    </div>

                </div>

                <div className={'TMarkSpeakingSForm'}>
                    <form onSubmit={this.submitHandler}>
                        <p>Question 1 Score: </p>
                        <input
                            type='number'
                            step="0.01"
                            name="SS"
                            value={this.state.SS}
                            onChange={this.ChangeHandler}
                        />
                        {this.state.isExpert==1?<p>Expert Comment:</p>:''}
                        {this.state.isExpert==1?
                        <textarea
                            placeholder={'Enter some text...'}
                            name='SC'
                            value={this.state.SC}
                            onChange={this.ChangeHandler}
                        />:''
                            }

                        <br />
                        <input
                            className="btn btn–default"
                            type="submit"
                        />
                    </form>
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


export default TMarkSpeaking;



