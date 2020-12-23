import React, {Component} from 'react';
import axios from 'axios';
import '../../../../css/TeacherPage.css';

// react-Bootstrap-Table
import '../../../../css/react-bootstrap-table-all.min.css'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

let order = 'desc';

class TMarkPendingList extends Component{

    state={
        loading: true,
        ToCheckExam:[]

    }

    // lifecycle to get the data from the database
    componentDidMount() {
        // create a temporary array to store data
        let toCheckExam=[];
        let token = localStorage.getItem('access_token');
        // use axios to fetch data from backend
        axios.get(global.config.url + `Teacher/GetIeltsScoreList`,{
            headers: {Authorization: `Bearer ${token}`}
        }).then(res=>{

            if(res.data.msg=="illegal hack") {
                alert("权限错误");
                window.location.href = '/';
            }

            console.log(res.data.data);
            res.data.data.map((data)=> {
                toCheckExam.push({ExamID:data.ExamID,
                                    UserID:data.user_ID,
                                    ListeningScore:data.Listening_Score,
                                    ReadingScore:data.Reading_Score,
                                    WritingScore:data.Writing_Score,
                                    SpeakingScore:data.Speaking_Score,
                                    IExpert:data.isExpert,
                                    CDate:data.CreateAt,
                                    status:data.Status
                })
            })
            this.setState({loading:false,ToCheckExam:toCheckExam});
            console.log(this.state.ToCheckExam)
        })

    }



    // To show whether need isExpert
    ExpertFormatter(cell, row) {
        return (
            <React.Fragment>
                {cell?'Yes':'No'}
            </React.Fragment>
        );
    }

    // Writing mark formatting
    WritingMarkFormatter(cell,row){
        return(
            <React.Fragment>
                {/*{cell==0?'Pending':cell}*/}
                <a href={'TMarkinglist/GetIeltsWritingAnswer?ExamID='+row.ExamID+ '&'+ row.IExpert} style={{color:cell==0?'red':'black'}}>
                    {cell==0?'pending': cell}
                </a>
            </React.Fragment>
        )
    }

    // Speaking mark Formatting
    SpeakingMarkFormatter(cell,row){
        return(
            <React.Fragment>
                <a href={'TMarkinglist/GetIeltsSpeakingAnswer?ExamID='+row.ExamID+ '&'+ row.IExpert} style={{color:cell==0?'red':'black'}}>
                    {cell==0?'pending': cell}
                </a>

            </React.Fragment>
        )
    }
    // status formatting

    SubmitFormatter(cell,row){
        return(
            <React.Fragment>
                {cell?'Submitted':<button className="btn btn–default" onClick={
                    this.check=(e)=>{
                        e.preventDefault()

                        // PreDefine
                        const ExamID=row.ExamID
                        const UserID=row.UserID
                        const ListeningScore = row.ListeningScore
                        const ReadingScore = row.ReadingScore
                        const WritingScore = row.WritingScore
                        const SpeakingScore = row.SpeakingScore
                        const isExpert = row.IExpert

                        if(WritingScore==0 || SpeakingScore==0){
                            alert("Please Mark the Speaking or Writing")
                        }else {
                            let IsExpertAlert = ''
                            if (isExpert == 1) {
                                IsExpertAlert = 'Make sure double check the Comment'
                            } else {
                                IsExpertAlert = ''
                            }

                            var txt = 'ExamID: ' + ExamID + '\n\n UserID:' + UserID +
                                '\n ListeningScore: ' + ListeningScore +
                                '\n ReadingScore: ' + ReadingScore +
                                '\n WritingScore: ' + WritingScore +
                                '\n SpeakingScore: ' + SpeakingScore +
                                '\n \n Warning!!!!!!!!!!!!!!!!!!!!  \n' +
                                'Please Double Check the Mark' +
                                '\n' + IsExpertAlert
                            ;

                            if (window.confirm(txt)) {
                                let token = localStorage.getItem('access_token');
                                axios.post(global.config.url + 'Teacher/SubmitScoreFinish', {ExamID:ExamID},{
                                    headers: {Authorization: `Bearer ${token}`}
                                }).then(
                                    res =>{
                                        if(res.data.msg='succeed'){
                                            alert('Updated Successfully')
                                            window.location.href='/TMarkinglist'
                                        }else{
                                            alert("error please check your form")
                                        }
                                    }
                                )
                            } else {
                                console.log('no')
                            }
                        }

                    }
                }>Submit</button>}
            </React.Fragment>
        )
    }


