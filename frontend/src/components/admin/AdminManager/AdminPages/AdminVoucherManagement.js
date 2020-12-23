import React, {Component} from 'react';
import axios from 'axios';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {Modal, Button, Row, Col, Divider, Switch} from "antd";


class AdminVoucherManagement extends Component{

    state={
        loading:true,
        TempProManagement:[],
        TempMonthlyVoucher:[],

        // Modal Display Control
        UserVoucherModal:false,
        PublicVoucherModal:false,
        EventVoucherModal:false,

        // Voucher Submit
            // Person Voucher Submit
        V_User_Name:'',    V_User_Value:'',    V_User_Comment:'',   V_User_Duration:'', V_User_UserID:'',

            // Public Voucher Submit
        V_Pub_Code:'',       V_Pub_Name:'',        V_Pub_Value:'',        V_Pub_Comment:'',        V_Pub_Duration:'',

            // Public Voucher Submit
        V_Act_Number:'',        V_Act_Activity:'',        V_Act_Value:'',        V_Act_Duration:'',

        // Voucher Type Hidden
        Daily_Voucher_Management_Hidden:false,
        Monthly_Voucher_Management_Hidden:true,

    }

    componentDidMount() {
        // User Token verification
        let token = localStorage.getItem('access_token');

        // Temp Promotion info
        let TempProManagement=[]
        axios.get(global.config.url + 'AdminHappy/GetPromoInfo',{headers: {Authorization: `Bearer ${token}`}}).then(res=>{
            // for loop to push
            res.data.data.map(data=>{
                // Append a new field to Json
                data['DeleteVoucher'] = 'Delete'
                TempProManagement.push(data)
            })

            // Set state
            this.setState({loading:false, TempProManagement:TempProManagement})
        })


        // Temp Monthly Promotion Info
        axios.get(global.config.url + 'AdminHappy/GetAllVipPower').then(res=>{
            console.log(res.data)
            this.setState({TempMonthlyVoucher:res.data.data})
            console.log(this.state)
        })

    }

