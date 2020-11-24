
import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, Component } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { HicetnuncContext } from '../context/HicetnuncContext';
import { Card, Col, Row } from 'reactstrap'
import { keyframes } from "styled-components";
import {hic} from '../media/hicetnuncfinal20202.png'
const axios = require('axios')



export default class AppNavbar extends Component {

    constructor(props) {
        super(props)
    }
    static contextType = HicetnuncContext

    render() {

        let drop = {
            fontSize: "25px",
            marginTop: "150%",
            marginRight: "35px",
            textAlign: "right"

        }

        var grow = keyframes`
        from { transform: scale(0.25); }
        to { transform: scale1; }
    `;

        let dot = {
            height: "30px",
            width: "30px",
            backgroundColor: "black",
            borderRadius: "50%",
            display: "inline-block",
            marginTop : "10px",
            marginRight : "25px",
            right : "0",
            top: "0",
            position : "absolute",
            animation : `${grow} 3s infinite`
        }

        let logo = {
            right : "0",
            position : "absolute",
            top : "0",
            marginTop : "13px",
            marginRight : "70px",
            color : "#000",
            "&:hover" : {
                color : "#000"
            }
        }
        return (
            <div>
                <Row>
                    <Col sm="12" md={{ size: 6, offset: 3 }}>
                        <Card body style={{border:"0", marginTop : '5px'}}> {/* { border: "none" } */}
                            <a href="/" style={logo}> /// </a><div onClick={this.context.toogleNavbar} style={dot}></div>
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