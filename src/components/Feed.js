import React, { Component } from 'react'
import { Card, Col, Row, CardTitle, CardText } from 'reactstrap'
import { HicetnuncContext } from '../context/HicetnuncContext'
var Router = require("react-router");

const axios = require('axios')

export default class Feed extends Component {

    constructor(props) {
        super(props)

        this.state = {
            results: [],
            loading: true,
            back: ''
        }

    }

    static contextType = HicetnuncContext

    componentWillMount = async () => {

        console.log(this.context.getAuth())

        this.setState({ back: `/tz/${this.context.getAuth()}` })

        const sample = 'KT1UMJwse4X8pXjSX1THZCNTDYCCiVLi5Gdv'

        await axios.get(process.env.REACT_APP_UNGRUND_FEED).then(res => {
            res.data.map(e => console.log(e))
            this.setState({
                results: res.data,
                loading: false
            })
        })
    }

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

        return (
            <div>
                <Row>
                    <Col sm="12" md={{ size: 6, offset: 3 }}>
                        <Card body style={{ border: 0, animation: "fadeMe 1.2s" }}>
                            {
                                this.context.collapsed ?
                                    <div style={{ animation: "fadeMe 1.2s" }}>
                                        <p style={{ 'padding': '5% 0', border: 0 }}>{this.state.results.length} hicetnuncDAOs</p>
                                        {
                                            this.state.results.map((e) => {

                                                return (
                                                    <div >
                                                        <Card style={{ border: 0 }}>
                                                            <CardTitle style={{fontWeight:'bold'}}>{e.meta.title.toLowerCase()}//<a rel="noopener noreferrer" href={'/kt/' + e.address}>{e.address}</a></CardTitle>
                                                            <Row xs="2" style={{ fontSize: '12px' }}>
                                                                <Col></Col>
                                                                <Col style={{ fontSize: '20px' }}>{e.percentage} %</Col>
                                                            </Row>
                                                            <div style={{ backgroundColor: 'black', width: e.percentage, height: "5px" }}></div>
                                                        </Card>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    :
                                    <ul style={this.context.menu}> {/* style={drodiv} */}
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
                                                    <li style={{ textDecoration: "line-through" }}>FA1.2</li>
                                                </ul>
                                                :
                                                null
                                        }
                                        <li><a style={{
                                            color: "#000",
                                            "&:hover": {
                                                color: "#000"
                                            }
                                        }} href='/about'>about</a></li>
                                    </ul>
                            }
                        </Card>
                        {
                            this.state.loading ? <p style={{ border: 0, animation: "fadeMe 1.2s" }}>loading...</p> : this.state.results.length == 0 ? <p>none</p> : undefined
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}
