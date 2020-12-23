import React, {Component} from 'react'
import TMarkPendingList from './TMarkPendingList'
import axios from 'axios';

import {parseTag} from '../../../Utility'

class TMarkWriting extends Component{
    // init the state that used to store data
    state={
        WQ1:'',
        WA1:'',
        WS1:'',
        WC1:'',
        WQ2:'',
        WA2:'',
        WS2:'',
        WC2:'',
        ExamID:'',
        isExpert:''
    };

    componentDidMount(){
        // use axios.get to fetch the data from backend and setState
        let token = localStorage.getItem('access_token');
        axios.get(global.config.url + `Teacher/GetIeltsWritingAnswer`+this.props.location.search,{
            headers: {Authorization: `Bearer ${token}`}
        }).then(res=>{

            // get the Exam_ID from the URL
            let TExamID=this.props.location.search
            TExamID=TExamID.slice(8,-2)

            console.log(TExamID)

            // get the last number from location.search to define isExpert
            let isExpert=this.props.location.search.slice(-1)

            // set state
            this.setState({
                WQ1:parseTag(res.data.data.WQ1_Text),
                WA1:res.data.data.WA1,
                WS1:res.data.data.WS1,
                WC1:res.data.data.WC1,
                WQ2:parseTag(res.data.data.WQ2_Text),
                WA2:res.data.data.WA2,
                WS2:res.data.data.WS2,
                WC2:res.data.data.WC2,
                ExamID:TExamID,
                isExpert: isExpert
            })
        })
    }

    // this Used to update the Score and Comment
    ChangeHandler = e =>{
        this.setState({[e.target.name]:e.target.value})

    };

    // submit handler
    submitHandler = (e) =>{
        e.preventDefault();
        console.log(this.state);
        let token = localStorage.getItem('access_token');
        axios.post(global.config.url + 'Teacher/UpdateIeltsWriting', {ExamID:this.state.ExamID, WS1:this.state.WS1, WC1:this.state.WC1,WS2:this.state.WS2, WC2:this.state.WC2},{
            headers: {Authorization: `Bearer ${token}`}
        }).then(
            res =>{
                if(res.data.msg='succeed'){
                    alert('Updated Successfully')
                    window.location.href='/TMarkinglist'
                }else{
                    alert("error please check your form")
                }
                console.log(res.data)

            }
        )
    }

    render(){
        return(
            <div className="TMarkWritingOverall">
                <h4 className={'ExamIDShow'}>ExamID: {this.state.ExamID}</h4>
                <div className='TMarkWritingAllQuestion'>
                    <div className={"TMarkWriting_Question"}>
                        <h1>Section 1:</h1>
                        <div dangerouslySetInnerHTML={{ __html: this.state.WQ1 }}></div><br/>
                        <p><b>Answer: </b>{this.state.WA1}</p>
                    </div>
                    <div className={"TMarkWriting_Question"}>
                        <h1>Section 2:</h1>
                        <div dangerouslySetInnerHTML={{ __html: this.state.WQ2 }}></div><br/>
                        <p><b>Answer: </b>{this.state.WA2}</p>
                    </div>
                </div>


                <div className="TMarkWritingForm">
                    <form onSubmit={this.submitHandler}>
                        <p>Question 1 Score: </p>
                        <input
                            type='number'
                            name='WS1'
                            step='any'
                            min='0.5'
                            max='10'
                            onChange={this.ChangeHandler}
                            value={this.state.WS1}
                        />
                        <br/>
                        {this.state.isExpert==1?<br/>:''}
                        {this.state.isExpert==1?<p>Question 1 Expert Comment:</p>:''}
                        {this.state.isExpert==1?
                            <textarea
                                name='WC1'
                                value={this.state.WC1}
                                onChange={this.ChangeHandler}
                            />:''}
                        <br />

                        <p>Question 2 Score: </p>
                        <input
                            type='number'
                            name='WS2'
                            step='any'
                            min='0.5'
                            max='10'
                            onChange={this.ChangeHandler}
                            value={this.state.WS2}
                        />

                        <br/>
                        {this.state.isExpert==1?<br/>:''}
                        {this.state.isExpert==1?<p>Question 2 Expert Comment:</p>:''}
                        {this.state.isExpert==1?<textarea
                                name='WC2'
                                value={this.state.WC2}
                                onChange={this.ChangeHandler}
                        />:''}
                        <br />
                        <input
                            type="submit"
                            className="btn btn–default"
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

export default TMarkWriting;