import React, { Component } from 'react'
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { HicetnuncContext } from '../context/HicetnuncContext'


export default class About extends Component {
    static contextType = HicetnuncContext
    render() {

        let style = {
            position: "absolute",
            listStyle: "none",
            right: "0",
            top: "0",
            marginTop: "20%",
            marginRight: "25px",
            fontFamiliy: "Roboto",
            textAlign: "right",
            fontSize: "40px",
            animation: "fadeMe 1.2s"
        }

        return (
            <Row>
                <Col sm="12" md={{ size: 6, offset: 3 }}>
                    {
                        !this.context.collapsed ?
                            <ul style={style}> {/* style={drodiv} */}
                                <li><a style={{
                                    color: "#000",
                                    "&:hover": {
                                        color: "#000"
                                    }
                                }} href="/feed">feed</a></li>
                                <li><a style={{
                                    color: "#000",
                                    "&:hover": {
                                        color: "#000"
                                    }
                                }} href="/sync">sync</a></li>
                                <li><a style={{
                                    color: "#000",
                                    "&:hover": {
                                        color: "#000"
                                    }
                                }} href="https://github.com/hicetnunc2000">github</a></li>
                            </ul>
                            :
                            <div style={{ animation: "fadeMe 1.2s" }}>

                                <div style={{ 'padding': '25% 0', border: 0 , textAlign:'justify'}}>
                                    <p>
                                        1 ꜩ address = ∞ hicetnuncDAOs
                                    </p>
                                    <p>
                                        this decentralized application allows its users to originate micro fundings as DAOs (Decentralized Autonomous Organisations)
                                        serving as a public, open source and sustainable smart contract infrastructure on Tezos.
                                    </p>
                                    <p>
                                        a variety of smart contracts and distributed systems are intended to be designed in collaboration decentralized communities. one should manage and care for social and economical traction and strategies for it's own DAO. 
                                    </p>
                                    <p>we're concerned about your security and autonomy. please verify informations while making transactions.</p>
                                    <p>for consulting, networking or questions:</p>
                                    <p>hicetnunc2000@protonmail.com</p>
                                </div>

                            </div>
                    }
                </Col>
            </Row>
        )
    }
}
