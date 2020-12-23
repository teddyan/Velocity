import React, {Component} from 'react';
import axios from 'axios';

// import parser
import {parseTag} from '../../../../../Utility'

class IletsInsertReading extends Component{

    state={
        loading:true,
        Ilets_Paper_ID:'',
        Ilets_Reading_Answer:[],
        Ilets_Sec_1_Publish_text:'',
        Ilets_Sec_2_Publish_text:'',
        Ilets_Sec_3_Publish_text:'',

        // TextArray Pre_Define
        Ilets_Reading_Sec_1_TextArray:[],
        Ilets_Reading_Sec_2_TextArray:[],
        Ilets_Reading_Sec_3_TextArray:[],

        // Corresponding to TextArray but use for name purpose
        Ilets_Reading_Sec_1_TextArray_name:[],
        Ilets_Reading_Sec_2_TextArray_name:[],
        Ilets_Reading_Sec_3_TextArray_name:[],

        // Submit Text
        Ilets_Reading_Sec_1_TextOverall:'',
        Ilets_Reading_Sec_2_TextOverall:'',
        Ilets_Reading_Sec_3_TextOverall:'',

        // Hidden Public Control
        Reading_Sec_1_Public_Hidden:true,
        Reading_Sec_2_Public_Hidden:true,
        Reading_Sec_3_Public_Hidden:true,

        // Hidden Control
        Reading_Sec_1_Hidden:false,
        Reading_Sec_2_Hidden:true,
        Reading_Sec_3_Hidden:true,
        Reading_Answer_Hidden:true,
    }

    componentDidMount() {
        // User Token verification
        let token = localStorage.getItem('access_token');

        // For Name Purpose -> this step is meaningless for display purpose, but need to maintain the same array.length with TextArray
        this.state.Ilets_Reading_Sec_1_TextArray_name.push('Intro')
        this.state.Ilets_Reading_Sec_2_TextArray_name.push('Intro')
        this.state.Ilets_Reading_Sec_3_TextArray_name.push('Intro')

        // Due to the Question of each Section the same
        this.state.Ilets_Reading_Sec_1_TextArray.push('READING PASSAGE 1\\n\\nYou should spend about 20 minutes on Questions 1-13, which are based on Reading \\n\\nPassage 1 below.\\n\\n[HiddenTag]')
        this.state.Ilets_Reading_Sec_2_TextArray.push('READING PASSAGE 2\\n\\nYou should spend about 20 minutes on Questions 14-26, which are based on Reading\\n\\nPassage 2 below.\\n\\n[HiddenTag]')
        this.state.Ilets_Reading_Sec_3_TextArray.push('READING PASSAGE 3\\n\\nYou should spend about 20 minutes on Questions 27-40, which are based on Reading\\n\\nPassage 3 below.\\n\\n[HiddenTag]')

        // Reading Overall
        for(let i=0;i<this.state.Ilets_Reading_Sec_1_TextArray.length;i++){
            if(this.state.Ilets_Reading_Sec_1_TextArray[i].slice(-11)=='[HiddenTag]') {
                this.state.Ilets_Reading_Sec_1_TextOverall = this.state.Ilets_Reading_Sec_1_TextOverall + this.state.Ilets_Reading_Sec_1_TextArray[i].slice(0,-11)
            }
            if(this.state.Ilets_Reading_Sec_2_TextArray[i].slice(-11)=='[HiddenTag]') {
                this.state.Ilets_Reading_Sec_2_TextOverall = this.state.Ilets_Reading_Sec_2_TextOverall + this.state.Ilets_Reading_Sec_2_TextArray[i].slice(0,-11)
            }
            if(this.state.Ilets_Reading_Sec_3_TextArray[i].slice(-11)=='[HiddenTag]') {
                this.state.Ilets_Reading_Sec_3_TextOverall = this.state.Ilets_Reading_Sec_3_TextOverall + this.state.Ilets_Reading_Sec_3_TextArray[i].slice(0,-11)
            }
        }

        axios.get(global.config.url + 'AdminHappy/GetIeltsReadingInfo?paperid=' + this.props.location.search.slice(1),{headers: {Authorization: `Bearer ${token}`}}).then(res=>{
            console.log(res.data)

            // Create Temporary Variable to store Reading_Answer
            let Temp_Reading_Answer = JSON.parse(res.data.data.Answer)
            let Temp_Reading_Answer_Array = []
            // use to for loop to convert it to array (Number of Answer is constant to be 40)
            for(let i=1;i<=40;i++){
                Temp_Reading_Answer_Array.push(Temp_Reading_Answer['RA'+i])
            }

            this.setState({
                // Retrieve from Database
                loading:false,
                Ilets_Paper_ID:res.data.data.Paper_ID,
                Ilets_Reading_Answer:Temp_Reading_Answer_Array,

                // Published Text
                Ilets_Sec_1_Publish_text:res.data.data.R_Section1_Text,
                Ilets_Sec_2_Publish_text:res.data.data.R_Section2_Text,
                Ilets_Sec_3_Publish_text:res.data.data.R_Section3_Text,

            })
            console.log(this.state)
        })
    }

