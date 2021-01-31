import React, { Component } from 'react'
import { Card, Col, Row } from 'reactstrap'

export default class Swap extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }

    componentDidMount = () => {
        console.log()
    }

    render() {
        return (
            <div>

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
                                <Card style={{ 'padding': '15% 0', border: 0, animation: "fadeMe 1.2s" }}>

                                    <input tpe="text" name="price_per_tk" onChange={this.handleChange} placeholder="ꜩ per token"></input>
                                    {/* tags */}
                                    <button onClick={this.submitForm}>swap offer</button>
                            This operations costs 0.5 ꜩ~

                        </Card>
                        }
                    </Col>
                </Row>

            </div>
        )
    }
}
