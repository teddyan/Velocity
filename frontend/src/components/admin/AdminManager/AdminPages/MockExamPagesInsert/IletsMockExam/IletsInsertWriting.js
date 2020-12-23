import React, {Component} from 'react';
import axios from 'axios';

// import parser
import {parseTag} from '../../../../../Utility'

import '../../../../../../css/AdminPages.css'


class IletsInsertWriting extends Component{

    state={
        loading:true,
        Ilets_Paper_ID:'',
        Ilets_Sec_1_Standard:'',
        IletsW_Sec_1_Text:'',
        IletsW_Sec_1_IMG:'',

        // Section_1_temp
        IletsW_Sec_1_input_text:'',
        IletsW_Sec_1_Overall:'',
        IletsW_Sec_1_Addition_1:'',
        IletsW_Sec_1_Addition_2:'',
        IletsW_Sec_1_Addition_3:'',

         // Section_2
        Ilets_Sec_2_Standard:'',
        IletsW_Sec_2_Text:'',
        IletsW_Sec_2_IMG:'',

        // Section_2_temp
        IletsW_Sec_2_input_text:'',
        IletsW_Sec_2_Overall:'',
        IletsW_Sec_2_Addition_1:'',
        IletsW_Sec_2_Addition_2:'',
        IletsW_Sec_2_Addition_3:'',

        // Hidden
        Ilets_W_Section_1_hidden:false,
        Ilets_W_Section_2_hidden:true,

        IletsW_Sec_1_hidden:false,
        IletsW_Sec_2_hidden:false,
    }

    componentDidMount() {
        // User Token verification
        let token = localStorage.getItem('access_token');

        axios.get(global.config.url + 'AdminHappy/GetIeltsWritingInfo?paperid=' + this.props.location.search.slice(1),{headers: {Authorization: `Bearer ${token}`}}).then(res=>{
            console.log(res.data)
            this.setState({
                loading:false,
                Ilets_Paper_ID:res.data.data.Paper_ID,

                // Section_1
                Ilets_Sec_1_Standard:res.data.data.W_Section_1_Standard,
                IletsW_Sec_1_Text:res.data.data.W_Section_1_Text,
                IletsW_Sec_1_IMG:res.data.data.W_Section_1_Imgpath,

                // Section_1_temp
                IletsW_Sec_1_Addition_1:"WRITING TASK 1\\n\nYou should spend about 20 minutes on this task.\\n\\n\n\n<table><tbody>\n<tr><td>\n",
                IletsW_Sec_1_Addition_2:"</td>\n</tr>\n</tbody>\n</table>\n[IMG]",
                IletsW_Sec_1_Addition_3:'[IMG]',


                // Section_1
                Ilets_Sec_2_Standard:res.data.data.W_Section_2_Standard,
                IletsW_Sec_2_Text:res.data.data.W_Section_2_Text,
                IletsW_Sec_2_IMG:res.data.data.W_Section_2_Imgpath,


                // Section_2_temp
                IletsW_Sec_2_Addition_1:"WRITING TASK 2\\n You should spend about 40 minutes on this task. \\n Write about the following topic:\\n<table><tbody><tr><td>",
                IletsW_Sec_2_Addition_2:"</td></tr></tbody></table>\\n\\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
                // IletsW_Sec_2_Addition_3:'[IMG]',


            },()=>{
                this.setState({IletsW_Sec_1_Overall:this.state.IletsW_Sec_1_Addition_1+this.state.IletsW_Sec_1_input_text+this.state.IletsW_Sec_1_Addition_2+this.state.IletsW_Sec_1_IMG})
                this.setState({IletsW_Sec_2_Overall:this.state.IletsW_Sec_2_Addition_1+this.state.IletsW_Sec_2_input_text+this.state.IletsW_Sec_2_Addition_2})
                console.log(this.state.Ilets_Paper_ID)
            })
        })
    }


