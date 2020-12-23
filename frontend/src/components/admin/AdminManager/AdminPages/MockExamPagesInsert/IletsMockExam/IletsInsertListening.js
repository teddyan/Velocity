import React, {Component} from 'react';
import axios from 'axios';

// import parser
import {parseTag} from '../../../../../Utility'

class IletsInsertListening extends Component{

    state={
        loading:true,

        // Load Data from response
        Ilets_Listening_PaperID:'',
        Ilets_Listening_Answer:[],
        Ilets_Sec_1_Publish_text:'',
        Ilets_Sec_2_Publish_text:'',
        Ilets_Sec_3_Publish_text:'',
        Ilets_Sec_4_Publish_text:'',

        // Create Listening TextArray for input purpose
        Ilets_Listening_Sec_1_TextArray_name:[],
        Ilets_Listening_Sec_2_TextArray_name:[],
        Ilets_Listening_Sec_3_TextArray_name:[],
        Ilets_Listening_Sec_4_TextArray_name:[],


        // Create Listening TextArray for input purpose
        Ilets_Listening_Sec_1_TextArray:[],
        Ilets_Listening_Sec_2_TextArray:[],
        Ilets_Listening_Sec_3_TextArray:[],
        Ilets_Listening_Sec_4_TextArray:[],


        // Create Edit Sections (1,2,3,4) display
        Ilets_Listening_Sec_1_TextOverall:'',
        Ilets_Listening_Sec_2_TextOverall:'',
        Ilets_Listening_Sec_3_TextOverall:'',
        Ilets_Listening_Sec_4_TextOverall:'',

        // Audio Link
        Ilets_Listening_Sec_1_Audio:'',
        Ilets_Listening_Sec_2_Audio:'',
        Ilets_Listening_Sec_3_Audio:'',
        Ilets_Listening_Sec_4_Audio:'',

        // Hidden Public Control
        Ilets_L_Section_1_Public_Hidden:true,
        Ilets_L_Section_2_Public_Hidden:true,
        Ilets_L_Section_3_Public_Hidden:true,
        Ilets_L_Section_4_Public_Hidden:true,

        // Hidden Control
        Ilets_L_Section_1_Hidden:false,
        Ilets_L_Section_2_Hidden:true,
        Ilets_L_Section_3_Hidden:true,
        Ilets_L_Section_4_Hidden:true,
        Ilets_L_Section_Answer:true,

    }


    componentDidMount() {
        // User Token verification
        let token = localStorage.getItem('access_token');

        // Before axios, set constant value ----------------------------------------------------------------------------

        // For Name Purpose -> this step is meaningless for display purpose, but need to maintain the same array.length with TextArray
        this.state.Ilets_Listening_Sec_1_TextArray_name.push('Intro')
        this.state.Ilets_Listening_Sec_2_TextArray_name.push('Intro')
        this.state.Ilets_Listening_Sec_3_TextArray_name.push('Intro')
        this.state.Ilets_Listening_Sec_4_TextArray_name.push('Intro')

        // Due to the Question of each Section the same
        this.state.Ilets_Listening_Sec_1_TextArray.push('PART 1\tQuestion 1-10\\n[HiddenTag]')
        this.state.Ilets_Listening_Sec_2_TextArray.push('PART 2\tQuestions 11-20\\n[HiddenTag]')
        this.state.Ilets_Listening_Sec_3_TextArray.push('PART 3\tQuestions 21-30\\n[HiddenTag]')
        this.state.Ilets_Listening_Sec_4_TextArray.push('PART 4\tQuestions 31-40\\n[HiddenTag]')

        // Listening Overall
        for(let i=0;i<this.state.Ilets_Listening_Sec_1_TextArray.length;i++){
            if(this.state.Ilets_Listening_Sec_1_TextArray[i].slice(-11)=='[HiddenTag]') {
                this.state.Ilets_Listening_Sec_1_TextOverall = this.state.Ilets_Listening_Sec_1_TextOverall + this.state.Ilets_Listening_Sec_1_TextArray[i].slice(0,-11)
            }
            if(this.state.Ilets_Listening_Sec_2_TextArray[i].slice(-11)=='[HiddenTag]') {
                this.state.Ilets_Listening_Sec_2_TextOverall = this.state.Ilets_Listening_Sec_2_TextOverall + this.state.Ilets_Listening_Sec_2_TextArray[i].slice(0,-11)
            }
            if(this.state.Ilets_Listening_Sec_3_TextArray[i].slice(-11)=='[HiddenTag]') {
                this.state.Ilets_Listening_Sec_3_TextOverall = this.state.Ilets_Listening_Sec_3_TextOverall + this.state.Ilets_Listening_Sec_3_TextArray[i].slice(0,-11)
            }
            if(this.state.Ilets_Listening_Sec_4_TextArray[i].slice(-11)=='[HiddenTag]') {
                this.state.Ilets_Listening_Sec_4_TextOverall = this.state.Ilets_Listening_Sec_4_TextOverall + this.state.Ilets_Listening_Sec_4_TextArray[i].slice(0,-11)
            }
        }

        axios.get(global.config.url + 'AdminHappy/GetIeltsListeningInfo?paperid=' + this.props.location.search.slice(1),{headers: {Authorization: `Bearer ${token}`}}).then(res=>{

            console.log(res.data)
            // Create Temporary Variable to store Listening_Answer
            let Temp_Listening_Answer = JSON.parse(res.data.data.Answer)
            let Temp_Listening_Answer_Array = []

            // Listening Answer
            for (let i = 1; i <= 40; i++) {
                Temp_Listening_Answer_Array.push(Temp_Listening_Answer['LA' + i])
            }

            this.setState({
                loading:false,
                Ilets_Listening_PaperID:res.data.data.Paper_ID,
                Ilets_Listening_Answer:Temp_Listening_Answer_Array,

                Ilets_Sec_1_Publish_text:res.data.data.L_Section1_Text,
                Ilets_Sec_2_Publish_text:res.data.data.L_Section2_Text,
                Ilets_Sec_3_Publish_text:res.data.data.L_Section3_Text,
                Ilets_Sec_4_Publish_text:res.data.data.L_Section4_Text,
            })
            console.log(this.state)
        })
    }

