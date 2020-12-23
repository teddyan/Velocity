import React from 'react';
import logo from "../img/logo.jpeg";
import { MDBListGroup, MDBListGroupItem, MDBIcon } from 'mdbreact';
import { NavLink } from 'react-router-dom';

const TopNavigation = () => {
    return (
        <div className="sidebar-fixed position-fixed">
            <a href="#!" className="logo-wrapper waves-effect">
                <img alt="MDB React Logo" className="img-fluid" src={logo}/>
            </a>
            <MDBListGroup className="list-group-flush">
                <NavLink exact to="/" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="home" className="mr-3"/>
                        首页
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/ielts" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="edit" className="mr-3"/>
                        雅思模考
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/tables" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="edit" className="mr-3"/>
                        PTE模考
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/maps" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="edit" className="mr-3"/>
                        CCL模考
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/404" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="user-alt" className="mr-3"/>
                        个人中心
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/404" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="cart-plus" className="mr-3"/>
                        VIP券
                    </MDBListGroupItem>
                </NavLink>
            </MDBListGroup>
        </div>
    );
}

export default TopNavigation;