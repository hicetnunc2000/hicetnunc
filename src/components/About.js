import React, { Component } from 'react'
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { HicetnuncContext } from '../context/HicetnuncContext'


export default class About extends Component {
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

        let subList = {
            listStyle: "none",
            fontSize: "26px"
        }

        let style = {
            position: "absolute",
            listStyle: "none",
            right: "0",
            top: "0",
            marginTop: "15%",
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
                                            }} href="/opensource" onClick={this.reveal}>micro funding</a></li>
                                            <li style={{ textDecoration: "line-through" }}>NFTs</li>
                                        </ul>
                                        :
                                        null
                                }
                                <li><a style={{
                                    color: "#000",
                                    "&:hover": {
                                        color: "#000"
                                    }
                                }} href="/ipfs">IPFS</a></li>
                                <li><a style={{
                                    color: "#000",
                                    "&:hover": {
                                        color: "#000"
                                    }
                                }} href="/sync">manage assets</a></li>
                                <li><a style={{
                                    color: "#000",
                                    "&:hover": {
                                        color: "#000"
                                    }
                                }} href="/about">about</a></li>
                            </ul>
                            :
                            <div style={{ animation: "fadeMe 1.2s" }}>

                                <div style={{ 'padding': '15% 0', border: 0, textAlign: 'justify' }}>
                                    <p style={{ 'fontWeight': 'bold' }}>

                                    </p>
                                    <p style={{ fontWeight: 'bold' }}>
                                        hicetnuncDAOs//hicetnuncNFTs//ungrund//hesychasm stack
                                    </p>
                                    <p>
                                        this decentralized application allows it's users to manage decentralized digital assets, originate micro fundings as DAOs (Decentralized Autonomous Organisations), minting NFTs, taking part on prediticion markets.
                                        serving as a public, open source and sustainable smart contract infrastructure on Tezos.
                                    </p>
                                    <p>
                                        in this experiment a variety of smart contracts and distributed systems are intended to be designed in collaboration with decentralized communities. one should manage and care for the social and economical strategies for it's own DAO.
                                    </p>
                                    <p>we're concerned about your security and autonomy. please verify informations while making transactions.</p>
                                    <p>for consulting, networking or questions:</p>
                                    <p>hicetnunc2000@protonmail.com</p>
                                    <a style={{
                                        color: "#000",
                                        "&:hover": {
                                            color: "#000"
                                        }
                                    }}
                                        href='https://github.com/hicetnunc2000'>github.com/hicetnunc2000</a>
                                </div>

                            </div>
                    }
                </Col>
            </Row>
        )
    }
}
