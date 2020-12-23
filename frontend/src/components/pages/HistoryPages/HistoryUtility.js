import reactStringReplace from "react-string-replace";
import {Modal} from "antd";

export function parseTag (str) {

    let imgs = [];
    let tables = [];
    let tableInputs = [];
    let MCMC = [];
    let MCSC = [];
    let FTB = [];
    let TFN = [];
    let result = '';

    //PART
    let parts = reactStringReplace(str, /\[PART\](.+?)\[PART\]/g, (match, i) => (
        `<div>${match}</div>`
    ));

    for (let i = 0; i < parts.length; i++) {
        result += parts[i];
    }

    //IMG
    imgs = reactStringReplace(result, /\[IMG\](.+?)\[IMG\]/g, (match, i) => (
        `<img src='${match}' id='img1' style='max-width:550px;height:auto'/>`
    ));

    result = '';
    for (let i = 0; i < imgs.length; i++) {
        result += imgs[i];
    }

    // //table
    // tables = reactStringReplace(result, /<table>(.+?)<\/table>/g, (match, i) => (
    //     `<table class="table table-bordered" style='width:auto'>${match}</table>`
    // ));

    result = result.replace(/<table>/g, `<table class="table table-bordered" style='width:auto'>`);

    // result = '';
    // for (let i = 0; i < tables.length; i++) {
    //     result += tables[i];
    // }

    //table input
    tableInputs = reactStringReplace(result, /\[TABLE\-(\d+)\]/g, (match, i) => (
        `${match}. <span id='answer${match}' style='max-width:200px;display:inline' disabled></span>`
    ));

    result = '';
    for (let i = 0; i < tableInputs.length; i++) {
        result += tableInputs[i];
    }

    //单选题
    MCSC = reactStringReplace(result, /\[MCSC\-(\d+)\]/g, (match, i) => (
        `<br/> ${match}.<span id='answer${match}' style='max-width:200px;display:inline' disabled></span><br/>Select one answer`
    ));

    result = '';
    for (let i = 0; i < MCSC.length; i++) {
        result += MCSC[i];
    }

    //多选题
    MCMC = reactStringReplace(result, /\[MCMC\-(\d+)\]/g, (match, i) => (
        `<br/>${match}. <span id='answer${match}' style='max-width:200px;display:inline' disabled></span>`
    ));

    result = '';
    for (let i = 0; i < MCMC.length; i++) {
        result += MCMC[i];
    }

    //填空题
    FTB = reactStringReplace(result, /\[FTB\-(\d+)\]/g, (match, i) => (
        `${match}. <span id='answer${match}' style='max-width:200px;display:inline' disabled> </span>`
    ));

    result = '';
    for (let i = 0; i < FTB.length; i++) {
        result += FTB[i];
    }

    //对错题
    TFN = reactStringReplace(result, /\[TFN\-(\d+)\]/g, (match, i) => (
        // `<Select id='answer${match}' style={{ width: 200, marginLeft:'5px',marginRight:'5px'}} placeholder='Question${match} Answer'>
        //   <Select.Option value="True">True</Select.Option>
        //   <Select.Option value="False">False</Select.Option>
        //   <Select.Option value="Not Given">Not Given</Select.Option>
        // </Select>`
        `${match}. <input id='answer${match}' autocomplete='off' class='form-control' style='max-width:200px;display:inline' disabled/> (Put True, False or Not Given)`
    ));

    result = '';
    for (let i = 0; i < TFN.length; i++) {
        result += TFN[i];
    }

    ///n
    result = result.replace(/\\n/g, '<br/>');

    //console.log(result);
    return result;

}

export function submitError(msg){
    let {confirm} = Modal;
    return (
        confirm({
            title: msg+'，请联系工作人员',
            //content: '请在“哔”声后开始答题',
            cancelButtonProps: {style: {display: 'none'}},
            okText: '回到主页',
            centered: true,
            onOk: () => {
                localStorage.removeItem('examID');
                let examID = JSON.parse(localStorage.getItem('examID'));
                if(examID!==null){
                    localStorage.removeItem('IELTSProgress'+examID);
                    localStorage.removeItem('IELTSListeningAnswer'+examID);
                    localStorage.removeItem('IELTSReadingAnswer'+examID);
                    localStorage.removeItem('IELTSWritingAnswer'+examID);
                    localStorage.removeItem('IELTSSpeakingAnswer'+examID);
                }
                window.location.href = '/Home';
            }
        })
    )
}

export function logout(){
    let {confirm} = Modal;
    confirm({
        title: '登录信息已过期，请重新登录',
        cancelButtonProps: {style: {display: 'none'}},
        okText: '回到主页',
        centered: true,
        onOk: () => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('username');
            localStorage.removeItem('userID');
            window.location.href = '/';
        }
    })
}

export function escapeHTML(str){
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return str.replace(/[&<>"']/g, function(m) { return map[m]; });
}