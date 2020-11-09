import React, { Component } from 'react'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { Card, Col, Row, CardTitle, CardText } from 'reactstrap'

const axios = require('axios')

export default class KTDisplay extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            auth: '',
            contribution: '',
            kt: {},
            kt_addr: '',
            contribute: false
        }

    }

    static contextType = HicetnuncContext

    handleChange = (e) => {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    componentWillMount = () => {

        this.context.setPath(window.location.pathname.split('/')[2])

        axios.post(process.env.REACT_APP_UNGRUND_KT, {
            kt: window.location.pathname.split('/')[2]
        }).then(res => {
            console.log(res)
            this.setState({
                loading: false,
                kt: res.data
            })
        })

    }

    render() {

        return (
            <div>
                <Row>
                    <Col sm="12" md={{ size: 6, offset: 3 }}>
                        {this.context.collapsed ?
                            <Card style={{ border: 0, animation: "fadeMe 1.2s" }}>
                                {
                                    this.state.loading
                                        ?
                                        <div style={{ 'padding': '20% 0', border: 0, animation: "fadeMe 1.2s" }}>
                                            loading...
                                </div>
                                        :
                                        <div style={{ 'padding': '10% 0', border: 0, animation: "fadeMe 1.2s" }}>
                                            <Card style={{ border: 0 }}>
                                                <CardTitle><a rel="noopener noreferrer" href={`https://better-call.dev/mainnet/${this.state.kt.address}`}>{`${this.state.kt.title}`}</a></CardTitle>
                                                <CardText>{this.state.kt.description}</CardText>
                                            </Card>
                                            <Row xs="2" style={{ padding: '2% 0', fontSize: '12px' }}>
                                                <Col>author</Col>
                                                <Col><a rel="noopener noreferrer" href={'/tz/' + this.state.kt.storage.admin}>{`${this.state.kt.storage.admin}`}</a></Col>
                                                {/*                                             <Col>lock</Col>
                                            <Col>{this.state.kt.timestamp}</Col> */}
                                                <Col>goal</Col>
                                                <Col>{this.state.kt.storage.goal} ꜩ</Col>
                                                <Col>contributions</Col>
                                                <Col>{this.state.kt.balance / 1000000} ꜩ</Col>
                                            </Row>
                                            <Row xs="2" style={{ fontSize: '12px' }}>
                                                <Col></Col>
                                                <Col style={{ fontSize: '20px' }}>{this.state.kt.percentage} %</Col>
                                            </Row>
                                            <div style={{ backgroundColor: 'black', width: this.state.kt.percentage, height: "5px" }}></div>
                                            {this.state.kt.links.length > 0 ? 

                                            <Card style={{ 'padding': '10% 0', border: 0 }}>
                                                <Col>linktree</Col>
                                                {this.state.kt.links.map(e => {
                                                    return (
                                                        <Col style={{ marginTop: '3%', backgroundColor: 'black', fontSize: '20px', textAlign: 'center' }}><a style={{ color: 'white' }} href={e.url}>{e.placeholder}</a></Col>
                                                    )
                                                })}
                                            </Card>
                                            :
                                            null
                                            }
                                        </div>
                                }

                            </Card>
                            :
                            <ul style={this.context.menu}> 
                                <li><a style={{
                                    color: "#000",
                                    "&:hover": {
                                        color: "#000"
                                    }
                                }} href='/feed'>feed</a></li>
                                <li><a style={{
                                    color: "#000",
                                    "&:hover": {
                                        color: "#000"
                                    }
                                }} href={'/contribute/' + this.context.lastPath}>contribute</a></li>
                                <li style={{
                                    color: "#000",
                                    textDecoration: "line-through"
                                }} >withdraw</li>
                                <li style={{
                                    color: "#000",
                                    textDecoration: "line-through"
                                }} >update</li>
                                <li><a style={{
                                    color: "#000",
                                    "&:hover": {
                                        color: "#000"
                                    }
                                }} href='/about'>about</a></li></ul>
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}
