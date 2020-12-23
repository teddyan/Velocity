import React, {Component} from 'react';
import axios from 'axios';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

//import css
import '../../../../../css/AdminPages.css'

class AdminIletsExamManagement extends Component{
    state={
        loading:true,
        IletsExamInfo:[],

        NewGlobalUrl:global.config.url.slice(0,-1)
    }


    componentDidMount() {
        // Temp Variable
        let tempIeltsExamInfo=[]

        // User Token verification
        let token = localStorage.getItem('access_token');

        // Only Fetch the Ielts paper
        axios.get(global.config.url + 'AdminHappy/PaperInfo?type=ielts',{headers: {Authorization: `Bearer ${token}`}}).then(res=>{
            console.log(res.data)
            // check Msg to double verify
            if(res.data.msg=='succeed'){
                // use loop to load the response data to the temporarily variable
                res.data.data.map(data=>{
                    tempIeltsExamInfo.push(data)
                })
                // set state
                this.setState({loading:false, IletsExamInfo:tempIeltsExamInfo})
                console.log(this.state.IletsExamInfo)
            }else{
                console.log("Wrong URL or Wrong Info")
            }
        })
    }





    render() {
        // css
        const HeaderSpanWord={
            color:'black',
            fontSize: '1.2em'
        }

        const cellEditProp = {
            mode: 'dbclick',
            afterSaveCell: onAfterSaveCell
        };

        const options = {
            onAddRow: this.onAddRow,
            defaultSortName: 'name',  // default sort column name
        };

        function onAfterSaveCell(row, cellName, cellValue){
            let token = localStorage.getItem('access_token');

            // Paper Name Change
            if(cellName==='Paper_Name'){
                axios.post(global.config.url + 'AdminHappy/updatePaperName',{papername:cellValue,paperid:row.Paper_ID},{headers: {Authorization: `Bearer ${token}`}
                }).then(res=>{
                    if(res.data.msg==='succeed'){
                        alert('Paper Name UpDate Successfully')
                    }else{
                        alert('Error')
                        window.location.href = '/AdminManagement/AdminIletsExamManagement'
                    }
                })
            }
        }

        return(
            <React.Fragment>
                <BootstrapTable
                    hover
                    data={ this.state.IletsExamInfo }
                    search={true}
                    pagination={ true }
                    exportCSV
                    cellEdit={ cellEditProp }
                    options={ options }
                    insertRow={true}
                >
                    <TableHeaderColumn dataSort={ true } dataField='Paper_ID' isKey hiddenOnInsert hidden editable={ false } dataSort><span style={HeaderSpanWord}>Paper_ID</span></TableHeaderColumn>
                    <TableHeaderColumn dataSort={ true } dataField='Paper_Name' dataSort><span style={HeaderSpanWord}>Paper Name</span></TableHeaderColumn>
                    <TableHeaderColumn dataSort={ true } dataField='CreateAt' hiddenOnInsert editable={ false } dataSort><span style={HeaderSpanWord}>CreateAt</span></TableHeaderColumn>
                    <TableHeaderColumn dataSort={ true } dataFormat={this.ListeningFormatting} hiddenOnInsert editable={ false } dataSort={false}><span style={HeaderSpanWord}>Listening</span></TableHeaderColumn>
                    <TableHeaderColumn dataSort={ true } dataFormat={this.SpeakingFormatting} hiddenOnInsert editable={ false } dataSort={false}><span style={HeaderSpanWord}>Speaking</span></TableHeaderColumn>
                    <TableHeaderColumn dataSort={ true } dataFormat={this.ReadingFormatting} hiddenOnInsert editable={ false } dataSort={false}><span style={HeaderSpanWord}>Reading</span></TableHeaderColumn>
                    <TableHeaderColumn dataSort={ true } dataFormat={this.WritingFormatting} hiddenOnInsert editable={ false } dataSort={false}><span style={HeaderSpanWord}>Writing</span></TableHeaderColumn>
                    <TableHeaderColumn dataSort={ true } dataField='isFree' dataFormat={this.FreeFormatting} dataSort><span style={HeaderSpanWord}>Free</span></TableHeaderColumn>
                    <TableHeaderColumn dataSort={ true } dataField='isActive' dataFormat={this.ActiveFormatting} hiddenOnInsert editable={ false } dataSort><span style={HeaderSpanWord}>isActive</span></TableHeaderColumn>
                    </BootstrapTable>
            </React.Fragment>
        )
    }


