import React, { Component } from 'react'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { Card, Col, Row, CardTitle, CardText } from 'reactstrap'

const axios = require('axios')

export default class Contribution extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            kt: {},
            contribution: 0
        }
    }

    static contextType = HicetnuncContext

    handleChange = (e) => {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    componentWillMount = () => {
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

    submitForm = async () => {

        await axios.post(process.env.REACT_APP_UNGRUND_CONTRIBUTE, {
            kt: window.location.pathname.split('/')[2],
            tz: this.context.getAuth(),
            amount: this.state.contribution
        }).then(res => {
            this.context.operationRequest(res.data)
        })

    }

    render() {

        return (
            <Row>
                <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <div>
                        {this.state.loading ?
                            <div style={{ 'padding': '10% 0', animation: "fadeMe 1.2s" }}>
                                <p>loading...</p>
                            </div> :
                            <div>
                                <div style={{ 'padding': '10% 0', border: 0, animation: "fadeMe 1.2s" }}>
                                    <Card style={{ border: 0 }}>
                                        <CardTitle><a style={{
                                            color: "#000",
                                            "&:hover": {
                                                color: "#000"
                                            }
                                        }} rel="noopener noreferrer" href={`https://better-call.dev/mainnet/${this.state.kt.address}`}>{`${this.state.kt.title}`}</a></CardTitle>
                                        <CardText>{this.state.kt.description}</CardText>
                                    </Card>
                                    <Row xs="2" style={{ padding: '2% 0', fontSize: '12px' }}>
                                        <Col>author</Col>
                                        <Col><a style={{
                                            color: "#000",
                                            "&:hover": {
                                                color: "#000"
                                            }
                                        }} rel="noopener noreferrer" href={'/tz/' + this.state.kt.storage.admin}>{`${this.state.kt.storage.admin}`}</a></Col>
                                        {/*                                             <Col>lock</Col>
                                            <Col>{this.state.kt.timestamp}</Col> */}
                                        <Col>goal</Col>
                                        <Col>{this.state.kt.storage.goal} ꜩ</Col>
                                        {/*                                             <Col>contributions</Col>
                                            <Col>{this.state.kt.balance / 1000000} ꜩ</Col> */}
                                    </Row>
                                    <Row xs="2" style={{ fontSize: '12px' }}>
                                        <Col></Col>
                                        <Col style={{ fontSize: '20px' }}>{this.state.kt.percentage} %</Col>
                                    </Row></div>
                                <div style={{ backgroundColor: 'black', width: this.state.kt.percentage, height: "5px" }}></div>
                                <Card style={{ border: 0, marginTop: '3%' }}>
                                    <input type="text" name="contribution" onChange={this.handleChange} placeholder="ꜩ amount"></input>
                                    <button onClick={this.submitForm}>contribute</button>
                                </Card>
                            </div>
                        }

                    </div>
                </Col>
            </Row>
        )
    }
}
