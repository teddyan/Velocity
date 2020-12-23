import React from 'react';
import { MDBFooter, MDBBtn, MDBIcon } from 'mdbreact';

const Footer = () => {
    return (
        <footer data-test="footer" className="page-footer light-blue text-center font-small" style={{zIndex:'2',position:'relative'}}>
            <p className="footer-copyright mb-0 py-3 text-center">
                &copy; {new Date().getFullYear()} Copyright <a href="https://www.MDBootstrap.com"> 迅达英语 </a>
            </p>
        </footer>
    );
}

export default Footer;