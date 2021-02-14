import React, { Component } from 'react'
import { Card, Col, Row, CardTitle, CardText, CardBody, CardImg } from 'reactstrap'
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
            back: '',
            curations: true,
            curations_arr: [],
            objkts_arr: []
        }

    }

    static contextType = HicetnuncContext

    componentWillMount = async () => {

        console.log(this.context.getAuth())

        this.setState({ back: `/tz/${this.context.getAuth()}` })

        const sample = 'KT1UMJwse4X8pXjSX1THZCNTDYCCiVLi5Gdv'
        //process.env.REACT_APP_UNGRUND_FEED

        //await axios.get(process.env.REACT_APP_UNGRUND_OBJKT_FEED).then(res => this.setState({ objkts_arr: res.data.result }))
        //'http://localhost:5000/objkt/ledger'
        await axios.post(process.env.REACT_APP_UNGRUND_OBJKT_LEDGER).then(res => {
            console.log(res.data.result)
            console.log(res.data)
            this.setState({ curations_arr: res.data.result, loading: false })
            //this.setState({ curations_arr: res.data.result, loading: false })
        })

        console.log(this.state)
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
                                        <div style={{ animation: "fadeMe 1.2s", paddingTop: '5%' }}>
                                            <div style={{ display: 'inline' }}>
                                                <span>curations // <a style={{
                                                    color: "#000",
                                                    fontStyle: "italic",
                                                    "&:hover": {
                                                        color: "#000"
                                                    }
                                                }} href='https://better-call.dev/mainnet/KT1M2JnD1wsg7w2B4UXJXtKQPuDUpU2L7cJH/operations'>KT1M2JnD1wsg7w2B4UXJXtKQPuDUpU2L7cJH</a></span>
                                            </div>
                                            {
                                                this.state.loading ? <p style={{ border: 0, animation: "fadeMe 1.2s", paddingTop: '5%' }}>loading...</p> : null
                                            }
                                            <div>
                                                {!this.state.loading ?
                                                    <div>
                                                                <Card style={{border : 0}}>
                                                                    {this.state.curations_arr.map(e => {
                                                                        return (
                                                                            <div style={{ border: 0, paddingTop: '5%' }}>
                                                                                <div style={{ display: 'inline'}}>
                                                                                    {e.metadata.formats[0].mimeType == 'video/mp4' ?
                                                                                        <div style={{ paddingTop: '2%', display: 'table', margin: '0 auto' }}>
                                                                                            <video className='media' src={e.metadata.artifactUri} controls></video>
                                                                                        </div>
                                                                                        :
                                                                                        <div style={{ paddingTop: '2%', display: 'table', margin: '0 auto' }}>
                                                                                            <img className='media'  src={e.metadata.artifactUri} />
                                                                                        </div>
                                                                                    }<a style={{
                                                                                        color: "#000",
                                                                                        fontStyle: "italic",
                                                                                        "&:hover": {
                                                                                            color: "#000"
                                                                                        }
                                                                                    }} href={'/objkt/' + e.tk_id}>OBJKT#{e.tk_id}</a>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </Card>
                                                    </div> : null}

                                            </div>
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
