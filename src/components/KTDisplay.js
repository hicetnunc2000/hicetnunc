import React, { Component } from 'react'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { Card, Col, Row, CardTitle, CardText } from 'reactstrap'
//import Withdraw from './microfunding/Withdraw'
import UpdateMetadata from './microfunding/UpdateMetadata'
import Menu from './Menu'

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
            linktreeToogle: true

        }

    }

    static contextType = HicetnuncContext

    handleChange = (e) => {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    entrypoints = (e) => {

        switch (e) {
            case "metadata":
                console.log("metadata")
            //return <UpdateMetadata />
            case "withdraw":
            default:

        }
    }

    componentWillMount = () => {

        this.context.setPath(window.location.pathname.split('/')[2])
        this.context.pathname = window.location.pathname.split('/')[2]
        console.log(this.context.pathname)
        axios.post(process.env.REACT_APP_UNGRUND_KT, {
            kt: window.location.pathname.split('/')[2]
        }).then(res => {
            console.log(res.data)
            this.setState({
                loading: false,
                kt: res.data
            })
        })

    }

    submitContribution = async () => {
        if (this.context.client == null) {
            alert('sync')
        } else {
            await axios.post(process.env.REACT_APP_UNGRUND_CONTRIBUTE, {
                kt: window.location.pathname.split('/')[2],
                tz: this.context.getAuth(),
                amount: this.state.contribution
            }).then(res => {
                console.log(res)
                this.context.operationRequest(res.data)
            })
        }
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
            withdrawToogle: true,
            linktreeToogle: false,
            contributeToogle: false


        })
    }

    contribute = () => {
        this.setState({
            contributeToogle: true,
            linktreeToogle: false,
            withdrawToogle: false


        })
    }

    linktree = () => {
        this.setState({
            linktreeToogle: true,
            withdrawToogle: false,
            contributeToogle: false

        })
    }

    /*     linktree = () => {
            this.setState({
                linktreeToogle: !this.state.linktreeToogle
            })
        } */

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
                                                <CardTitle style={{ fontWeight: "bold" }}>{this.state.kt.meta.result.title}//<a rel="noopener noreferrer" href={`https://better-call.dev/mainnet/${this.state.kt.address}`}>{`${this.state.kt.address}`}</a></CardTitle>
                                                <CardText>{this.state.kt.meta.result.description}</CardText>
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
                                            {this.state.kt.meta.result.links.length > 0 ?

                                                <Card style={{ 'padding': '10% 0', border: 0 }}>


                                                    <Col style={{ display: 'inline' }}>
                                                        <span onClick={this.linktree}>linktree</span>
                                                        <span style={{ paddingLeft: '25px' }} onClick={this.contribute}>+contribute</span>
                                                        {
                                                            this.context.address == this.state.kt.storage.admin ? <span style={{ paddingLeft: '25px' }} onClick={this.withdraw}>-withdraw</span> : null
                                                        }
                                                    </Col>
                                                    {
                                                        this.state.withdrawToogle ?
                                                            <Card style={{ border: 0, marginTop: '3%' }}>
                                                                <input type="text" name="withdraw" onChange={this.handleChange} placeholder="ꜩ amount"></input>
                                                                <button onClick={this.submitWithdraw}>withdraw</button>
                                                            </Card> : null
                                                    }
                                                    {
                                                        this.state.contributeToogle ?
                                                            <Card style={{ border: 0, marginTop: '3%' }}>
                                                                <input type="text" name="contribution" onChange={this.handleChange} placeholder="ꜩ amount"></input>
                                                                <button onClick={this.submitContribution}>contribute</button>
                                                            </Card> : null
                                                    }
                                                    {
                                                        this.state.linktreeToogle ?
                                                            this.state.kt.meta.result.links.map(e => {
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
                            <Menu />
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}
