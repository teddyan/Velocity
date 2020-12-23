import React from 'react';
import axios from 'axios';

// import CSS
import '../../../../css/AdminPages.css'

class AdminBannerManagement extends React.Component{

    state={
        AdminBannerLeft:[],
        AdminBannerRight:[],

        // Banner Display Hidden
        Admin_Left_Banner_Hidden:false,
        Admin_Right_Banner_Hidden:true,

        NewGlobalUrl:global.config.url.slice(0,-1)
    }

    componentDidMount() {
        axios.get(global.config.url + 'AdminHappy/GetBannerImg').then(res=>{
            console.log(res.data)

            this.setState({
                AdminBannerLeft:res.data.data.left_banner,
                AdminBannerLeftLink:res.data.data.left_banner_link,
                AdminBannerRight:res.data.data.right_banner,
                AdminBannerRightLink:res.data.data.right_banner_link,
            })
            console.log(this.state)
        })
    }

    render(){
        return(
            <div className='AdminBannerManagement_Overall'>
                <button name='Admin_Banner_Left' onClick={this.Admin_Banner_Hidden_Control}>Banner Left </button>&nbsp;
                <button name='Admin_Banner_Right' onClick={this.Admin_Banner_Hidden_Control}>Banner Right </button>&nbsp;&nbsp;&nbsp;
                <button name='Admin_Banner_Submit' onClick={this.Admin_Banner_Submit}>Submit</button>
                <br/>
                <div id='Admin_Banner_Left' className='Admin_Banner_Management_Control' hidden={this.state.Admin_Left_Banner_Hidden}>
                    <div className='Admin_Banner_Display' style={{paddingTop:'30px'}}>
                        {
                            this.state.AdminBannerLeft.map((data,i)=>{
                                if(data!='[Delete]ThisWillBeDelete[Delete]') {
                                    return (
                                        <div key={i}>
                                            <h6><b>Banner {[i + 1]}: </b></h6>
                                            <p><b>url_link:</b></p>
                                            <p>{this.state.AdminBannerLeftLink[i]}</p>
                                            <br/>
                                            <p><b>Banner Image:</b></p>
                                            <img src={this.state.NewGlobalUrl + data} width="48%"
                                                 height="23%"/>
                                             <br/><br/>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>

                    <div className='Admin_Banner_Insert'>
                        <button name='Admin_Banner_Left_Add' onClick={this.Admin_Banner_Add_Delete}>Add Banner</button><br/><br/>
                        {
                            this.state.AdminBannerLeft.map((data,i)=>{
                                if(data!='[Delete]ThisWillBeDelete[Delete]') {
                                    return (
                                        <div key={i}>
                                            <h6><b>Banner {[i + 1]}: </b></h6>
                                            <input style={{width: '70%'}} id={i}
                                                   value={this.state.AdminBannerLeftLink[i]}
                                                   name='Admin_Banner_Left_Url'
                                                   onChange={this.OnChangeHandler}
                                            /><br/><br/>
                                            <textarea style={{width: '70%'}} value={data} id={i} name='Admin_Banner_Left' onChange={this.OnChangeHandler}/><br/>
                                            <input type='file' name='Admin_Banner_Left' id={i} onChange={this.Admin_Banner_Upload} accept="image/*"/>
                                            <button name='Admin_Banner_Left_Delete' id={i} onClick={this.Admin_Banner_Add_Delete}>Delete</button>
                                            <br/><br/>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
                <div id='Admin_Banner_Right' className='Admin_Banner_Management_Control' hidden={this.state.Admin_Right_Banner_Hidden}>
                    <div className='Admin_Banner_Display' style={{paddingTop:'30px'}}>
                        {
                            this.state.AdminBannerRight.map((data,i)=>{
                                if(data!='[Delete]ThisWillBeDelete[Delete]') {
                                    return (
                                        <div key={i}>
                                            <h6><b>Banner {[i + 1]}: </b></h6>
                                            <p><b>url_link:</b></p>
                                            <p>{this.state.AdminBannerRightLink[i]}</p>
                                            <br/>
                                            <p><b>Banner Image:</b></p>
                                            <img src={this.state.NewGlobalUrl + data} width="48%"
                                                 height="23%"/>
                                            <br/>
                                             <br/><br/>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>

                    <div className='Admin_Banner_Insert'>
                        <button name='Admin_Banner_Right_Add' onClick={this.Admin_Banner_Add_Delete}>Add Banner</button><br/><br/>
                        {
                            this.state.AdminBannerRight.map((data,i)=>{
                                if(data!='[Delete]ThisWillBeDelete[Delete]') {
                                    return (
                                        <div key={i}>
                                            <h6><b>Banner {[i + 1]}: </b></h6>
                                            <input style={{width: '70%'}} id={i} value={this.state.AdminBannerRightLink[i]}
                                                   name='Admin_Banner_Right_Url'
                                                   onChange={this.OnChangeHandler}
                                            /><br/><br/>
                                            <textarea style={{width: '70%'}} type='text' id={i}
                                                      name='Admin_Banner_Right' value={data}
                                                      onChange={this.OnChangeHandler}/><br/>
                                            <input type='file' name='Admin_Banner_Right' id={i}
                                                   onChange={this.Admin_Banner_Upload} accept="image/*"/>
                                            <button name='Admin_Banner_Right_Delete' id={i}
                                                    onClick={this.Admin_Banner_Add_Delete}>Delete
                                            </button>
                                            <br/><br/>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>

                </div>

            </div>
        )
    }

    // On Change Handler
    OnChangeHandler=(e)=>{
        if(e.target.name==='Admin_Banner_Left'){
            let TempBannerArray=this.state.AdminBannerLeft
            TempBannerArray[e.target.id]=e.target.value
            this.setState({AdminBannerLeft:TempBannerArray})
        }
        if(e.target.name ==='Admin_Banner_Left_Url'){
            let TempBannerArray=this.state.AdminBannerLeftLink
            TempBannerArray[e.target.id]=e.target.value
            this.setState({AdminBannerLeftLink:TempBannerArray})
        }
        if(e.target.name==='Admin_Banner_Right'){
            let TempBannerArray=this.state.AdminBannerRight
            TempBannerArray[e.target.id]=e.target.value
            this.setState({AdminBannerRight:TempBannerArray})
        }
        if(e.target.name ==='Admin_Banner_Right_Url'){
            let TempBannerArray=this.state.AdminBannerRightLink
            TempBannerArray[e.target.id]=e.target.value
            this.setState({AdminBannerRightLink:TempBannerArray})
        }

    }

    // Banner Hidden Control
    Admin_Banner_Hidden_Control=(e)=>{
        if(e.target.name==='Admin_Banner_Left'){
            this.setState({
                Admin_Left_Banner_Hidden:false,
                Admin_Right_Banner_Hidden:true
            })
        }

        if(e.target.name==='Admin_Banner_Right'){
            this.setState({
                Admin_Left_Banner_Hidden:true,
                Admin_Right_Banner_Hidden:false
            })
        }
    }

    // Banner Add Or Delete
    Admin_Banner_Add_Delete=(e)=>{

        // Add Banner Button Left
        if(e.target.name==='Admin_Banner_Left_Add') {
            let NewBannerArray = this.state.AdminBannerLeft
            NewBannerArray.push('')
            let NewBannerArrayLink = this.state.AdminBannerLeftLink
            NewBannerArrayLink.push('')

            this.setState({AdminBannerLeft:NewBannerArray, AdminBannerLeftLink:NewBannerArrayLink})
        }

        // Add Banner Button Right
        if(e.target.name==='Admin_Banner_Right_Add'){
            let NewBannerArray = this.state.AdminBannerRight
            NewBannerArray.push('')
            let NewBannerArrayLink = this.state.AdminBannerRightLink
            NewBannerArrayLink.push('')

            this.setState({AdminBannerRight:NewBannerArray, AdminBannerRightLink:NewBannerArrayLink})
        }

        if(e.target.name==='Admin_Banner_Left_Delete'){
            // This part delete IMG
            let TempBannerArray=this.state.AdminBannerLeft
            TempBannerArray[e.target.id]='[Delete]ThisWillBeDelete[Delete]'

            // This part Delete URL
            let NewBannerArrayLink = this.state.AdminBannerLeftLink
            NewBannerArrayLink[e.target.id]='[Delete]ThisWillBeDelete[Delete]'
            this.setState({AdminBannerLeft:TempBannerArray, AdminBannerLeftLink:NewBannerArrayLink})
        }

        if(e.target.name==='Admin_Banner_Right_Delete'){
            // This part delete IMG
            let TempBannerArray=this.state.AdminBannerRight
            TempBannerArray[e.target.id]='[Delete]ThisWillBeDelete[Delete]'

            // This part Delete URL
            let NewBannerArrayLink = this.state.AdminBannerRightLink
            NewBannerArrayLink[e.target.id]='[Delete]ThisWillBeDelete[Delete]'
            this.setState({AdminBannerRight:TempBannerArray})
        }

    }

    // Banner Upload
    Admin_Banner_Upload=(e)=>{
        e.persist()

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
                if(e.target.name==='Admin_Banner_Left') {
                    let NewBannerArray = this.state.AdminBannerLeft
                    NewBannerArray[e.target.id] = '/IMG/'+key
                    this.setState({AdminBannerLeft: NewBannerArray})
                    alert('Banner Uploaded Successfully')
                }
                else if(e.target.name==='Admin_Banner_Right') {
                    let NewBannerArray = this.state.AdminBannerRight
                    NewBannerArray[e.target.id] = '/IMG/'+key
                    this.setState({AdminBannerRight: NewBannerArray})
                    alert('Banner Uploaded Successfully')
                }else{
                    alert('Error')
                }
            }
        })
    }

    // Final Submit
    Admin_Banner_Submit=(e)=>{
        // Convert Left Array Banner To String
        let Banner_Left_Submit='';
        for(let i=0;i<this.state.AdminBannerLeft.length;i++){
            if(this.state.AdminBannerLeft[i]!='[Delete]ThisWillBeDelete[Delete]') {
                Banner_Left_Submit = Banner_Left_Submit + this.state.AdminBannerLeft[i] + ';'
            }
        }
        Banner_Left_Submit=Banner_Left_Submit.slice(0,-1)

        // Convert Left Array Banner To String
        let Banner_Left_url_Submit='';
        for(let i=0;i<this.state.AdminBannerLeftLink.length;i++){
            if(this.state.AdminBannerLeftLink[i]!='[Delete]ThisWillBeDelete[Delete]') {
                Banner_Left_url_Submit = Banner_Left_url_Submit + this.state.AdminBannerLeftLink[i] + ';'
            }
        }
        Banner_Left_url_Submit=Banner_Left_url_Submit.slice(0,-1)

        // Convert Right Array Banner To String
        let Banner_Right_Submit='';
        for(let i=0;i<this.state.AdminBannerRight.length;i++){
            if(this.state.AdminBannerRight[i]!='[Delete]ThisWillBeDelete[Delete]') {
                Banner_Right_Submit = Banner_Right_Submit + this.state.AdminBannerRight[i] + ';'
            }
        }
        Banner_Right_Submit=Banner_Right_Submit.slice(0,-1)

        // Convert Left Array Banner To String
        let Banner_Right_url_Submit='';
        for(let i=0;i<this.state.AdminBannerRightLink.length;i++){
            if(this.state.AdminBannerLeftLink[i]!='[Delete]ThisWillBeDelete[Delete]') {
                Banner_Right_url_Submit = Banner_Right_url_Submit + this.state.AdminBannerRightLink[i] + ';'
            }
        }
        Banner_Right_url_Submit=Banner_Right_url_Submit.slice(0,-1)

        console.log(Banner_Left_Submit)
        if(window.confirm('Are You sure Update Banner Info')) {
            axios.post(this.state.NewGlobalUrl + '/AdminHappy/ChangeBannerImg', {
                left: Banner_Left_Submit,
                right: Banner_Right_Submit,
                left_link: Banner_Left_url_Submit,
                right_link: Banner_Right_url_Submit
            }).then(res => {
                if (res.data.msg === 'succeed') {
                    alert('Banner Updated Successfully')
                    window.location.href='/AdminManagement/AdminBannerManagement'
                }
            })
        }

    }
}

export default AdminBannerManagement

