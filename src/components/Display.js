import React, { Component } from 'react'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import {
    CardImg, CardGroup,
    CardSubtitle, CardBody
} from 'reactstrap';
import '../App.css';
import Menu from './Menu'

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
            reveal: false,
            objkts: []
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
        }).then(async res => {
            console.log(res.data)
            /*             await axios.post('http://localhost:5000/objk/tz', {
                            tz: this.context.getAuth()
                        }).then(async res => console.log(res)) */
            this.setState({
                results: res.data.results,
                token_meta: res.data.token_meta,
                balance: res.data.balance,
                loading: false
            })
        })

        await axios.post(process.env.REACT_APP_UNGRUND_OBJKT_TZ_LEDGER, {
            tz: this.context.getAuth()
        }).then(res => {
            this.setState({
                objkts: res.data.result
            })
        })
        console.log(this.state)
        await axios.post(process.env.REACT_APP_UNGRUND_OBJKT_TZ_SWAPS, {
            tz: this.context.getAuth()
        }).then(res => console.log(res.data))
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
            marginTop: "25%"
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
                                    <Menu />
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
                                                        {Math.round(this.state.balance / 1000000)} $xtz
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
                                                                    <CardTitle><a rel="noopener noreferrer" href={`https://hicetnunc.xyz/kt/${e.address}`}>{`${e.address}`}</a></CardTitle>

                                                                    <Row xs="2" style={{ fontSize: '12px' }}>
                                                                        <Col>min</Col>
                                                                        <Col>{e.storage.time_lock}</Col>
                                                                        <Col>goal</Col>
                                                                        <Col>{Math.round(e.storage.goal / 1000000)} $xtz</Col>
                                                                        <Col>contributions</Col>
                                                                        <Col>{e.balance / 1000000} $xtz</Col>

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
                                                                {e.balance} OS#{e.id}
                                                            </div>
                                                        </div>
                                                    )
                                            })}
                                        </Card>
                                        {
                                            <CardGroup>

                                                {this.state.objkts.length > 0 ?
                                                    this.state.objkts.map(e => {
                                                        return (<Card style={{ backgroundColor: 'black', margin: '5px' }}>
                                                            {/*                                                             <CardImg top width="100%" src={e.view.media} alt="Card image cap" />
 */}                                                            <CardBody>
                                                                <CardTitle tag="h5" style={{ color: "white", backgroundColor: "black" }}><a style={{
                                                                    color: "white",
                                                                    "&:hover": {
                                                                        color: "white"
                                                                    }}} href={ '/objkt/' + e.tk_id } > OBJKT#{ e.tk_id }</a></CardTitle>
                                                            </CardBody>
                                                        </Card>)
                                                    }) : null}
                                            </CardGroup>
                                        }
                                    </div>
                            }
                        </Card>

                    </Col>
                </Row>
            </div>
        )
    }
}