    render(){
        return(
            <React.Fragment>
                <h4>Paper ID: {this.state.Ilets_Paper_ID}</h4>
                <div className="IletInsertWritingOverall">
                    <div style={{right:'right'}}>
                        <input type='button' name='Writing_Section_1_Display' value='Section_1' onClick={this.IletsDisplayHidden}/> &nbsp;
                        <input type='button' name='Writing_Section_2_Display' value='Section_2' onClick={this.IletsDisplayHidden}/> &nbsp;
                        <input type='button' value='Submit' onClick={this.FinalWritingSubmit}/>
                    </div>

                    <div className='IletInsertWriting_QuestionDisplay'>

                        {/* Section_1 Display */}
                        <div hidden={this.state.Ilets_W_Section_1_hidden} className='W_Sec_1'>
                            <h5>Section 1: </h5><br/>
                            <input type='button' name='IletsW_Sec_1_hidden' value="Click me" onClick={this.QuestionToggle}/>
                            <div hidden={this.state.IletsW_Sec_1_hidden}><h5>Origin</h5><br/><span dangerouslySetInnerHTML={{ __html: parseTag(this.state.IletsW_Sec_1_Text)}}></span></div><br/>
                            <div hidden={!this.state.IletsW_Sec_1_hidden}><h5>Editing</h5><br/><span dangerouslySetInnerHTML={{ __html: parseTag(this.state.IletsW_Sec_1_Overall) }}></span></div><br/>
                        </div>

                        {/* Section_2 Display */}
                        <div hidden={this.state.Ilets_W_Section_2_hidden}>
                            <h5>Section 2: </h5><br/>
                            <input type='button' name='IletsW_Sec_2_hidden' value="Click me" onClick={this.QuestionToggle}/><br/>
                            <div hidden={this.state.IletsW_Sec_2_hidden}><h5>Origin:</h5><br/><span dangerouslySetInnerHTML={{ __html: parseTag(this.state.IletsW_Sec_2_Text) }}></span></div><br/>
                            <div hidden={!this.state.IletsW_Sec_2_hidden}><h5>Editing:</h5><br/><span dangerouslySetInnerHTML={{ __html: parseTag(this.state.IletsW_Sec_2_Overall) }}></span></div><br/>
                        </div>

                    </div>

                    <div className='IletInsertWriting_QuestionInsert'>

                        {/* Section_1 Insert Form */}
                        <div hidden={this.state.Ilets_W_Section_1_hidden} >
                            <h6>Section_1_Question: </h6><br/>
                            <textarea type="text" style={{width:'50%', height:'150px'}} value={this.state.IletsW_Sec_1_input_text} name='IletsW_Sec_1_input_text' value={this.state.IletsW_Sec_1_input_text} onChange={this.handleChange.bind(this)}/>
                            <br/>
                            <h6>Img:</h6><br/>
                            <textarea type="text" style={{width:'50%', height:'30px'}} value={this.state.IletsW_Sec_1_IMG} name='IletsW_Sec_1_IMG' onChange={this.handleChange.bind(this)}/>
                            <br/>
                            <br/>
                            {/* Image Upload Section_1 */}
                            <h6>Section 1 Image Upload</h6>
                            <input type='file' onChange={this.PictureUpload} accept="image/*"/>

                        </div>

                        {/* Section_2 Insert Form*/}
                        <div hidden={this.state.Ilets_W_Section_2_hidden}>
                            <h6>Section_2_Question: </h6><br/>
                            <textarea type="text" style={{width:'50%', height:'150px'}} value={this.state.IletsW_Sec_2_input_text} name='IletsW_Sec_2_input_text' value={this.state.IletsW_Sec_2_input_text} onChange={this.handleChange.bind(this)}/>
                            <br/>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    IletsDisplayHidden=(e)=>{
        if(e.target.name==='Writing_Section_1_Display'){
            this.setState({Ilets_W_Section_1_hidden:false,Ilets_W_Section_2_hidden:true})
        }else if(e.target.name==='Writing_Section_2_Display'){
            this.setState({Ilets_W_Section_1_hidden:true,Ilets_W_Section_2_hidden:false})
        }
    }


    handleChange=(e)=>{
        this.setState({[e.target.name]: [e.target.value]},()=>{
            this.setState({IletsW_Sec_1_Overall:this.state.IletsW_Sec_1_Addition_1+this.state.IletsW_Sec_1_input_text+this.state.IletsW_Sec_1_Addition_2+this.state.IletsW_Sec_1_IMG+this.state.IletsW_Sec_1_Addition_3,})
            this.setState({IletsW_Sec_2_Overall:this.state.IletsW_Sec_2_Addition_1+this.state.IletsW_Sec_2_input_text+this.state.IletsW_Sec_2_Addition_2})
        })
    }

    // Show Origin And Edit
    QuestionToggle=(e)=>{
        console.log(e.target.name)
        let toggleTry=this.state[e.target.name]
        toggleTry=!toggleTry
        this.setState({[e.target.name]:toggleTry})
    }

    // Section_1_picture Upload
    PictureUpload=(e)=>{
        let formatData = new FormData()
        let UploadImage = e.target.files[0]
        formatData.append('file', UploadImage)
        let token = localStorage.getItem('access_token');
        axios({
            method:'post',
            url:global.config.url + `AdminHappy/ImgUpload`,
            data: formatData,
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        }).then(res=>{
            console.log(res.data)
            for (let key in res.data.data){
                console.log(key)
                this.setState({IletsW_Sec_1_IMG:global.config.url + 'IMG/'+key})
            }
        })
    }

    // Final Submit
    FinalWritingSubmit=(e)=>{
        // User Token verification
        let token = localStorage.getItem('access_token');
        axios({
            method:'post',
            url:global.config.url + `AdminHappy/WritingPaperUpdate`,
            data:{
                paperid:this.state.Ilets_Paper_ID,
                section1:this.state.IletsW_Sec_1_Overall,
                section2:this.state.IletsW_Sec_2_Overall,
                section1Standard:this.state.Ilets_Sec_1_Standard,
                section2Standard:this.state.Ilets_Sec_2_Standard
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res=>{
            console.log(res.data)
            if(res.data.msg=='succeed'){
                alert('Submit Successfully')
            }
        })

    }

}
export default IletsInsertWriting;