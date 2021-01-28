import React, { Component } from 'react'
import { Card, Col, Row, CardTitle, CardText } from 'reactstrap'
import { HicetnuncContext } from '../context/HicetnuncContext'
import Menu from './Menu'

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
//process.env.REACT_APP_UNGRUND_FEED
        await axios.get(process.env.REACT_APP_UNGRUND_FEED).then(res => {
            console.log(res.data.result)
            res.data.result.map(e => console.log(e))
            this.setState({
                results: res.data.result,
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
                                    <div>
                                        <div style={{ animation: "fadeMe 1.2s" }}>
                                            <p style={{ 'padding': '5% 0', border: 0 }}>{this.state.results.length} micro fundings</p>
                                            {
                                                this.state.loading ? <p style={{ border: 0, animation: "fadeMe 1.2s" }}>loading...</p> : this.state.results.length == 0 ? <p>none</p> : undefined
                                            }
                                            {
                                                this.state.results.map((e) => {

                                                    return (
                                                        <div >
                                                            <Card style={{ border: 0 }}>
                                                                <CardTitle style={{ fontWeight: 'bold' }}>{e.meta.result.title.toLowerCase()}//<a rel="noopener noreferrer" href={'/kt/' + e.address}>{e.address}</a></CardTitle>
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
                                    </div>

                                    :
                                    <Menu />
                            }
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
