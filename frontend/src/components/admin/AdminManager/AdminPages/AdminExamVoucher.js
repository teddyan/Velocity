import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {Row, Col, Divider, Button, Cascader, Modal} from 'antd';
import "bootstrap/dist/css/bootstrap.min.css";
import ReactSpinner from 'react-bootstrap-spinner';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

class Exam_voucher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pte: "",
      expert_pte: "",
      ccl: "",
      expert_ccl: "",
      ielts: "",
      expert_ielts: "",
      vip: "",
      activity: "",
      comment: "",
      start_day: "",
      duration: "",
      number: "",
      PublicVoucherModal: false,
      process: false,
      process_okbutton: false,
      process_cancelbutton: false,
      success: false,
      process_status: "Success !",
      VoucherInfo: [],
      tableLoading: true,
    };
    this.voucher_submit = this.voucher_submit.bind(this);
    this.voucher_request = this.voucher_request.bind(this);
    this.cancel_modal = this.cancel_modal.bind(this);
    this.ReloadTable = this.ReloadTable.bind(this);
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    this.handleDeletedRow = this.handleDeletedRow.bind(this);
  }

  componentDidMount() {
    //Temp Variable
    let TempVoucherInfo = [];

    // User Token verification
    let token = localStorage.getItem('access_token');
    axios.get(global.config.url + 'AdminHappy/VoucherInfo',{headers: {Authorization: `Bearer ${token}`}}).then(res=> {

        // Token Check from backend
        if (res.data.msg==="illegal hack") {
            alert("权限错误");
            window.location.href = '/';
        }

        // Verify Success
        if (res.data.msg === 'succeed') {
            res.data.data.map(data => {
                TempVoucherInfo.push(data)
            });
            this.setState({
              VoucherInfo: TempVoucherInfo.reverse(),
              tableLoading: false
            });
        } 
        else {
            alert("Wrong URL or Wrong Info")
        }
    })
  }

  ReloadTable() {
    //Temp Variable
    let TempVoucherInfo = [];

    // User Token verification
    let token = localStorage.getItem('access_token');
    axios.get(global.config.url + 'AdminHappy/VoucherInfo',{headers: {Authorization: `Bearer ${token}`}}).then(res=> {

        // Token Check from backend
        if (res.data.msg==="illegal hack") {
            alert("权限错误");
            window.location.href = '/';
        }

        // Verify Success
        if (res.data.msg === 'succeed') {
            res.data.data.map(data => {
                TempVoucherInfo.push(data)
            });
            this.setState({
              VoucherInfo: TempVoucherInfo.reverse(),
              tableLoading: false
            });
        } 
        else {
            alert("Wrong URL or Wrong Info")
        }
    })
  }

  voucher_submit(e) {
    e.preventDefault();
    this.setState({
      pte: e.target[0].value ? e.target[0].value : 0,
      expert_pte: e.target[1].value ? e.target[1].value : 0,
      ccl: e.target[2].value ? e.target[2].value : 0,
      expert_ccl: e.target[3].value ? e.target[3].value : 0,
      ielts: e.target[4].value ? e.target[4].value : 0,
      expert_ielts: e.target[5].value ? e.target[5].value : 0,
      vip: e.target[6].value,
      activity: e.target[7].value,
      comment: e.target[8].value,
      start_day: e.target[9].value,
      duration: e.target[10].value,
      number: e.target[11].value,
      PublicVoucherModal: true,
    });
  }

  cancel_modal() {
    this.setState({
      PublicVoucherModal: false,
      process: false, 
      process_okbutton: false, 
      success: false,
      process_status: "Success !"
    });
    window.location.reload();
  }

  async voucher_request() {
    let token = localStorage.getItem('access_token');
    this.setState({
      process: true,
      process_okbutton: true,
    });
    const request = await axios({
      method: "POST",
      mode: "no-cors",
      url: global.config.url+ "AdminHappy/CreateVipVoucher",
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": `Bearer ${token}`
      },
      data: {
        "pte": String(this.state.pte),
        "expert_pte": String(this.state.expert_pte),
        "ccl": String(this.state.ccl),
        "expert_ccl": String(this.state.expert_ccl),
        "ielts": String(this.state.ielts),
        "expert_ielts": String(this.state.expert_ielts),
        "vip": String(this.state.vip),
        "activity": String(this.state.activity),
        "comment": String(this.state.comment),
        "start_day": this.state.start_day,
        "duration": String(this.state.duration),
        "number": String(this.state.number)
      }
    }).catch(error => {return(error.response)});
    if (request.status == 200) {
      this.setState({
        success: true,
      });
    }
    else if (request.data.msg==="illegal hack") {
      alert("权限错误");
      window.location.href = '/';
    }
    else {
      this.setState({
        success: true,
        process_status: "Submit failed, Please try again !"
      });
    }
  }
  async onAfterSaveCell(row, cellName, cellValue) {
    let token = localStorage.getItem('access_token');
    this.setState({
      tableLoading: true
    });
    if(cellName==='pte_Voucher') {
      const request = await axios({
        method: "POST",
        mode: "no-cors",
        url: global.config.url + "AdminHappy/SetEPVip_PTE",
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${token}`
        },
        data: {
          "Code": String(row.Voucher_code),
          "PTE": cellValue
        }
      }).catch(error => {return(error.response)});
      if (request.status == 200) {
        this.ReloadTable()
      }
      else if (request.data.msg==="illegal hack") {
        alert("权限错误");
        window.location.href = '/';
      }
      else {
        alert("Failed operation, please try again.");
        this.ReloadTable()
      }
    }

    if(cellName==='expert_pte_Voucher') {
      const request = await axios({
        method: "POST",
        mode: "no-cors",
        url: global.config.url + "AdminHappy/SetEPVip_Expert_PTE",
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${token}`
        },
        data: {
          "Code": String(row.Voucher_code),
          "Expert_PTE": cellValue
        }
      }).catch(error => {return(error.response)});
      if (request.status == 200) {
        this.ReloadTable()
      }
      else if (request.data.msg==="illegal hack") {
        alert("权限错误");
        window.location.href = '/';
      }
      else {
        alert("Failed operation, please try again.");
        this.ReloadTable()
      }
    }

    if(cellName==='ccl_Voucher') {
      const request = await axios({
        method: "POST",
        mode: "no-cors",
        url: global.config.url + "AdminHappy/SetEPVip_CCL",
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${token}`
        },
        data: {
          "Code": String(row.Voucher_code),
          "CCL": cellValue
        }
      }).catch(error => {return(error.response)});
      if (request.status == 200) {
        this.ReloadTable()
      }
      else if (request.data.msg==="illegal hack") {
        alert("权限错误");
        window.location.href = '/';
      }
      else {
        alert("Failed operation, please try again.");
        this.ReloadTable()
      }
    }

    if(cellName==='expert_ccl_Voucher') {
      const request = await axios({
        method: "POST",
        mode: "no-cors",
        url: global.config.url + "AdminHappy/SetEPVip_Expert_CCL",
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${token}`
        },
        data: {
          "Code": String(row.Voucher_code),
          "Expert_CCL": cellValue
        }
      }).catch(error => {return(error.response)});
      if (request.status == 200) {
        this.ReloadTable()
      }
      else if (request.data.msg==="illegal hack") {
        alert("权限错误");
        window.location.href = '/';
      }
      else {
        alert("Failed operation, please try again.");
        this.ReloadTable()
      }
    }

    if(cellName==='ielts_Voucher') {
      const request = await axios({
        method: "POST",
        mode: "no-cors",
        url: global.config.url + "AdminHappy/SetEPVip_IELTS",
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${token}`
        },
        data: {
          "Code": String(row.Voucher_code),
          "IELTS": cellValue
        }
      }).catch(error => {return(error.response)});
      if (request.status == 200) {
        this.ReloadTable()
      }
      else if (request.data.msg==="illegal hack") {
        alert("权限错误");
        window.location.href = '/';
      }
      else {
        alert("Failed operation, please try again.");
        this.ReloadTable()
      }
    }

    if(cellName==='expert_ielts_Voucher') {
      const request = await axios({
        method: "POST",
        mode: "no-cors",
        url: global.config.url + "AdminHappy/SetEPVip_Expert_IELTS",
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${token}`
        },
        data: {
          "Code": String(row.Voucher_code),
          "Expert_IELTS": cellValue
        }
      }).catch(error => {return(error.response)});
      if (request.status == 200) {
        this.ReloadTable()
      }
      else if (request.data.msg==="illegal hack") {
        alert("权限错误");
        window.location.href = '/';
      }
      else {
        alert("Failed operation, please try again.");
        this.ReloadTable()
      }
    }

    if(cellName==='vip') {
      const request = await axios({
        method: "POST",
        mode: "no-cors",
        url: global.config.url + "AdminHappy/SetEPVip_VIP",
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${token}`
        },
        data: {
          "Code": String(row.Voucher_code),
          "VIP": cellValue
        }
      }).catch(error => {return(error.response)});
      if (request.status == 200) {
        this.ReloadTable()
      }
      else if (request.data.msg==="illegal hack") {
        alert("权限错误");
        window.location.href = '/';
      }
      else {
        alert("Failed operation, please try again.");
        this.ReloadTable()
      }
    }

    if(cellName==='activity') {
      const request = await axios({
        method: "POST",
        mode: "no-cors",
        url: global.config.url + "AdminHappy/SetEPVip_Activity",
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${token}`
        },
        data: {
          "Code": String(row.Voucher_code),
          "Activity": String(cellValue)
        }
      }).catch(error => {return(error.response)});
      if (request.status == 200) {
        this.ReloadTable()
      }
      else if (request.data.msg==="illegal hack") {
        alert("权限错误");
        window.location.href = '/';
      }
      else {
        alert("Failed operation, please try again.");
        this.ReloadTable()
      }
    }

    if(cellName==='comment') {
      const request = await axios({
        method: "POST",
        mode: "no-cors",
        url: global.config.url + "AdminHappy/SetEPVip_Comment",
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${token}`
        },
        data: {
          "Code": String(row.Voucher_code),
          "Comment": String(cellValue)
        }
      }).catch(error => {return(error.response)});
      if (request.status == 200) {
        this.ReloadTable()
      }
      else if (request.data.msg==="illegal hack") {
        alert("权限错误");
        window.location.href = '/';
      }
      else {
        alert("Failed operation, please try again.");
        this.ReloadTable()
      }
    }

    if(cellName==='start_day') {
      const request = await axios({
        method: "POST",
        mode: "no-cors",
        url: global.config.url + "AdminHappy/SetEPVip_Start_Day",
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${token}`
        },
        data: {
          "Code": String(row.Voucher_code),
          "Start_Day": cellValue
        }
      }).catch(error => {return(error.response)});
      if (request.status == 200) {
        this.ReloadTable()
      }
      else if (request.data.msg==="illegal hack") {
        alert("权限错误");
        window.location.href = '/';
      }
      else {
        alert("Failed operation, please try again.");
        this.ReloadTable()
      }
    }

    if(cellName==='duration') {
      const request = await axios({
        method: "POST",
        mode: "no-cors",
        url: global.config.url + "AdminHappy/SetEPVip_Duration",
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${token}`
        },
        data: {
          "Code": String(row.Voucher_code),
          "Duration": cellValue
        }
      }).catch(error => {return(error.response)});
      if (request.status == 200) {
        this.ReloadTable()
      }
      else if (request.data.msg==="illegal hack") {
        alert("权限错误");
        window.location.href = '/';
      }
      else {
        alert("Failed operation, please try again.");
        this.ReloadTable()
      }
    }
    if(cellName==='Status') {
      const request = await axios({
        method: "POST",
        mode: "no-cors",
        url: global.config.url + "AdminHappy/SetEPVip_Status",
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${token}`
        },
        data: {
          "Code": String(row.Voucher_code),
          "Status": cellValue
        }
      }).catch(error => {return(error.response)});
      if (request.status == 200) {
        this.ReloadTable()
      }
      else if (request.data.msg==="illegal hack") {
        alert("权限错误");
        window.location.href = '/';
      }
      else {
        alert("Failed operation, please try again.");
        this.ReloadTable()
      }
    }
  }

  async handleDeletedRow(rowKeys) {
    let token = localStorage.getItem('access_token');
    this.setState({
      tableLoading: true
    });
    const request = await axios({
      method: "POST",
      mode: "no-cors",
      url: global.config.url + "AdminHappy/DeleteVoucherInfo",
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": `Bearer ${token}`
      },
      data: {
        "Code": rowKeys,
      }
    }).catch(error => {return(error.response)});
    if (request.status == 200) {
      this.ReloadTable()
    }
    else if (request.data.msg==="illegal hack") {
        alert("权限错误");
        window.location.href = '/';
      }
    else {
      alert("Failed operation, please try again.");
      this.ReloadTable()
    }
  }

  render() {
    const HeaderSpanWord={
      color:'black',
      fontSize: '1.2em'
    }

    const cellEditProp = {
      mode: 'dbclick',
      afterSaveCell: this.onAfterSaveCell
    };
    
    const selectRow = {
      mode: 'checkbox', //radio or checkbox
    };
    
    const options = {
      afterDeleteRow: this.handleDeletedRow
    };
    return (
      <div style={{paddingLeft:"100px", paddingTop:"30px"}}>
        <h3>礼包优惠生成</h3>
        <form onSubmit={this.voucher_submit} style={{paddingBottom: "100px"}}>
          <Row style={{paddingBottom:"10px"}}>
              <Col style={{width: '300px'}}>
                  <div>PTE</div>
              </Col>
              <Col>
                  <input id='PTE' type="number" className='form-control' style={{width: '200px', height: '32px', display: 'inline'}} placeholder="Type a number" min="0"/>
              </Col>
              <Col style={{paddingTop:"10px", paddingLeft:"10px"}}>
                <div>(张数)</div>
              </Col>
          </Row>
          <Row style={{paddingBottom:"10px"}}>
              <Col style={{width: '300px'}}>
                  <div>Expert_PTE</div>
              </Col>
              <Col>
                  <input id='Expert_PTE' type="number" className='form-control' style={{width: '200px', height: '32px', display: 'inline'}} placeholder="Type a number" min="0"/>
              </Col>
              <Col style={{paddingTop:"10px", paddingLeft:"10px"}}>
                <div>(张数)</div>
              </Col>
          </Row>
          <Row style={{paddingBottom:"10px"}}>
              <Col style={{width: '300px'}}>
                  <div>CCL</div>
              </Col>
              <Col>
                  <input id='CCL' type="number" className='form-control' style={{width: '200px', height: '32px', display: 'inline'}} placeholder="Type a number" min="0"/>
              </Col>
              <Col style={{paddingTop:"10px", paddingLeft:"10px"}}>
                <div>(张数)</div>
              </Col>
          </Row>
          <Row style={{paddingBottom:"10px"}}>
              <Col style={{width: '300px'}}>
                  <div>Expert_CCL</div>
              </Col>
              <Col>
                  <input id='Expert_CCL' type="number" className='form-control' style={{width: '200px', height: '32px', display: 'inline'}} placeholder="Type a number" min="0"/>
              </Col>
              <Col style={{paddingTop:"10px", paddingLeft:"10px"}}>
                <div>(张数)</div>
              </Col>
          </Row>
          <Row style={{paddingBottom:"10px"}}>
              <Col style={{width: '300px'}}>
                  <div>IELTS</div>
              </Col>
              <Col>
                  <input id='IELTS' type="number" className='form-control' style={{width: '200px', height: '32px', display: 'inline'}} placeholder="Type a number" min="0"/>
              </Col>
              <Col style={{paddingTop:"10px", paddingLeft:"10px"}}>
                <div>(张数)</div>
              </Col>
          </Row>
          <Row style={{paddingBottom:"10px"}}>
              <Col style={{width: '300px'}}>
                  <div>Expert_IELTS</div>
              </Col>
              <Col>
                  <input id='Expert_IELTS' type="number" className='form-control' style={{width: '200px', height: '32px', display: 'inline'}} placeholder="Type a number" min="0"/>
              </Col>
              <Col style={{paddingTop:"10px", paddingLeft:"10px"}}>
                <div>(张数)</div>
              </Col>
          </Row>
          <Row style={{paddingBottom:"10px"}}>
              <Col style={{width: '300px'}}>
                  <div>VIP</div>
              </Col>
              <Col>
                  <input id='VIP' type="number" className='form-control' style={{width: '200px', height: '32px', display: 'inline'}} placeholder="Type a number" min="0" required/>
              </Col>
              <Col style={{paddingTop:"10px", paddingLeft:"10px"}}>
                <div>(天数)</div>
              </Col>
          </Row>
          <Row style={{paddingBottom:"10px"}}>
              <Col style={{width: '300px'}}>
                  <div>Activity</div>
              </Col>
              <Col>
                  <input id='Activity' className='form-control' style={{width: '200px', height: '32px', display: 'inline'}} placeholder="Type an activity"required/>
              </Col>
              <Col style={{paddingTop:"10px", paddingLeft:"10px"}}>
                <div>(预计使用活动名称)</div>
              </Col>
          </Row>
          <Row style={{paddingBottom:"10px"}}>
              <Col style={{width: '300px'}}>
                  <div>Comment</div>
              </Col>
              <Col>
                  <input id='Comment' className='form-control' style={{width: '200px', height: '32px', display: 'inline'}} placeholder="Type a comment"required/>
              </Col>
              <Col style={{paddingTop:"10px", paddingLeft:"10px"}}>
                <div>(备注)</div>
              </Col>
          </Row>
          <Row style={{paddingBottom:"10px"}}>
              <Col style={{width: '300px'}}>
                  <div>Start Day</div>
              </Col>
              <Col>
                  <input id='Start_Day' type="date" className='form-control' style={{width: '200px', height: '32px', display: 'inline'}}required/>
              </Col>
              <Col style={{paddingTop:"10px", paddingLeft:"10px"}}>
                <div>(优惠卷生效日期)</div>
              </Col>
          </Row>
          <Row style={{paddingBottom:"10px"}}>
              <Col style={{width: '300px'}}>
                  <div>Duration</div>
              </Col>
              <Col>
                  <input id='Duration' type="number" className='form-control' style={{width: '200px', height: '32px', display: 'inline'}} placeholder="Type a number" min="0" required/>
              </Col>
              <Col style={{paddingTop:"10px", paddingLeft:"10px"}}>
                <div>(优惠卷有效天数)</div>
              </Col>
          </Row>
          <Row style={{paddingBottom:"10px"}}>
              <Col style={{width: '300px'}}>
                  <div>Number</div>
              </Col>
              <Col>
                  <input id='Number' type="number" className='form-control' style={{width: '200px', height: '32px', display: 'inline'}} placeholder="Type a number" min="0" required/>
              </Col>
              <Col style={{paddingTop:"10px", paddingLeft:"10px"}}>
                <div>(批量生成)</div>
              </Col>
          </Row>
          <Button htmlType='submit' style={{float: 'right'}}>生成</Button>
        </form>
        <Modal
          title={"礼包优惠卷生成确认"}
          okText={'Submit'}
          cancelText={'Cancel'}
          onOk={this.voucher_request}
          onCancel={this.cancel_modal}
          visible={this.state.PublicVoucherModal}
          centered
          width='40%'
          okButtonProps={{ disabled: this.state.process_okbutton }}
          cancelButtonProps={{ disabled: this.state.process_cancelbutton }}
          maskClosable={false}
          keyboard={false}
          closable={false}
        >
          { 
            !this.state.process &&
              <div className='Public_Voucher_Modal' style={{textAlign: "center"}}>
                <div><span>PTE：</span>{this.state.pte} 張</div><br/>
                <div><span>Expert_PTE：</span>{this.state.expert_pte} 張</div><br/>
                <div><span>CCL：</span>{this.state.ccl} 張</div><br/>
                <div><span>Expert_CCL：</span>{this.state.expert_ccl} 張</div><br/>
                <div><span>IELTS：</span>{this.state.ielts} 張</div><br/>
                <div><span>Expert_IELTS：</span>{this.state.expert_ielts} 張</div><br/>
                <div><span>VIP：</span>{this.state.vip} 張</div><br/>
                <div><span>Activity：</span>{this.state.activity} </div><br/>
                <div><span>Comment：</span>{this.state.comment} </div><br/>
                <div><span>Start Day：</span>{this.state.start_day} </div><br/>
                <div><span>Duration：</span>{this.state.duration} 天</div><br/>
                <div><span>Number：</span>{this.state.number} 套</div><br/>        
              </div>
          }
          {
            this.state.process && !this.state.success &&
            <div style={{textAlign: "center"}}>
              <ReactSpinner type="border" color="primary" size="8" style={{float: "center"}}/>
              <div>Request sending...</div>
            </div>
          }
          {
            this.state.success &&
            <div style={{textAlign: "center"}}>
              {this.state.process_status}
            </div>
          }
        </Modal>
        
        {
          this.state.tableLoading &&
          <div style={{textAlign: "center"}}>
            <ReactSpinner type="border" color="primary" size="8" style={{float: "center"}}/>
            <div>Table Loading</div>
          </div>
        }
        {
          !this.state.tableLoading &&
          <BootstrapTable hover
            data={ this.state.VoucherInfo }
            ignoreSinglePage
            search={true}
            pagination={ true }
            exportCSV
            cellEdit={ cellEditProp }
            selectRow={ selectRow }
            deleteRow
            options={ options }
            >
            <TableHeaderColumn width='550' dataSort={ true } editable={ { type: 'textarea' } } dataField='Voucher_code' isKey><span style={HeaderSpanWord}>Code</span></TableHeaderColumn>
            <TableHeaderColumn width='150' dataSort={ true } dataField='pte_Voucher'><span style={HeaderSpanWord}>PTE</span></TableHeaderColumn>
            <TableHeaderColumn width='150' dataSort={ true } dataField='expert_pte_Voucher'><span style={HeaderSpanWord}>Expert_PTE</span></TableHeaderColumn>
            <TableHeaderColumn width='150' dataSort={ true } dataField='ccl_Voucher'><span style={HeaderSpanWord}>CCL</span></TableHeaderColumn>
            <TableHeaderColumn width='150' dataSort={ true } dataField='expert_ccl_Voucher'><span style={HeaderSpanWord}>Expert_CCL</span></TableHeaderColumn>
            <TableHeaderColumn width='150' dataSort={ true } dataField='ielts_Voucher'><span style={HeaderSpanWord}>IELTS</span></TableHeaderColumn>
            <TableHeaderColumn width='150' dataSort={ true } dataField='expert_ielts_Voucher'><span style={HeaderSpanWord}>Expert_IELTS</span></TableHeaderColumn>
            <TableHeaderColumn width='150' dataSort={ true } dataField='vip'><span style={HeaderSpanWord}>VIP</span></TableHeaderColumn>
            <TableHeaderColumn width='150' dataSort={ true } dataField='activity'><span style={HeaderSpanWord}>Activity</span></TableHeaderColumn>
            <TableHeaderColumn width='150' dataSort={ true } dataField='comment'><span style={HeaderSpanWord}>Comment</span></TableHeaderColumn>
            <TableHeaderColumn width='250' dataSort={ true } editable={ { type: 'date' } } dataField='start_day'><span style={HeaderSpanWord}>Start Day</span></TableHeaderColumn>
            <TableHeaderColumn width='150' dataSort={ true } dataField='duration'><span style={HeaderSpanWord}>Duration</span></TableHeaderColumn>
            <TableHeaderColumn width='150' dataSort={ true } dataField='Status'><span style={HeaderSpanWord}>Status</span></TableHeaderColumn>
          </BootstrapTable>
        } 
      </div>
    );
  }
}

