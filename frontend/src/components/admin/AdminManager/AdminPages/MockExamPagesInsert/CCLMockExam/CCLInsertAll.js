import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {Row, Col, Divider, Button, Cascader, Modal} from 'antd';
import "bootstrap/dist/css/bootstrap.min.css";
import ReactSpinner from 'react-bootstrap-spinner';

class CCLInsertAll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CCL_Audio_1_SCENARIO: [],
      CCL_Audio_2_SCENARIO: [],
      CCL_Audio_1: [],
      CCL_Audio_2: [],
      section1: false,
      section2: true,
      SpeakerA: "",
      SpeakerB: "",
      Paper: "",
      // NewGlobalUrl: "http://localhost:8000"
      NewGlobalUrl:global.config.url.slice(0,-1)
    };
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search)
    const myParam = urlParams.get('Paper')
    this.setState({
      Paper: myParam
    })

    // User Token verification
    let token = localStorage.getItem('access_token');

    axios.get(global.config.url + 'AdminHappy/GetCCLInfo?paperid=' + myParam, {headers: {Authorization: `Bearer ${token}`}}).then(res=>{
      console.log(res.data)

      this.setState({
        CCL_Audio_1_SCENARIO: res.data.data.Scenario_Audio_1,
        CCL_Audio_2_SCENARIO: res.data.data.Scenario_Audio_2,
        CCL_Audio_1: res.data.data.Section1_Audio,
        CCL_Audio_2: res.data.data.Section2_Audio,
        SpeakerA: res.data.data.SpeakerA_Gender,
        SpeakerB: res.data.data.SpeakerB_Gender,
      })
      console.log(this.state)
    })
  }
  
  SectionAppendAudio = (e) => {
    if (e.target.name == "CCL_AUDIO_1") {
      let AudioAppend = this.state.CCL_Audio_1
      AudioAppend.push('')
      this.setState({
        CCL_Audio_1: AudioAppend
      })
    }
    else {
      let AudioAppend = this.state.CCL_Audio_2
      AudioAppend.push('')
      this.setState({
        CCL_Audio_2: AudioAppend
      })
    }
  }

  SectionRemoveAudio = (e) => {
    if (e.target.name == "CCL_AUDIO_1") {
      let AudioRemove = this.state.CCL_Audio_1
      AudioRemove.pop()
      this.setState({
        CCL_Audio_1: AudioRemove
      })
    }
    else {
      let AudioRemove = this.state.CCL_Audio_2
      AudioRemove.pop()
      this.setState({
        CCL_Audio_2: AudioRemove
      })
    }
  }

  OnChangeHandler = (e) => {
    if (e.target.name == "CCL_AUDIO_1") {
      // Audio Setting
      let Current_CCL_Section = this.state.CCL_Audio_1
      Current_CCL_Section[e.target.id]=[e.target.value]

      // Overall update
      this.setState({
        CCL_Audio_1: Current_CCL_Section
      })
    }
    else if (e.target.name == "CCL_Audio_1_SCENARIO") {
      // Audio Setting
      let Current_CCL_Section = this.state.CCL_Audio_1_SCENARIO
      Current_CCL_Section[e.target.id]=[e.target.value]

      // Overall update
      this.setState({
        CCL_Audio_1_SCENARIO: Current_CCL_Section
      })
    }
    else if (e.target.name == "CCL_Audio_2_SCENARIO") {
      // Audio Setting
      let Current_CCL_Section = this.state.CCL_Audio_2_SCENARIO
      Current_CCL_Section[e.target.id]=[e.target.value]

      // Overall update
      this.setState({
        CCL_Audio_2_SCENARIO: Current_CCL_Section
      })
    }
    else {
      // Audio Setting
      let Current_CCL_Section = this.state.CCL_Audio
      Current_CCL_Section[e.target.id]=[e.target.value]

      // Overall update
      this.setState({
        CCL_Audio: Current_CCL_Section
      })
    }
  }

  Upload_Audio = (e) => {
    e.persist()

    // Pre define
    let token = localStorage.getItem('access_token');
    let formatData = new FormData()
    let UploadAudio = e.target.files[0]
    formatData.append('file', UploadAudio)
    const urlParams = new URLSearchParams(window.location.search)
    const myParam = urlParams.get('Paper')

    axios({
        method: 'post',
        url: global.config.url + `AdminHappy/CCL_AudioUpload?Paper=` + myParam,
        data: formatData,
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
    }).then(res => {
      console.log('ccl audio submit')
      console.log(res.data.data)
      // To search the response name
      for (let key in res.data.data) {
        if (e.target.name == 'CCL_Audio_1') {
          // Create a temporary array that store data
          let Current_CCL_Section = this.state.CCL_Audio_1
          // The e.target.id used to keep trace of which index
          Current_CCL_Section[e.target.id]= res.data.data[key]

          // Overall update
          this.setState({
            CCL_Audio_1: Current_CCL_Section
          })
        }
        else if (e.target.name == 'CCL_Audio_1_SCENARIO') {
          // Create a temporary array that store data
          let Current_CCL_Section = this.state.CCL_Audio_1_SCENARIO
          // The e.target.id used to keep trace of which index
          Current_CCL_Section[e.target.id]= res.data.data[key]

          // Overall update
          this.setState({
            CCL_Audio_1_SCENARIO: Current_CCL_Section
          })
        }
        else if (e.target.name == 'CCL_Audio_2_SCENARIO') {
          // Create a temporary array that store data
          let Current_CCL_Section = this.state.CCL_Audio_2_SCENARIO
          // The e.target.id used to keep trace of which index
          Current_CCL_Section[e.target.id]= res.data.data[key]

          // Overall update
          this.setState({
            CCL_Audio_2_SCENARIO: Current_CCL_Section
          })
        }
        else {
          let Current_CCL_Section = this.state.CCL_Audio_2
          // The e.target.id used to keep trace of which index
          Current_CCL_Section[e.target.id]= res.data.data[key]

          // Overall update
          this.setState({
            CCL_Audio_2: Current_CCL_Section
          })
        }
      }
    })
  }

  DisplayHiddenControl=(e)=>{
    if (e.target.name == 'Sect_1_Hidden') {
      this.setState({
        section1: false,
        section2: true
      })
    }
    else {
      this.setState({
        section1: true,
        section2: false
      })
    }
  }

  FinalSubmit = (e) => {
    let token = localStorage.getItem('access_token');

    let Final_Submit_Scenario_Audio_1_Srting=''
    let Final_Submit_Scenario_Audio_2_Srting=''
    let Final_Submit_Sec_1_Audio_Srting=''
    let Final_Submit_Sec_2_Audio_Srting=''

    // Scenario1   - > Change array to string
    for (let i = 0; i < this.state.CCL_Audio_1_SCENARIO.length; i++){
      // Sec_1_audioArray
      Final_Submit_Scenario_Audio_1_Srting = Final_Submit_Scenario_Audio_1_Srting + this.state.CCL_Audio_1_SCENARIO[i]
    }

    // Scenario2   - > Change array to string
    for (let i = 0; i < this.state.CCL_Audio_2_SCENARIO.length; i++){
      // Sec_1_audioArray
      Final_Submit_Scenario_Audio_2_Srting = Final_Submit_Scenario_Audio_2_Srting + this.state.CCL_Audio_2_SCENARIO[i]
    }

    // Section 1   - > Change array to string
    for (let i = 0; i < this.state.CCL_Audio_1.length; i++){
      // Sec_1_audioArray
      Final_Submit_Sec_1_Audio_Srting = Final_Submit_Sec_1_Audio_Srting + this.state.CCL_Audio_1[i]+';'
    }

    // Section 2   - > Change array to string
    for (let i = 0; i < this.state.CCL_Audio_2.length; i++){
      // Sec_1_audioArray
      Final_Submit_Sec_2_Audio_Srting=Final_Submit_Sec_2_Audio_Srting + this.state.CCL_Audio_2[i]+';'
    }

    // Use for loop to change Array to String  (Section_1)
    Final_Submit_Sec_1_Audio_Srting=Final_Submit_Sec_1_Audio_Srting.slice(0,-1)

    // Use for loop to change Array to String  (Section_3)
    Final_Submit_Sec_2_Audio_Srting=Final_Submit_Sec_2_Audio_Srting.slice(0,-1)
    
    console.log(Final_Submit_Scenario_Audio_1_Srting)
    console.log(Final_Submit_Scenario_Audio_2_Srting)
    console.log(Final_Submit_Sec_1_Audio_Srting)
    console.log(Final_Submit_Sec_2_Audio_Srting)
    console.log(this.state.SpeakerA)
    console.log(this.state.SpeakerB)
    console.log(this.state.Paper)

    axios({
      method: 'post',
      url: global.config.url+ `AdminHappy/CCLPaperUpdate`,
      data: {
        paperid: this.state.Paper,
        Scenario_Audio_1: Final_Submit_Scenario_Audio_1_Srting,
        Scenario_Audio_2: Final_Submit_Scenario_Audio_2_Srting,
        Sec_Audio_1: Final_Submit_Sec_1_Audio_Srting,
        Sec_Audio_2: Final_Submit_Sec_2_Audio_Srting,
        SpeakerA: this.state.SpeakerA,
        SpeakerB: this.state.SpeakerB
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      if(res.data.msg='succeed'){
        alert('Success')
        window.location.href='/AdminManagement/AdminCCLExamManagement'
      }
    })
  }

  OnChangeSpeaker = (e) => {
    if (e.target.name == 'SpeakerA') {
      this.setState({
        SpeakerA: e.target.value
      })
    }
    else {
      this.setState({
        SpeakerB: e.target.value
      })
    }
  }

  render() {
    return (
      <div>
        <div style={{padding: "10px"}}>
          <button name='Sect_1_Hidden' onClick={this.DisplayHiddenControl}>Section 1</button>
          <button name='Sect_2_Hidden' onClick={this.DisplayHiddenControl}>Section 2</button>
          <button name='CCL_Submit' onClick={this.FinalSubmit}>Final</button>
        </div>

        <div className='IletInsertSpeaking_QuestionDisplay'>
          <div hidden={this.state.section1} id='CCL_Section_1'>
            <h5><b>CCL Section 1</b></h5>
            {
              this.state.CCL_Audio_1_SCENARIO.map((record, i)=> {
                return(
                  <div key={i}>
                    <audio controls>
                      <source src={this.state.NewGlobalUrl + record} name={'CCL_Audio_1_SCENARIO'} id={i} type={"audio/ogg"}/>
                    </audio>
                    <br/>
                  </div>
                )
              })
            }
            {
              this.state.CCL_Audio_1.map((record, i)=> {
                return(
                  <div key={i}>
                    <audio controls>
                      <source src={this.state.NewGlobalUrl + record} name={'CCL_Audio_1'} id={i} type={"audio/ogg"}/>
                    </audio>
                    <br/>
                  </div>
                )
              })
            }
          </div>
        </div>

        <div className='IletInsertSpeaking_QuestionInsert'>
          <div hidden={this.state.section1} className='Ilets_Speaking_Section_3'>
            <h5><b>CCL Section 1</b></h5>
            <input type='button' name="CCL_AUDIO_1" value='Add' onClick={this.SectionAppendAudio}/>
            <input type='button' name="CCL_AUDIO_1" value='Remove' onClick={this.SectionRemoveAudio}/>
            <div style={{textAlign:'left'}}>
              <div>Please select Speaker A gender:</div>
              <select name='SpeakerA' onChange={this.OnChangeSpeaker}>
                <option value="" selected data-default>gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <div>Please select Speaker B gender:</div>
              <select name='SpeakerB' onChange={this.OnChangeSpeaker}>
                <option value="" selected data-default>gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            {
              // load the audio from the state (array)
              this.state.CCL_Audio_1_SCENARIO.map((data, i)=>{
                return(
                  // <span><span>{data}</span><br/> </span>
                  <div style={{textAlign:'left'}} key={i}>
                    <h5><b>Section1 Scenario</b></h5>
                    <h6>Scenario Input</h6>
                    <h6>Audio Input</h6>
                    <input type="text" key={i} style={{width:'100%', height:'30px'}} name={'CCL_Audio_1_SCENARIO'} id={i}  value={data} onChange={this.OnChangeHandler} disabled/>
                    <br/><br/>
                    <input type='file' name={'CCL_Audio_1_SCENARIO'} id={i} onChange={this.Upload_Audio} accept="audio/*"/>
                    <br/>
                    <br/>
                  </div>
                )
              })
            }
            {
              // load the audio from the state (array)
              this.state.CCL_Audio_1.map((data, i)=>{
                return(
                  // <span><span>{data}</span><br/> </span>
                  <div style={{textAlign:'left'}} key={i}>
                    <h5><b>Question {i+1}</b></h5>
                    <h6>Question Input</h6>
                    <h6>Audio Input</h6>
                    <input type="text" key={i} style={{width:'100%', height:'30px'}} name={'CCL_Audio_1'} id={i}  value={data} onChange={this.OnChangeHandler} disabled/>
                    <br/><br/>
                    <input type='file' name={'CCL_Audio_1'} id={i} onChange={this.Upload_Audio} accept="audio/*"/>
                    <br/>
                    <br/>
                  </div>
                )
              })
            }
          </div>
        </div>

        <div className='IletInsertSpeaking_QuestionDisplay'>
          <div hidden={this.state.section2} id='CCL_Section_2'>
            <h5><b>CCL Section 2</b></h5>
            {
              this.state.CCL_Audio_2_SCENARIO.map((record, i)=> {
                return(
                  <div key={i}>
                    <audio controls>
                      <source src={this.state.NewGlobalUrl + record} name={'CCL_Audio_2_SCENARIO'} id={i} type={"audio/ogg"}/>
                    </audio>
                    <br/>
                  </div>
                )
              })
            }
            {
              this.state.CCL_Audio_2.map((record, i)=> {
                return(
                  <div key={i}>
                    <audio controls>
                      <source src={this.state.NewGlobalUrl + record} name={'CCL_Audio_2'} id={i} type={"audio/ogg"}/>
                    </audio>
                    <br/>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className='IletInsertSpeaking_QuestionInsert'>
          <div hidden={this.state.section2} className='Ilets_Speaking_Section_3'>
            <h5><b>CCL Section 2</b></h5>
            <input type='button' name="CCL_AUDIO_2" value='Add' onClick={this.SectionAppendAudio}/>
            <input type='button' name="CCL_AUDIO_2" value='Remove' onClick={this.SectionRemoveAudio}/>
            <div style={{textAlign:'left'}}>
              <div>Please select Speaker A gender:</div>
              <select name='SpeakerA' onChange={this.OnChangeSpeaker}>
                <option value="" selected data-default>gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <div>Please select Speaker B gender:</div>
              <select name='SpeakerB' onChange={this.OnChangeSpeaker}>
                <option value="" selected data-default>gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            {
              // load the audio from the state (array)
              this.state.CCL_Audio_2_SCENARIO.map((data, i)=>{
                return(
                  // <span><span>{data}</span><br/> </span>
                  <div style={{textAlign:'left'}} key={i}>
                    <h5><b>Section2 Scenario</b></h5>
                    <h6>Scenario Input</h6>
                    <h6>Audio Input</h6>
                    <input type="text" key={i} style={{width:'100%', height:'30px'}} name={'CCL_Audio_2_SCENARIO'} id={i}  value={data} onChange={this.OnChangeHandler} disabled/>
                    <br/><br/>
                    <input type='file' name={'CCL_Audio_2_SCENARIO'} id={i} onChange={this.Upload_Audio} accept="audio/*"/>
                    <br/>
                    <br/>
                  </div>
                )
              })
            }
            {
              // load the audio from the state (array)
              this.state.CCL_Audio_2.map((data, i)=>{
                return(
                  // <span><span>{data}</span><br/> </span>
                  <div style={{textAlign:'left'}} key={i}>
                    <h5><b>Question {i+1}</b></h5>
                    <h6>Question Input</h6>
                    <h6>Audio Input</h6>
                    <input type="text" key={i} style={{width:'100%', height:'30px'}} name={'CCL_Audio_2'} id={i}  value={data} onChange={this.OnChangeHandler} disabled/>
                    <br/><br/>
                    <input type='file' name={'CCL_Audio_2'} id={i} onChange={this.Upload_Audio} accept="audio/*"/>
                    <br/>
                    <br/>
                  </div>
                )
              })
            }
          </div>
        </div>

      </div>
    );
  }
}

export default CCLInsertAll;
