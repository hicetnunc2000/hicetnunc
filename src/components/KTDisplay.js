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
            kt: {},
            kt_addr: '',
            contributeToogle: false,
            contribution: 0,
            withdraw: 0,
            withdrawToogle: false,
            linktreeToogle: false

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

    submitContribution = async () => {

        await axios.post(process.env.REACT_APP_UNGRUND_CONTRIBUTE, {
            kt: window.location.pathname.split('/')[2],
            tz: this.context.getAuth(),
            amount: this.state.contribution
        }).then(res => {
            console.log(res)
            this.context.operationRequest(res.data)
        })

    }

    submitWithdraw = async () => {

        await axios.post(process.env.REACT_APP_UNGRUND_WITHDRAW, {
            kt: window.location.pathname.split('/')[2],
            tz: this.context.getAuth(),
            amount: this.state.withdraw
        }).then(res => {
            this.context.operationRequest(res.data)
        })

    }

    withdraw = () => {
        this.setState({
            withdrawToogle: !this.state.withdrawToogle
        })
    }

    contribute = () => {
        this.setState({
            contributeToogle: !this.state.contributeToogle
        })
    }

    linktree = () => {
        this.setState({
            linktreeToogle : !this.state.linktreeToogle
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
                                                <CardTitle style={{fontWeight:"bold"}}>{this.state.kt.title}//<a rel="noopener noreferrer" href={`https://better-call.dev/mainnet/${this.state.kt.address}`}>{`${this.state.kt.address}`}</a></CardTitle>
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
                                                    <Col onClick={this.contribute}>+contribute</Col>
                                                    {
                                                        this.state.contributeToogle ?
                                                            <Card style={{ border: 0, marginTop: '3%' }}>
                                                                <input type="text" name="contribution" onChange={this.handleChange} placeholder="ꜩ amount"></input>
                                                                <button onClick={this.submitContribution}>contribute</button>
                                                            </Card> : null
                                                    }
                                                    <Col onClick={this.withdraw}>+withdraw</Col>
                                                    {
                                                        this.state.withdrawToogle ?
                                                            <Card style={{ border: 0, marginTop: '3%' }}>
                                                                <input type="text" name="withdraw" onChange={this.handleChange} placeholder="ꜩ amount"></input>
                                                                <button onClick={this.submitWithdraw}>withdraw</button>
                                                            </Card> : null
                                                    }
                                                    <Col onClick={this.linktree}>+linktree</Col>
                                                    {
                                                    this.state.linktreeToogle ?
                                                    this.state.kt.links.map(e => {
                                                        return (
                                                            <Col style={{ marginTop: '3%', backgroundColor: 'black', fontSize: '20px', textAlign: 'center' }}><a style={{ color: 'white' }} href={e.url}>{e.placeholder}</a></Col>
                                                        )
                                                    }) : null
                                                    }
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
                                    fontStyle: "italic",
                                    "&:hover": {
                                        color: "#000"
                                    }
                                }} href='/feed'>smartfeed</a></li>
                                <li style={{
                                    color: "#000",
                                    textDecoration: "line-through"
                                }} >update metadata</li>
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