    render(){

        const TableTStyle={
            border: '0px',
            borderCollapse: 'collapse',
        }
        const TableHeaderStyle={
            top:'10px',
            border: 'global.config.brown, 1px solid',
            backgroundColor: global.config.brown,
            borderRadius: '15pt',
            height: '60px'
        }
        const TableBodyStyle={
            padding:'10px',
            border: 'global.config.brown, 1px solid',
            borderRadius: '15pt',
            boxShadow: '1px 1px 1px 1px #888888',
            background:'white'
        }
        const TableTrStyle={
            borderRadius: '15pt',
            borderBottom: '1px solid'
        }
        const HeaderSpanWord={
            color:'white',
            fontSize: '1.2em'
        }

        return(
            <div className={'TMarkTableList'} >
                {/*striped hover*/}
                <BootstrapTable data={this.state.ToCheckExam}   hover
                                pagination={ true }
                                tableStyle={TableTStyle}
                                headerStyle={ TableHeaderStyle }
                                bodyStyle={ TableBodyStyle }
                                trStyle={TableTrStyle}
                >
                    <TableHeaderColumn thStyle={{border: '0px'}} tdStyle={{border: '0px'}} dataSort={ true } isKey dataField='ExamID'><span style={HeaderSpanWord}>Exam ID</span></TableHeaderColumn>
                    <TableHeaderColumn thStyle={{border: '0px'}} tdStyle={{border: '0px'}} dataSort={ true } dataField='UserID' hidden><span style={HeaderSpanWord}>UserID</span></TableHeaderColumn>
                    <TableHeaderColumn thStyle={{border: '0px'}} tdStyle={{border: '0px'}} dataSort={ true } dataField='CDate' ><span style={HeaderSpanWord}>Create Date</span></TableHeaderColumn>
                    <TableHeaderColumn thStyle={{border: '0px'}} tdStyle={{border: '0px'}} dataSort={ true } dataField='ListeningScore'><span style={HeaderSpanWord}>Listening Score</span></TableHeaderColumn>
                    <TableHeaderColumn thStyle={{border: '0px'}} tdStyle={{border: '0px'}} dataSort={ true } dataField='ReadingScore'><span style={HeaderSpanWord}>Reading Score</span></TableHeaderColumn>
                    <TableHeaderColumn thStyle={{border: '0px'}} tdStyle={{border: '0px'}} dataSort={ true } dataField='WritingScore' dataFormat={this.WritingMarkFormatter}><span style={HeaderSpanWord}>Writing Score</span></TableHeaderColumn>
                    <TableHeaderColumn thStyle={{border: '0px'}} tdStyle={{border: '0px'}} dataSort={ true } dataField='SpeakingScore' dataFormat={this.SpeakingMarkFormatter}><span style={HeaderSpanWord}>Speaking Score</span></TableHeaderColumn>
                    <TableHeaderColumn thStyle={{border: '0px'}} tdStyle={{border: '0px'}} dataSort={ true } dataField='IExpert' dataFormat={this.ExpertFormatter}><span style={HeaderSpanWord}>Expert</span></TableHeaderColumn>
                    <TableHeaderColumn thStyle={{border: '0px'}} tdStyle={{border: '0px'}} dataSort={ true } dataField='status' dataFormat={this.SubmitFormatter}><span style={HeaderSpanWord}>Submit</span></TableHeaderColumn>
                </BootstrapTable>,


                {/*
                    Loading circle appear when this.state.loading= true
                */}
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

export default TMarkPendingList;