export default Exam_voucher;
// <Modal
//           title={"考試卷優惠卷生成確認"}
//           okText={'Submit'}
//           cancelText={'Cancel'}
//           onOk={}
//           onCancel={}
//           visible={this.state.PublicVoucherModal}
//           centered
//           width='40%'
//         >
//           <div className='Public_Voucher_Modal'>
//               <div><span>优惠卷码：</span><input className='Modal_Daily_Voucher_update' name='V_Pub_Code' onChange={this.Voucher_OnChange_Handler} value={this.state.V_Pub_Code}/></div><br/>
//               <div><span>优惠卷名称：</span><input className='Modal_Daily_Voucher_update' name='V_Pub_Name' onChange={this.Voucher_OnChange_Handler} value={this.state.V_Pub_Name}/></div><br/>
//               <div><span>优惠卷价值：</span><input className='Modal_Daily_Voucher_update' name='V_Pub_Value' onChange={this.Voucher_OnChange_Handler} value={this.state.V_Pub_Value}/></div><br/>
//               <div><span>优惠卷备注：</span><input className='Modal_Daily_Voucher_update' name='V_Pub_Comment' onChange={this.Voucher_OnChange_Handler} value={this.state.V_Pub_Comment}/></div><br/>
//               <div><span>优惠卷时效：</span><input className='Modal_Daily_Voucher_update' name='V_Pub_Duration' onChange={this.Voucher_OnChange_Handler} value={this.state.V_Pub_Duration}/></div>
//           </div>
//         </Modal>

