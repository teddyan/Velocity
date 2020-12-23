import React, {Component} from 'react';
import axios from 'axios';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import '../../../../css/AdminPages.css'

class AdminUserManagement extends Component{
    state={
        loading:true,
        UserInfo:[]
    }

    componentDidMount() {
        //Temp Variable
        let TempUserInfo = [];

        // User Token verification
        let token = localStorage.getItem('access_token');
        axios.get(global.config.url + 'AdminHappy/UserInfo',{headers: {Authorization: `Bearer ${token}`}}).then(res=> {

            // Token Check from backend
            if(res.data.msg==="illegal hack") {
                alert("权限错误");
                window.location.href = '/';
            }

            // Verify Success
            if (res.data.msg === 'succeed') {
                res.data.data.map(data => {
                    data["HPassword"]=''
                    TempUserInfo.push(data)
                })
                this.setState({loading: false, UserInfo: TempUserInfo});
            }else{
                alert("Wrong URL or Wrong Info")
            }
        })
    }



    render() {
        // css
        const HeaderSpanWord={
            color:'black',
            fontSize: '1.2em'
        }

        function onAfterSaveCell(row, cellName, cellValue){
            // User Token verification
            let token = localStorage.getItem('access_token');

            // Change Ilets Tickets number    -> AdminHappy/setIeltsVoucher   59
            if(cellName==='ielts_Voucher'){
                axios.post(global.config.url+'AdminHappy/setIeltsVoucher',{userid:row.user_ID, ieltsvoucher:cellValue},{headers: {Authorization: `Bearer ${token}`}
                }).then(res=>{
                    if(res.data.msg==='succeed') {
                        alert('ilets voucher Updated Successfully');
                        window.location.href='/AdminManagement/AdminUserManagement'
                    }
                })
            }

            // Chang PTE Tickets number    -> AdminHappy/setPteVoucher   60
            if(cellName==='pte_Voucher'){
                axios.post(global.config.url+'AdminHappy/setPteVoucher',{userid:row.user_ID, ptevoucher:cellValue},{headers: {Authorization: `Bearer ${token}`}
                }).then(res=>{
                    if(res.data.msg==='succeed') {
                        alert('PTE voucher Updated Successfully');
                        window.location.href='/AdminManagement/AdminUserManagement'
                    }
                })
            }

            // Chang CCL Tickets number    -> AdminHappy/setPteVoucher   61
            if(cellName==='ccl_Voucher'){
                axios.post(global.config.url+'AdminHappy/setCclVoucher',{userid:row.user_ID, cclvoucher:cellValue},{headers: {Authorization: `Bearer ${token}`}
                }).then(res=>{
                    if(res.data.msg==='succeed') {
                        alert('CCL voucher Updated Successfully');
                        window.location.href='/AdminManagement/AdminUserManagement'
                    }
                })
            }

            // Chang Ilets Expert Tickets number    -> AdminHappy/setPteVoucher   61
            if(cellName==='expert_ielts_Voucher'){
                axios.post(global.config.url+'AdminHappy/setIeltsExpertVoucher',{userid:row.user_ID, ieltsexpertvoucher:cellValue},{headers: {Authorization: `Bearer ${token}`}
                }).then(res=>{
                    if(res.data.msg==='succeed') {
                        alert('Ilets Expert voucher Updated Successfully');
                        window.location.href='/AdminManagement/AdminUserManagement'
                    }
                })
            }

            // Chang PTE Expert Tickets number    -> AdminHappy/setPteVoucher   61
            if(cellName==='expert_pte_Voucher'){
                axios.post(global.config.url+'AdminHappy/setPteExpertVoucher',{userid:row.user_ID, pteexpertvoucher:cellValue},{headers: {Authorization: `Bearer ${token}`}
                }).then(res=>{
                    if(res.data.msg==='succeed') {
                        alert('PTE Expert voucher Updated Successfully');
                        window.location.href='/AdminManagement/AdminUserManagement'
                    }
                })
            }

            // Chang CCL Expert Tickets number    -> AdminHappy/setPteVoucher   61
            if(cellName==='expert_ccl_Voucher'){
                axios.post(global.config.url+'AdminHappy/setCclExpertVoucher',{userid:row.user_ID, cclexpertvoucher:cellValue},{headers: {Authorization: `Bearer ${token}`}
                }).then(res=>{
                    if(res.data.msg==='succeed') {
                        alert('CCL Expert voucher Updated Successfully');
                        window.location.href='/AdminManagement/AdminUserManagement'
                    }
                })
            }

            // Change Role   -> /AdminHappy/setRoleID   -> Check Role value before pass to server
            if(cellName==='role_ID') {
                if (cellValue >= 0 && cellValue <= 2) {
                    axios.post(global.config.url + 'AdminHappy/setRoleID', {userid: row.user_ID, roleid: cellValue}, {
                        headers: {Authorization: `Bearer ${token}`}
                    }).then(res => {
                        if (res.data.msg === 'succeed') {
                            alert('Role Updated Successfully');
                            window.location.href = '/AdminManagement/AdminUserManagement'
                        }
                    })
                }else{
                    alert("Incorrect Input: !!!!!!!!!!!!!!!!!!!!!! \n\nPlease Choose As following: \nAdmin:0 \nTeacher:1 \nStudent:2\n")
                    window.location.href = '/AdminManagement/AdminUserManagement'
                }
            }

            // Change VIP Start Date   -> /AdminHappy/setVIPStart   66
            if(cellName==='VIPStart'){
                axios.post(global.config.url+'AdminHappy/setVIPStart',{userid:row.user_ID, vipstart:cellValue},{headers: {Authorization: `Bearer ${token}`}
                }).then(res=>{
                    if(res.data.msg==='succeed') {
                        alert('VIP Start Updated Successfully');
                        window.location.href='/AdminManagement/AdminUserManagement'
                    }
                })
            }

            // Change VIP Start Date   ->  /AdminHappy/setAudioTime   -> /AdminHappy/setVIPEnd   66
            if(cellName==='VIPEnd'){
                axios.post(global.config.url+'AdminHappy/setVIPEnd',{userid:row.user_ID, vipend:cellValue},{headers: {Authorization: `Bearer ${token}`}
                }).then(res=>{
                    if(res.data.msg==='succeed') {
                        alert('VIP End Updated Successfully');
                        window.location.href='/AdminManagement/AdminUserManagement'
                    }
                })
            }

            // Change Audio Time   ->  /AdminHappy/setAudioTime 79
            if(cellName==='AudioTime'){
                axios.post(global.config.url+'AdminHappy/setAudioTime',{userid:row.user_ID, audiotime:cellValue},{headers: {Authorization: `Bearer ${token}`}
                }).then(res=>{
                    if(res.data.msg==='succeed') {
                        alert('Audio Time Updated Successfully');
                        window.location.href='/AdminManagement/AdminUserManagement'
                    }else{
                        alert('Error')
                    }
                })
            }
        }

        const cellEditProp = {
            mode: 'dbclick',
            afterSaveCell: onAfterSaveCell
        };

        const options = {
            onAddRow: this.onAddRow

        };

        return(
            <React.Fragment>
                <BootstrapTable hover
                    data={ this.state.UserInfo }

                    // Function
                    ignoreSinglePage
                    insertRow={true}
                    search={true}
                    pagination={ true }
                    exportCSV
                    cellEdit={ cellEditProp }
                    options={ options }
                >
                    <TableHeaderColumn width='150' dataSort={ true } editable={ { type: 'textarea' } } dataField='Email' isKey><span style={HeaderSpanWord}>Email</span></TableHeaderColumn>
                    <TableHeaderColumn width='150' dataSort={ true } dataField='HPassword' hidden><span style={HeaderSpanWord}>Password</span></TableHeaderColumn>
                    <TableHeaderColumn width='150' dataSort={ true } dataField='username'><span style={HeaderSpanWord}>Username</span></TableHeaderColumn>
                    <TableHeaderColumn width='150' dataSort={ true } dataField='user_ID' hiddenOnInsert><span style={HeaderSpanWord}>User ID</span></TableHeaderColumn>
                    <TableHeaderColumn width='150' dataSort={ true } dataField='ielts_Voucher' hiddenOnInsert><span style={HeaderSpanWord}>ielts Voucher</span></TableHeaderColumn>
                    <TableHeaderColumn width='180' dataSort={ true } dataField='expert_ielts_Voucher' hiddenOnInsert><span style={HeaderSpanWord}>ilets Expert Voucher</span></TableHeaderColumn>
                    <TableHeaderColumn width='150' dataSort={ true } dataField='pte_Voucher' hiddenOnInsert><span style={HeaderSpanWord}>PTE Voucher</span></TableHeaderColumn>
                    <TableHeaderColumn width='180' dataSort={ true } dataField='expert_pte_Voucher' hiddenOnInsert><span style={HeaderSpanWord}>PTE Expert Voucher</span></TableHeaderColumn>
                    <TableHeaderColumn width='150' dataSort={ true } dataField='ccl_Voucher' hiddenOnInsert><span style={HeaderSpanWord}>CCL Voucher</span></TableHeaderColumn>
                    <TableHeaderColumn width='180' dataSort={ true } dataField='expert_ccl_Voucher' hiddenOnInsert><span style={HeaderSpanWord}>CCL Expert Voucher</span></TableHeaderColumn>
                    <TableHeaderColumn width='150' dataSort={ true } dataFormat={this.VIPStatusFormatting}  dataField='isVIP' hiddenOnInsert editable={ false }><span style={HeaderSpanWord}>VIP Status</span></TableHeaderColumn>
                    <TableHeaderColumn width='200' dataSort={ true } dataField='VIPStart' hiddenOnInsert><span style={HeaderSpanWord}>VIP Start Date</span></TableHeaderColumn>
                    <TableHeaderColumn width='200' dataSort={ true } dataField='VIPEnd' hiddenOnInsert><span style={HeaderSpanWord}>VIP End Date</span></TableHeaderColumn>
                    <TableHeaderColumn width='150' dataSort={ true } dataField='Country' hiddenOnInsert editable={ false }><span style={HeaderSpanWord}>Country</span></TableHeaderColumn>
                    <TableHeaderColumn width='150' dataSort={ true } dataField='City' hiddenOnInsert editable={ false }><span style={HeaderSpanWord}>City</span></TableHeaderColumn>
                    <TableHeaderColumn width='150' dataSort={ true } dataField='AudioTime' hiddenOnInsert><span style={HeaderSpanWord}>AudioTime</span></TableHeaderColumn>
                    <TableHeaderColumn width='150' dataSort={ true } dataFormat={this.RoleStatusFormatting} dataField='role_ID'><span style={HeaderSpanWord}>Role</span></TableHeaderColumn>
                    <TableHeaderColumn width='150' dataSort={ true } dataFormat={this.ActiveStatusFormatting} dataField='isActive' hiddenOnInsert editable={ false }><span style={HeaderSpanWord}>Active Status</span></TableHeaderColumn>
                </BootstrapTable>
            </React.Fragment>
        )
    }


