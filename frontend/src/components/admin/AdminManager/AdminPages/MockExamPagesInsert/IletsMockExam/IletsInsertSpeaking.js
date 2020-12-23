import React, {Component} from 'react';
import axios from 'axios';

// import parser
import {parseTag} from '../../../../../Utility'

class IletsInsertSpeaking extends Component{

    state={
        loading:true,
        Ilets_Paper_ID:'',

        // Ilets_Speaking_Section_1
        Ilets_Speaking_Section_1_Audio:[],
        Ilets_Speaking_Section_1_TextArray:[],

        // Ilets_Speaking_Section_2
        Ilets_Speaking_Section_2_Text:'',

        // Ilets_Speaking_Section_3
        Ilets_Speaking_Section_3_Audio:[],
        Ilets_Speaking_Section_3_TextArray:[],

        // Speaking_Section_Display
        Speaking_Sec_1_Hidden:false,
        Speaking_Sec_2_Hidden:true,
        Speaking_Sec_3_Hidden:true,

        NewGlobalUrl:global.config.url.slice(0,-1)

    }

    componentDidMount() {
        // User Token verification
        let token = localStorage.getItem('access_token');

        // Pre_define
        let Temp_Ilets_Speaking_Section_1_Audio=[]

        axios.get(global.config.url + 'AdminHappy/GetIeltsSpeakingInfo?paperid=' + this.props.location.search.slice(1),{headers: {Authorization: `Bearer ${token}`}}).then(res=>{
            console.log(res.data)

            this.setState({
                loading:false,
                Ilets_Paper_ID:res.data.data.Paper_ID,
                Ilets_Speaking_Section_1_Audio:res.data.data.Section_1_AudioArray,
                Ilets_Speaking_Section_1_TextArray:res.data.data.Section_1_TextArray,
                Ilets_Speaking_Section_2_Text:res.data.data.Section_2_Question,
                Ilets_Speaking_Section_3_Audio:res.data.data.Section_3_AudioArray,
                Ilets_Speaking_Section_3_TextArray:res.data.data.Section_3_TextArray,
            })
            console.log(this.state)
        })
    }