// <TableHeaderColumn width='150' dataSort={ true } editable={ { type: 'textarea' } } dataField='Email' isKey><span style={HeaderSpanWord}>Email</span></TableHeaderColumn>
//             <TableHeaderColumn width='150' dataSort={ true } dataField='username'><span style={HeaderSpanWord}>Username</span></TableHeaderColumn>
//             <TableHeaderColumn width='150' dataSort={ true } dataField='user_ID' hiddenOnInsert><span style={HeaderSpanWord}>User ID</span></TableHeaderColumn>
//             <TableHeaderColumn width='150' dataSort={ true } dataField='ielts_Voucher' hiddenOnInsert><span style={HeaderSpanWord}>ielts Voucher</span></TableHeaderColumn>
//             <TableHeaderColumn width='180' dataSort={ true } dataField='expert_ielts_Voucher' hiddenOnInsert><span style={HeaderSpanWord}>ilets Expert Voucher</span></TableHeaderColumn>
//             <TableHeaderColumn width='150' dataSort={ true } dataField='pte_Voucher' hiddenOnInsert><span style={HeaderSpanWord}>PTE Voucher</span></TableHeaderColumn>
//             <TableHeaderColumn width='180' dataSort={ true } dataField='expert_pte_Voucher' hiddenOnInsert><span style={HeaderSpanWord}>PTE Expert Voucher</span></TableHeaderColumn>
//             <TableHeaderColumn width='150' dataSort={ true } dataField='ccl_Voucher' hiddenOnInsert><span style={HeaderSpanWord}>CCL Voucher</span></TableHeaderColumn>
//             <TableHeaderColumn width='180' dataSort={ true } dataField='expert_ccl_Voucher' hiddenOnInsert><span style={HeaderSpanWord}>CCL Expert Voucher</span></TableHeaderColumn>
// async function onAfterSaveCell(row, cellName, cellValue) {

