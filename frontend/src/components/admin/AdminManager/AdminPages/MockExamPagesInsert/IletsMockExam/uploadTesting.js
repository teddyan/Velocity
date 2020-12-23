import React from 'react';
import axios from 'axios';

class uploadTesting extends React.Component{
    state={
        upload:'',

        audio:'',
        Array:[],


    }

    TryUploadPic=(e)=>{
        let formatData = new FormData()
        let UploadImage = e.target.files[0]
        formatData.append('file', UploadImage)

        let token = localStorage.getItem('access_token');
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        }
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
                this.setState({upload:global.config.url + 'IMG/'+key})
            }
        })
    }

    TryUploadAudio=(e)=> {

        let formatData = new FormData()

        let UploadImage = e.target.files[0]
        formatData.append('file', UploadImage)


        let token = localStorage.getItem('access_token');
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }

        }

        axios({
            method: 'post',
            url: global.config.url + `AdminHappy/AudioUpload`,
            data: formatData,
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            console.log(res.data)
            for (let key in res.data.data) {
                console.log(key)
                this.setState({audio:global.config.url + 'AUDIO/'+key})
            }
        })
    }

    componentDidMount() {
        let Temp_sec_1_intro=this.state.Ilets_Reading_Sec_1_TextArray.push('READING PASSAGE \'I\\n\nYou should spend about 20 minutes on Questions 1-13, which are based on Reading Passage I below.\\n\n')

        this.setState({
            Ilets_Reading_Sec_1_TextArray:Temp_sec_1_intro
        })

        console.log(this.state)

    }


    render(){
        return(
            <React.Fragment>
                <div>
                    <input type='file' onChange={this.TryUploadPic} accept="image/*"/>
                    <div className='image-preview'>
                        <img src={this.state.upload} />
                    </div>
                </div>
                <br/>
                <div>
                    <input type='file' onChange={this.TryUploadAudio} accept="audio/*"/>
                    <audio controls>
                        <source src={this.state.audio} />
                    </audio>
                </div>

                <div>
                    <button onClick={this.trytry}>button</button>
                </div>


            </React.Fragment>
        )
    }




}
export default uploadTesting;