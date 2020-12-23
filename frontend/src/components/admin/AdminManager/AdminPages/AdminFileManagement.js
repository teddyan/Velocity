import React, {Component} from 'react';
import axios from 'axios';

class AdminFileManagement extends Component{
    state={
        Admin_Pic_Management:[],
        Admin_Audio_Management:[],

        Image_Display_Hidden:false,
        Audio_Display_Hidden:true,

        //
        NewGlobalUrl:global.config.url.slice(0,-1)

    }

    componentDidMount() {
        // Fetch Picture
        axios.get(global.config.url + 'AdminHappy/ImgDetail').then(res=>{
            this.setState({
                Admin_Pic_Management:res.data.data
            })
        })

        // Fetch Audio
        axios.get(global.config.url + 'AdminHappy/AudioDetail').then(res=>{
            this.setState({
                Admin_Audio_Management:res.data.data
            })
        })
    }

    render(){
        return(
            <div className='Audio_And_Pic_Management'>
                <button name='File_Control_Image' onClick={this.FileTypeHiddenControl}>Show Image</button>&nbsp;
                <button name='File_Control_Audio'onClick={this.FileTypeHiddenControl}>Show Audio</button>&nbsp;

                <div className='Picture_Show_Overall' hidden={this.state.Image_Display_Hidden}>{
                    this.state.Admin_Pic_Management.map((data, i) => {
                        return (
                            <div style={{padding: '20px'}} key={i}>
                                <h5>{[i + 1] + ': ' + this.state.NewGlobalUrl + data}</h5>
                                <img src={this.state.NewGlobalUrl + data} width="30%" height="40%"/>
                                <br/>
                                <button id={data} onClick={this.FileDeleteButton.bind(this)}>Delete</button>
                                <br/>
                            </div>
                        )
                    })
                }</div>

                <div className='Audio_Show_Overall'hidden={this.state.Audio_Display_Hidden}>{
                    this.state.Admin_Audio_Management.map((data, i) => {
                        return (
                            <div style={{padding: '20px'}} key={i}>
                                <h5>{[i + 1] + ': ' + this.state.NewGlobalUrl + data}</h5>
                                <audio controls>
                                    <source src={this.state.NewGlobalUrl + data}/>
                                </audio>
                                <br/>
                                <button id={data} onClick={this.FileDeleteButton.bind(this)}>Delete</button>
                                <br/>
                            </div>
                        )
                    })
                }</div>

            </div>
        )
    }

    // File Type Hidden Control
    FileTypeHiddenControl=(e)=>{
        if(e.target.name=='File_Control_Image'){
            this.setState({Image_Display_Hidden:false,Audio_Display_Hidden:true})
        }
        if(e.target.name=='File_Control_Audio'){
            this.setState({Image_Display_Hidden:true,Audio_Display_Hidden:false})
        }
    }

    // Delete File button
    FileDeleteButton=(e)=>{
        if (window.confirm("Are You Sure Delete This File")) {
            axios.post(global.config.url + 'AdminHappy/DelFile', {filepath:e.target.id}).then(res=>{
                if(res.data.msg=='succeed'){
                    alert("Deleted Successfully")
                    window.location.href='/AdminManagement/AdminFileManagement'
                }
            })
        }
    }




}
export default AdminFileManagement;
// <div className='Audio_And_Pic_Management'>
//                 <button name='File_Control_Image' onClick={this.FileTypeHiddenControl}>Show Image</button>&nbsp;
//                 <button name='File_Control_Audio'onClick={this.FileTypeHiddenControl}>Show Audio</button>&nbsp;

//                 <div className='Picture_Show_Overall' hidden={this.state.Image_Display_Hidden}>{
//                     this.state.Admin_Pic_Management.map((data, i) => {
//                         return (
//                             <div style={{padding: '20px'}} key={i}>
//                                 <h5>{[i + 1] + ': ' + this.state.NewGlobalUrl + data}</h5>
//                                 <img src={this.state.NewGlobalUrl + data} width="30%" height="40%"/>
//                                 <br/>
//                                 <button id={data} onClick={this.FileDeleteButton.bind(this)}>Delete</button>
//                                 <br/>
//                             </div>
//                         )
//                     })
//                 }</div>

//                 <div className='Audio_Show_Overall'hidden={this.state.Audio_Display_Hidden}>{
//                     this.state.Admin_Audio_Management.map((data, i) => {
//                         return (
//                             <div style={{padding: '20px'}} key={i}>
//                                 <h5>{[i + 1] + ': ' + this.state.NewGlobalUrl + data}</h5>
//                                 <audio controls>
//                                     <source src={this.state.NewGlobalUrl + data}/>
//                                 </audio>
//                                 <br/>
//                                 <button id={data} onClick={this.FileDeleteButton.bind(this)}>Delete</button>
//                                 <br/>
//                             </div>
//                         )
//                     })
//                 }</div>

//             </div>