    render() {
        return(
            <React.Fragment>
                <div className='Display_Button' style={{paddingBottom:'30px'}}>
                    <button name='Voucher_Hidden_Display_Daily' onClick={this.Voucher_Type_Hidden_Control} >Daily Voucher Management</button>
                    <button name='Voucher_Hidden_Display_Month' onClick={this.Voucher_Type_Hidden_Control}>Monthly Voucher Management</button>
                </div>

                <div name='Daily_Voucher_Management' hidden={this.state.Daily_Voucher_Management_Hidden} >
                    <div className='Voucher_Generate_Button_And_Modal'>
                        <button className='Voucher_Generate_Button_Control' name='UserVoucherGenerateButton' onClick={this.Voucher_All_Modal_Display}>专人卷</button>&nbsp;
                        <Modal
                                title={"专人优惠卷生成"}
                                okText={'Submit'}
                                cancelText={'Cancel'}
                                onOk={this.UserVoucherGenerate}
                                onCancel={() => this.setState({UserVoucherModal: false})}
                                visible={this.state.UserVoucherModal}
                                centered
                                width='50%'
                            >
                                <div className='User_Voucher_Modal'>
                                    <div><span>用户的ID：</span><input className='Modal_Daily_Voucher_update' name='V_User_UserID' onChange={this.Voucher_OnChange_Handler} value={this.state.V_User_UserID}/></div><br/>
                                    <div><span>优惠卷名称：</span><input className='Modal_Daily_Voucher_update' name='V_User_Name' onChange={this.Voucher_OnChange_Handler} value={this.state.V_User_Name}/></div><br/>
                                    <div><span>优惠卷价值：</span><input className='Modal_Daily_Voucher_update' name='V_User_Value' onChange={this.Voucher_OnChange_Handler} value={this.state.V_User_Value}/></div><br/>
                                    <div><span>优惠卷备注：</span><input className='Modal_Daily_Voucher_update' name='V_User_Comment' onChange={this.Voucher_OnChange_Handler} value={this.state.V_User_Comment}/></div><br/>
                                    <div><span>优惠卷时效：</span><input className='Modal_Daily_Voucher_update' name='V_User_Duration' onChange={this.Voucher_OnChange_Handler} value={this.state.V_User_Duration}/></div>
                                </div>
                            </Modal>

                        <button className='Voucher_Generate_Button_Control' name='PublicVoucherGenerateButton' onClick={this.Voucher_All_Modal_Display}>通用卷</button>&nbsp;

                            <Modal
                                title={"通用优惠卷生成"}
                                okText={'Submit'}
                                cancelText={'Cancel'}
                                onOk={this.PublicVoucherGenerate}
                                onCancel={() => this.setState({PublicVoucherModal: false})}
                                visible={this.state.PublicVoucherModal}
                                centered
                                width='40%'
                            >
                                <div className='Public_Voucher_Modal'>
                                    <div><span>优惠卷码：</span><input className='Modal_Daily_Voucher_update' name='V_Pub_Code' onChange={this.Voucher_OnChange_Handler} value={this.state.V_Pub_Code}/></div><br/>
                                    <div><span>优惠卷名称：</span><input className='Modal_Daily_Voucher_update' name='V_Pub_Name' onChange={this.Voucher_OnChange_Handler} value={this.state.V_Pub_Name}/></div><br/>
                                    <div><span>优惠卷价值：</span><input className='Modal_Daily_Voucher_update' name='V_Pub_Value' onChange={this.Voucher_OnChange_Handler} value={this.state.V_Pub_Value}/></div><br/>
                                    <div><span>优惠卷备注：</span><input className='Modal_Daily_Voucher_update' name='V_Pub_Comment' onChange={this.Voucher_OnChange_Handler} value={this.state.V_Pub_Comment}/></div><br/>
                                    <div><span>优惠卷时效：</span><input className='Modal_Daily_Voucher_update' name='V_Pub_Duration' onChange={this.Voucher_OnChange_Handler} value={this.state.V_Pub_Duration}/></div>
                                </div>
                            </Modal>

                        <button className='Voucher_Generate_Button_Control' name='EventVoucherGenerateButton' onClick={this.Voucher_All_Modal_Display}>活动生产卷</button>&nbsp;

                            <Modal
                                title={"活动优惠卷生成"}
                                okText={'Submit'}
                                cancelText={'Cancel'}
                                onOk={this.EventVoucherGenerate}
                                onCancel={() => this.setState({EventVoucherModal: false, record: false})}
                                visible={this.state.EventVoucherModal}
                                centered
                                width='40%'
                            >
                                <div className='Activity_Voucher_Modal'>
                                    <div><span>优惠卷数量：</span><input className='Modal_Daily_Voucher_update' type='number' name='V_Act_Number' onChange={this.Voucher_OnChange_Handler}  value={this.state.V_Act_Number}/></div><br/>
                                    <div><span>优惠卷活动：</span><input className='Modal_Daily_Voucher_update' name='V_Act_Activity' onChange={this.Voucher_OnChange_Handler} value={this.state.V_Act_Activity}/></div><br/>
                                    <div><span>优惠卷价值：</span><input className='Modal_Daily_Voucher_update' name='V_Act_Value' onChange={this.Voucher_OnChange_Handler} value={this.state.V_Act_Value}/></div><br/>
                                    <div><span>优惠卷时效：</span><input className='Modal_Daily_Voucher_update' name='V_Act_Duration' onChange={this.Voucher_OnChange_Handler} value={this.state.V_Act_Duration}/></div>
                                </div>
                            </Modal>
                    </div>

                    <BootstrapTable
                        data={ this.state.TempProManagement }
                        ignoreSinglePage
                        search={true}
                        pagination={ true }
                        exportCSV
                    >
                        <TableHeaderColumn dataSort={ true } width='150' dataField='Promot_code'>Promotion code</TableHeaderColumn>
                        <TableHeaderColumn dataSort={ true }  width='180' dataField='Promot_code_name'>Promotion Code Name</TableHeaderColumn>
                        <TableHeaderColumn dataSort={ true } width='150' dataField='user_ID' isKey>User ID</TableHeaderColumn>
                        <TableHeaderColumn dataSort={ true } width='150' dataField='user_ID_collection'>User ID collection</TableHeaderColumn>
                        <TableHeaderColumn dataSort={ true } width='150' dataField='Comment'>Comment</TableHeaderColumn>
                        <TableHeaderColumn dataSort={ true } width='150' dataField='duration'>Duration</TableHeaderColumn>
                        <TableHeaderColumn dataSort={ true } width='150' dataField='value'>Value</TableHeaderColumn>
                        <TableHeaderColumn dataSort={ true } width='150' dataFormat={this.ActiveStatusFormatting} dataField='isAvaliable'>isAvaliable</TableHeaderColumn>
                        <TableHeaderColumn dataSort={ true } width='150' dataFormat={this.DeleteVoucherFormatting} dataField='DeleteVoucher'>Delete Voucher</TableHeaderColumn>
                    </BootstrapTable>
                </div>

                <div name='Monthly_Voucher_Management' hidden={this.state.Monthly_Voucher_Management_Hidden}>

                    <div>
                        <h5>CCL</h5>
                        <input className='MonthlyVoucherUpdate' type='number' name='ccl_Voucher' value={this.state.TempMonthlyVoucher.ccl_Voucher} onChange={this.Voucher_OnChange_Handler}/>
                    </div><br/>
                    <div>
                        <h5>expert_ccl_Voucher</h5>
                        <input className='MonthlyVoucherUpdate' type='number' name='expert_ccl_Voucher' value={this.state.TempMonthlyVoucher.expert_ccl_Voucher} onChange={this.Voucher_OnChange_Handler}/>
                    </div><br/>
                    <div>
                        <h5>ielts_Voucher</h5>
                        <input className='MonthlyVoucherUpdate' type='number' name='ielts_Voucher' value={this.state.TempMonthlyVoucher.ielts_Voucher} onChange={this.Voucher_OnChange_Handler}/>
                    </div><br/>
                    <div>
                        <h5>expert_ielts_Voucher</h5>
                        <input className='MonthlyVoucherUpdate' type='number' name='expert_ielts_Voucher' value={this.state.TempMonthlyVoucher.expert_ielts_Voucher} onChange={this.Voucher_OnChange_Handler}/>
                    </div><br/>
                    <div>
                        <h5>pte_Voucher</h5>
                        <input className='MonthlyVoucherUpdate' type='number' name='pte_Voucher' value={this.state.TempMonthlyVoucher.pte_Voucher} onChange={this.Voucher_OnChange_Handler}/>
                    </div><br/>
                    <div>
                        <h5>expert_pte_Voucher</h5>
                        <input className='MonthlyVoucherUpdate' type='number' name='expert_pte_Voucher' value={this.state.TempMonthlyVoucher.expert_pte_Voucher} onChange={this.Voucher_OnChange_Handler}/>
                    </div><br/>
                    <button onClick={this.Monthly_Voucher_Edit_Control_submit}>Submit</button>
                </div>
            </React.Fragment>
        )
    }

