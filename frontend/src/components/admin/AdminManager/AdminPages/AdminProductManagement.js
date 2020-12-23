import React, {Component} from 'react';
import axios from 'axios';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {Modal, Button, Row, Col, Divider, Switch} from "antd";

import '../../../../css/AdminPages.css'

class AdminProductManagement extends Component{
    state={
        loading:true,
        ProductManagement:[],

        // Modal_Display (For Edit Product_Content )
        Modal_Display_Visible:false,
        Modal_Display_Product_ID:'',
        Modal_Temp_JSON_Key_Name:[],
        Modal_Temp_JSON_Key_Value:[],

        // Modal_Display For Add New product
        Modal_Display_Add_Visible:false,
        Modal_Add_Submit_Description:'',
        Modal_Add_Submit_Price:'',
        Modal_Add_Submit_Product_Content_Name:[],
        Modal_Add_Submit_Product_Content_Value:[],
    }

    componentDidMount() {
        //Temp array to store product
        let tempProduct=[]

        // token verification when submit
        let token = localStorage.getItem('access_token');

        // Fetch Data from the backend and load it to TempProduct array
        axios.get(global.config.url + 'AdminHappy/ProductInfo',{headers: {Authorization: `Bearer ${token}`}}).then(res=> {
            res.data.data.map(data => {
                tempProduct.push(data)
            })

            // Due to the Product_Content are in String format, Require to Convert to JSON format for Display Purpose
            for(let i=0;i<tempProduct.length;i++){
                tempProduct[i].Product_Content=JSON.parse(tempProduct[i].Product_Content)

                // Append A new Submit Button For Edit purpose
                tempProduct[i]['Submit']='[This Is Use For Edit_Submit Purpose]'
            }

            // Set State
            this.setState({loading:false, ProductManagement:tempProduct})
            console.log(this.state)
        })
    }

