import React, {Component} from 'react';
import {MDBCard, MDBCardBody, MDBCardHeader, MDBIcon, MDBTable, MDBTableBody} from "mdbreact";
import {Collapse} from "antd";
import Sample from '../../img/Sample.png';

const {Panel} = Collapse;

class HelpPage extends Component {
    render() {
        return (
            <MDBCard style={{borderRadius: '20px'}} className='mt-5'>
                <MDBCardHeader style={cardHeader}>
                    常见问题
                </MDBCardHeader>
                <MDBCardBody>
                    <Collapse style={{borderRadius:'20px',fontSize:'14pt'}}>
                        <Panel header="模考券和点评券有什么区别？" key="1">
                            <p style={size12}>模考券用于参加考试（含给分）。<br/><br/>
                                点评券用于考试结果分析，老师会分析考生的答案，指出语法逻辑错误并给出具体评价和可提升的地方。<br/>不同类型（雅思，PTE，CCL）的模考券和点评券不能混用。</p>
                        </Panel>
                        <Panel header="点评券具体包含哪些服务？" key="2">
                            <MDBTable hover bordered style={{marginBottom:'0px',backgroundColor: 'rgba(0, 0, 0, 0.02)'}}>
                                <MDBTableBody>
                                    <tr>
                                        <td style={cardTitle}>雅思</td>
                                        <td>
                                            写作&口语：1. 分别给出整体点评 2. 指出语法逻辑错误 3. 指点可提升的地方
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={cardTitle}>PTE</td>
                                        <td>敬请期待</td>
                                    </tr>
                                    <tr>
                                        <td style={cardTitle}>CCL</td>
                                        <td>1. 分别给出整体点评 2. 指出语法逻辑错误 3. 指点可提升的地方</td>
                                    </tr>
                                </MDBTableBody>
                            </MDBTable>
                            <hr/>
                            <div>雅思写作点评样例(部分)：</div>
                            <img src={Sample} style={{width:'500px',height:'auto',border:'solid 1px grey'}}/>
                        </Panel>
                        <Panel header="模考券和点评券会过期吗？" key="3">
                            <p style={size12}>不会，模考券和点评券一经购买，永久持有，直到将其使用。</p>
                        </Panel>
                        <Panel id='bottomRound' style={{borderRadius:'0 0 20px 20px'}} header="如果考试中途意外退出了，可以退模考券吗？" key="4">
                            <p style={size12}>不会，付费考试一旦开始，对应的1张模考券就会被消耗。如果您意外退出，可以通过返回未完成的考试以继续模考，考试进度会从您上次退出的地方开始。</p>
                        </Panel>
                    </Collapse>
                </MDBCardBody>
            </MDBCard>
        );
    }
}

const cardHeader = {
    backgroundColor: global.config.brown,
    color: 'white',
    fontSize: '14pt',
    borderRadius: '20px 20px 0 0'
}

const size12 = {
    fontSize: '12pt',
}

const cardTitle = {
    verticalAlign:'middle',
    textAlign:'center',
    backgroundColor: 'rgba(0, 0, 0, 0.04)'
}

export default HelpPage;