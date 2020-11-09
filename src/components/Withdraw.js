import React, { Component } from 'react'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { Card, Col, Row, CardTitle, CardText } from 'reactstrap'
const axios = require('axios')

export default class Withdraw extends Component {

    constructor(props) {
        super(props)

        this.state = {
            amount: 0,
            loading: true
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

        await axios.post(process.env.REACT_APP_UNGRUND_WITHDRAW, {
            kt: window.location.pathname.split('/')[2],
            tz: this.context.getAuth(),
            amount: this.state.amount
        }).then(res => {
            this.context.operationRequest(res.data)
        })

    }

    render() {
        return (
            <Row>
                <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <div style={{ 'padding': '10% 0', animation: "fadeMe 1.2s" }}>
                        {this.state.loading ? <p>loading...</p> : <div>
                            {window.location.pathname.split('/')[2]}
                balance {this.state.kt.balance} µꜩ
                <Card style={{ border: 0, 'padding': '10% 0', animation: "fadeMe 1.2s" }}>
                                <input type="text" name="amount" onChange={this.handleChange} placeholder="ꜩ amount"></input>
                                <button onClick={this.submitForm}>withdraw</button>
                            </Card></div>}
                    </div>
                </Col>
            </Row>
        )
    }
}
