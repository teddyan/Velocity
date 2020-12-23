import React, {Component} from 'react';
import '../css/RectBackground.css';
import Bell from '../img/Christmas_Bell.png'
import Bulb from '../img/Christmas_Bulb.png'
import Candy from '../img/Christmas_Candy.png'
import Flake from '../img/Christmas_Flake.png'
import Gift from '../img/Christmas_gift.png'
import Ginger from '../img/Christmas_Ginger.png'
import GlassBall from '../img/Christmas_GlassBall.png'
import Glove from '../img/Christmas_Glove.png'
import Loli from '../img/Christmas_Loli.png'
import Santa from '../img/Christmas_Santa.png'
import Sled from '../img/Christmas_Sled.png'
import Snowman from '../img/Christmas_Snowman.png'
import Tree from '../img/Christmas_Tree.png'
import Wreath from '../img/Christmas_Wreath.png'




class RectBackground extends Component {

    render() {
        return (
            <div className="area" style={{position:'fixed',top:'0',left:'0',right:'0',zIndex:'-1'}}>
                <ul className="circles">
                    <li><img src={Flake} style={{width: '40px'}}/></li>
                    <li><img src={Ginger} style={{width: '70px'}}/></li>
                    <li><img src={GlassBall} style={{width: '80px'}}/></li>
                    <li><img src={Glove} style={{width: '80px'}}/></li>
                    <li><img src={Loli} style={{width: '89px'}}/></li>
                    <li><img src={Tree} style={{width: '40px'}}/></li>
                    <li><img src={Wreath} style={{width: '50px'}}/></li>
                    <li><img src={Snowman} style={{width: '60px'}}/></li>
                    <li><img src={Santa} style={{width: '80px'}}/></li>
                    <li><img src={Sled} style={{width: '90px'}}/></li>
                    <li><img src={Gift} style={{width: '60px'}}/></li>
                    <li><img src={Candy} style={{width: '30px'}}/></li>
                    <li><img src={Bulb} style={{width: '40px'}}/></li>
                    <li><img src={Bell} style={{width: '50px'}}/></li>
                    <li><img src={Candy} style={{width: '80px'}}/></li>
                    <li><img src={Loli} style={{width: '60px'}}/></li>
                    <li><img src={Flake} style={{width: '70px'}}/></li>
                    <li><img src={GlassBall} style={{width: '80px'}}/></li>
                    <li><img src={Flake} style={{width: '92px'}}/></li>
                    <li><img src={Flake} style={{width: '70px'}}/></li>
                    
                    {/* Part 2*/}
                    <li><img src={Flake} style={{width: '50px'}}/></li>
                    <li><img src={Ginger} style={{width: '54px'}}/></li>
                    <li><img src={GlassBall} style={{width: '40px'}}/></li>
                    <li><img src={Glove} style={{width: '60px'}}/></li>
                    <li><img src={Loli} style={{width: '30px'}}/></li>
                    <li><img src={Tree} style={{width: '80px'}}/></li>
                    <li><img src={Wreath} style={{width: '80px'}}/></li>
                    <li><img src={Snowman} style={{width: '80px'}}/></li>
                    <li><img src={Santa} style={{width: '80px'}}/></li>
                    <li><img src={Sled} style={{width: '80px'}}/></li>
                    <li><img src={Gift} style={{width: '80px'}}/></li>
                    <li><img src={Candy} style={{width: '80px'}}/></li>
                    <li><img src={Bulb} style={{width: '80px'}}/></li>
                    <li><img src={Bell} style={{width: '80px'}}/></li>
                    <li><img src={Candy} style={{width: '80px'}}/></li>
                    {/* Part 2 //#endregion */}
                      
                     {/* Test Christmas*/ }
                      {/* <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li>
                      <li><img src={candy} style={{width: '120px'}}/></li> */}
                </ul>
            </div>
        );
    }
}

export default RectBackground;