    render(){
        // css
        const HeaderSpanWord={
            color:'black',
            fontSize: '1.2em'
        }

        const cellEditProp = {
            mode: 'dbclick',
            afterSaveCell: onAfterSaveCell.bind(this)
        };

        function onAfterSaveCell(row, cellName, cellValue){
            let ArrayLocation=''

            // Search the index location of an array
            for(let i=0;i<this.state.ProductManagement.length;i++){
                if(this.state.ProductManagement[i].Product_ID===row.Product_ID){
                    ArrayLocation=i
                }
            }
            // Update the specific Index of an array (With correct CellName)
            this.state.ProductManagement[ArrayLocation][cellName]=cellValue

            // Update the State
            this.setState({ProductManagement:this.state.ProductManagement})
            console.log(this.state)
        }

        return(
            <React.Fragment>
                <button name='Product_Add_New_Product' className='ControlButton_Active' onClick={this.Product_NewAdd_Management}>Add New Product</button>

                {/* Table Display */}
                <BootstrapTable
                    data={ this.state.ProductManagement }
                    // Function
                    ignoreSinglePage
                    search={true}
                    pagination={ true }
                    exportCSV
                    cellEdit={ cellEditProp }
                >
                    <TableHeaderColumn dataSort={ true } editable={ false } dataField='Product_ID' isKey><span style={HeaderSpanWord}>Product ID</span></TableHeaderColumn>
                    <TableHeaderColumn dataSort={ true } dataField='Description'><span style={HeaderSpanWord}>Description</span></TableHeaderColumn>
                    <TableHeaderColumn dataSort={ true } editable={ false } dataField='Product_Content' dataFormat={this.ProductDescriptionFormatting.bind(this)} ><span style={HeaderSpanWord}>Description</span></TableHeaderColumn>
                    <TableHeaderColumn dataSort={ true } dataField='Price'><span style={HeaderSpanWord}>Price</span></TableHeaderColumn>
                    <TableHeaderColumn dataSort={ true } dataField='isActive' dataFormat={this.ProductActiveFormatting}>Active Status</TableHeaderColumn>
                    <TableHeaderColumn dataSort={ true } editable={ false } dataField='Submit' dataFormat={this.ProductSubmitFormatting}>Edit_Submit</TableHeaderColumn>
                </BootstrapTable>

                {/* Modal Setting */}
                <Modal
                    title={'Product Content: '}
                    visible={this.state.Modal_Display_Visible}
                    onCancel={()=>this.setState({Modal_Display_Visible:false,Modal_Display_Product_ID:'', Modal_Temp_JSON_Key_Name:[], Modal_Temp_JSON_Key_Value:[]})}
                    onOk={this.Product_Content_Modal_Management}
                >
                    <button name='Modal_OnClick_Add_Product' onClick={this.Modal_Product_Add_Product}>Add Product</button>&nbsp;
                    <button name='Modal_OnClick_Delete_Product' onClick={this.Modal_Product_Add_Product}>Delete Product</button><br/><br/>

                    {
                        this.state.Modal_Temp_JSON_Key_Name.map((Name,i)=>{
                            return(
                                <React.Fragment key={i}>
                                    <div>
                                        <input value={Name} name='Modal_On_Change_Handler_Name' className={i} onChange={this.Modal_OnChange_Handler}/>:
                                        <input value={this.state.Modal_Temp_JSON_Key_Value[i]} name='Modal_On_Change_Handler_Value' className={i} onChange={this.Modal_OnChange_Handler}/>
                                    </div>
                                </React.Fragment>
                            )
                        })
                    }
                </Modal>


                <Modal
                    title={'Add Product: '}
                    visible={this.state.Modal_Display_Add_Visible}
                    onCancel={()=>this.setState({Modal_Display_Add_Visible:false})}
                    onOk={this.Product_NewAdd_Management_Submit}
                >
                    <button onClick={this.Product_NewAdd_Management} name='Modal_Submit_AddNewContent'>Add_Product_Content</button>&nbsp;
                    <button onClick={this.Product_NewAdd_Management} name='Modal_Submit_DeleteNewContent'>Delete Product_Content</button><br/><br/>
                    <span><b>Description: </b><input name='Modal_Submit_Product_Description_OnChange' value={this.state.Modal_Add_Submit_Description}  onChange={this.Product_NewAdd_Management}/></span><br/>
                    <span><b>Price: </b><input type='number' step='any' name='Modal_Submit_Product_Price_OnChange' value={this.state.Modal_Add_Submit_Price}  onChange={this.Product_NewAdd_Management}/></span><br/>
                    <span>
                        <b>Product_Content: </b>
                        {
                            this.state.Modal_Add_Submit_Product_Content_Name.map((Name,i)=>{
                                return(
                                    <React.Fragment key={i}>
                                        <div>
                                            <input value={Name} name='Modal_Submit_Product_Content_OnChange_Name' placeholder='Name' className={i} onChange={this.Product_NewAdd_Management}/>:
                                            <input value={this.state.Modal_Add_Submit_Product_Content_Value[i]} placeholder='Value' name='Modal_Submit_Product_Content_OnChange_Value' className={i} onChange={this.Product_NewAdd_Management}/>
                                        </div>
                                    </React.Fragment>
                                )
                            })
                        }
                    </span>
                </Modal>
            </React.Fragment>
        )
    }

