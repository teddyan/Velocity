import reactStringReplace from "react-string-replace";
import { Modal } from "antd";
import React from "react";
import axios from "axios";
import $ from "jquery";
import { removeLocalIELTSExam as ri, removeLocalCCLExam as rc, submitError as s, useExpert as u,useCCLExpert as ccluse, logout as l } from "./Utility";


export function parseTag(str) {

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
        `<img src='${match}' id='img${match}' style='max-width:550px;height:auto'/>`
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
        `${match}. <input id='answer${match}' autocomplete='off' class='form-control' style='max-width:200px;display:inline'/>`
    ));

    result = '';
    for (let i = 0; i < tableInputs.length; i++) {
        result += tableInputs[i];
    }

    //单选题
    MCSC = reactStringReplace(result, /\[MCSC\-(\d+)\]/g, (match, i) => (
        `<br/>${match}. <input id='answer${match}' autocomplete='off' class='form-control' style='max-width:200px;display:inline'/><br/>Select one answer`
    ));

    result = '';
    for (let i = 0; i < MCSC.length; i++) {
        result += MCSC[i];
    }

    //多选题
    MCMC = reactStringReplace(result, /\[MCMC\-(\d+)\]/g, (match, i) => (
        `<br/>${match}. <input id='answer${match}' autocomplete='off' class='form-control' style='max-width:200px;display:inline'/>`
    ));

    result = '';
    for (let i = 0; i < MCMC.length; i++) {
        result += MCMC[i];
    }

    //填空题
    FTB = reactStringReplace(result, /\[FTB\-(\d+)\]/g, (match, i) => (
        `${match}. <input id='answer${match}' autocomplete='off' class='form-control' style='max-width:200px;display:inline'/>`
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
        `${match}. <input id='answer${match}' autocomplete='off' class='form-control' style='max-width:200px;display:inline'/> (Put True, False or Not Given)`
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

export function submitError(msg) {
    let { confirm } = Modal;
    return (
        confirm({
            title: msg + '，请联系工作人员',
            //content: '请在“哔”声后开始答题',
            cancelButtonProps: { style: { display: 'none' } },
            okText: '回到主页',
            centered: true,
            onOk: () => {
                localStorage.removeItem('examID');
                let examID = JSON.parse(localStorage.getItem('examID'));
                if (examID !== null) {
                    localStorage.removeItem('IELTSProgress' + examID);
                    localStorage.removeItem('IELTSListeningAnswer' + examID);
                    localStorage.removeItem('IELTSReadingAnswer' + examID);
                    localStorage.removeItem('IELTSWritingAnswer' + examID);
                    localStorage.removeItem('IELTSSpeakingAnswer' + examID);
                }
                window.location.href = '/Home';
            }
        })
    )
}

export function logout() {
    let { confirm } = Modal;
    confirm({
        title: '登录信息已过期，请重新登录',
        cancelButtonProps: { style: { display: 'none' } },
        okText: '回到主页',
        centered: true,
        onOk: () => {
            removeLocalUserInfo();
            window.location.href = '/';
        }
    })
}

export function escapeHTML(str) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return str.replace(/[&<>"']/g, function (m) { return map[m]; });
}

export function renderTime({ remainingTime }) {

    const minute = Math.floor(remainingTime / 60);
    let remain = document.getElementById('remain');

    if (remainingTime === 0) {
        if (remain !== null) {
            remain.innerHTML = '等待读题';
        }
        return <div className="timer" style={{ fontSize: '20pt', color: 'orange' }}>
            <center>等待读题</center>
        </div>;
    }

    const timeString = minute === 0 ? (remainingTime + '秒') : (minute + '分钟');
    if (remain !== null) {
        remain.innerHTML = timeString;
    }

    return (
        <div className="timer">
            <div className="text">还剩</div>
            <div className="value"
                style={{ fontSize: '25pt' }}>{timeString}</div>
        </div>
    );
};

export function removeLocalUserInfo() {
    localStorage.removeItem('imgKey');
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('userID');
    localStorage.removeItem('addWord');
}

export function removeLocalIELTSExam() {
    let regex = /^examID$|IELTSProgress|IELTSListeningAnswer|IELTSReadingAnswer|IELTSWritingAnswer|IELTSSpeakingAnswer|addWord/;
    let done = false;
    while (!done) {
        done = true;
        for (let key in localStorage) {
            if (regex.test(key)) {
                localStorage.removeItem(key);
                done = false;
                break;
            }
        }
    }
}

export function removeLocalCCLExam() {
    let regex = /^examIDCCL$|CCLProgress|CCLAnswer/;
    let done = false;
    while (!done) {
        done = true;
        for (let key in localStorage) {
            if (regex.test(key)) {
                localStorage.removeItem(key);
                done = false;
                break;
            }
        }
    }
}

export function askAddWord(word) {
    let { confirm } = Modal;
    return (
        confirm({
            title: '是否添加' + word + '到单词本',
            // content: <div>单词本功能开关<Switch className='ml-3' checked={this.state.addWord} onChange={(e)=>{this.setState({addWord:e});localStorage.setItem('addWord',JSON.stringify(e))}}/></div>,
            cancelText: '取消',
            okText: '确认',
            centered: true,
            onOk: () => {

                let token = localStorage.getItem('access_token');
                let userID = localStorage.getItem('userID');

                if (token === null || userID === null) {
                    return;
                }

                let formData = new FormData();
                formData.append('userID', userID);
                formData.append('word', word);
                axios({
                    method: 'post',
                    url: global.config.url + `User/AddWord`,
                    data: formData,
                    headers: { Authorization: `Bearer ${token}`, "Content-type": "application/json" }
                }).then(res => {
                    console.log(res);
                    if (typeof res.headers.authorization !== 'undefined') {
                        console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                        localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
                    }
                    if (res.data.msg === 'succeed') {
                        console.log('单词添加成功');
                    }
                }).catch(err => {
                    console.log(err);
                    console.log(err.response);
                    //Token过期
                    if (typeof err.response !== 'undefined' && err.response.status === 401) {
                        console.log('token过期，单词添加失败。用户在考试，所以不退出。');
                        //logout();
                    } else if (err.response.status === 400 && err.response.data.msg === 'that\'s not a word in english') {
                        let { confirm } = Modal;
                        return (
                            confirm({
                                title: '添加失败，' + word + '不是标准单词',
                                // content: '',
                                cancelText: '取消',
                                okText: '确定',
                                centered: true
                            })
                        )
                    }
                })
            }
        })
    )
}

//#region Ielts Expert
export function checkExpert(examID) {
    let { confirm } = Modal;
    return (
        confirm({
            title: '本次点评将消耗1张雅思点评券，确定使用吗？',
            cancelText: '取消',
            okText: '确定',
            centered: true,
            onCancel: () => {
                const path = document.location.pathname.toLowerCase();
                if (!/historypage/.test(path)) {
                    ri();
                    window.location.href = '/HistoryPage';
                }
            },
            onOk: () => {
                u(examID);
            }
        })
    )
}

//检查并使用雅思点评券
export function useExpert(examID) {
    let token = localStorage.getItem('access_token');
    let userID = localStorage.getItem('userID');
    //let examID = JSON.parse(localStorage.getItem('examID'));

    if (token === null || userID === null) {
        l();
        return;
    }

    let formData = new FormData();
    formData.append('userID', userID);
    formData.append('examID', examID);

    axios({
        method: 'post',
        url: global.config.url + `User/UseExpertIeltsTicket`,
        data: formData,
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        console.log(res);
        if (typeof res.headers.authorization !== 'undefined') {
            console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
            localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
        }
        if (res.data.msg === 'succeed') {
            console.log('成功');
            let { confirm } = Modal;
            return (
                confirm({
                    title: '点评券使用成功，老师正在奋力分析。请在模考记录查看进度。',
                    okText: '确定',
                    centered: true,
                    cancelButtonProps: { style: { display: 'none' } },
                    onOk: () => {
                        const path = document.location.pathname.toLowerCase();
                        if (!/historypage/.test(path)) {
                            ri();
                        }
                        window.location.href = '/HistoryPage';
                    }
                })
            )
        } else {
            s('点评券使用失败');
        }
    }).catch(err => {
        console.log(err);
        console.log(err.response);
        //Token过期
        if (typeof err.response !== 'undefined' && err.response.status === 401) {
            l();
        } else if (err.response.status === 400 && err.response.data.msg === 'lack of voucher') {
            let { confirm } = Modal;
            return (
                confirm({
                    title: '您的雅思点评券不足',
                    content: '购买后请在模考记录使用',
                    cancelText: '取消',
                    okText: '前往购买',
                    centered: true,
                    onCancel: () => {
                        const path = document.location.pathname.toLowerCase();
                        if (!/historypage/.test(path)) {
                            window.location.href = '/HistoryPage';
                        }
                    },
                    onOk: () => {
                        window.location.href = '/VIP';
                    }
                })
            )
        }
    });
    localStorage.removeItem('examID');
}
////#endregion

////#region CCL Expert

export function checkCCLExpert(examID) {
    let { confirm } = Modal;
    return (
        confirm({
            title: '本次点评将消耗1张CCL点评券，确定使用吗？',
            cancelText: '取消',
            okText: '确定',
            centered: true,
            onCancel: () => {
                const path = document.location.pathname.toLowerCase();
                if (!/cclhistorypage/.test(path)) {
                    rc();
                    window.location.href = '/CCLHistoryPage';
                }
            },
            onOk: () => {
                ccluse(examID);
            }
        })
    )
}

//检查并使用CCL点评券
export function useCCLExpert(examID) {
    let token = localStorage.getItem('access_token');
    let userID = localStorage.getItem('userID');
    //let examID = JSON.parse(localStorage.getItem('examID'));

    if (token === null || userID === null) {
        l();
        return;
    }

    let formData = new FormData();
    formData.append('userID', userID);
    formData.append('examID', examID);

    axios({
        method: 'post',
        url: global.config.url + `User/UseExpertCCLTicket`,
        // url: `http://localhost:8000/User/UseExpertCCLTicket`,
        data: formData,
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        console.log(res);
        if (typeof res.headers.authorization !== 'undefined') {
            console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
            localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
        }
        if (res.data.msg === 'succeed') {
            console.log('成功');
            let { confirm } = Modal;
            return (
                confirm({
                    title: '点评券使用成功，老师正在奋力分析。请在模考记录查看进度。',
                    okText: '确定',
                    centered: true,
                    cancelButtonProps: { style: { display: 'none' } },
                    onOk: () => {
                        const path = document.location.pathname.toLowerCase();
                        if (!/cclhistorypage/.test(path)) {
                            rc();
                        }
                        window.location.href = '/CCLHistoryPage';
                    }
                })
            )
        } else {
            s('点评券使用失败');
        }
    }).catch(err => {
        console.log(err);
        console.log(err.response);
        //Token过期
        if (typeof err.response !== 'undefined' && err.response.status === 401) {
            l();
        } else if (err.response.status === 400 && err.response.data.msg === 'lack of voucher') {
            let { confirm } = Modal;
            return (
                confirm({
                    title: '您的CCL点评券不足',
                    content: '购买后请在模考记录使用',
                    cancelText: '取消',
                    okText: '前往购买',
                    centered: true,
                    onCancel: () => {
                        const path = document.location.pathname.toLowerCase();
                        if (!/cclhistorypage/.test(path)) {
                            window.location.href = '/CCLHistoryPage';
                        }
                    },
                    onOk: () => {
                        window.location.href = '/VIP';
                    }
                })
            )
        }
    });
    localStorage.removeItem('examID');
}
////#endregion


//放弃考试api
export function giveup(type) {
    let token = localStorage.getItem('access_token');
    let examID = null;
    if (type === 'ielts') {
        examID = JSON.parse(localStorage.getItem('examID'));
    } else if (type === 'pte') {
        examID = JSON.parse(localStorage.getItem('examIDPTE'));
    } else if (type === 'ccl') {
        examID = JSON.parse(localStorage.getItem('examIDCCL'));
    }

    if (examID !== null && token !== null) {

        let formData = new FormData();
        formData.append('examID', examID);
        formData.append('type', type);

        axios({
            method: 'post',
            url: global.config.url + `User/Giveup`,
            data: formData,
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            console.log(res);
            if (typeof res.headers.authorization !== 'undefined') {
                console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
            }
            if (res.data.msg === 'succeed') {
                console.log('成功');
                if (type === 'ielts') {
                    ri();
                } else if (type === 'ccl') {
                    rc();
                }
                window.location.reload();
            }
        }).catch(err => {
            console.log(err);
            //Token过期
            if (typeof err.response !== 'undefined' && err.response.status === 401) {
                l();
            }
        });


    }
}

export const doubleArr =
    <svg t="1602300216549" className="icon" viewBox="0 0 1024 1024" version="1.1" fill="white" xmlns="http://www.w3.org/2000/svg" p-id="13797" width="15" height="20" preserveAspectRatio="none">
        <path d="M512.03799 0 921.675981 411.648 102.4 411.648 512.03799 0ZM512.03799 995.328 102.4 583.68 921.675981 583.68 512.03799 995.328Z" p-id="13798" />
    </svg>;

export const upArr =
    <svg t="1602300216549" className="icon" viewBox="0 0 1024 1024" version="1.1" fill="white" xmlns="http://www.w3.org/2000/svg" p-id="13797" width="15" height="20" preserveAspectRatio="none">
        <path d="M473.6 300.8 134.4 633.6c-6.4 6.4 0 25.6 12.8 25.6l729.6 0c12.8 0 19.2-12.8 12.8-25.6L550.4 300.8C531.2 275.2 492.8 275.2 473.6 300.8z" p-id="14058" />
    </svg>;

export const downArr =
    <svg t="1602300216549" className="icon" viewBox="0 0 1024 1024" version="1.1" fill="white" xmlns="http://www.w3.org/2000/svg" p-id="13797" width="15" height="20" preserveAspectRatio="none">
        <path d="M473.6 704 134.4 364.8C128 358.4 134.4 339.2 147.2 339.2l729.6 0c12.8 0 19.2 12.8 12.8 25.6L550.4 704C531.2 723.2 492.8 723.2 473.6 704z" p-id="14188" />
    </svg>;