//       this.setState({
//         tableLoading: true
//       });

//       if(cellName==='pte') {
//         const request = await axios({
//           method: "POST",
//           mode: "no-cors",
//           url: "http://localhost:8000/AdminHappy/SetEPVip_PTE",
//           headers: {
//             "Content-type": "application/json",
//             "Access-Control-Allow-Origin": "*",
//           },
//           data: {
//             "Code": String(row.voucher_code),
//             "PTE": cellValue
//           }
//         }).catch(error => {return(error.response)});
//         if (request.status == 200) {
//           this.ReloadTable()
//         }
//         else {
//           alert("Failed operation, please try again.");
//         }
//       }

//       if(cellName==='ccl') {
//         const request = await axios({
//           method: "POST",
//           mode: "no-cors",
//           url: "http://localhost:8000/AdminHappy/SetEPVip_CCL",
//           headers: {
//             "Content-type": "application/json",
//             "Access-Control-Allow-Origin": "*",
//           },
//           data: {
//             "Code": String(row.voucher_code),
//             "CCL": cellValue
//           }
//         }).catch(error => {return(error.response)});
//         if (request.status == 200) {
//           alert("Success !");
//           window.location.reload();
//         }
//         else {
//           alert("Failed operation, please try again.");
//         }
//       }

//       if(cellName==='ielts') {
//         const request = await axios({
//           method: "POST",
//           mode: "no-cors",
//           url: "http://localhost:8000/AdminHappy/SetEPVip_IELTS",
//           headers: {
//             "Content-type": "application/json",
//             "Access-Control-Allow-Origin": "*",
//           },
//           data: {
//             "Code": String(row.voucher_code),
//             "IELTS": cellValue
//           }
//         }).catch(error => {return(error.response)});
//         if (request.status == 200) {
//           alert("Success !");
//           window.location.reload();
//         }
//         else {
//           alert("Failed operation, please try again.");
//         }
//       }