    render(){
        return(
            <React.Fragment>

                <div className='IletInsertSpeakingOverall'>
                    <div>
                        <input type='Button' name='Speaking_Sect_1_Hidden' value='Section_1' onClick={this.SpeakingDisplayHiddenControl}/>
                        <input type='Button' name='Speaking_Sect_2_Hidden' value='Section_2' onClick={this.SpeakingDisplayHiddenControl}/>
                        <input type='Button' name='Speaking_Sect_3_Hidden' value='Section_3' onClick={this.SpeakingDisplayHiddenControl}/>
                        <input type='Button' value='Final' onClick={this.FinalSubmit.bind(this)}/>
                    </div>

                    <div className='IletInsertSpeaking_QuestionDisplay'>
                        <div hidden={this.state.Speaking_Sec_1_Hidden} id='Ilets_Speaking_Section_1'>
                            <h5><b>Speaking Section 1</b></h5>
                            {
                                this.state.Ilets_Speaking_Section_1_Audio.map((record, i)=>{
                                    return(
                                        <div key={i}>
                                            <h6>{ this.state.Ilets_Speaking_Section_1_TextArray[i]}</h6>
                                            <audio controls>
                                                <source src={this.state.NewGlobalUrl + record} name={'Ilets_Speaking_Section_1_Audio'} id={i} type={"audio/ogg"}/>
                                            </audio>
                                            <br/>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div hidden={this.state.Speaking_Sec_2_Hidden} className='Ilets_Speaking_Section_2'>
                            <h5><b>Speaking Section 2</b></h5>
                            <span dangerouslySetInnerHTML={{ __html: parseTag(this.state.Ilets_Speaking_Section_2_Text) }}></span>
                        </div>

                        <div hidden={this.state.Speaking_Sec_3_Hidden} className='Ilets_Speaking_Section_3'>
                            <h5><b>Speaking Section 3</b></h5>
                                {
                                    this.state.Ilets_Speaking_Section_3_Audio.map((record, i)=>{
                                        return(
                                            <div key={i}>
                                                <h6>{this.state.Ilets_Speaking_Section_3_TextArray[i]}</h6>
                                                <audio controls>
                                                    <source src={this.state.NewGlobalUrl + record} name={'Ilets_Speaking_Section_3_Audio'} id={i} type={"audio/ogg"}/>
                                                </audio>
                                                <br/>
                                            </div>
                                        )
                                    })
                                }
                        </div>
                    </div>

                    <div className='IletInsertSpeaking_QuestionInsert'>

                        <div hidden={this.state.Speaking_Sec_1_Hidden} className='Ilets_Speaking_Section_1'>
                            <h5><b>Speaking Section 1</b></h5>
                            <input type='button' name="Ilet_Speaking_Section_1" value='Add' onClick={this.SectionAppendAudio}/>
                            <input type='button' name="Ilet_Speaking_Section_1" value='Remove' onClick={this.SectionRemoveAudio}/>
                            {
                                // load the audio from the state (array)
                                this.state.Ilets_Speaking_Section_1_Audio.map((data, i)=>{
                                    return(
                                        // <span><span>{data}</span><br/> </span>
                                        <div style={{textAlign:'left'}} key={i}>
                                            <h5><b>Question {i+1}</b></h5>
                                            <h6>Question Input</h6>
                                            <textarea style={{width:'100%', height:'30px'}} id={i} name='Ilets_Speaking_Section_1_TextArray' onChange={this.OnChangeHandler} value={this.state.Ilets_Speaking_Section_1_TextArray[i]}/>
                                            <br/>
                                            <h6>Audio Input</h6>
                                            <input key={i} style={{width:'100%', height:'30px'}} name={'Ilets_Speaking_Section_1_Audio'} id={i}  value={data} onChange={this.OnChangeHandler} disabled/>
                                            <br/><br/>
                                            <input type='file' name={'Ilets_Speaking_Section_1_Audio'} id={i} onChange={this.Upload_Audio} accept="audio/*"/>
                                            <br/><br/>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div hidden={this.state.Speaking_Sec_2_Hidden} className='Ilets_Speaking_Section_2'>
                            <h5><b>Speaking Section 2</b></h5>
                            <textarea style={{width:'100%', height:'80px'}} name='Ilets_Speaking_Section_2_Text' onChange={this.OnChangeHandler} value={this.state.Ilets_Speaking_Section_2_Text}/>
                        </div>


                        <div hidden={this.state.Speaking_Sec_3_Hidden} className='Ilets_Speaking_Section_3'>
                            <h5><b>Speaking Section 3</b></h5>
                            <input type='button' name="Ilet_Speaking_Section_3" value='Add' onClick={this.SectionAppendAudio}/>
                            <input type='button' name="Ilet_Speaking_Section_3" value='Remove' onClick={this.SectionRemoveAudio}/>
                            {
                                // load the audio from the state (array)
                                this.state.Ilets_Speaking_Section_3_Audio.map((data, i)=>{
                                    return(
                                        // <span><span>{data}</span><br/> </span>
                                        <div style={{textAlign:'left'}} key={i}>
                                            <h5><b>Question {i+1}</b></h5>
                                            <h6>Question Input</h6>
                                            <textarea style={{width:'100%', height:'30px'}} id={i} name='Ilets_Speaking_Section_3_TextArray' onChange={this.OnChangeHandler} value={this.state.Ilets_Speaking_Section_3_TextArray[i]}/>
                                            <br/>
                                            <h6>Audio Input</h6>
                                            <input type="text" key={i} style={{width:'100%', height:'30px'}} name={'Ilets_Speaking_Section_3_Audio'} id={i}  value={data} onChange={this.OnChangeHandler} disabled/>
                                            <br/><br/>
                                            <input type='file' name={'Ilets_Speaking_Section_3_Audio'} id={i} onChange={this.Upload_Audio} accept="audio/*"/>
                                            <br/>
                                            <br/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    SpeakingDisplayHiddenControl=(e)=>{
        if(e.target.name=='Speaking_Sect_1_Hidden'){
            this.setState({
                Speaking_Sec_1_Hidden:false,
                Speaking_Sec_2_Hidden:true,
                Speaking_Sec_3_Hidden:true,
            })
        }else if(e.target.name=='Speaking_Sect_2_Hidden'){
            this.setState({
                Speaking_Sec_1_Hidden:true,
                Speaking_Sec_2_Hidden:false,
                Speaking_Sec_3_Hidden:true,
            })
        }else if(e.target.name=='Speaking_Sect_3_Hidden'){
            this.setState({
                Speaking_Sec_1_Hidden:true,
                Speaking_Sec_2_Hidden:true,
                Speaking_Sec_3_Hidden:false,
            })
        }
    }


    OnChangeHandler=(e)=>{
        if(e.target.name=='Ilets_Speaking_Section_1_Audio') {
            // Audio Setting
            let Current_Speaking_Section = this.state.Ilets_Speaking_Section_1_Audio
            Current_Speaking_Section[e.target.id]=[e.target.value]

            // Overall update
            this.setState({Ilets_Speaking_Section_1_Audio: Current_Speaking_Section})
        }

        if(e.target.name=='Ilets_Speaking_Section_1_TextArray'){
            // Question Setting
            let Current_Speaking_Question_Section = this.state.Ilets_Speaking_Section_1_TextArray
            Current_Speaking_Question_Section[e.target.id]=[e.target.value]

            this.setState({Ilets_Speaking_Section_1_TextArray: Current_Speaking_Question_Section})

        }

        if(e.target.name=='Ilets_Speaking_Section_2_Text'){
            this.setState({[e.target.name]:e.target.value})
        }

        if(e.target.name=='Ilets_Speaking_Section_3_Audio') {
            // Audio Setting
            let Current_Speaking_Section = this.state.Ilets_Speaking_Section_3_Audio
            Current_Speaking_Section[e.target.id]=[e.target.value]

            // Overall update
            this.setState({Ilets_Speaking_Section_3_Audio: Current_Speaking_Section})
        }

        if(e.target.name=='Ilets_Speaking_Section_3_TextArray'){
            // Question Setting
            let Current_Speaking_Question_Section = this.state.Ilets_Speaking_Section_3_TextArray
            Current_Speaking_Question_Section[e.target.id]=[e.target.value]

            this.setState({Ilets_Speaking_Section_3_TextArray: Current_Speaking_Question_Section})
        }

    }

    SectionAppendAudio=(e)=>{
        if(e.target.name=='Ilet_Speaking_Section_1'){
            console.log("Section_1")
            let AudioAppend = this.state.Ilets_Speaking_Section_1_Audio
            AudioAppend.push('')

            let TextQuestion = this.state.Ilets_Speaking_Section_1_TextArray
            TextQuestion.push('')
            this.setState({Ilets_Speaking_Section_1_Audio:AudioAppend, Ilets_Speaking_Section_1_TextArray:TextQuestion})
        }

        if(e.target.name=='Ilet_Speaking_Section_3'){
            console.log("Section_3")
            let AudioAppend = this.state.Ilets_Speaking_Section_3_Audio
            AudioAppend.push('')

            let TextQuestion = this.state.Ilets_Speaking_Section_3_TextArray
            TextQuestion.push('')
            this.setState({Ilets_Speaking_Section_3_Audio:AudioAppend, Ilets_Speaking_Section_3_TextArray:TextQuestion})
        }
    }

    SectionRemoveAudio=(e)=>{
        if(e.target.name=='Ilet_Speaking_Section_1'){
            console.log("Section_1")
            let AudioRemove = this.state.Ilets_Speaking_Section_1_Audio
            AudioRemove.pop()

            let TextQuestion = this.state.Ilets_Speaking_Section_1_TextArray
            TextQuestion.pop()
            this.setState({Ilets_Speaking_Section_1_Audio:AudioRemove, Ilets_Speaking_Section_1_TextArray:TextQuestion})
        }

        if(e.target.name=='Ilet_Speaking_Section_3'){
            console.log("Section_3")
            let AudioRemove = this.state.Ilets_Speaking_Section_3_Audio
            AudioRemove.pop()

            let TextQuestion = this.state.Ilets_Speaking_Section_3_TextArray
            TextQuestion.pop()
            this.setState({Ilets_Speaking_Section_3_Audio:AudioRemove, Ilets_Speaking_Section_3_TextArray:TextQuestion})
        }
    }


    Upload_Audio=(e)=> {
        e.persist()

        // Pre define
        let token = localStorage.getItem('access_token');
        let formatData = new FormData()
        let UploadAudio = e.target.files[0]
        formatData.append('file', UploadAudio)

        if(e.target.name=='Ilets_Speaking_Section_1_Audio'){
            console.log("Section 1")
            axios({
                method: 'post',
                url: global.config.url + `AdminHappy/AudioUpload`,
                data: formatData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                // To search the response name
                for (let key in res.data.data) {

                    // Create a temporary array that store data
                    let Current_Speaking_Section = this.state.Ilets_Speaking_Section_1_Audio
                    // The e.target.id used to keep trace of which index
                    Current_Speaking_Section[e.target.id]= '/AUDIO/'+key

                    // Overall update
                    this.setState({Ilets_Speaking_Section_1_Audio: Current_Speaking_Section})
                }
            })
        }


        if(e.target.name=='Ilets_Speaking_Section_3_Audio'){
            console.log("Section 3")
            axios({
                method: 'post',
                url: global.config.url + `AdminHappy/AudioUpload`,
                data: formatData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                // To search the response name
                for (let key in res.data.data) {

                    // Create a temporary array that store data
                    let Current_Speaking_Section = this.state.Ilets_Speaking_Section_3_Audio
                    // The e.target.id used to keep trace of which index
                    Current_Speaking_Section[e.target.id]= '/AUDIO/'+key

                    // Overall update
                    this.setState({Ilets_Speaking_Section_3_Audio: Current_Speaking_Section})
                }
            })


        }

    }

    FinalSubmit=(e)=>{
        let token = localStorage.getItem('access_token');

        let Final_Submit_Sec_1_Text_Srting=''
        let Final_Submit_Sec_1_Audio_Srting=''
        let Final_Submit_Sec_3_Text_Srting=''
        let Final_Submit_Sec_3_Audio_Srting=''

        // Section 1   - > Change array to string
        for (let i=0;i<this.state.Ilets_Speaking_Section_1_TextArray.length;i++){
            // Sec_1_TextArray
            Final_Submit_Sec_1_Text_Srting=Final_Submit_Sec_1_Text_Srting+this.state.Ilets_Speaking_Section_1_TextArray[i]+';'

            // Sec_1_audioArray
            Final_Submit_Sec_1_Audio_Srting=Final_Submit_Sec_1_Audio_Srting+this.state.Ilets_Speaking_Section_1_Audio[i]+';'
        }

        // Section 3   - > Change array to string
        for (let i=0;i<this.state.Ilets_Speaking_Section_3_Audio.length;i++){
            // Sec_1_TextArray
            Final_Submit_Sec_3_Text_Srting=Final_Submit_Sec_3_Text_Srting+this.state.Ilets_Speaking_Section_3_TextArray[i]+';'

            // Sec_1_audioArray
            Final_Submit_Sec_3_Audio_Srting=Final_Submit_Sec_3_Audio_Srting+this.state.Ilets_Speaking_Section_3_Audio[i]+';'
        }

        // Use for loop to change Array to String  (Section_1)
        Final_Submit_Sec_1_Text_Srting=Final_Submit_Sec_1_Text_Srting.slice(0,-1)
        Final_Submit_Sec_1_Audio_Srting=Final_Submit_Sec_1_Audio_Srting.slice(0,-1)

        // Use for loop to change Array to String  (Section_3)
        Final_Submit_Sec_3_Text_Srting=Final_Submit_Sec_3_Text_Srting.slice(0,-1)
        Final_Submit_Sec_3_Audio_Srting=Final_Submit_Sec_3_Audio_Srting.slice(0,-1)

        console.log(this.state.Ilets_Speaking_Section_2_Text)
        axios({
            method: 'post',
            url: global.config.url + `AdminHappy/SpeakingPaperUpdate`,
            data: {
                paperid:this.state.Ilets_Paper_ID,
                Section_1_AudioArray:Final_Submit_Sec_1_Audio_Srting,
                Section_1_TextArray:Final_Submit_Sec_1_Text_Srting,
                Section_2_Question:this.state.Ilets_Speaking_Section_2_Text,
                Section_3_AudioArray:Final_Submit_Sec_3_Audio_Srting,
                Section_3_TextArray:Final_Submit_Sec_3_Text_Srting,
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if(res.data.msg='succeed'){
                alert('Success')
                window.location.href='/AdminManagement/AdminIletsExamManagement'
            }
        })

    }
}
export default IletsInsertSpeaking;