    Voucher_Type_Hidden_Control=(e)=>{
        if(e.target.name==='Voucher_Hidden_Display_Daily'){
            this.setState({
                Daily_Voucher_Management_Hidden:false,
                Monthly_Voucher_Management_Hidden:true,
            })
        }
        if(e.target.name==='Voucher_Hidden_Display_Month'){
            this.setState({
                Daily_Voucher_Management_Hidden:true,
                Monthly_Voucher_Management_Hidden:false,
            })
        }
    }

    // Voucher Active Status Formatting
    ActiveStatusFormatting(cell, row){
        // User Token verification
        let token = localStorage.getItem('access_token');
        let InactiveWarning='Are You Sure Change Voucher To Inactive'
        let ActiveWarning='Are You Sure Change Voucher To Active'
        return(
            <span>
                {cell === '1' ?
                    <button className='ControlButton_Active' onClick={
                        this.DeActivate=(e)=> {
                            e.preventDefault()
                            if (window.confirm(InactiveWarning)) {
                                axios.post(global.config.url + 'AdminHappy/ChangeCodeStatus', {code: row.Promot_code}, {headers: {Authorization: `Bearer ${token}`}}).then(res => {
                                    if (res.data.msg === 'succeed') {
                                        alert("Voucher has been activated")
                                        window.location.href = '/AdminManagement/AdminVoucherManagement'
                                    } else {
                                        alert("Error")
                                    }
                                })
                            }

                        }
                    }>activated</button>
                    :
                    <button className='ControlButton_Inactive' onClick={
                        this.Activate=(e)=> {
                            e.preventDefault()
                            if (window.confirm(ActiveWarning)) {
                                axios.post(global.config.url + 'AdminHappy/ChangeCodeStatus', {code: row.Promot_code}, {headers: {Authorization: `Bearer ${token}`}}).then(res => {
                                    if (res.data.msg === 'succeed') {
                                        alert("Voucher has been deactivated")
                                        window.location.href = '/AdminManagement/AdminVoucherManagement'
                                    } else {
                                        alert("Error")
                                    }
                                })
                            }
                        }
                    }>deactivated</button>
                }
            </span>
        )
    }