    // dataFormat={this.ProductDescriptionFormatting.bind(this)}
    ProductActiveFormatting(cell, row){
        // User Token verification
        let token = localStorage.getItem('access_token');

        let ActiveWarning='Are You Sure Public the Product'
        let InactiveWarning='Are You Sure Hidden the Product'

        return(
            <span>
                {cell===1?
                    <button className='ControlButton_Active' onClick={
                        this.productUnActive=(e)=> {
                            if (window.confirm(InactiveWarning)) {
                                axios.post(global.config.url + 'AdminHappy/ProductDeActive', {productid: row.Product_ID}, {headers: {Authorization: `Bearer ${token}`}}).then(res => {
                                    if (res.data.msg === 'succeed') {
                                        alert("Product has been deactivated ")
                                        window.location.href = '/AdminManagement/AdminProductManagement'
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
                        this.productActive=(e)=> {
                            if (window.confirm(ActiveWarning)) {
                                axios.post(global.config.url + 'AdminHappy/ProductActive', {productid: row.Product_ID}, {headers: {Authorization: `Bearer ${token}`}}).then(res => {
                                    if (res.data.msg === 'succeed') {
                                        alert("Product has been Activated ")
                                        window.location.href = '/AdminManagement/AdminProductManagement'
                                    } else {
                                        alert("Error")
                                    }
                                })
                            }
                        }
                    }>Disable</button>}
            </span>
        )
    }

    // Product Description Formatting
    ProductDescriptionFormatting(cell,row){
        let Json_Product_Content_Display=''
        let Product_Content_ID=row.Product_ID

        Object.keys(cell).forEach(function(key,i) {
            Json_Product_Content_Display=Json_Product_Content_Display+ key + ': ' + cell[key] +'<br/>'
        });

        return(
            <span id={Product_Content_ID} onClick={this.Product_Content_Modal_Visible} style={{cursor:'pointer'}} dangerouslySetInnerHTML={{ __html: Json_Product_Content_Display }}></span>
        )
    }

    // Product Edit_Submit Button Formatting
    ProductSubmitFormatting(cell,row){
        return(
            <button className='ControlButton_Active' onClick={
                this.Product_Final_Submit=(e)=>{
                    if (window.confirm('Are You Sure Update Product Content ')) {
                        axios.post(global.config.url + 'AdminHappy/ProductEdit',{productid:row.Product_ID, Description:row.Description, productContent:JSON.stringify(row.Product_Content), price:row.Price}).then(res=>{
                            if(res.data.msg==='succeed'){
                                alert('Product Info Updated Successfully')
                                window.location.href = '/AdminManagement/AdminProductManagement'
                            }
                        })
                    }
                }
            } id={row.Product_ID}>Submit To Edit</button>
        )
    }


    // Set Visible and ProductID
    Product_Content_Modal_Visible=(e)=>{

        // Temporary Variable Store Index of Specific Product
        let Product_ID_Location_Index=''

        // Temporary Array that Store Json Name and Value
        let TempModalArrayName=[]
        let TempModalArrayValue=[]

        // Search the Where the Product ID located at
        for(let i=0;i<this.state.ProductManagement.length;i++){
            if(this.state.ProductManagement[i].Product_ID==e.target.id){
                Product_ID_Location_Index=i
            }
        }

        // Target Json
        let JsonArray = this.state.ProductManagement[Product_ID_Location_Index].Product_Content

        // Loop the Json Array
        Object.keys(JsonArray).forEach(function(key,i) {
            TempModalArrayName.push(key)
            TempModalArrayValue.push(JsonArray[key])
        });

        this.setState({
            Modal_Display_Visible:true,
            Modal_Display_Product_ID:Product_ID_Location_Index,
            Modal_Temp_JSON_Key_Name:TempModalArrayName,
            Modal_Temp_JSON_Key_Value:TempModalArrayValue,
        })
    }

    // Modal Add Product Function
    Modal_Product_Add_Product=(e)=>{
        // Add
        if(e.target.name==='Modal_OnClick_Add_Product'){
            this.state.Modal_Temp_JSON_Key_Name.push('')
            this.state.Modal_Temp_JSON_Key_Value.push('')
            this.setState({
                Modal_Temp_JSON_Key_Name:this.state.Modal_Temp_JSON_Key_Name,
                Modal_Temp_JSON_Key_Value:this.state.Modal_Temp_JSON_Key_Value
            })
        }
        // Pop
        if(e.target.name==='Modal_OnClick_Delete_Product'){
            this.state.Modal_Temp_JSON_Key_Name.pop()
            this.state.Modal_Temp_JSON_Key_Value.pop()
            this.setState({
                Modal_Temp_JSON_Key_Name:this.state.Modal_Temp_JSON_Key_Name,
                Modal_Temp_JSON_Key_Value:this.state.Modal_Temp_JSON_Key_Value
            })
        }
    }

    // Modal OnChange Handler
    Modal_OnChange_Handler=(e)=>{

        //Modal Edit Product Content ---------------------------------------------------------------------
        if(e.target.name==='Modal_On_Change_Handler_Name'){
            let TempStateUpdate = this.state.Modal_Temp_JSON_Key_Name
            TempStateUpdate[e.target.className]=e.target.value
            this.setState({Modal_Temp_JSON_Key_Name:TempStateUpdate})
        }

        if(e.target.name==='Modal_On_Change_Handler_Value'){
            let TempStateUpdate = this.state.Modal_Temp_JSON_Key_Value
            TempStateUpdate[e.target.className]=e.target.value
            this.setState({Modal_Temp_JSON_Key_Value:TempStateUpdate})
        }

        //Modal Add New Content ---------------------------------------------------------------------

    }

    // Modal Edited Product Submit To DataBase
    Product_Content_Modal_Management=(e)=>{
        // Modal_Display_Product_ID is not the actual ProductID, it is a location where the product ID located at in the array
        let Product_Product_Info_Overall_Update = this.state.ProductManagement

        // Create a new Json Array that receive data from Modal
        let Modal_PID_Product_Content_Update={}

        // loop from the array and load to the new JSON
        for(let i=0;i<this.state.Modal_Temp_JSON_Key_Name.length;i++){
            Modal_PID_Product_Content_Update[this.state.Modal_Temp_JSON_Key_Name[i]]=this.state.Modal_Temp_JSON_Key_Value[i]
        }

        // Update the specific Product_content
        Product_Product_Info_Overall_Update[this.state.Modal_Display_Product_ID].Product_Content=Modal_PID_Product_Content_Update

        this.setState({ProductManagement:Product_Product_Info_Overall_Update, Modal_Display_Visible:false})

    }

    // New Product Added
    Product_NewAdd_Management=(e)=>{
        // For Add_New_Product   Modal Display
        if(e.target.name==='Product_Add_New_Product') {
            this.setState({Modal_Display_Add_Visible: true})
        }

        // For Add_New_Product  Product Content Control ----> ADD
        if(e.target.name==='Modal_Submit_AddNewContent'){
            this.state.Modal_Add_Submit_Product_Content_Name.push('')
            this.state.Modal_Add_Submit_Product_Content_Value.push('')
            this.setState({
                Modal_Add_Submit_Product_Content_Name:this.state.Modal_Add_Submit_Product_Content_Name,
                Modal_Add_Submit_Product_Content_Value:this.state.Modal_Add_Submit_Product_Content_Value
            })
        }

        // For Add_New_Product  Product Content Control  ----> Delete
        if(e.target.name==='Modal_Submit_DeleteNewContent'){
            this.state.Modal_Add_Submit_Product_Content_Name.pop()
            this.state.Modal_Add_Submit_Product_Content_Value.pop()
            this.setState({
                Modal_Add_Submit_Product_Content_Name:this.state.Modal_Add_Submit_Product_Content_Name,
                Modal_Add_Submit_Product_Content_Value:this.state.Modal_Add_Submit_Product_Content_Value
            })
        }


        if(e.target.name==='Modal_Submit_Product_Description_OnChange'){
            this.state.Modal_Add_Submit_Description=e.target.value
            this.setState({Modal_Add_Submit_Description:this.state.Modal_Add_Submit_Description})
        }

        if(e.target.name==='Modal_Submit_Product_Price_OnChange'){
            this.state.Modal_Add_Submit_Price=e.target.value
            this.setState({Modal_Add_Submit_Price:this.state.Modal_Add_Submit_Price})
        }


        // For Add_New_Product  Product_Content Product Name OnChange Handler
        if(e.target.name==='Modal_Submit_Product_Content_OnChange_Name'){
            let Temp_AddSubmit_Product_add = this.state.Modal_Add_Submit_Product_Content_Name
            Temp_AddSubmit_Product_add[e.target.className]=e.target.value
            this.setState({Modal_Add_Submit_Product_Content_Name:Temp_AddSubmit_Product_add})
        }

        // For Add_New_Product  Product_Content Product Value OnChange Handler
        if(e.target.name==='Modal_Submit_Product_Content_OnChange_Value'){
            let Temp_AddSubmit_Product_add = this.state.Modal_Add_Submit_Product_Content_Value
            Temp_AddSubmit_Product_add[e.target.className]=e.target.value
            this.setState({Modal_Add_Submit_Product_Content_Value:Temp_AddSubmit_Product_add})
        }

    }

    // New Product Final Submit
    Product_NewAdd_Management_Submit=(e)=>{
        // Submit Product Content in Json Format
        let Submit_Product_Content={}

        // Loop the Product Content and Product Value and store in JSON format
        for(let i=0;i<this.state.Modal_Add_Submit_Product_Content_Name.length;i++){
            Submit_Product_Content[this.state.Modal_Add_Submit_Product_Content_Name[i]]=this.state.Modal_Add_Submit_Product_Content_Value[i]
        }
        console.log(JSON.stringify(Submit_Product_Content))
        Submit_Product_Content=JSON.stringify(Submit_Product_Content)

        axios.post(global.config.url + 'AdminHappy/ProductAdd',{Description:this.state.Modal_Add_Submit_Description, productContent:Submit_Product_Content, price:this.state.Modal_Add_Submit_Price}).then(res=>{
            if(res.data.msg==='succeed'){
                alert('New Product Updated Successfully')
                window.location.href='/AdminManagement/AdminProductManagement'
            }else{
                console.log(res.data)
            }
        })
    }



}
export default AdminProductManagement
