import React, { Component } from 'react'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import '../App.css';

const axios = require('axios')
const QRCode = require('@qrcode/react')

export default class Display extends Component {
    constructor(props) {
        super(props)
        this.state = {
            render: false,
            token_meta: [],
            balance: 0,
            loading: true,
            results: [],
            reveal : false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    static contextType = HicetnuncContext

    componentDidUpdate = () => {
        console.log(this.context)
    }

    componentWillMount = async () => {
        this.context.setPath(window.location.pathname)
        console.log(this.context.getAuth())
        await axios.post(process.env.REACT_APP_UNGRUND_TZ, { // 3.129.20.231
            tz: this.context.getAuth()
        }).then(res => {
            console.log(res)
            this.setState({
                results: res.data.results,
                token_meta: res.data.token_meta,
                balance: res.data.balance,
                loading: false
            })
        })
    }

    handleSubmit = () => {

        this.setState({
            render: true
        })

    }

    /* 
        verify cookies auth <-> redis    
    */

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
            position: "absolute",
            marginTop: "20%",
            marginRight: "25px",
            fontFamiliy: "Roboto",
            textAlign: "right",
            fontSize: "40px"
        }

        let styleDisplay = {
            textAlign: "right",
            padding: '20% 0'
        }

        let dot1 = {
            height: "3px",
            width: "3px",
            backgroundColor: "black",
            borderRadius: "50%",
            display: "inline-block",
            marginTop: "15px",
            marginLeft: "0px",
            left: "0",
            position: "absolute"
        }

        let dot2 = {
            height: "8px",
            width: "8px",
            backgroundColor: "black",
            borderRadius: "50%",
            display: "inline-block",
            marginTop: "7px",
            marginLeft: "7px",
            left: "0",
            position: "absolute"
        }

        let dao = {
            marginLeft: '25px'
        }

        let load = {
            backgroundColor: "black"
        }

        let cardStyle = {
            position: "absolute",
            listStyle: "none",
            top: "0",
            marginTop: "25%",
            fontFamiliy: "Roboto",
        }

        let subList = {
            listStyle: "none",
            fontSize: "26px"
        }

        const addr = window.location.pathname.split('/')[2]

        return (
            <div>
                {/*this.state.render ? <h3>{this.context.address}</h3> : null*/}
                {/*<button onClick={this.handleSubmit}>Teste</button>*/}
                <Row>
                    <Col sm="12" md={{ size: 6, offset: 3 }}>
                        <Card style={{ paddingTop: "45px", border: 0 }}>
                            {
                                !this.context.collapsed ?
                                    <ul style={style}> {/* style={drodiv} */}
                                        <li><a style={{
                                            color: "#000",
                                            fontStyle: "italic",
                                            "&:hover": {
                                                color: "#000"
                                            }
                                        }} href="/feed">feed</a></li>
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
                                                </ul>
                                                :
                                                null
                                        }
                                        <li><a style={{
                                            color: "#000",
                                            "&:hover": {
                                                color: "#000"
                                            }
                                        }} href="/sync">sync</a></li>
                                        <li><a style={{
                                            color: "#000",
                                            "&:hover": {
                                                color: "#000"
                                            }
                                        }} href="/about">about</a></li>
                                    </ul>
                                    :
                                    <div>
                                        <Card style={{ border: 0 }}>
                                            <Row xs="2">
                                                <Col>
                                                    <div style={{ cardStyle }}>

                                                        <QRCode value={addr} size={150} />
                                                        {/* this.context.getBalance(addr) */}

                                                    </div>
                                                </Col>
                                                <Col>
                                                    <div style={styleDisplay}>
                                                        <a href={`https://tzkt.io/${addr}`}>{addr}</a><br />
                                                        {this.state.balance} ꜩ
                                        </div>
                                                </Col>

                                            </Row>
                                        </Card>
                                        <Card style={{ border: 0, marginTop: '3%' }}>
                                            <p style={{ "fontWeight": "bold" }}>
                                                Resources
                                                            </p>
                                        </Card>
                                        <Card style={{ border: 0, marginLeft: '2%', marginTop: '3%' }}>
                                            {
                                                !this.state.loading ? this.state.results.length != 0 ?
                                                    this.state.results.map(e => {
                                                        return (
                                                            <div >
                                                                <Card style={{ border: 0 }}>
                                                                    <CardTitle><a rel="noopener noreferrer" href={`http://localhost:3000/kt/${e.address}`}>{`${e.address}`}</a></CardTitle>

                                                                    <Row xs="2" style={{ fontSize: '12px' }}>
                                                                        <Col>min</Col>
                                                                        <Col>{e.storage.time_lock}</Col>
                                                                        <Col>goal</Col>
                                                                        <Col>{e.storage.goal} ꜩ</Col>
                                                                        <Col>contributions</Col>
                                                                        <Col>{e.balance / 1000000} ꜩ</Col>

                                                                    </Row>
                                                                    <Row xs="2" style={{ fontSize: '12px' }}>
                                                                        <Col></Col>
                                                                        <Col style={{ fontSize: '20px' }}>{e.percentage} %</Col>
                                                                    </Row>

                                                                    <div style={{ backgroundColor: 'black', width: e.percentage, height: "5px" }}></div>
                                                                </Card>
                                                            </div>
                                                        )
                                                    })
                                                    :
                                                    <p>none</p>
                                                    :
                                                    <div>
                                                        <p>loading...</p>
                                                        <div style={load}>

                                                        </div>
                                                    </div>
                                            }
                                        </Card>
                                        <Card style={{ border: 0, marginTop: '3%', marginLeft: '2%' }}>
                                            {this.state.token_meta.map(e => {
                                                if (e != null)
                                                    return (
                                                        <div>
                                                            <div style={dot1}></div>
                                                            <div style={dot2}></div>
                                                            <div style={dao}>
                                                                {e.balance} hicetnuncDAO#{e.id}
                                                            </div>
                                                        </div>
                                                    )
                                            })}
                                        </Card>
                                    </div>
                            }
                        </Card>

                    </Col>
                </Row>
            </div>
        )
    }
}
