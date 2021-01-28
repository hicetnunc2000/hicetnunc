import React, { Component } from 'react'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { Redirect } from 'react-router-dom'

const axios = require('axios')

export default class Sync extends Component {

    constructor(props) {
        super(props)
    }

    static contextType = HicetnuncContext

    /* 
    initializes session
    */

    componentWillMount = async () => {
        this.context.dAppClient()
    }

    refresh = async () => {
        window.location.reload()
    }

    render() {

        let load = {
            border: "black"
        }

        let style = {
            position: "absolute",
            listStyle: "none",
            top: "0",
            marginTop: "20%",
            border: "0"
        }

        return (
            <div>
                {
                    this.context.address != "" ?
                        <Redirect to={`/tz/${this.context.address}`} />
                        :
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <Card style={style}>
                                    <div style={{ fontSize: "25px" }} >
                                        requesting permissions <a href='/sync'>try again?</a>
                                    </div>
                                    <div style={load}>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                }
            </div>
        )
    }
}
