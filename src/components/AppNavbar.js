
import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, Component } from 'react';
import { Redirect } from 'react-router-dom'
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { HicetnuncContext } from '../context/HicetnuncContext';
import { Card, Col, Row } from 'reactstrap'
import { keyframes } from "styled-components";
const axios = require('axios')



export default class AppNavbar extends Component {

    constructor(props) {
        super(props)
    }
    static contextType = HicetnuncContext

    componentWillMount = () => {
        console.log(window.location.pathname)
    }

    render() {

        let drop = {
            fontSize: "25px",
            marginTop: "150%",
            marginRight: "35px",
            textAlign: "right"
        }

        var grow = keyframes`
        from { transform: scale(0.225); }
        to { transform: scale(1); }
    `;

        let left = {
            height: "30px",
            width: "30px",
            //borderRadius: "50%",
            display: "inline-block",
            marginTop: "10px",
            marginRight: "25px",
            right: "0",
            top: "0",
            position: "absolute"
            //animation: `${grow} 3.5s infinite`
        }

        let dot = {
            height: "25px",
            width: "25px",
            borderRadius: "50%",
            backgroundColor: 'black',
            display: "inline-block",
            top: '0',
            marginTop: '13px',
            position: 'absolute'

            /* animation: `${grow} 6s infinite` */
        }

        let logoLetters = {
            fontSize: "20px",
            top: '0',
            marginLeft: '40px',
            marginTop: '13px',
            position: 'absolute',
            color: "#000",
            fontStyle: "normal",
            "&:hover": {
                color: "#000"
            }
        }

        let logo = {
            right: "0",
            position: "absolute",
            fontFamily: 'courier',
            top: "0",
            marginTop: "15px",
            marginRight: "70px",
            color: "#000",
            "&:hover": {
                color: "#000"
            }
        }
        return (
            <div>
                <Row>
                    <Col sm="12" md={{ size: 6, offset: 3 }}>
                        <Card body style={{ border: "0", marginTop: '5px' }}> {/* { border: "none" } */}
                            <a style={dot} href='/'></a>
                            {!this.context.collapsed || window.location.pathname != '/' ? <a href="/" style={logoLetters}>hicetnunc</a> : null}

                            <a href="#" style={logo} onClick={this.context.syncTaquito}>sync</a>
                            {/* <a href="#" style={logo} onClick={this.context.dAppClient}>sync</a> */}
                            <div onClick={this.context.toogleNavbar}>
                                <a href='#'><img style={left} src={require('../media/menu-black-18dp.svg')} /></a>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
/*
<div>
<Navbar color="faded" light>
    <NavbarBrand href="/" className="mr-auto" id="font">hicetnunc</NavbarBrand>
    <NavbarToggler style={{ border: "none" }} onClick={this.toogle} className="mr-2" />
</Navbar>
</div>   */