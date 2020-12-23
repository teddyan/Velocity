import React from 'react';
import { FullPage, Slide } from 'react-full-page';
import FirstGuide from "./FirstGuide";
import FourthGuide from './FourthGuide';
import SecondGuide from "./SecondGuide";
import ThirdGuide from "./ThirdGuide";


export default class FullGuide extends React.Component {

    beforeChange = (e)=>{
        console.log(e);
        if(e.from===0){
            let video = document.getElementById('video1');
            if(video!==null&&!video.paused){
                video.pause();
            }
        }else if(e.from===1){
            let video = document.getElementById('video2');
            if(video!==null&&!video.paused){
                video.pause();
            }
        }
    }

    // afterChange = (e) =>{
    //     console.log(e);
    //     if(e.to===0){
    //         let video = document.getElementById('video1');
    //         if(video!==null&&video.paused){
    //             video.play();
    //         }
    //     }else if(e.to===1){
    //         let video = document.getElementById('video2');
    //         if(video!==null&&video.paused){
    //             video.play();
    //         }
    //     }
    // }

    render() {
        return (
            <FullPage beforeChange={this.beforeChange} duration={1000}>
                <Slide>
                    <FirstGuide/>
                </Slide>
                <Slide>
                    <SecondGuide/>
                </Slide>
                <Slide>
                    <ThirdGuide/>
                </Slide>
                <Slide>
                    <FourthGuide/>
                </Slide>
             
            </FullPage>
        );
    }
}