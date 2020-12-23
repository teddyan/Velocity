import React, {Component} from 'react';
import axios from 'axios';

import {parseTag, submitError} from './HistoryUtility';

// import {parseTag, submitError} from '../../Utility';

class HistoryListeningPage extends Component{

    state={
        loading:true,
        ListeningSection_1:'',
        ListeningSection_2:'',
        ListeningSection_3:'',
        ListeningSection_4:'',

        // Listening Section Display Hidden
        Listening_Section_1_Hidden:false,
        Listening_Section_2_Hidden:true,
        Listening_Section_3_Hidden:true,
        Listening_Section_4_Hidden:true,
    }



    componentDidMount() {
        let token = localStorage.getItem('access_token');
        axios.get(global.config.url + 'User/IELTSListeningHistoryAnswer?examID=' + this.props.location.search.slice(1), {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res=>{
            console.log(res.data)

            this.setState({
                loading:false,
                ListeningSection_1:parseTag(res.data.data.ListeningQuestion.LQ1),
                ListeningSection_2:parseTag(res.data.data.ListeningQuestion.LQ2),
                ListeningSection_3:parseTag(res.data.data.ListeningQuestion.LQ3),
                ListeningSection_4:parseTag(res.data.data.ListeningQuestion.LQ4)
            })

            // use for loop to loop the answer and insert to the HTML
            for(let i=1; i<=40;i++){
                // Temp var
                let LisUser=''
                let LisStandard=''

                // if answer match with Standard
                if(res.data.data.ListeningAnswer["LA"+i.toString()].toLowerCase() == res.data.data.ListeningStandard["LA"+i.toString()].toLowerCase()) {

                    LisUser = res.data.data.ListeningAnswer["LA" + i.toString()]
                    document.getElementById('answer' + i).innerHTML='<input id="CorrectAnswer"  style="border: 1px solid green;" value='+LisUser+'  />'

                }else{
                    //else display User's answer and Standard answer
                    LisUser=res.data.data.ListeningAnswer["LA"+i.toString()]
                    LisStandard = res.data.data.ListeningStandard["LA" + i.toString()]
                    document.getElementById('answer' + i).innerHTML='<input id="WrongAnswer" style="border: 1px solid red;"   value='+LisUser+'>' +
                        ' <span style="color: green" id="CorrectAnswer">' + LisStandard + '</span>'

                }
            }
        })

    }

    render(){
        return(
            <React.Fragment>
                <div style={{paddingBottom:'30px'}}>
                    <button name='Listening_Section_1_Hidden' onClick={this.Listening_Display_Hidden}>Section 1</button>&nbsp;
                    <button name='Listening_Section_2_Hidden' onClick={this.Listening_Display_Hidden}>Section 2</button>&nbsp;
                    <button name='Listening_Section_3_Hidden' onClick={this.Listening_Display_Hidden}>Section 3</button>&nbsp;
                    <button name='Listening_Section_4_Hidden' onClick={this.Listening_Display_Hidden}>Section 4</button>&nbsp;
                </div>

                <div hidden={this.state.Listening_Section_1_Hidden} dangerouslySetInnerHTML={{ __html: this.state.ListeningSection_1 }}></div>
                <div hidden={this.state.Listening_Section_2_Hidden} dangerouslySetInnerHTML={{ __html: this.state.ListeningSection_2 }}></div>
                <div hidden={this.state.Listening_Section_3_Hidden} dangerouslySetInnerHTML={{ __html: this.state.ListeningSection_3 }}></div>
                <div hidden={this.state.Listening_Section_4_Hidden} dangerouslySetInnerHTML={{ __html: this.state.ListeningSection_4 }}></div>

                {
                    this.state.loading?
                        <center>
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span></div>
                        </center>
                        :''
                }

            </React.Fragment>


        )

    }
    Listening_Display_Hidden=(e)=>{
        if(e.target.name==='Listening_Section_1_Hidden'){
            this.setState({
                Listening_Section_1_Hidden:false,
                Listening_Section_2_Hidden:true,
                Listening_Section_3_Hidden:true,
                Listening_Section_4_Hidden:true,
            })
        }

        if(e.target.name==='Listening_Section_2_Hidden'){
            this.setState({
                Listening_Section_1_Hidden:true,
                Listening_Section_2_Hidden:false,
                Listening_Section_3_Hidden:true,
                Listening_Section_4_Hidden:true,
            })
        }

        if(e.target.name==='Listening_Section_3_Hidden'){
            this.setState({
                Listening_Section_1_Hidden:true,
                Listening_Section_2_Hidden:true,
                Listening_Section_3_Hidden:false,
                Listening_Section_4_Hidden:true,
            })
        }

        if(e.target.name==='Listening_Section_4_Hidden'){
            this.setState({
                Listening_Section_1_Hidden:true,
                Listening_Section_2_Hidden:true,
                Listening_Section_3_Hidden:true,
                Listening_Section_4_Hidden:false,
            })
        }
    }
}

export default HistoryListeningPage;