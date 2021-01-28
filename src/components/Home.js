import React, { Component } from 'react'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { Card, Col, Row } from 'reactstrap'
import '../index'
import Menu from './Menu'
import hic from '../media/hicetnuncfinal202022.png'

export default class Home extends Component {

    constructor(props) {
        super(props)

        this.state = {
            reveal: false
        }

    }

    static contextType = HicetnuncContext

    reveal = () => {
        this.setState({
            reveal: !this.state.reveal
        })
    }

    render() {

        let style = {
            position: "absolute",
            listStyle: "none",
            right: "0",
            top: "0",
            marginTop: "20%",
            marginRight: "25px",
            textAlign: "right",
            fontSize: "40px"
        }

        let subList = {
            listStyle: "none",
            fontSize: "26px"
        }

        let cardStyle = {
            position: "absolute",
            listStyle: "none",
            top: "0",
            marginTop: "22.5%",
            border: "0"
        }



        return (

            <Row>
                <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <Card style={{ border: 0 }}> {/* { border: "none" } */}
                        {
                            !this.context.collapsed ?
                                <Menu />
                                :
                                <Card style={cardStyle}>
                                    <div>
                                        <div style={{ fontFamily: "Courier New", fontSize: "38px", left: 0, marginTop: '5%' }}>
                                            hicetnunc
                                    </div>
                                        <div style={{ fontFamily: "Courier New", fontSize: "18px", left: 0, marginTop: '-2%' }}>
                                            decentralized digital assets
                                </div>
                                    </div>
                                </Card>
                        }
                    </Card>
                </Col>
            </Row >
        )
    }
}