    render(){
        return(
            <div className='Ilets_Listening_Overall'>
                <div className='Ilets_Listening_Button_Control'>
                    <button name='Ilets_Listening_Sec_1_hidden' onClick={this.ListeningDisplayHiddenControl.bind(this)}>Section_1</button>	&nbsp;
                    <button name='Ilets_Listening_Sec_2_hidden' onClick={this.ListeningDisplayHiddenControl.bind(this)}>Section_2</button>	&nbsp;
                    <button name='Ilets_Listening_Sec_3_hidden' onClick={this.ListeningDisplayHiddenControl.bind(this)}>Section_3</button>	&nbsp;
                    <button name='Ilets_Listening_Sec_4_hidden' onClick={this.ListeningDisplayHiddenControl.bind(this)}>Section_4</button>	&nbsp;
                    <button name='Ilets_Listening_Answer_hidden' onClick={this.ListeningDisplayHiddenControl.bind(this)}>Show Answer</button> &nbsp;
                    <button name='FinalSubmission' onClick={this.IletsListeningSubmit.bind(this)}>Final</button>

                </div>

                <div className='Ilets_Listening_Display'>

                    <div className='Ilets_Listening_Sect_1_Overall' hidden={this.state.Ilets_L_Section_1_Public_Hidden && this.state.Ilets_L_Section_1_Hidden}>
                        {/* Display Mode Button */}
                        <button name='Ilets_Listening_Sec_1_hidden' onClick={this.ListeningDisplayHiddenControl_Public.bind(this)}>{this.state.Ilets_L_Section_1_Public_Hidden?'Edit Mode':'Origin Mode'}</button>	&nbsp;

                        {/* Origin Mode Text */}
                        <div hidden={this.state.Ilets_L_Section_1_Public_Hidden} >
                            <div dangerouslySetInnerHTML={{ __html: parseTag(this.state.Ilets_Sec_1_Publish_text)}}></div>
                        </div>


                        {/* Edit Mode Text */}
                        <div hidden={this.state.Ilets_L_Section_1_Hidden} name='Ilets_Listening_Sec_1'>
                        <div dangerouslySetInnerHTML={{ __html: parseTag(this.state.Ilets_Listening_Sec_1_TextOverall)}}></div>
                        <br/><br/><br/>

                        {/* This for IT programmer (this data that will post to backend) */}
                        <div id=''>
                            {this.state.Ilets_Listening_Sec_1_TextOverall}
                        </div>
                        <br/><br/>
                        <br/>
                    </div>
                    </div>

                    <div className='Ilets_Listening_Sect_2_Overall' hidden={this.state.Ilets_L_Section_2_Public_Hidden && this.state.Ilets_L_Section_2_Hidden} >
                        {/* Display Mode Button */}
                        <button name='Ilets_Listening_Sec_2_hidden' onClick={this.ListeningDisplayHiddenControl_Public.bind(this)}>{this.state.Ilets_L_Section_2_Public_Hidden?'Edit Mode':'Origin Mode'}</button>	&nbsp;

                        {/* Origin Mode Text */}
                        <div hidden={this.state.Ilets_L_Section_2_Public_Hidden}>
                            <div dangerouslySetInnerHTML={{ __html: parseTag(this.state.Ilets_Sec_2_Publish_text)}}></div>
                        </div>


                        {/* Edit Mode Text */}
                        <div hidden={this.state.Ilets_L_Section_2_Hidden} name='Ilets_Listening_Sec_2'><br/>
                            <div dangerouslySetInnerHTML={{ __html: parseTag(this.state.Ilets_Listening_Sec_2_TextOverall)}}></div>
                            <br/><br/><br/>
                            <div id=''>
                                {this.state.Ilets_Listening_Sec_2_TextOverall}
                            </div>
                        </div>
                    </div>

                    <div className='Ilets_Listening_Sect_3_Overall' hidden={this.state.Ilets_L_Section_3_Public_Hidden && this.state.Ilets_L_Section_3_Hidden}>
                        {/* Display Mode Button */}
                        <button name='Ilets_Listening_Sec_3_hidden' onClick={this.ListeningDisplayHiddenControl_Public.bind(this)}>{this.state.Ilets_L_Section_3_Public_Hidden?'Edit Mode':'Origin Mode'}</button>	&nbsp;

                        {/* Origin Mode Text */}
                        <div hidden={this.state.Ilets_L_Section_3_Public_Hidden}>
                            <div dangerouslySetInnerHTML={{ __html: parseTag(this.state.Ilets_Sec_3_Publish_text)}}></div>
                        </div>

                        {/* Edit Mode Text */}
                        <div hidden={this.state.Ilets_L_Section_3_Hidden} name='Ilets_Listening_Sec_3_hidden'>
                            <br/>
                            <div dangerouslySetInnerHTML={{ __html: parseTag(this.state.Ilets_Listening_Sec_3_TextOverall)}}></div>
                            <br/><br/><br/>
                            <div id=''>
                                {this.state.Ilets_Listening_Sec_3_TextOverall}
                            </div>
                        </div>
                    </div>

                    <div className='Ilets_Listening_Sect_4_Overall' hidden={this.state.Ilets_L_Section_4_Public_Hidden && this.state.Ilets_L_Section_4_Hidden}>
                        {/* Display Mode Button */}
                        <button name='Ilets_Listening_Sec_4_hidden' onClick={this.ListeningDisplayHiddenControl_Public.bind(this)}>{this.state.Ilets_L_Section_3_Public_Hidden?'Edit Mode':'Origin Mode'}</button>	&nbsp;

                        {/* Origin Mode Text */}
                        <div hidden={this.state.Ilets_L_Section_4_Public_Hidden}>
                            <div dangerouslySetInnerHTML={{ __html: parseTag(this.state.Ilets_Sec_4_Publish_text)}}></div>
                        </div>

                        {/* Edit Mode Text */}
                        <div hidden={this.state.Ilets_L_Section_4_Hidden}  name='Ilets_Listening_Sec_4'>
                            <br/>
                            <div dangerouslySetInnerHTML={{ __html: parseTag(this.state.Ilets_Listening_Sec_4_TextOverall)}}></div>
                            <br/><br/><br/>
                            <div id=''>
                                {this.state.Ilets_Listening_Sec_4_TextOverall}
                            </div>
                        </div>
                    </div>

                    <div hidden={this.state.Ilets_L_Section_Answer} name='Ilets_Listening_Answer'>
                        {
                            this.state.Ilets_Listening_Answer.map((data,i)=>{
                                return(
                                    <div key={i}>
                                        <h6><b>Answer_{i+1}:</b></h6>
                                        <p>&nbsp;-&nbsp;{data}</p>
                                    </div>
                                )
                            })
                        }
                    </div>

                </div>

                <div className='Ilets_Listening_Insert'>

                    <div hidden={this.state.Ilets_L_Section_1_Hidden} name='Ilets_Listening_Sec_1'>
                        <div className='Listening_Sec_1_ButtonControl'>
                            <button name='Ilets_Listening_Add_Question_Desc' onClick={this.Listening_Sect_1_Add_Question.bind(this)}>加问题描述</button>&nbsp;
                            <button name='Ilets_Listening_Add_Type_Bracket' onClick={this.Listening_Sect_1_Add_Question.bind(this)}>加方框题</button>&nbsp;
                            <button name='Ilets_Listening_Add_Type_Question' onClick={this.Listening_Sect_1_Add_Question.bind(this)}>加问题(选择,多选,TFN,FTB)</button>&nbsp;
                            <button name='Ilets_Listening_Add_Pic' onClick={this.Listening_Sect_1_Add_Question.bind(this)}>插入图片</button>&nbsp;
                        </div>
                        <br/>
                        <input type='file' name='Listening_Sec_1_Audio' onChange={this.Listening_Audio_Upload} accept="audio/*"/>
                        <br/>
                        {
                            this.state.Ilets_Listening_Sec_1_TextArray.map((data, i)=> {
                                // Contain '[HiddenTag]' will not be show
                                if (this.state.Ilets_Listening_Sec_1_TextArray[i].slice(-11) === '[HiddenTag]') {
                                    return (
                                        <div hidden={true} key={i}>
                                            <p><b>{this.state.Ilets_Listening_Sec_1_TextArray_name[i]}</b></p>
                                            <p>{data}</p>
                                        </div>
                                    )
                                } else if (this.state.Ilets_Listening_Sec_1_TextArray[i].length=='2') {    // This is used to detect IMG upload (only Pic's array have two)
                                    return(
                                        <div key={i}>
                                            <p><b>{this.state.Ilets_Listening_Sec_1_TextArray_name[i]}</b></p>
                                            <input name='Ilets_Listening_Sec_1_Overall'
                                                   id={i} className={0} value={this.state.Ilets_Listening_Sec_1_TextArray[i][0]}
                                                   onChange={this.Ilets_Listening_OnChangeHandler}
                                            />
                                            <input style={{width:'50%'}} name='Ilets_Listening_Sec_1_Overall'
                                                   id={i} type='file' onChange={this.Listening_Pic_Upload} accept="image/*"/>
                                        </div>
                                    )
                                }else{
                                    return (
                                        <div key={i}>
                                            <p><b>{this.state.Ilets_Listening_Sec_1_TextArray_name[i]}</b></p>
                                            <textarea style={{width:'80%', height:'100px'}} name='Ilets_Listening_Sec_1_Overall' id={i} value={data[i]} onChange={this.Ilets_Listening_OnChangeHandler}/>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>

                    <div hidden={this.state.Ilets_L_Section_2_Hidden} name='Ilets_Listening_Sec_2'>
                        <div className='Listening_Sec_2_ButtonControl'>
                            <button name='Ilets_Listening_Add_Question_Desc' onClick={this.Listening_Sect_2_Add_Question.bind(this)}>加问题描述</button>&nbsp;
                            <button name='Ilets_Listening_Add_Type_Bracket' onClick={this.Listening_Sect_2_Add_Question.bind(this)}>加方框题</button>&nbsp;
                            <button name='Ilets_Listening_Add_Type_Question' onClick={this.Listening_Sect_2_Add_Question.bind(this)}>加问题(选择,多选,TFN,FTB)</button>&nbsp;
                            <button name='Ilets_Listening_Add_Pic' onClick={this.Listening_Sect_2_Add_Question.bind(this)}>插入图片</button>&nbsp;
                        </div>
                        <br/>
                        <input type='file' name='Listening_Sec_2_Audio' onChange={this.Listening_Audio_Upload} accept="audio/*"/>
                        <br/>
                        {
                            this.state.Ilets_Listening_Sec_2_TextArray.map((data, i)=>{
                                // Contain '[HiddenTag]' will not be show
                                if(this.state.Ilets_Listening_Sec_2_TextArray[i].slice(-11)==='[HiddenTag]'){
                                    return(
                                        <div hidden={true} key={i}>
                                            <p><b>{this.state.Ilets_Listening_Sec_2_TextArray_name[i]}</b></p>
                                            <p>{data}</p>
                                        </div>
                                    )
                                }else if (this.state.Ilets_Listening_Sec_2_TextArray[i].length=='2') {    // This is used to detect IMG upload (only Pic's array have two)
                                    return(
                                        <div key={i}>
                                            <p><b>{this.state.Ilets_Listening_Sec_2_TextArray_name[i]}</b></p>
                                            <input name='Ilets_Listening_Sec_2_Overall'
                                                   id={i} className={0} value={this.state.Ilets_Listening_Sec_2_TextArray[i][0]}
                                                   onChange={this.Ilets_Listening_OnChangeHandler}
                                            />
                                            <input style={{width:'50%'}} name='Ilets_Listening_Sec_2_Overall'
                                                   id={i} type='file' onChange={this.Listening_Pic_Upload} accept="image/*"/>
                                        </div>
                                    )
                                }else {
                                    return (
                                        <div key={i}>
                                            <p><b>{this.state.Ilets_Listening_Sec_2_TextArray_name[i]}</b></p>
                                            <textarea style={{width:'80%', height:'100px'}} name='Ilets_Listening_Sec_2_Overall' id={i} value={data[i]} onChange={this.Ilets_Listening_OnChangeHandler}/>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>

                    <div hidden={this.state.Ilets_L_Section_3_Hidden} name='Ilets_Listening_Sec_3'>
                        <div className='Listening_Sec_3_ButtonControl'>
                            <button name='Ilets_Listening_Add_Question_Desc' onClick={this.Listening_Sect_3_Add_Question.bind(this)}>加问题描述</button>&nbsp;
                            <button name='Ilets_Listening_Add_Type_Bracket' onClick={this.Listening_Sect_3_Add_Question.bind(this)}>加方框题</button>&nbsp;
                            <button name='Ilets_Listening_Add_Type_Question' onClick={this.Listening_Sect_3_Add_Question.bind(this)}>加问题(选择,多选,TFN,FTB)</button>&nbsp;
                            <button name='Ilets_Listening_Add_Pic' onClick={this.Listening_Sect_3_Add_Question.bind(this)}>插入图片</button>&nbsp;
                        </div>
                        <br/>
                        <input type='file' name='Listening_Sec_3_Audio' onChange={this.Listening_Audio_Upload} accept="audio/*"/>
                        <br/>
                        {
                            this.state.Ilets_Listening_Sec_3_TextArray.map((data, i)=>{
                                // Contain '[HiddenTag]' will not be show
                                if(this.state.Ilets_Listening_Sec_3_TextArray[i].slice(-11)==='[HiddenTag]'){
                                    return(
                                        <div hidden={true} key={i}>
                                            <p><b>{this.state.Ilets_Listening_Sec_3_TextArray_name[i]}</b></p>
                                            <p>{data}</p>
                                        </div>
                                    )
                                }else if (this.state.Ilets_Listening_Sec_3_TextArray[i].length=='2') {    // This is used to detect IMG upload (only Pic's array have two)
                                    return(
                                        <div key={i}>
                                            <p><b>{this.state.Ilets_Listening_Sec_3_TextArray_name[i]}</b></p>
                                            <input name='Ilets_Listening_Sec_3_Overall'
                                                   id={i} className={0} value={this.state.Ilets_Listening_Sec_3_TextArray[i][0]}
                                                   onChange={this.Ilets_Listening_OnChangeHandler}
                                            />
                                            <input style={{width:'50%'}} name='Ilets_Listening_Sec_3_Overall'
                                                   id={i} type='file' onChange={this.Listening_Pic_Upload} accept="image/*"/>
                                        </div>
                                    )
                                }else {
                                    return (
                                        <div key={i}>
                                            <p><b>{this.state.Ilets_Listening_Sec_3_TextArray_name[i]}</b></p>
                                            <textarea style={{width:'80%', height:'100px'}} name='Ilets_Listening_Sec_3_Overall' id={i} value={data[i]} onChange={this.Ilets_Listening_OnChangeHandler}/>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>

                    <div hidden={this.state.Ilets_L_Section_4_Hidden}  name='Ilets_Listening_Sec_4'>
                        <div className='Listening_Sec_4_ButtonControl'>
                            <button name='Ilets_Listening_Add_Question_Desc' onClick={this.Listening_Sect_4_Add_Question.bind(this)}>加问题描述</button>&nbsp;
                            <button name='Ilets_Listening_Add_Type_Bracket' onClick={this.Listening_Sect_4_Add_Question.bind(this)}>加方框题</button>&nbsp;
                            <button name='Ilets_Listening_Add_Type_Question' onClick={this.Listening_Sect_4_Add_Question.bind(this)}>加问题(选择,多选,TFN,FTB)</button>&nbsp;
                            <button name='Ilets_Listening_Add_Pic' onClick={this.Listening_Sect_4_Add_Question.bind(this)}>插入图片</button>&nbsp;
                        </div>
                        <br/>
                        <input type='file' name='Listening_Sec_4_Audio' onChange={this.Listening_Audio_Upload} accept="audio/*"/>
                        <br/>
                        {
                            this.state.Ilets_Listening_Sec_4_TextArray.map((data, i)=>{
                                // Contain '[HiddenTag]' will not be show
                                if(this.state.Ilets_Listening_Sec_4_TextArray[i].slice(-11)==='[HiddenTag]'){
                                    return(
                                        <div hidden={true} key={i}>
                                            <p><b>{this.state.Ilets_Listening_Sec_4_TextArray_name[i]}</b></p>
                                            <p>{data}</p>
                                        </div>
                                    )
                                }else if (this.state.Ilets_Listening_Sec_4_TextArray[i].length=='2') {    // This is used to detect IMG upload (only Pic's array have two)
                                    return(
                                        <div key={i}>
                                            <p><b>{this.state.Ilets_Listening_Sec_4_TextArray_name[i]}</b></p>
                                            <input name='Ilets_Listening_Sec_4_Overall'
                                                   id={i} className={0} value={this.state.Ilets_Listening_Sec_4_TextArray[i][0]}
                                                   onChange={this.Ilets_Listening_OnChangeHandler}
                                            />
                                            <input name='Ilets_Listening_Sec_4_Overall'
                                                   id={i} type='file' onChange={this.Listening_Pic_Upload} accept="image/*"/>
                                        </div>
                                    )
                                }else {
                                    return (
                                        <div key={i}>
                                            <p><b>{this.state.Ilets_Listening_Sec_4_TextArray_name[i]}</b></p>
                                            <textarea style={{width:'80%', height:'100px'}} name='Ilets_Listening_Sec_4_Overall' id={i} value={data[i]} onChange={this.Ilets_Listening_OnChangeHandler}/>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>

                    <div hidden={this.state.Ilets_L_Section_Answer} name='Ilets_Listening_Answer'>
                        {
                            this.state.Ilets_Listening_Answer.map((data,i)=>{
                                return(
                                    <div key={i}>
                                        <h6><b>Answer_{i+1}:</b></h6>
                                        <input value={data} name='Ilets_Listening_Answer' id={i} onChange={this.Ilets_Listening_OnChangeHandler}/>
                                    </div>
                                )
                            })
                        }
                    </div>

                </div>

            </div>
        )
    }

    // Filtering function
    Filtering_Temp_Overall=(temp_overall)=>{

        // replace 问题描述
        temp_overall = temp_overall.replaceAll('[WillBeDelete]\\n[/WillBeDelete]','')
        temp_overall = temp_overall.replaceAll('[WillBeDelete]','')
        temp_overall = temp_overall.replaceAll('[/WillBeDelete]','')

        // Replace 图片
        temp_overall = temp_overall.replaceAll('[IMG][IMG]\\n','')

        // Replace 空的方框题目
        temp_overall = temp_overall.replaceAll('\\n<table><tbody><tr><td></td></tr></tbody></table>','')

        return temp_overall;
    }

    // Listening Toggle Display Mode
    ListeningDisplayHiddenControl_Public=(e)=>{
        if (e.target.name === 'Ilets_Listening_Sec_1_hidden') {
            this.setState({Ilets_L_Section_1_Public_Hidden:!this.state.Ilets_L_Section_1_Public_Hidden, Ilets_L_Section_1_Hidden:!this.state.Ilets_L_Section_1_Hidden})
        }
        if (e.target.name === 'Ilets_Listening_Sec_2_hidden') {
            this.setState({Ilets_L_Section_2_Public_Hidden:!this.state.Ilets_L_Section_2_Public_Hidden, Ilets_L_Section_2_Hidden:!this.state.Ilets_L_Section_2_Hidden})
        }
        if (e.target.name === 'Ilets_Listening_Sec_3_hidden') {
            this.setState({Ilets_L_Section_3_Public_Hidden:!this.state.Ilets_L_Section_3_Public_Hidden, Ilets_L_Section_3_Hidden:!this.state.Ilets_L_Section_3_Hidden})
        }
        if (e.target.name === 'Ilets_Listening_Sec_4_hidden') {
            this.setState({Ilets_L_Section_4_Public_Hidden:!this.state.Ilets_L_Section_4_Public_Hidden, Ilets_L_Section_4_Hidden:!this.state.Ilets_L_Section_4_Hidden})
        }

    }

    // Listening Display Hidden Control
    ListeningDisplayHiddenControl=(e)=>{

        if (e.target.name === 'Ilets_Listening_Sec_1_hidden') {
            this.setState({
                Ilets_L_Section_1_Hidden: false,
                Ilets_L_Section_2_Hidden: true,
                Ilets_L_Section_3_Hidden: true,
                Ilets_L_Section_4_Hidden: true,
                Ilets_L_Section_Answer: true,

                Ilets_L_Section_1_Public_Hidden:true,
                Ilets_L_Section_2_Public_Hidden:true,
                Ilets_L_Section_3_Public_Hidden:true,
                Ilets_L_Section_4_Public_Hidden:true,
            })

        }

        if (e.target.name === 'Ilets_Listening_Sec_2_hidden') {
            this.setState({
                Ilets_L_Section_1_Hidden: true,
                Ilets_L_Section_2_Hidden: false,
                Ilets_L_Section_3_Hidden: true,
                Ilets_L_Section_4_Hidden: true,
                Ilets_L_Section_Answer: true,

                Ilets_L_Section_1_Public_Hidden:true,
                Ilets_L_Section_2_Public_Hidden:true,
                Ilets_L_Section_3_Public_Hidden:true,
                Ilets_L_Section_4_Public_Hidden:true,
            })
        }

        if (e.target.name === 'Ilets_Listening_Sec_3_hidden') {
            this.setState({
                Ilets_L_Section_1_Hidden: true,
                Ilets_L_Section_2_Hidden: true,
                Ilets_L_Section_3_Hidden: false,
                Ilets_L_Section_4_Hidden: true,
                Ilets_L_Section_Answer: true,

                Ilets_L_Section_1_Public_Hidden:true,
                Ilets_L_Section_2_Public_Hidden:true,
                Ilets_L_Section_3_Public_Hidden:true,
                Ilets_L_Section_4_Public_Hidden:true,
            })
        }

        if (e.target.name === 'Ilets_Listening_Sec_4_hidden') {
            this.setState({
                Ilets_L_Section_1_Hidden: true,
                Ilets_L_Section_2_Hidden: true,
                Ilets_L_Section_3_Hidden: true,
                Ilets_L_Section_4_Hidden: false,
                Ilets_L_Section_Answer: true,

                Ilets_L_Section_1_Public_Hidden:true,
                Ilets_L_Section_2_Public_Hidden:true,
                Ilets_L_Section_3_Public_Hidden:true,
                Ilets_L_Section_4_Public_Hidden:true,
            })

        }

        if (e.target.name === 'Ilets_Listening_Answer_hidden') {
            this.setState({
                Ilets_L_Section_1_Hidden: true,
                Ilets_L_Section_2_Hidden: true,
                Ilets_L_Section_3_Hidden: true,
                Ilets_L_Section_4_Hidden: true,
                Ilets_L_Section_Answer: false,

                Ilets_L_Section_1_Public_Hidden:true,
                Ilets_L_Section_2_Public_Hidden:true,
                Ilets_L_Section_3_Public_Hidden:true,
                Ilets_L_Section_4_Public_Hidden:true,
            })
        }

    }

    // Listening Picture Upload
    Listening_Pic_Upload=(e)=>{
        e.persist()

        // Token check
        let token = localStorage.getItem('access_token');

        // Share between all Sections
        let formatData = new FormData()
        let UploadImage = e.target.files[0]

        formatData.append('file', UploadImage)

        axios({
            method:'post',
            url:global.config.url + `AdminHappy/ImgUpload`,
            data: formatData,
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        }).then(res=>{

            // Listening Section 1    -->  Load the link to double array index 0, load the file to index 1
            if(e.target.name=='Ilets_Listening_Sec_1_Overall'){
                // Load the Data and retrieve the file name
                for (let key in res.data.data) {
                    let UpdateArray = this.state.Ilets_Listening_Sec_1_TextArray
                    UpdateArray[e.target.id][0] = global.config.url + 'IMG/' + key
                    UpdateArray[e.target.id][1] = UploadImage
                    this.setState({Ilets_Listening_Sec_1_TextArray: UpdateArray})
                }
            }

            // Listening Section 2    -->  Load the link to double array index 0, load the file to index 1
            if(e.target.name=='Ilets_Listening_Sec_2_Overall'){
                // Load the Data and retrieve the file name
                for (let key in res.data.data) {
                    let UpdateArray = this.state.Ilets_Listening_Sec_2_TextArray
                    UpdateArray[e.target.id][0] = global.config.url + 'IMG/' + key
                    UpdateArray[e.target.id][1] = UploadImage
                    this.setState({Ilets_Listening_Sec_2_TextArray: UpdateArray})
                }
            }

            // Listening Section 3    -->  Load the link to double array index 0, load the file to index 1
            if(e.target.name=='Ilets_Listening_Sec_3_Overall'){
                // Load the Data and retrieve the file name
                for (let key in res.data.data) {
                    let UpdateArray = this.state.Ilets_Listening_Sec_3_TextArray
                    UpdateArray[e.target.id][0] = global.config.url + 'IMG/' + key
                    UpdateArray[e.target.id][1] = UploadImage
                    this.setState({Ilets_Listening_Sec_3_TextArray: UpdateArray})
                }
            }

            // Listening Section 4    -->  Load the link to double array index 0, load the file to index 1
            if(e.target.name=='Ilets_Listening_Sec_4_Overall'){
                // Load the Data and retrieve the file name
                for (let key in res.data.data) {
                    let UpdateArray = this.state.Ilets_Listening_Sec_4_TextArray
                    UpdateArray[e.target.id][0] = global.config.url + 'IMG/' + key
                    UpdateArray[e.target.id][1] = UploadImage
                    this.setState({Ilets_Listening_Sec_4_TextArray: UpdateArray})
                }
            }
        })

    }

    // Listening Audio Upload
    Listening_Audio_Upload=(e)=>{
        if(e.target.name=='Listening_Sec_1_Audio'){
            console.log(e.target.files[0])
            this.state.Ilets_Listening_Sec_1_Audio=e.target.files[0]
            console.log(this.state)
        }
        if(e.target.name=='Listening_Sec_2_Audio'){
            console.log(e.target.files[0])
            this.state.Ilets_Listening_Sec_2_Audio=e.target.files[0]
            console.log(this.state)
        }
        if(e.target.name=='Listening_Sec_3_Audio'){
            console.log(e.target.files[0])
            this.state.Ilets_Listening_Sec_3_Audio=e.target.files[0]
            console.log(this.state)
        }
        if(e.target.name=='Listening_Sec_4_Audio'){
            console.log(e.target.files[0])
            this.state.Ilets_Listening_Sec_4_Audio=e.target.files[0]
            console.log(this.state)
        }
    }

    // OnChangeHandler for all Sections
    Ilets_Listening_OnChangeHandler=(e)=>{
        // On Change Handler to Update Reading Answer
        if(e.target.name==='Ilets_Listening_Answer'){
            let TempAnswerArray=this.state.Ilets_Listening_Answer
            TempAnswerArray[e.target.id]=e.target.value
            this.setState({Ilets_Listening_Answer:TempAnswerArray})
        }

        // Listening OnChange Handler
        if(e.target.name=='Ilets_Listening_Sec_1_Overall'){

            // Edit particular Array
            let temp_Sec_array=this.state.Ilets_Listening_Sec_1_TextArray

            // On Change Handler ---------------------------------------------------
               // Check if an array.length==2 within 'Ilets_Listening_Sec_1_TextArray'  -> length==2 for Picture
            if(temp_Sec_array[e.target.id].length=='2'){
                temp_Sec_array[e.target.id][e.target.className]=[e.target.value]
            }else{
                temp_Sec_array[e.target.id]=[e.target.value]
            }
            this.setState({Ilets_Listening_Sec_1_TextArray:temp_Sec_array})


            // Update Data Overall ---------------------------------------------------------
            let temp_overall=''
            for(let i=0;i<this.state.Ilets_Listening_Sec_1_TextArray.length;i++){
                if(this.state.Ilets_Listening_Sec_1_TextArray[i].length=='2'){
                        // For picture -> Link store in index 0  for display, index 1 store pic file
                    temp_overall=temp_overall+this.state.Ilets_Listening_Sec_1_TextArray[i][0]
                }else {
                    if (this.state.Ilets_Listening_Sec_1_TextArray[i].slice(-11) === '[HiddenTag]') {
                        temp_overall = temp_overall + this.state.Ilets_Listening_Sec_1_TextArray[i].slice(0, -11)
                    } else {
                        temp_overall = temp_overall + this.state.Ilets_Listening_Sec_1_TextArray[i]
                    }
                }
            }

            temp_overall = this.Filtering_Temp_Overall(temp_overall)

            this.setState({Ilets_Listening_Sec_1_TextOverall:temp_overall})
        }

        if(e.target.name=='Ilets_Listening_Sec_2_Overall'){

            // Edit particular Array
            let temp_Sec_array=this.state.Ilets_Listening_Sec_2_TextArray

            // Check if an array.length==2 within 'Ilets_Listening_Sec_1_TextArray'  -> length==2 for Picture
            if(temp_Sec_array[e.target.id].length=='2'){
                temp_Sec_array[e.target.id][e.target.className]=[e.target.value]
            }else{
                temp_Sec_array[e.target.id]=[e.target.value]
            }

            // Use loop to update Overall Reading_Sec2
            let temp_overall=''
            for(let i=0;i<this.state.Ilets_Listening_Sec_2_TextArray.length;i++){
                if(this.state.Ilets_Listening_Sec_2_TextArray[i].length=='2'){
                    temp_overall=temp_overall+this.state.Ilets_Listening_Sec_2_TextArray[i][0]
                }else {
                    if (this.state.Ilets_Listening_Sec_2_TextArray[i].slice(-11) === '[HiddenTag]') {
                        temp_overall = temp_overall + this.state.Ilets_Listening_Sec_2_TextArray[i].slice(0, -11)
                    } else {
                        temp_overall = temp_overall + this.state.Ilets_Listening_Sec_2_TextArray[i]
                    }
                }
            }

            temp_overall = this.Filtering_Temp_Overall(temp_overall)

            this.setState({Ilets_Listening_Sec_2_TextOverall:temp_overall})
        }

        if(e.target.name=='Ilets_Listening_Sec_3_Overall'){

            // Edit particular Array
            let temp_Sec_array=this.state.Ilets_Listening_Sec_3_TextArray

            // Check if an array.length==2 within 'Ilets_Listening_Sec_1_TextArray'  -> length==2 for Picture
            if(temp_Sec_array[e.target.id].length=='2'){
                temp_Sec_array[e.target.id][e.target.className]=[e.target.value]
            }else{
                temp_Sec_array[e.target.id]=[e.target.value]
            }
            // Use loop to update Overall Reading_Sec3
            let temp_overall=''
            for(let i=0;i<this.state.Ilets_Listening_Sec_3_TextArray.length;i++){
                if(this.state.Ilets_Listening_Sec_3_TextArray[i].length=='2'){
                    temp_overall=temp_overall+this.state.Ilets_Listening_Sec_3_TextArray[i][0]
                }else {
                    if (this.state.Ilets_Listening_Sec_3_TextArray[i].slice(-11) === '[HiddenTag]') {
                        temp_overall = temp_overall + this.state.Ilets_Listening_Sec_3_TextArray[i].slice(0, -11)
                    } else {
                        temp_overall = temp_overall + this.state.Ilets_Listening_Sec_3_TextArray[i]
                    }
                }
            }
            temp_overall = this.Filtering_Temp_Overall(temp_overall)

            this.setState({Ilets_Listening_Sec_3_TextOverall:temp_overall})
        }

        if(e.target.name=='Ilets_Listening_Sec_4_Overall'){
            // Edit particular Array
            let temp_Sec_array=this.state.Ilets_Listening_Sec_4_TextArray

            // Check if an array.length==2 within 'Ilets_Listening_Sec_1_TextArray'  -> length==2 for Picture
            if(temp_Sec_array[e.target.id].length=='2'){
                temp_Sec_array[e.target.id][e.target.className]=[e.target.value]
            }else{
                temp_Sec_array[e.target.id]=[e.target.value]
            }

            // Use loop to update Overall Reading_Sec4
            let temp_overall=''
            for(let i=0;i<this.state.Ilets_Listening_Sec_4_TextArray.length;i++){
                if(this.state.Ilets_Listening_Sec_4_TextArray[i].length=='2'){
                    temp_overall=temp_overall+this.state.Ilets_Listening_Sec_4_TextArray[i][0]
                }else {
                    if (this.state.Ilets_Listening_Sec_4_TextArray[i].slice(-11) === '[HiddenTag]') {
                        temp_overall = temp_overall + this.state.Ilets_Listening_Sec_4_TextArray[i].slice(0, -11)
                    } else {
                        temp_overall = temp_overall + this.state.Ilets_Listening_Sec_4_TextArray[i]
                    }
                }
            }
            temp_overall = this.Filtering_Temp_Overall(temp_overall)
            this.setState({Ilets_Listening_Sec_4_TextOverall:temp_overall})
        }
    }

    // Add Insert base on buttons ->-------------------------------------------------------- Four sections below
    Listening_Sect_1_Add_Question=(e)=>{
        //问题描述
        if(e.target.name=='Ilets_Listening_Add_Question_Desc'){

            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Listening_Sec_1_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push(' Description-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Listening_Sec_1_TextArray
            TempArray.push("[WillBeDelete][HiddenTag]")
            TempArray.push('')
            TempArray.push("\\n[/WillBeDelete][HiddenTag]")

            // Set State
            this.setState({Ilets_Listening_Sec_1_TextArray_name:TempNameArray, Ilets_Listening_Sec_1_TextArray:TempArray})
        }

        // 方框题
        if(e.target.name=='Ilets_Listening_Add_Type_Bracket'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Listening_Sec_1_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Bracket-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Listening_Sec_1_TextArray
            TempArray.push('<table><tbody><tr><td>[HiddenTag]')
            TempArray.push('')
            TempArray.push("</td></tr></tbody></table>\\n[HiddenTag]")
            this.setState({Ilets_Reading_Sec_1_TextArray:TempArray, Ilets_Reading_Sec_1_TextArray_name:TempNameArray})
        }

        // 题目加内容 (题型: 多选,单选,填空,对错)
        if(e.target.name=='Ilets_Listening_Add_Type_Question'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Listening_Sec_1_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Detail-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Listening_Sec_1_TextArray
            TempArray.push("[WillBeDelete][HiddenTag]")
            TempArray.push('')
            TempArray.push("\\n[/WillBeDelete][HiddenTag]")
            this.setState({Ilets_Listening_Sec_1_TextArray:TempArray, Ilets_Listening_Sec_1_TextArray_name:TempNameArray})
        }

        // 图片
        if(e.target.name=='Ilets_Listening_Add_Pic'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Listening_Sec_1_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Upload Pic: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Listening_Sec_1_TextArray
            TempArray.push('[IMG][HiddenTag]')
            TempArray.push(['',''])
            TempArray.push("[IMG]\\n[HiddenTag]")
            this.setState({Ilets_Listening_Sec_1_TextArray:TempArray, Ilets_Listening_Sec_1_TextArray_name:TempNameArray})
        }
    }

    Listening_Sect_2_Add_Question=(e)=>{
        //问题描述
        if(e.target.name=='Ilets_Listening_Add_Question_Desc'){

            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Listening_Sec_2_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push(' Description-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Listening_Sec_2_TextArray
            TempArray.push("[WillBeDelete][HiddenTag]")
            TempArray.push('')
            TempArray.push("\\n[/WillBeDelete][HiddenTag]")

            // Set State
            this.setState({Ilets_Listening_Sec_2_TextArray_name:TempNameArray, Ilets_Listening_Sec_2_TextArray:TempArray})
        }

        // 方框题
        if(e.target.name=='Ilets_Listening_Add_Type_Bracket'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Listening_Sec_2_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Bracket-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Listening_Sec_2_TextArray
            TempArray.push('<table><tbody><tr><td>[HiddenTag]')
            TempArray.push('')
            TempArray.push("</td></tr></tbody></table>\\n[HiddenTag]")
            this.setState({Ilets_Listening_Sec_2_TextArray:TempArray, Ilets_Listening_Sec_2_TextArray_name:TempNameArray})
        }

        // 题目加内容 (题型: 多选,单选,填空,对错)
        if(e.target.name=='Ilets_Listening_Add_Type_Question'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Listening_Sec_2_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Detail-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Listening_Sec_2_TextArray
            TempArray.push("[WillBeDelete][HiddenTag]")
            TempArray.push('')
            TempArray.push("\\n[/WillBeDelete][HiddenTag]")
            this.setState({Ilets_Listening_Sec_2_TextArray:TempArray, Ilets_Listening_Sec_2_TextArray_name:TempNameArray})
        }

        // 图片
        if(e.target.name=='Ilets_Listening_Add_Pic'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Listening_Sec_2_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Upload Pic: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Listening_Sec_2_TextArray
            TempArray.push('[IMG][HiddenTag]')
            TempArray.push(['',''])
            TempArray.push("[IMG]\\n[HiddenTag]")
            this.setState({Ilets_Listening_Sec_2_TextArray:TempArray, Ilets_Listening_Sec_2_TextArray_name:TempNameArray})
        }
    }

    Listening_Sect_3_Add_Question=(e)=>{
        //问题描述
        if(e.target.name=='Ilets_Listening_Add_Question_Desc'){

            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Listening_Sec_3_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push(' Description-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Listening_Sec_3_TextArray
            TempArray.push("[WillBeDelete][HiddenTag]")
            TempArray.push('')
            TempArray.push("\\n[/WillBeDelete][HiddenTag]")

            // Set State
            this.setState({Ilets_Listening_Sec_3_TextArray_name:TempNameArray, Ilets_Listening_Sec_3_TextArray:TempArray})
        }

        // 方框题
        if(e.target.name=='Ilets_Listening_Add_Type_Bracket'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Listening_Sec_3_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Bracket-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Listening_Sec_3_TextArray
            TempArray.push('<table><tbody><tr><td>[HiddenTag]')
            TempArray.push('')
            TempArray.push("</td></tr></tbody></table>\\n[HiddenTag]")
            this.setState({Ilets_Listening_Sec_3_TextArray:TempArray, Ilets_Listening_Sec_3_TextArray_name:TempNameArray})
        }

        // 题目加内容 (题型: 多选,单选,填空,对错)
        if(e.target.name=='Ilets_Listening_Add_Type_Question'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Listening_Sec_3_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Detail-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Listening_Sec_3_TextArray
            TempArray.push("[WillBeDelete][HiddenTag]")
            TempArray.push('')
            TempArray.push("\\n[/WillBeDelete][HiddenTag]")
            this.setState({Ilets_Listening_Sec_3_TextArray:TempArray, Ilets_Listening_Sec_3_TextArray_name:TempNameArray})
        }

        // 图片
        if(e.target.name=='Ilets_Listening_Add_Pic'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Listening_Sec_3_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Upload Pic: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Listening_Sec_3_TextArray
            TempArray.push('[IMG][HiddenTag]')
            TempArray.push(['',''])
            TempArray.push("[IMG]\\n[HiddenTag]")
            this.setState({Ilets_Listening_Sec_3_TextArray:TempArray, Ilets_Listening_Sec_3_TextArray_name:TempNameArray})
        }
    }

    Listening_Sect_4_Add_Question=(e)=>{
        if(e.target.name=='Ilets_Listening_Add_Question_Desc'){

            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Listening_Sec_4_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push(' Description-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Listening_Sec_4_TextArray
            TempArray.push("[WillBeDelete][HiddenTag]")
            TempArray.push('')
            TempArray.push("\\n[/WillBeDelete][HiddenTag]")

            // Set State
            this.setState({Ilets_Listening_Sec_4_TextArray_name:TempNameArray, Ilets_Listening_Sec_4_TextArray:TempArray})
        }

        // 方框题
        if(e.target.name=='Ilets_Listening_Add_Type_Bracket'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Listening_Sec_4_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Bracket-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Listening_Sec_4_TextArray
            TempArray.push('<table><tbody><tr><td>[HiddenTag]')
            TempArray.push('')
            TempArray.push("</td></tr></tbody></table>\\n[HiddenTag]")
            this.setState({Ilets_Listening_Sec_4_TextArray:TempArray, Ilets_Listening_Sec_4_TextArray_name:TempNameArray})
        }

        // 题目加内容 (题型: 多选,单选,填空,对错)
        if(e.target.name=='Ilets_Listening_Add_Type_Question'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Listening_Sec_4_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Detail-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Listening_Sec_4_TextArray
            TempArray.push("[WillBeDelete][HiddenTag]")
            TempArray.push('')
            TempArray.push("\\n[/WillBeDelete][HiddenTag]")
            this.setState({Ilets_Listening_Sec_4_TextArray:TempArray, Ilets_Listening_Sec_4_TextArray_name:TempNameArray})
        }

        // 图片
        if(e.target.name=='Ilets_Listening_Add_Pic'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Listening_Sec_4_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Upload Pic: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Listening_Sec_4_TextArray
            TempArray.push('[IMG][HiddenTag]')
            TempArray.push(['',''])
            TempArray.push("[IMG]\\n[HiddenTag]")
            this.setState({Ilets_Listening_Sec_4_TextArray:TempArray, Ilets_Listening_Sec_4_TextArray_name:TempNameArray})
        }
    }

    // Final Submit
    IletsListeningSubmit=(e)=>{

        let token = localStorage.getItem('access_token');
        let submitData = new FormData();

        // Load the submit info to Submit Data
        submitData.append('paperid',this.state.Ilets_Listening_PaperID)
        submitData.append('Section1Text',this.state.Ilets_Listening_Sec_1_TextOverall)
        submitData.append('Section2Text',this.state.Ilets_Listening_Sec_2_TextOverall)
        submitData.append('Section3Text',this.state.Ilets_Listening_Sec_3_TextOverall)
        submitData.append('Section4Text',this.state.Ilets_Listening_Sec_4_TextOverall)

        // Audio post
        submitData.append('Section1Audio',this.state.Ilets_Listening_Sec_1_Audio)
        submitData.append('Section2Audio',this.state.Ilets_Listening_Sec_2_Audio)
        submitData.append('Section3Audio',this.state.Ilets_Listening_Sec_3_Audio)
        submitData.append('Section4Audio',this.state.Ilets_Listening_Sec_4_Audio)

        // loop Answer
        for(let i=0;i<40;i++){
            submitData.append('LA'+[i+1],this.state.Ilets_Listening_Answer[i])
            console.log(this.state.Ilets_Listening_Answer[i])
        }

        if (window.confirm("Listening Paper Submit")) {
            // Axios submit
            axios({
                method: 'post',
                url: global.config.url + `AdminHappy/ListeningPaperUpdate`,
                data: submitData,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                if(res.data.msg=='succeed'){
                    alert('Submit Successfully')
                }else{
                    alert('Error')
                }
            })
        }
    }
}
export default IletsInsertListening;