    ActiveFormatting(cell, row){
        // User Token verification
        let token = localStorage.getItem('access_token');
        let InactiveWarning="Are You Sure Hide The Paper From Public"
        let ActiveWarning="Are You Sure Public The Paper To User"
        return(
            <span>
                {cell=='1'?
                    // If IsActive is true -> deactivated
                    <button className='ControlButton_Active' onClick={
                        this.DeActivate=(e)=> {
                            e.preventDefault()
                            if(cell==1){
                                if (window.confirm(InactiveWarning)) {
                                    axios.post(global.config.url + 'AdminHappy/DeActivePaper', {paperid: row.Paper_ID}, {headers: {Authorization: `Bearer ${token}`}}).then(res => {
                                        if (res.data.msg == 'succeed') {
                                            alert("Mock Exam Paper has been deactivated")
                                            window.location.href = '/AdminManagement/AdminIletsExamManagement'
                                        } else {
                                            alert("Error")
                                        }
                                    })
                                }
                            }

                        }
                    }>Active</button>
                    :
                    // If IsActive is False -> deactivated
                    <button className='ControlButton_Inactive' onClick={
                        this.Activate=(e)=> {
                            e.preventDefault()
                            if(cell==0){
                                if (window.confirm(InactiveWarning)) {
                                    axios.post(global.config.url + 'AdminHappy/ActivePaper', {paperid: row.Paper_ID}, {headers: {Authorization: `Bearer ${token}`}}).then(res => {
                                        if (res.data.msg == 'succeed') {
                                            alert("Mock Exam Paper has been activated")
                                            window.location.href = '/AdminManagement/AdminIletsExamManagement'
                                        }
                                    })
                                }
                            }

                        }
                    }>Disable</button>}
            </span>
        )
    }

    FreeFormatting(cell, row){
        // User Token verification
        let token = localStorage.getItem('access_token');

        let SetPayPaper='Paper Will Start Earn Money From Now'
        let SetFreePaper='Paper Will Be Free Of Charge From Now'

        return(
            <span
                style={{color:cell==1?'Green':'Red'}}>
                {cell=='1'?
                    // If Free is true -> Set unFree
                    <button className='ControlButton_Active' onClick={
                        this.SetUnFree=(e)=> {
                            e.preventDefault()
                            if(cell==1) {
                                if (window.confirm(SetPayPaper)) {
                                    axios.post(global.config.url + 'AdminHappy/PaperSetUnFree', {paperid: row.Paper_ID}, {headers: {Authorization: `Bearer ${token}`}}).then(res => {
                                        if (res.data.msg == 'succeed') {
                                            alert("Paper Set to Pay")
                                            window.location.href = '/AdminManagement/AdminIletsExamManagement'
                                        } else {
                                            alert("Error")
                                        }
                                    })
                                }
                            }

                        }
                    }>Free</button>
                    :
                    // If Free is False -> set Free
                    <button className='ControlButton_Inactive' onClick={
                        this.SetFree=(e)=> {
                            e.preventDefault()
                            if(cell==0){
                                if (window.confirm(SetFreePaper)) {
                                    axios.post(global.config.url + 'AdminHappy/PaperSetFree', {paperid: row.Paper_ID}, {headers: {Authorization: `Bearer ${token}`}}).then(res => {
                                        if (res.data.msg == 'succeed') {
                                            alert("Paper Set to Free")
                                            window.location.href = '/AdminManagement/AdminIletsExamManagement'
                                        } else {
                                            alert("Error")
                                        }
                                    })
                                }
                            }

                        }
                    }>Pay</button>}
            </span>
        )
    }

    ListeningFormatting(cell, row){
        return(
            <React.Fragment>
                <a href={'/AdminManagement/AdminIletsExamManagement/IletsInsertListening?'+row.Paper_ID}>Listening</a>
            </React.Fragment>
        )
    }

    SpeakingFormatting(cell, row){
        return(
            <React.Fragment>
                <a href={'/AdminManagement/AdminIletsExamManagement/IletsInsertSpeaking?'+row.Paper_ID}>Speaking</a>
            </React.Fragment>
        )
    }

    ReadingFormatting(cell, row){
        return(
            <React.Fragment>
                <a href={'/AdminManagement/AdminIletsExamManagement/IletsInsertReading?'+row.Paper_ID}>Reading</a>
            </React.Fragment>
        )
    }

    WritingFormatting(cell, row){
        return(
            <React.Fragment>
                <a href={'/AdminManagement/AdminIletsExamManagement/IletsInsertWriting?'+row.Paper_ID}>Writing</a>
            </React.Fragment>
        )
    }

    // add row success will set state again to update teh ta
    onAddRow(row) {
        // User Token verification
        let token = localStorage.getItem('access_token');
        
        axios.post(global.config.url +  'AdminHappy/InsertIeltsPaper', {isFree:row.isFree, papername:row.Paper_Name},{headers: {Authorization: `Bearer ${token}`}}).then(res=>{
            if(res.data.msg=='succeed'){
                alert("New Mock Paper Added")
                window.location.href='/AdminManagement/AdminIletsExamManagement'
            }else{
                alert("Error")
            }
        })

    }


}
export default AdminIletsExamManagement;