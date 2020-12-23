// import React, {Component} from 'react';
// import axios from 'axios';
// import '../../../css/TeacherPage.css';
//
// import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
// // import 'node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
//
//
// class TMarkPendingList extends Component{
//
//     state={
//         loading: true,
//         ToCheckExam:[]
//
//     }
//
//     // lifecycle to get the data from the database
//     componentDidMount() {
//         // create a temporary array to store data
//         let toCheckExam=[];
//
//         // use axios to fetch data from backend
//         axios.get(global.config.url + `Teacher/GetIeltsScoreList`).then(res=>{
//             res.data.data.map((data)=> {
//                 toCheckExam.push([data.ExamID, data.user_ID, data.Listening_Score, data.Reading_Score, data.Writing_Score, data.Speaking_Score, data.isExpert, data.CreateAt, data.Status])
//             })
//             this.setState({loading:false,ToCheckExam:toCheckExam});
//             console.log(this.state.ToCheckExam)
//         })
//
//     }
//
//
//
//     // submit button
//     FinalSubmit=(e)=>{
//         e.preventDefault()
//
//         let ArrayIndex=this.state.ToCheckExam[e.currentTarget.id]
//
//         const ExamID=ArrayIndex[0]
//         const UserID=ArrayIndex[1]
//         const ListeningScore = ArrayIndex[2]
//         const ReadingScore = ArrayIndex[3]
//         const WritingScore = ArrayIndex[4]
//         const SpeakingScore = ArrayIndex[5]
//
//         // check if the Writing and Speaking are marked
//         if(WritingScore==0 || SpeakingScore==0){
//             alert("Please Mark the Speaking or Writing")
//         }else {
//             let IsExpertAlert = ''
//             if (ArrayIndex[6] == 1) {
//                 IsExpertAlert = 'Make sure double check the Comment'
//             } else {
//                 IsExpertAlert = ''
//             }
//
//             var txt = 'ExamID: ' + ExamID + '\n UserID:' + UserID +
//                 '\n ListeningScore: ' + ListeningScore +
//                 '\n ReadingScore: ' + ReadingScore +
//                 '\n WritingScore: ' + WritingScore +
//                 '\n SpeakingScore: ' + SpeakingScore +
//                 '\n \n Warning!!!!!!!!!!!!!!!!!!!!  \n' +
//                 'Please Double Check the Mark' +
//                 '\n' + IsExpertAlert
//             ;
//
//             if (window.confirm(txt)) {
//                 axios.post(global.config.url + 'Teacher/SubmitScoreFinish', {ExamID:ExamID}).then(
//                     res =>{
//                         if(res.data.msg='succeed'){
//                             alert('Updated Successfully')
//                             window.location.href='/TMarkinglist'
//                         }else{
//                             alert("error please check your form")
//                         }
//                     }
//                 )
//             } else {
//                 console.log('no')
//             }
//         }
//
//
//     }
//
//     render(){
//         return(
//             <div className={'TMarkTableList'}>
//                 <table className={'TMarkTable'}>
//                     <thead style={{color:'black', fontWeight:'bold'}}>
//                     <tr>
//                         <th>User_ID</th>
//                         <th>Exam_ID</th>
//                         <th>Date</th>
//                         <th>Listening</th>
//                         <th>Reading</th>
//                         <th>Writing</th>
//                         <th>Speaking</th>
//                         <th>isExpert</th>
//                         <th>Submit</th>
//                     </tr>
//                     </thead>
//                     <tbody color='white'>
//                     {
//                         this.state.ToCheckExam.map((record, i) => {
//                             return (
//                                 <tr key={record[0]}>
//                                     <td style={{display: 'none'}}>{record[0]}</td>
//                                     <td>{record[1]}</td>
//                                     <td>{record[0]}</td>
//                                     <td>{record[7]}</td>
//                                     <td>{record[2]}</td>
//                                     <td>{record[3]}</td>
//                                     <td>
//                                         <a href={'TMarkinglist/GetIeltsWritingAnswer?ExamID='+record[0]+'&'+record[6]} style={{color:record[4]==0?'red':'black'}}>
//                                             {record[4]==0?'pending': record[4]}
//                                         </a>
//                                     </td>
//                                     <td>
//                                         <a href={'TMarkinglist/GetIeltsSpeakingAnswer?ExamID='+record[0]+'&'+record[6]} style={{color:record[5]==0?'red':'black'}}>
//                                             {record[5]==0?'pending': record[5]}
//                                         </a>
//                                     </td>
//                                     <td>{record[6]==1?'Yes':'No'}</td>
//                                     <td>{record[8]==1?'Submitted':<button id={i} className="btn btn–default" onClick={this.FinalSubmit}>Submit</button>}</td>
//                                 </tr>
//                             );
//                         })
//                     }
//                     </tbody>
//                 </table>
//                 {
//                     this.state.loading?
//                         <center>
//                             <div className="spinner-border" role="status">
//                                 <span className="sr-only">Loading...</span></div>
//                         </center>
//                         :''
//                 }
//             </div>
//         )
//     }
// }
//
// export default TMarkPendingList;