    render(){
        return(
            <div className='Ilets_Insert_Reading_Overall'>

                <div className='Ilets_Insert_Reading_Display'>
                    <div className='DisplayControl'>
                        <button name='Reading_Sec_1_Hidden' onClick={this.ReadingDisplayHiddenControl.bind(this)}>Section_1</button>	&nbsp;
                        <button name='Reading_Sec_2_Hidden' onClick={this.ReadingDisplayHiddenControl.bind(this)}>Section_2</button>	&nbsp;
                        <button name='Reading_Sec_3_Hidden' onClick={this.ReadingDisplayHiddenControl.bind(this)}>Section_3</button>	&nbsp;
                        <button name='Reading_Answer_Hidden' onClick={this.ReadingDisplayHiddenControl.bind(this)}>Show Answer</button> &nbsp;
                        <button name='FinalSubmission' onClick={this.IletsReadingFinalSubmit.bind(this)}>Final</button> &nbsp;
                        <br/><br/>
                    </div>

                    <div className="Reading_Sect_1_Overall" hidden={this.state.Reading_Sec_1_Public_Hidden && this.state.Reading_Sec_1_Hidden}>
                        {/* Display Mode Button */}
                        <button name='Ilets_Reading_Sec_1_hidden' onClick={this.Reading_DisplayHiddenControl_Public.bind(this)}>{this.state.Reading_Sec_1_Public_Hidden?'Edit Mode':'Origin Mode'}</button>	&nbsp;

                        {/* Origin Mode Text */}
                        <div hidden={this.state.Reading_Sec_1_Public_Hidden}>
                            <br/>
                            <div dangerouslySetInnerHTML={{ __html: parseTag(this.state.Ilets_Sec_1_Publish_text)}}></div>
                        </div>

                        {/* Edit Mode Text */}
                        <div className='Reading_Sect_1_Display' hidden={this.state.Reading_Sec_1_Hidden}>
                            <br/>
                            <div dangerouslySetInnerHTML={{ __html: parseTag(this.state.Ilets_Reading_Sec_1_TextOverall)}}></div>
                            <br/><br/><br/>
                            <div id=''>
                            {this.state.Ilets_Reading_Sec_1_TextOverall}
                            </div>
                        </div>
                    </div>

                    <div className="Reading_Sect_2_Overall" hidden={this.state.Reading_Sec_2_Public_Hidden && this.state.Reading_Sec_2_Hidden}>
                        {/* Display Mode Button */}
                        <button name='Ilets_Reading_Sec_2_hidden' onClick={this.Reading_DisplayHiddenControl_Public.bind(this)}>{this.state.Reading_Sec_2_Public_Hidden?'Edit Mode':'Origin Mode'}</button>	&nbsp;

                        {/* Origin Mode Text */}
                        <div hidden={this.state.Reading_Sec_2_Public_Hidden}>
                            <br/>
                            <div dangerouslySetInnerHTML={{ __html: parseTag(this.state.Ilets_Sec_2_Publish_text)}}></div>
                        </div>

                        {/* Edit Mode Text */}
                        <div className='Reading_Sect_2_Display' hidden={this.state.Reading_Sec_2_Hidden}>
                            <br/>
                            <div dangerouslySetInnerHTML={{ __html: parseTag(this.state.Ilets_Reading_Sec_2_TextOverall)}}></div>
                            <br/><br/><br/>
                            <div id=''>
                                {this.state.Ilets_Reading_Sec_2_TextOverall}
                            </div>
                    </div>
                    </div>

                    <div className="Reading_Sect_3_Overall" hidden={this.state.Reading_Sec_3_Public_Hidden && this.state.Reading_Sec_3_Hidden}>
                        {/* Display Mode Button */}
                        <button name='Ilets_Reading_Sec_3_hidden' onClick={this.Reading_DisplayHiddenControl_Public.bind(this)}>{this.state.Reading_Sec_3_Public_Hidden?'Edit Mode':'Origin Mode'}</button>	&nbsp;

                        {/* Origin Mode Text */}
                        <div hidden={this.state.Reading_Sec_3_Public_Hidden}>
                            <br/>
                            <div dangerouslySetInnerHTML={{ __html: parseTag(this.state.Ilets_Sec_3_Publish_text)}}></div>
                        </div>

                        {/* Edit Mode Text */}
                        <div className='Reading_Sect_3_Display' hidden={this.state.Reading_Sec_3_Hidden}>
                            <br/>
                            <div dangerouslySetInnerHTML={{ __html: parseTag(this.state.Ilets_Reading_Sec_3_TextOverall)}}></div>
                            <br/><br/><br/>
                            <div id=''>
                                {this.state.Ilets_Reading_Sec_3_TextOverall}
                            </div>
                        </div>
                    </div>

                    <div className='Reading_Answer_Display' hidden={this.state.Reading_Answer_Hidden}>
                        {
                            this.state.Ilets_Reading_Answer.map((data,i)=>{
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
                <div className='Ilets_Insert_Reading_Insert'>

                    <div className='Reading_Sect_1_Insert' hidden={this.state.Reading_Sec_1_Hidden}>
                        <button name='Ilets_Reading_Add_Para' onClick={this.Reading_Sect_1_Add_Question.bind(this)}>加文章</button>&nbsp;
                        <button name='Ilets_Reading_Add_Question_Desc' onClick={this.Reading_Sect_1_Add_Question.bind(this)}>加问题描述</button>&nbsp;
                        <button name='Ilets_Reading_Add_Type_Bracket' onClick={this.Reading_Sect_1_Add_Question.bind(this)}>加方框题</button>&nbsp;
                        <button name='Ilets_Reading_Add_Type_Question' onClick={this.Reading_Sect_1_Add_Question.bind(this)}>加问题(选择,多选,TFN,FTB)</button>&nbsp;
                        <button name='Ilets_Reading_Add_Add_Pic' onClick={this.Reading_Sect_1_Add_Question.bind(this)}>插入图片</button>&nbsp;
                        <br/>
                        {
                            this.state.Ilets_Reading_Sec_1_TextArray.map((data, i)=>{
                                // Contain '[HiddenTag]' will not be show
                                if(this.state.Ilets_Reading_Sec_1_TextArray[i].slice(-11)==='[HiddenTag]'){
                                    return(
                                        <div hidden={true} key={i}>
                                            <p><b>{this.state.Ilets_Reading_Sec_1_TextArray_name[i]}</b></p>
                                            <p>{data}</p>
                                        </div>
                                    )
                                }else if (this.state.Ilets_Reading_Sec_1_TextArray[i].length=='2') {    // This is used to detect IMG upload (only Pic's array have two)
                                    return(
                                        <div key={i}>
                                            <p><b>{this.state.Ilets_Reading_Sec_1_TextArray_name[i]}</b></p>
                                            <input name='Ilets_Reading_Sec_1_Overall'
                                                   id={i} className={0} value={this.state.Ilets_Reading_Sec_1_TextArray[i][0]}
                                                   onChange={this.Ilets_Reading_OnChangeHandler}
                                            />
                                            <input name='Ilets_Reading_Sec_1_Overall'
                                                   id={i} type='file' onChange={this.Reading_Pic_Upload} accept="image/*"/>
                                        </div>
                                    )
                                }else {
                                    return (
                                        <div key={i}>
                                            <p><b>{this.state.Ilets_Reading_Sec_1_TextArray_name[i]}</b></p>
                                            <textarea style={{width:'80%', height:'100px'}}  name='Ilets_Reading_Sec_1_Overall' id={i} value={data[i]} onChange={this.Ilets_Reading_OnChangeHandler}/>
                                        </div>
                                    )
                                }
                            })
                        }

                    </div>

                    <div className='Reading_Sect_2_Insert' hidden={this.state.Reading_Sec_2_Hidden}>
                        <button name='Ilets_Reading_Add_Para' onClick={this.Reading_Sect_2_Add_Question.bind(this)}>加文章</button>&nbsp;
                        <button name='Ilets_Reading_Add_Question_Desc' onClick={this.Reading_Sect_2_Add_Question.bind(this)}>加问题描述</button>&nbsp;
                        <button name='Ilets_Reading_Add_Type_Bracket' onClick={this.Reading_Sect_2_Add_Question.bind(this)}>加方框题</button>&nbsp;
                        <button name='Ilets_Reading_Add_Type_Question' onClick={this.Reading_Sect_2_Add_Question.bind(this)}>加问题(选择,多选,TFN,FTB)</button>&nbsp;
                        <button name='Ilets_Reading_Add_Add_Pic' onClick={this.Reading_Sect_2_Add_Question.bind(this)}>插入图片</button>&nbsp;

                        <br/>
                        {
                            this.state.Ilets_Reading_Sec_2_TextArray.map((data, i)=>{
                                // Contain '[HiddenTag]' will not be show
                                if(this.state.Ilets_Reading_Sec_2_TextArray[i].slice(-11)==='[HiddenTag]'){
                                    return(
                                        <div hidden={true} key={i}>
                                            <p><b>{this.state.Ilets_Reading_Sec_1_TextArray_name[i]}</b></p>
                                            <p>{data}</p>
                                        </div>
                                    )
                                } else if (this.state.Ilets_Reading_Sec_2_TextArray[i].length=='2') {    // This is used to detect IMG upload (only Pic's array have two)
                                    return(
                                        <div key={i}>
                                            <p><b>{this.state.Ilets_Reading_Sec_2_TextArray_name[i]}</b></p>
                                            <input name='Ilets_Reading_Sec_2_Overall'
                                                   id={i} className={0} value={this.state.Ilets_Reading_Sec_2_TextArray[i][0]}
                                                   onChange={this.Ilets_Reading_OnChangeHandler}
                                            />
                                            <input name='Ilets_Reading_Sec_2_Overall'
                                                   id={i} type='file' onChange={this.Reading_Pic_Upload} accept="image/*"/>
                                        </div>
                                    )
                                }else {
                                    return (
                                        <div key={i}>
                                            <p><b>{this.state.Ilets_Reading_Sec_2_TextArray_name[i]}</b></p>
                                            <textarea style={{width:'80%', height:'100px'}} name='Ilets_Reading_Sec_2_Overall' className='wocao' id={i} value={data[i]} onChange={this.Ilets_Reading_OnChangeHandler}/>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>

                    <div className='Reading_Sect_3_Insert' hidden={this.state.Reading_Sec_3_Hidden}>
                        <button name='Ilets_Reading_Add_Para' onClick={this.Reading_Sect_3_Add_Question.bind(this)}>加文章</button>&nbsp;
                        <button name='Ilets_Reading_Add_Question_Desc' onClick={this.Reading_Sect_3_Add_Question.bind(this)}>加问题描述</button>&nbsp;
                        <button name='Ilets_Reading_Add_Type_Bracket' onClick={this.Reading_Sect_3_Add_Question.bind(this)}>加方框题</button>&nbsp;
                        <button name='Ilets_Reading_Add_Type_Question' onClick={this.Reading_Sect_3_Add_Question.bind(this)}>加问题(选择,多选,TFN,FTB)</button>&nbsp;
                        <button name='Ilets_Reading_Add_Add_Pic' onClick={this.Reading_Sect_3_Add_Question.bind(this)}>插入图片</button>&nbsp;

                        <br/>
                        {
                            this.state.Ilets_Reading_Sec_3_TextArray.map((data, i)=>{
                                // Contain '[HiddenTag]' will not be show
                                if(this.state.Ilets_Reading_Sec_3_TextArray[i].slice(-11)==='[HiddenTag]'){
                                    return(
                                        <div hidden={true} key={i}>
                                            <p><b>{this.state.Ilets_Reading_Sec_1_TextArray_name[i]}</b></p>
                                            <p>{data}</p>
                                        </div>
                                    )
                                }else if (this.state.Ilets_Reading_Sec_3_TextArray[i].length=='2') {    // This is used to detect IMG upload (only Pic's array have two)
                                    return(
                                        <div key={i}>
                                            <p><b>{this.state.Ilets_Reading_Sec_3_TextArray_name[i]}</b></p>
                                            <input name='Ilets_Reading_Sec_3_Overall'
                                                   id={i} className={0} value={this.state.Ilets_Reading_Sec_3_TextArray[i][0]}
                                                   onChange={this.Ilets_Reading_OnChangeHandler}
                                            />
                                            <input name='Ilets_Reading_Sec_3_Overall'
                                                   id={i} type='file' onChange={this.Reading_Pic_Upload} accept="image/*"/>
                                        </div>
                                    )
                                }else {
                                    return (
                                        <div key={i}>
                                            <p><b>{this.state.Ilets_Reading_Sec_3_TextArray_name[i]}</b></p>
                                            <textarea style={{width:'80%', height:'100px'}} name='Ilets_Reading_Sec_3_Overall' className='wocao' id={i} value={data[i]} onChange={this.Ilets_Reading_OnChangeHandler}/>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>

                    <div className='Reading_Answer_Insert' hidden={this.state.Reading_Answer_Hidden}>
                        {
                            this.state.Ilets_Reading_Answer.map((data,i)=>{
                                return(
                                    <div key={i}>
                                        <h6><b>Answer_{i+1}:</b></h6>
                                        <input value={data} name='Ilets_Reading_Answer' id={i} onChange={this.Ilets_Reading_OnChangeHandler}/>
                                    </div>
                                )
                            })
                        }
                    </div>

                </div>

            </div>
        )
    }

    // Reading toggle Origin or Edit mode
    Reading_DisplayHiddenControl_Public=(e)=>{
        if(e.target.name=='Ilets_Reading_Sec_1_hidden'){
            this.setState({Reading_Sec_1_Public_Hidden:!this.state.Reading_Sec_1_Public_Hidden, Reading_Sec_1_Hidden:!this.state.Reading_Sec_1_Hidden})
        }
        if(e.target.name=='Ilets_Reading_Sec_2_hidden'){
            this.setState({Reading_Sec_2_Public_Hidden:!this.state.Reading_Sec_2_Public_Hidden, Reading_Sec_2_Hidden:!this.state.Reading_Sec_2_Hidden})
        }
        if(e.target.name=='Ilets_Reading_Sec_3_hidden'){
            this.setState({Reading_Sec_3_Public_Hidden:!this.state.Reading_Sec_3_Public_Hidden, Reading_Sec_3_Hidden:!this.state.Reading_Sec_3_Hidden})
        }
    }

    // Section Display Hidden Control
    ReadingDisplayHiddenControl=(e)=>{

        if(e.target.name == 'Reading_Sec_1_Hidden'){
            this.setState({
                Reading_Sec_1_Hidden: false,
                Reading_Sec_2_Hidden: true,
                Reading_Sec_3_Hidden: true,
                Reading_Answer_Hidden: true,

                Reading_Sec_1_Public_Hidden:true,
                Reading_Sec_2_Public_Hidden:true,
                Reading_Sec_3_Public_Hidden:true,

            })

        }

        if(e.target.name == 'Reading_Sec_2_Hidden') {
            this.setState({
                Reading_Sec_1_Hidden: true,
                Reading_Sec_2_Hidden: false,
                Reading_Sec_3_Hidden: true,
                Reading_Answer_Hidden: true,
                Reading_Sec_1_Public_Hidden:true,
                Reading_Sec_2_Public_Hidden:true,
                Reading_Sec_3_Public_Hidden:true,
            })
        }

        if(e.target.name == 'Reading_Sec_3_Hidden') {
            this.setState({
                Reading_Sec_1_Hidden: true,
                Reading_Sec_2_Hidden: true,
                Reading_Sec_3_Hidden: false,
                Reading_Answer_Hidden: true,
                Reading_Sec_1_Public_Hidden:true,
                Reading_Sec_2_Public_Hidden:true,
                Reading_Sec_3_Public_Hidden:true,
            })
        }

        if(e.target.name == 'Reading_Answer_Hidden'){
            this.setState({
                Reading_Sec_1_Hidden: true,
                Reading_Sec_2_Hidden: true,
                Reading_Sec_3_Hidden: true,
                Reading_Answer_Hidden: false,
                Reading_Sec_1_Public_Hidden:true,
                Reading_Sec_2_Public_Hidden:true,
                Reading_Sec_3_Public_Hidden:true,
            })
        }
    }

    // Filtering function
    Filtering_Temp_Overall=(temp_overall)=>{

        // replace 问题描述
        temp_overall = temp_overall.replaceAll('[WillBeDelete]\\n[/WillBeDelete]','')

        // replace 加文章
        temp_overall = temp_overall.replaceAll('[WillBeDelete]\\n\\n[Question][/WillBeDelete]','')

        temp_overall = temp_overall.replaceAll('[WillBeDelete]','')
        temp_overall = temp_overall.replaceAll('[/WillBeDelete]','')

        // Replace 图片
        temp_overall = temp_overall.replaceAll('[IMG][IMG]\\n','')

        // Replace 空的方框题目
        temp_overall = temp_overall.replaceAll('\\n<table><tbody><tr><td></td></tr></tbody></table>','')


        return temp_overall;
    }

    // On Change Handler
    Ilets_Reading_OnChangeHandler=(e)=>{

        // On Change Handler to Update Reading Answer
        if(e.target.name==='Ilets_Reading_Answer'){
            let TempAnswerArray=this.state.Ilets_Reading_Answer
            TempAnswerArray[e.target.id]=e.target.value
            this.setState({Ilets_Reading_Answer:TempAnswerArray})
        }

        if(e.target.name=='Ilets_Reading_Sec_1_Overall'){

            // Edit particular Array
            let temp_Sec_1_array=this.state.Ilets_Reading_Sec_1_TextArray

            // On Change Handler ---------------------------------------------------
                // Check if an array.length==2 within 'Ilets_Listening_Sec_1_TextArray'  -> length==2 for Picture
            if(temp_Sec_1_array[e.target.id].length=='2'){
                temp_Sec_1_array[e.target.id][e.target.className]=[e.target.value]
            }else{
                temp_Sec_1_array[e.target.id]=[e.target.value]
            }
            this.setState({Ilets_Reading_Sec_1_TextArray:temp_Sec_1_array})

            // Update Data Overall ---------------------------------------------------------
            let temp_overall=''
            for(let i=0;i<this.state.Ilets_Reading_Sec_1_TextArray.length;i++){
                if(this.state.Ilets_Reading_Sec_1_TextArray[i].length=='2'){
                    // For picture -> Link store in index 0  for display, index 1 store pic file
                    temp_overall=temp_overall+this.state.Ilets_Reading_Sec_1_TextArray[i][0]
                }else {
                    if (this.state.Ilets_Reading_Sec_1_TextArray[i].slice(-11) === '[HiddenTag]') {
                        temp_overall = temp_overall + this.state.Ilets_Reading_Sec_1_TextArray[i].slice(0, -11)
                    } else {
                        temp_overall = temp_overall + this.state.Ilets_Reading_Sec_1_TextArray[i]
                    }
                }
            }
            temp_overall = this.Filtering_Temp_Overall(temp_overall)
            this.setState({Ilets_Reading_Sec_1_TextOverall:temp_overall})
        }

        if(e.target.name=='Ilets_Reading_Sec_2_Overall'){

            // Edit particular Array
            let temp_Sec_2_array=this.state.Ilets_Reading_Sec_2_TextArray

            // On Change Handler ---------------------------------------------------
            // Check if an array.length==2 within 'Ilets_Listening_Sec_1_TextArray'  -> length==2 for Picture
            if(temp_Sec_2_array[e.target.id].length=='2'){
                temp_Sec_2_array[e.target.id][e.target.className]=[e.target.value]
            }else{
                temp_Sec_2_array[e.target.id]=[e.target.value]
            }
            this.setState({Ilets_Reading_Sec_2_TextArray:temp_Sec_2_array})

            // Update Data Overall ---------------------------------------------------------
            let temp_overall=''
            for(let i=0;i<this.state.Ilets_Reading_Sec_2_TextArray.length;i++){
                if(this.state.Ilets_Reading_Sec_2_TextArray[i].length=='2'){
                    // For picture -> Link store in index 0  for display, index 1 store pic file
                    temp_overall=temp_overall+this.state.Ilets_Reading_Sec_2_TextArray[i][0]
                }else {
                    if (this.state.Ilets_Reading_Sec_2_TextArray[i].slice(-11) === '[HiddenTag]') {
                        temp_overall = temp_overall + this.state.Ilets_Reading_Sec_2_TextArray[i].slice(0, -11)
                    } else {
                        temp_overall = temp_overall + this.state.Ilets_Reading_Sec_2_TextArray[i]
                    }
                }
            }
            temp_overall = this.Filtering_Temp_Overall(temp_overall)
            this.setState({Ilets_Reading_Sec_2_TextOverall:temp_overall})
        }

        if(e.target.name=='Ilets_Reading_Sec_3_Overall'){

            // Edit particular Array
            let temp_Sec_3_array=this.state.Ilets_Reading_Sec_3_TextArray

            // On Change Handler ---------------------------------------------------
            // Check if an array.length==2 within 'Ilets_Listening_Sec_1_TextArray'  -> length==2 for Picture
            if(temp_Sec_3_array[e.target.id].length=='2'){
                temp_Sec_3_array[e.target.id][e.target.className]=[e.target.value]
            }else{
                temp_Sec_3_array[e.target.id]=[e.target.value]
            }
            this.setState({Ilets_Reading_Sec_3_TextArray:temp_Sec_3_array})

            // Update Data Overall ---------------------------------------------------------
            let temp_overall=''
            for(let i=0;i<this.state.Ilets_Reading_Sec_3_TextArray.length;i++){
                if(this.state.Ilets_Reading_Sec_3_TextArray[i].length=='2'){
                    // For picture -> Link store in index 0  for display, index 1 store pic file
                    temp_overall=temp_overall+this.state.Ilets_Reading_Sec_3_TextArray[i][0]
                }else {
                    if (this.state.Ilets_Reading_Sec_3_TextArray[i].slice(-11) === '[HiddenTag]') {
                        temp_overall = temp_overall + this.state.Ilets_Reading_Sec_3_TextArray[i].slice(0, -11)
                    } else {
                        temp_overall = temp_overall + this.state.Ilets_Reading_Sec_3_TextArray[i]
                    }
                }
            }
            temp_overall = this.Filtering_Temp_Overall(temp_overall)
            this.setState({Ilets_Reading_Sec_3_TextOverall:temp_overall})
        }
    }

    // Reading Picture Upload Controller
    Reading_Pic_Upload=(e)=>{
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
            // Reading Section 1    -->  Load the link to double array index 0, load the file to index 1
            if(e.target.name=='Ilets_Reading_Sec_1_Overall'){
                // Load the Data and retrieve the file name
                for (let key in res.data.data) {
                    let UpdateArray = this.state.Ilets_Reading_Sec_1_TextArray
                    UpdateArray[e.target.id][0] = global.config.url + 'IMG/' + key
                    UpdateArray[e.target.id][1] = UploadImage
                    this.setState({Ilets_Reading_Sec_1_TextArray: UpdateArray})
                }
            }

            // Reading Section 2    -->  Load the link to double array index 0, load the file to index 1
            if(e.target.name=='Ilets_Reading_Sec_2_Overall'){
                // Load the Data and retrieve the file name
                for (let key in res.data.data) {
                    let UpdateArray = this.state.Ilets_Reading_Sec_2_TextArray
                    UpdateArray[e.target.id][0] = global.config.url + 'IMG/' + key
                    UpdateArray[e.target.id][1] = UploadImage
                    this.setState({Ilets_Reading_Sec_2_TextArray: UpdateArray})
                }
            }

            // Reading Section 3    -->  Load the link to double array index 0, load the file to index 1
            if(e.target.name=='Ilets_Reading_Sec_3_Overall'){
                // Load the Data and retrieve the file name
                for (let key in res.data.data) {
                    let UpdateArray = this.state.Ilets_Reading_Sec_3_TextArray
                    UpdateArray[e.target.id][0] = global.config.url + 'IMG/' + key
                    UpdateArray[e.target.id][1] = UploadImage
                    this.setState({Ilets_Reading_Sec_3_TextArray: UpdateArray})
                }
            }

        })

    }

    Reading_Sect_1_Add_Question=(e)=>{
        //文章插入
        if(e.target.name=='Ilets_Reading_Add_Para'){

            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Reading_Sec_1_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Paragraph: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Reading_Sec_1_TextArray
            TempArray.push("[WillBeDelete][HiddenTag]")
            TempArray.push('')
            TempArray.push("\\n\\n[Question][/WillBeDelete][HiddenTag]")

            // Set State
            this.setState({Ilets_Reading_Sec_1_TextArray:TempArray, Ilets_Reading_Sec_1_TextArray_name:TempNameArray})
            console.log(TempArray)
        }

        //问题描述
        if(e.target.name=='Ilets_Reading_Add_Question_Desc'){

            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Reading_Sec_1_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push(' Description-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Reading_Sec_1_TextArray
            TempArray.push("[WillBeDelete][HiddenTag]")
            TempArray.push('')
            TempArray.push("\\n[/WillBeDelete][HiddenTag]")

            // Set State
            this.setState({Ilets_Reading_Sec_1_TextArray:TempArray, Ilets_Reading_Sec_1_TextArray_name:TempNameArray})
            console.log(TempArray)
        }

        // 方框题
        if(e.target.name=='Ilets_Reading_Add_Type_Bracket'){

            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Reading_Sec_1_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Bracket-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Reading_Sec_1_TextArray
            TempArray.push('<table><tbody><tr><td>[HiddenTag]')
            TempArray.push('')
            TempArray.push("</td></tr></tbody></table>\\n[HiddenTag]")
            this.setState({Ilets_Reading_Sec_1_TextArray:TempArray, Ilets_Reading_Sec_1_TextArray_name:TempNameArray})
        }

        // 题目加内容 (题型: 多选,单选,填空,对错)
        if(e.target.name=='Ilets_Reading_Add_Type_Question'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Reading_Sec_1_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Detail-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Reading_Sec_1_TextArray
            TempArray.push("[WillBeDelete][HiddenTag]")
            TempArray.push('')
            TempArray.push("\\n[/WillBeDelete][HiddenTag]")
            this.setState({Ilets_Reading_Sec_1_TextArray:TempArray, Ilets_Reading_Sec_1_TextArray_name:TempNameArray})
        }

        // 图片
        if(e.target.name=='Ilets_Reading_Add_Add_Pic'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Reading_Sec_1_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Upload Pic: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Reading_Sec_1_TextArray
            TempArray.push('[IMG][HiddenTag]')
            TempArray.push(['',''])
            TempArray.push("[IMG]\\n[HiddenTag]")
            this.setState({Ilets_Reading_Sec_1_TextArray:TempArray, Ilets_Reading_Sec_1_TextArray_name:TempNameArray})
        }
    }

    Reading_Sect_2_Add_Question=(e)=>{

        //文章插入
        if(e.target.name=='Ilets_Reading_Add_Para'){

            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Reading_Sec_2_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Paragraph: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Reading_Sec_2_TextArray
            TempArray.push("[WillBeDelete][HiddenTag]")
            TempArray.push('')
            TempArray.push("\\n\\n[Question][/WillBeDelete][HiddenTag]")

            // Set State
            this.setState({Ilets_Reading_Sec_2_TextArray:TempArray, Ilets_Reading_Sec_2_TextArray_name:TempNameArray})
            console.log(TempArray)
        }

        //问题描述
        if(e.target.name=='Ilets_Reading_Add_Question_Desc'){

            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Reading_Sec_2_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Question Description: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Reading_Sec_2_TextArray
            TempArray.push("[WillBeDelete][HiddenTag]")
            TempArray.push('')
            TempArray.push("\\n[/WillBeDelete][HiddenTag]")

            // Set State
            this.setState({Ilets_Reading_Sec_2_TextArray:TempArray, Ilets_Reading_Sec_2_TextArray_name:TempNameArray})
            console.log(TempArray)
        }

        // 方框题
        if(e.target.name=='Ilets_Reading_Add_Type_Bracket'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Reading_Sec_2_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Bracket-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Reading_Sec_2_TextArray
            TempArray.push('<table><tbody><tr><td>[HiddenTag]')
            TempArray.push('')
            TempArray.push("</td></tr></tbody></table>\\n[HiddenTag]")
            this.setState({Ilets_Reading_Sec_2_TextArray:TempArray, Ilets_Reading_Sec_2_TextArray_name:TempNameArray})
        }

        // 题目加内容 (题型: 多选,单选,填空,对错)
        if(e.target.name=='Ilets_Reading_Add_Type_Question'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Reading_Sec_2_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Detail-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Reading_Sec_2_TextArray
            TempArray.push("[WillBeDelete][HiddenTag]")
            TempArray.push('')
            TempArray.push("\\n[/WillBeDelete][HiddenTag]")
            this.setState({Ilets_Reading_Sec_2_TextArray:TempArray, Ilets_Reading_Sec_2_TextArray_name:TempNameArray})
        }

        // 图片
        if(e.target.name=='Ilets_Reading_Add_Add_Pic'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Reading_Sec_2_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Upload Pic: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Reading_Sec_2_TextArray
            TempArray.push('[IMG][HiddenTag]')
            TempArray.push(['',''])
            TempArray.push("[IMG]\\n[HiddenTag]")
            this.setState({Ilets_Reading_Sec_2_TextArray:TempArray, Ilets_Reading_Sec_2_TextArray_name:TempNameArray})
        }
    }

    Reading_Sect_3_Add_Question=(e)=>{
        //文章插入
        if(e.target.name=='Ilets_Reading_Add_Para'){

            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Reading_Sec_3_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Paragraph: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Reading_Sec_3_TextArray
            TempArray.push("[WillBeDelete][HiddenTag]")
            TempArray.push('')
            TempArray.push("\\n\\n[Question][/WillBeDelete][HiddenTag]")

            // Set State
            this.setState({Ilets_Reading_Sec_3_TextArray:TempArray, Ilets_Reading_Sec_3_TextArray_name:TempNameArray})
            console.log(TempArray)
        }

        //问题描述
        if(e.target.name=='Ilets_Reading_Add_Question_Desc'){

            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Reading_Sec_3_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Question Description: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Reading_Sec_3_TextArray
            TempArray.push("[WillBeDelete][HiddenTag]")
            TempArray.push('')
            TempArray.push("\\n[/WillBeDelete][HiddenTag]")

            // Set State
            this.setState({Ilets_Reading_Sec_3_TextArray:TempArray, Ilets_Reading_Sec_3_TextArray_name:TempNameArray})
            console.log(TempArray)
        }

        // 方框题
        if(e.target.name=='Ilets_Reading_Add_Type_Bracket'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Reading_Sec_3_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Bracket-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Reading_Sec_3_TextArray
            TempArray.push('<table><tbody><tr><td>[HiddenTag]')
            TempArray.push('')
            TempArray.push("</td></tr></tbody></table>\\n[HiddenTag]")
            this.setState({Ilets_Reading_Sec_3_TextArray:TempArray, Ilets_Reading_Sec_3_TextArray_name:TempNameArray})
        }

        // 题目加内容 (题型: 多选,单选,填空,对错
        if(e.target.name=='Ilets_Reading_Add_Type_Question'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Reading_Sec_3_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Detail-Question: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Reading_Sec_3_TextArray
            TempArray.push("[WillBeDelete][HiddenTag]")
            TempArray.push('')
            TempArray.push("\\n[/WillBeDelete][HiddenTag]")
            this.setState({Ilets_Reading_Sec_3_TextArray:TempArray, Ilets_Reading_Sec_3_TextArray_name:TempNameArray})
        }

        // 图片
        if(e.target.name=='Ilets_Reading_Add_Add_Pic'){
            // This is to Update Name Array
            let TempNameArray=this.state.Ilets_Reading_Sec_3_TextArray_name
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden
            TempNameArray.push('Upload Pic: ')
            TempNameArray.push("Meaningless[HiddenTag]")   // Will be Hidden

            // This is to Update Display Array
            let TempArray=this.state.Ilets_Reading_Sec_3_TextArray
            TempArray.push('[IMG][HiddenTag]')
            TempArray.push(['',''])
            TempArray.push("[IMG]\\n[HiddenTag]")
            this.setState({Ilets_Reading_Sec_3_TextArray:TempArray, Ilets_Reading_Sec_3_TextArray_name:TempNameArray})
        }
    }

    IletsReadingFinalSubmit=(e)=>{

        let token = localStorage.getItem('access_token');
        let submitData = new FormData();

        // Append paper_id  Section1_text Section2_text Section3_text
        submitData.append('paperid',this.state.Ilets_Paper_ID)
        submitData.append('section1',this.state.Ilets_Reading_Sec_1_TextOverall)
        submitData.append('section2',this.state.Ilets_Reading_Sec_2_TextOverall)
        submitData.append('section3',this.state.Ilets_Reading_Sec_3_TextOverall)

        // loop Answer
        for(let i=0;i<40;i++){
            submitData.append('RA'+[i+1],this.state.Ilets_Reading_Answer[i])
        }

        // Final Submit
        if (window.confirm("Reading Paper Submit")) {
            axios({
                method: 'post',
                url: global.config.url + `AdminHappy/ReadingPaperUpdate`,
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
export default IletsInsertReading;