//       if(cellName==='vip') {
//         const request = await axios({
//           method: "POST",
//           mode: "no-cors",
//           url: "http://localhost:8000/AdminHappy/SetEPVip_VIP",
//           headers: {
//             "Content-type": "application/json",
//             "Access-Control-Allow-Origin": "*",
//           },
//           data: {
//             "Code": String(row.voucher_code),
//             "VIP": cellValue
//           }
//         }).catch(error => {return(error.response)});
//         if (request.status == 200) {
//           alert("Success !");
//           window.location.reload();
//         }
//         else {
//           alert("Failed operation, please try again.");
//         }
//       }

//       if(cellName==='activity') {
//         const request = await axios({
//           method: "POST",
//           mode: "no-cors",
//           url: "http://localhost:8000/AdminHappy/SetEPVip_Activity",
//           headers: {
//             "Content-type": "application/json",
//             "Access-Control-Allow-Origin": "*",
//           },
//           data: {
//             "Code": String(row.voucher_code),
//             "Activity": String(cellValue)
//           }
//         }).catch(error => {return(error.response)});
//         if (request.status == 200) {
//           alert("Success !");
//           window.location.reload();
//         }
//         else {
//           alert("Failed operation, please try again.");
//         }
//       }

//       if(cellName==='comment') {
//         const request = await axios({
//           method: "POST",
//           mode: "no-cors",
//           url: "http://localhost:8000/AdminHappy/SetEPVip_Comment",
//           headers: {
//             "Content-type": "application/json",
//             "Access-Control-Allow-Origin": "*",
//           },
//           data: {
//             "Code": String(row.voucher_code),
//             "Comment": String(cellValue)
//           }
//         }).catch(error => {return(error.response)});
//         if (request.status == 200) {
//           alert("Success !");
//           window.location.reload();
//         }
//         else {
//           alert("Failed operation, please try again.");
//         }
//       }

