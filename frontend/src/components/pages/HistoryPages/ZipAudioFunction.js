import React from 'react';

import axios from 'axios';
import { saveAs } from 'file-saver';



export function DownloadZipFile(UserExamID) {
    // use Temp Array to store Speaking Audio link
    let Speaking_Questions_1=[];
    let Speaking_Questions_2=[];
    let Speaking_Questions_3=[];

    let token = localStorage.getItem('access_token');

    axios.get(global.config.url + 'User/IELTSSpeakingHistoryAnswer?examID='+UserExamID, {
        headers: {Authorization: `Bearer ${token}`}
    }).then(res=>{
        console.log(res.data)
        // Speaking_Questions_1
        for (let i=0;i<res.data.data.SA1Audio.length;i++){
            // global.config.url +
            Speaking_Questions_1.push([res.data.data.SA1Audio[i]])
        }

        // Speaking_Questions_2
        Speaking_Questions_2.push([res.data.data.SA2Audio])


        // Speaking_Questions_3
        for (let i=0;i<res.data.data.SA3Audio.length;i++){
            // global.config.url +
            Speaking_Questions_3.push([res.data.data.SA3Audio[i]])
        }
        TriggerDownload();


    })

    // Call to retrieve the specific Audio
    async function getData(url){
        return await axios.get(url,{responseType: 'blob'});
    }

    // Download Zip Function
    async function TriggerDownload() {
        // use array to store Audio Name and Download info
        let filename=[]
        let fileData=[]

        // call JSZip library
        var JSZip = require("jszip");
        var zip = new JSZip();

        // Speaking_question 1
        for(let i=0;i<Speaking_Questions_1.length;i++) {
            // call to retrieve audio data
            var mp3 = await getData(global.config.url.slice(0,-1) + Speaking_Questions_1[i]);

            // push to array
            filename.push("Speaking_Q1_"+(i+1)+".mp3")
            fileData.push(mp3)
        }

        // Speaking_question 2
        for(let i=0;i<Speaking_Questions_2.length;i++) {
            // call to retrieve audio data

            var mp3 = await getData(global.config.url.slice(0,-1) + Speaking_Questions_2[i]);


            // push to array
            filename.push("Speaking_Q2_"+(i+1)+".mp3")
            fileData.push(mp3)
        }

        // Speaking_question 3
        for(let i=0;i<Speaking_Questions_3.length;i++) {
            // call to retrieve audio data
            var mp3 = await getData(global.config.url.slice(0,-1) + Speaking_Questions_3[i]);

            // push to array
            filename.push("Speaking_Q3_"+(i+1)+".mp3")
            fileData.push(mp3)
        }

        // load Audio name and Download Info to JSZip content
        for(let i=0;i<filename.length;i++) {
            zip.file(filename[i], fileData[i].data);
        }

        // Zip the audio
        zip.generateAsync({type: "blob"})
            .then(function (content) {
                // see FileSaver.js
                saveAs(content, "MockExam.zip");
            });

    }

}

export default DownloadZipFile;