    /*
        Column Formatting ---------------------------------------------
     */

    VIPStatusFormatting(cell, row){
        // User Token verification
        let token = localStorage.getItem('access_token');
        let InactiveWarning='Are You Sure Disable User\'s VIP';
        let ActiveWarning='Are You Sure Enable User\'s VIP';

        return (
            <span style={{color:cell===1?'Green':'Red'}}>
                {cell===1?
                    <button className='ControlButton_Active' onClick={
                        this.DisableVIP = (e) => {
                            if (window.confirm(InactiveWarning)) {
                                axios.post(global.config.url + 'AdminHappy/unSetVIP', {userid: row.user_ID}, {
                                    headers: {Authorization: `Bearer ${token}`}
                                }).then(res => {
                                    if (res.data.msg === 'succeed') {
                                        alert('VIP deactivated Successfully');
                                        window.location.href = '/AdminManagement/AdminUserManagement'
                                    }
                                })
                            }
                        }
                    }>Active VIP</button>
                :
                    <button className='ControlButton_Inactive' onClick={
                        this.DisableVIP = (e) => {
                            if (window.confirm(ActiveWarning)) {
                                axios.post(global.config.url + 'AdminHappy/SetVIP', {userid: row.user_ID}, {
                                    headers: {Authorization: `Bearer ${token}`}
                                }).then(res => {
                                    if (res.data.msg === 'succeed') {
                                        alert('VIP Activated Successfully');
                                        window.location.href = '/AdminManagement/AdminUserManagement'
                                    }
                                })
                            }
                        }
                    }>Inactive VIP</button>
                }
            </span>
        );
    }