//       if(cellName==='start_day') {
//         const request = await axios({
//           method: "POST",
//           mode: "no-cors",
//           url: "http://localhost:8000/AdminHappy/SetEPVip_Start_Day",
//           headers: {
//             "Content-type": "application/json",
//             "Access-Control-Allow-Origin": "*",
//           },
//           data: {
//             "Code": String(row.voucher_code),
//             "Start_Day": String(cellValue)
//           }
//         }).catch(error => {return(error.response)});
//         if (request.status == 200) {
//           alert("Success !");
//           window.location.reload();
//         }
//         else {
//           alert("Failed operation, please try again.");
//         }
//       }

//       if(cellName==='duration') {
//         const request = await axios({
//           method: "POST",
//           mode: "no-cors",
//           url: "http://localhost:8000/AdminHappy/SetEPVip_Duration",
//           headers: {
//             "Content-type": "application/json",
//             "Access-Control-Allow-Origin": "*",
//           },
//           data: {
//             "Code": String(row.voucher_code),
//             "Duration": cellValue
//           }
//         }).catch(error => {return(error.response)});
//         if (request.status == 200) {
//           alert("Success !");
//           window.location.reload();
//         }
//         else {
//           alert("Failed operation, please try again.");
//         }
//       }
//     }
    
//     async function handleDeletedRow(rowKeys) {
//       const request = await axios({
//         method: "POST",
//         mode: "no-cors",
//         url: "http://localhost:8000/AdminHappy/DeleteVoucherInfo",
//         headers: {
//           "Content-type": "application/json",
//           "Access-Control-Allow-Origin": "*",
//         },
//         data: {
//           "Code": String(rowKeys),
//         }
//       }).catch(error => {return(error.response)});
//       if (request.status == 200) {
//         alert("Success !");
//         window.location.reload();
//       }
//       else {
//         alert("Failed operation, please try again.");
//       }
//     }

    // const HeaderSpanWord={
    //   color:'black',
    //   fontSize: '1.2em'
    // }

    // const cellEditProp = {
    //   mode: 'dbclick',
    //   afterSaveCell: onAfterSaveCell
    // };
    
    // const selectRow = {
    //   mode: 'checkbox', //radio or checkbox
    // };
    
    // const options = {
    //   afterDeleteRow: handleDeletedRow
    // };
// HeaderSpanWord: {
//         color:'black',
//         fontSize: '1.2em'
//       },
//       cellEditProp: {
//         mode: 'dbclick',
//         afterSaveCell: this.onAfterSaveCell
//       },
//       selectRow: {
//         mode: 'checkbox', //radio or checkbox
//       },
//       options: {
//         afterDeleteRow: this.handleDeletedRow
//       },


