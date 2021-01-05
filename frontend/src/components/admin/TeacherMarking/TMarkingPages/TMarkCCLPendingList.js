import React, {Component} from 'react';
import axios from 'axios';
import '../../../../css/TeacherPage.css';

// react-Bootstrap-Table
import '../../../../css/react-bootstrap-table-all.min.css'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

let order = 'desc';

class TMarkCCLPendingList extends Component{

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
        axios.get(global.config.url + `Teacher/GetCCLScoreList`,{
            headers: {Authorization: `Bearer ${token}`}
        }).then(res=>{

            if(res.data.msg=="illegal hack") {
                alert("权限错误");
                window.location.href = '/';
            }

            console.log(res.data.data);
            res.data.data.map((data)=> {
                toCheckExam.push({
                    ExamID: data.ExamID,
                    UserID: data.user_ID,
                    Dialogue1_Score: data.Dialogue1_Score,
                    Dialogue2_Score: data.Dialogue2_Score,
                    IExpert: data.isExpert,
                    CDate: data.CreateAt,
                    status: data.Status
                })
            })
            this.setState({
                loading:false,ToCheckExam:toCheckExam
            });
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

    CCLS1MarkFormatter(cell,row) {
        return(
            <React.Fragment>
                {/*{cell==0?'Pending':cell}*/}
                <a href={'/TMarkinglist/TMarkingCCLlist/GetCCLS1Answer?ExamID='+row.ExamID+ '&'+ row.IExpert} style={{color:cell==0?'red':'black'}}>
                    {cell==0?'pending': cell}
                </a>
            </React.Fragment>
        )
    }

    // Speaking mark Formatting
    CCLS2MarkFormatter(cell,row){
        return(
            <React.Fragment>
                <a href={'/TMarkinglist/TMarkingCCLlist/GetCCLS2Answer?ExamID='+row.ExamID+ '&'+ row.IExpert} style={{color:cell==0?'red':'black'}}>
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
                        const Dialogue1_Score = row.Dialogue1_Score
                        const Dialogue2_Score = row.Dialogue2_Score
                        const isExpert = row.IExpert

                        if(Dialogue1_Score==0 || Dialogue2_Score==0){
                            alert("Please Mark the Dialogue1_Score or Dialogue2_Score")
                        }else {
                            let IsExpertAlert = ''
                            if (isExpert == 1) {
                                IsExpertAlert = 'Make sure double check the Comment'
                            } else {
                                IsExpertAlert = ''
                            }

                            var txt = 'ExamID: ' + ExamID + '\n\n UserID:' + UserID +
                                '\n Dialogue1_Score: ' + Dialogue1_Score +
                                '\n Dialogue2_Score: ' + Dialogue2_Score +
                                '\n \n Warning!!!!!!!!!!!!!!!!!!!!  \n' +
                                'Please Double Check the Mark' +
                                '\n' + IsExpertAlert
                            ;

                            if (window.confirm(txt)) {
                                let token = localStorage.getItem('access_token');
                                axios.post(global.config.url + 'Teacher/SubmitCCLScoreFinish', {ExamID:ExamID},{
                                    headers: {Authorization: `Bearer ${token}`}
                                }).then(
                                    res =>{
                                        if(res.data.msg='succeed'){
                                            alert('Updated Successfully')
                                            window.location.href='/TMarkinglist/TMarkingCCLlist'
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
                    <TableHeaderColumn thStyle={{border: '0px'}} tdStyle={{border: '0px'}} dataSort={ true } dataField='Dialogue1_Score' dataFormat={this.CCLS1MarkFormatter}><span style={HeaderSpanWord}>Section1 Score</span></TableHeaderColumn>
                    <TableHeaderColumn thStyle={{border: '0px'}} tdStyle={{border: '0px'}} dataSort={ true } dataField='Dialogue2_Score' dataFormat={this.CCLS2MarkFormatter}><span style={HeaderSpanWord}>Section2 Score</span></TableHeaderColumn>
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

export default TMarkCCLPendingList;