    RoleStatusFormatting(cell, row) {
        let Role = '';
        if (cell < 3 & cell>=0){
            if (cell === 0) {
                Role = 'Admin'
            } else if (cell === 1) {
                Role = 'Teacher'
            } else if (cell = 2) {
                Role = 'Student'
            }
        }else{
            Role='Error'
        }
        return(
            <React.Fragment>
                {Role}
            </React.Fragment>
        )
    }

    ActiveStatusFormatting(cell, row){
        // User Token verification
        let token = localStorage.getItem('access_token');
        let InactiveWarning='Are You Sure Change User To Inactive'
        let ActiveWarning='Are You Sure Change User To Active'
        return(
            <span>
                {cell===1?
                    <button className='ControlButton_Active' onClick={
                        this.DisableActive=(e)=> {
                            if (window.confirm(InactiveWarning)) {
                                axios.post(global.config.url + 'AdminHappy/UserSetDeActive', {userID: row.user_ID}, {
                                    headers: {Authorization: `Bearer ${token}`}
                                }).then(res => {
                                    if (res.data.msg === 'succeed') {
                                        alert('Deactivated Successfully');
                                        window.location.href = '/AdminManagement/AdminUserManagement'
                                    } else {
                                        alert("Error")
                                    }
                                })
                            }
                        }
                    }
                    >Active</button>
                    :
                    <button className='ControlButton_Inactive' onClick={
                        this.EnableActive=(e)=> {
                            if (window.confirm(ActiveWarning)) {
                                axios.post(global.config.url + 'AdminHappy/UserSetActive', {userID: row.user_ID}, {
                                    headers: {Authorization: `Bearer ${token}`}
                                }).then(res => {
                                    console.log(res.data)
                                    if (res.data.msg === 'succeed') {
                                        alert('Activated Successfully');
                                        window.location.href = '/AdminManagement/AdminUserManagement'
                                    } else {
                                        alert("Error")
                                    }
                                })
                            }
                        }
                    }
                    >Inactive</button>
                }
            </span>
        )
    }

    onAddRow(row) {
        // User Token verification
        let token = localStorage.getItem('access_token');

        // add User function
        axios.post(global.config.url+'AdminHappy/addAccount',{email:row.Email,password:row.HPassword, username:row.username, roleid:row.role_ID},{headers: {Authorization: `Bearer ${token}`}
        }).then(res=>{
            if(res.data.msg==='succeed') {
                alert('New User Added');
                window.location.href = '/AdminManagement/AdminUserManagement'
            }
        })
    }

}
export default AdminUserManagement;