    // Voucher Delete Formatting
    DeleteVoucherFormatting(cell,row){
        let token = localStorage.getItem('access_token');
        return(
            <button className='ControlButton_Inactive'
            onClick={this.DeleteVoucher=(e)=>{
                e.preventDefault()
                if(window.confirm('Are You Sure Delete This Voucher')){
                    axios.post(global.config.url + 'AdminHappy/DeleteCode',{code: row.Promot_code},{headers: {Authorization: `Bearer ${token}`}}).then(res =>{
                        if(res.data.msg==='succeed'){
                            alert("Voucher has been Deleted")
                            window.location.href = '/AdminManagement/AdminVoucherManagement'
                        }else{
                            alert('Error')
                        }
                    })
                }
            }}
            >Delete</button>
        )
    }

    // Voucher Modal Display
    Voucher_All_Modal_Display=(e)=>{

        if(e.target.name==='UserVoucherGenerateButton'){
            this.setState({UserVoucherModal:true})
        }

        if(e.target.name==='PublicVoucherGenerateButton'){
            this.setState({PublicVoucherModal:true})
        }

        if(e.target.name==='EventVoucherGenerateButton'){
            this.setState({EventVoucherModal:true})
        }
    }

    //OnChangeHandler
    Voucher_OnChange_Handler=(e)=>{
        if(e.target.className==='Modal_Daily_Voucher_update') {
            // Modal On Change Handler
            this.setState({
                [e.target.name]: e.target.value
            })
        }

        if(e.target.className==='MonthlyVoucherUpdate'){
            let MonthlyVoucherUpdate = this.state.TempMonthlyVoucher
            MonthlyVoucherUpdate[e.target.name]=e.target.value
            this.setState({TempMonthlyVoucher:MonthlyVoucherUpdate})
        }
    }

    // Generate User Voucher
    UserVoucherGenerate=(e)=>{
        if (window.confirm('Are You Sure Create User Voucher')) {
            axios.post(global.config.url + 'AdminHappy/GenerateSpecialPromotion', {name:this.state.V_User_Name, value: this.state.V_User_Value, comment: this.state.V_User_Comment, duration:this.state.V_User_Duration, userID:this.state.V_User_UserID}).then(res=>{
                console.log(res.data)
                let GenerateText='UserID: ' + res.data.msg.userid + '\nGenerate Code: ' + res.data.msg.code
                alert(GenerateText)
                window.location.href = '/AdminManagement/AdminVoucherManagement';
            })
        }
    }

    // Generate Public Voucher
    PublicVoucherGenerate=(e)=>{
        if (window.confirm('Are You Sure Create Public Voucher')) {
            axios.post(global.config.url + 'AdminHappy/GenerateGeneralPromotion',{code:this.state.V_Pub_Code, name:this.state.V_Pub_Name, value:this.state.V_Pub_Value, comment:this.state.V_Pub_Comment, duration:this.state.V_Pub_Duration}).then(res=>{
                if(res.data.msg==='succeed'){
                    alert("Generate Voucher Code Has Been Generated")
                    window.location.href = '/AdminManagement/AdminVoucherManagement';
                }
            })
        }
    }

    // Generate Event Voucher
    EventVoucherGenerate=(e)=>{
        if (window.confirm('Are You Sure Create Event Voucher')) {
            axios.post(global.config.url + 'AdminHappy/BatchActivityCodeGenerate',{number:this.state.V_Act_Number, activity:this.state.V_Act_Activity, value:this.state.V_Act_Value, duration:this.state.V_Act_Duration}).then(res=>{
                if(res.data.msg==='succeed'){
                    alert("Generate Activity Code Has Been Generated")
                    window.location.href = '/AdminManagement/AdminVoucherManagement';
                }
            })
        }
    }

    //  Monthly Voucher management
    Monthly_Voucher_Edit_Control_submit=(e)=> {
        if(window.confirm('Are You Sure Update Monthly Voucher Number')){
            axios.post(global.config.url + 'AdminHappy/UpdateAllVipPower',{
                ieltsVoucher:this.state.TempMonthlyVoucher.ielts_Voucher,
                cclVoucher:this.state.TempMonthlyVoucher.ccl_Voucher,
                pteVoucher:this.state.TempMonthlyVoucher.pte_Voucher,
                expertieltsVoucher:this.state.TempMonthlyVoucher.expert_ielts_Voucher,
                expertcclVoucher:this.state.TempMonthlyVoucher.expert_ccl_Voucher,
                expertpteVoucher:this.state.TempMonthlyVoucher.expert_pte_Voucher
            }).then(res=>{
                if(res.data.msg==='succeed'){
                    alert("Monthly Voucher Updated Successfully")
                    window.location.href = '/AdminManagement/AdminVoucherManagement'
                }else{
                    console.log(res.data)
                }
            })
        }
    }

}

export default AdminVoucherManagement;