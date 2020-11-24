import React, { Component } from 'react'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { Card, Col, Row } from 'reactstrap'

export default class Home extends Component {

    constructor(props) {
        super(props)

        this.state = {
            reveal: false
        }
    }

    static contextType = HicetnuncContext

    reveal = () => {
        this.setState({
            reveal: !this.state.reveal
        })
    }

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
            fontSize: "40px"
        }

        let subList = {
            listStyle: "none",
            fontSize: "26px"
        }

        let cardStyle = {
            position: "absolute",
            listStyle: "none",
            top: "0",
            marginTop: "25%",
            fontFamiliy: "Roboto",
            border: "0"
        }



        return (
            
            <Row>
                <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <Card style={{ border: 0 }}> {/* { border: "none" } */}
                        {
                            !this.context.collapsed & this.context.address === "" ?
                                <ul style={this.context.menu}> {/* style={drodiv} */}
                                    <li><a style={{
                                        color: "#000",
                                        fontStyle: "italic",
                                        "&:hover": {
                                            color: "#000"
                                        }
                                    }} href="/feed">feed</a></li>
                                    <li><a style={{
                                        color: "#000",
                                        "&:hover": {
                                            color: "#000"
                                        }
                                    }} href="#" onClick={this.reveal}>smart contracts</a></li>
                                    {
                                        this.state.reveal ?
                                            <ul style={subList}>
                                                <li><a style={{
                                                    color: "#000",
                                                    "&:hover": {
                                                        color: "#000"
                                                    }
                                                }} href="/opensource" onClick={this.reveal}>hicetnuncDAO</a></li>
                                                <li style={{ textDecoration: "line-through" }}>hicetnuncNFTs</li>
                                            </ul>
                                            :
                                            null
                                    }
                                    <li><a style={{
                                                color: "#000",
                                                "&:hover": {
                                                    color: "#000"
                                                }
                                            }} href='/ipfs'>IPFS
                                            </a></li>
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
                                    }} href="/about">about</a></li>
                                </ul>
                                :
                                <Card style={cardStyle}>
                                    <div style={{ fontSize: "60px", left: 0 }}>
                                        terraforming virtual realities
                                </div></Card>
                        }
                    </Card>
                </Col>
            </Row >
        )
    }
}
