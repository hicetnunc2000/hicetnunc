import React, { Component } from 'react'
import { Col, Row, Card, ListGroupItemHeading } from 'reactstrap'
import Menu from './Menu'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { InputDecimal } from "./InputDecimal";

import ReactPlayer from 'react-player'
const axios = require('axios')


export default class ObjktDisplay extends Component {

    constructor(props) {
        super(props)

        this.state = {
            objkt_id: 0,
            objkt: {},
            balance: 0,
            info: true,
            owners_arr: [],
            owners: false,
            curate: false,
            loaded: false,
            test : false,
            value : 0,
            tz_per_objkt: 0,
            objkt_amount: 0
        }
    }

    static contextType = HicetnuncContext


    componentWillMount = async () => {

        await axios.post(process.env.REACT_APP_UNGRUND_OBJKT_ID, {
            objkt_id: window.location.pathname.split('/')[2]
        }).then(res => {
            console.log(res.data)
            this.setState({
                objkt: res.data.result,
                balance: res.data.balance,
                owners_arr: res.data.owners,
                loaded: true
            })
        })

        const swaps = await axios.get('http://localhost:5000/objkt/swaps').then(res => {
            this.setState({
                swaps : res.data.result.filter(e => parseInt(e.objkt_id) == window.location.pathname.split('/')[2])
            })
        })
        console.log(this.state)
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value }, () => console.log(this.state))
    }

    amountChange = e => {
        const amount = e.target.value;
        console.log(amount)
        if (!amount || amount.match(/^\d{1,}(\.\d{0,6})?$/)) {
          this.setState({ tz_per_objkt : amount });
        }
      };

    submitForm = async () => {
        console.log(this.state)
        await axios.post('https://ci7muk9qia.execute-api.us-east-1.amazonaws.com/dev/api/v1/objkt/curate', {
            objkt_id: window.location.pathname.split('/')[2],
            tz_per_objkt: this.context.tz_per_objkt,
            objkt_amount: this.state.objkt_amount
        }).then(res => {
            this.context.operationRequest(res.data)
        })
        console.log('test')
    }

    info = () => this.setState({ info: true, owners: false, curate: false, test : false })
    owners = () => this.setState({ info: false, owners: true, curate: false, test : false })
    curate = () => this.setState({ info: false, owners: false, curate: true, test : false })
    swap = () => {
        console.log('oi')
        this.setState({ info : false, owners : false, curate : false, test : true})}
    render() {
        let cardStyle = {
            position: "absolute",
            listStyle: "none",
            top: "0",
            marginTop: "22.5%",
            border: "0"
        }

        return (
            <div>
                { this.context.collapsed ? <div>
                    { this.state.loaded ?
                        <div style={{ backgroundColor: 'white' }}>
                            {this.state.objkt.metadata.formats[0].mimeType == 'video/mp4' ?
                                <div style={{ paddingTop: '5%', display: 'table', margin: '0 auto' }}>
                                    <video className='media' src={this.state.objkt.metadata.artifactUri} controls></video>
                                </div>
                                :
                                <div style={{ paddingTop: '5%', display: 'table', margin: '0 auto' }}>
                                    <img className='media' src={this.state.objkt.metadata.artifactUri} />
                                </div>
                            }
                            {/*                 <video controls>
                    <source src="https://ipfs.io/ipfs/QmNWTszpFbLRzt5EnaT7SKZz3GvpszvKyDR6Uj5rEL77hu"/>
                </video> */}
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
                                    <Card style={{ paddingTop: '5%', border: 0 }}>
                                        <div style={{ diplay: 'inline' }}>
                                            <span onClick={this.info}>info</span>
                                            <span onClick={this.owners} style={{ paddingLeft: '25px' }}>owners</span>
                                            <span onClick={this.swap} style={{ paddingLeft: '25px' }}>+swaps</span>
                                            {
                                                this.state.objkt.metadata.creator == this.context.address ?
                                                    <span onClick={this.curate} style={{ paddingLeft: '25px' }}>+curate</span>
                                                    :
                                                    null
                                            }
                                        </div>
                                        <div style={{ paddingTop: '2.5%' }}>
                                            {
                                                this.state.info ?
                                                    <div>
                                                        {this.state.balance}x OBJKT#{this.state.objkt.tk_id}<br />
                                                issuer {this.state.objkt.metadata.creator}
                                                    </div> : null
                                            }
                                            {
                                                this.state.owners ?
                                                    this.state.owners_arr.map(e => <div>{e.balance}x {e.address}</div>) : null
                                            }
                                            {
                                                this.state.curate ?
                                                    <div style={{display : 'inline'}}>
                                                        <input type="text" name="objkt_amount" onChange={this.handleChange} placeholder="OBJKT amount"></input>
                                                        <InputDecimal type="text" placeholder="TEZ PER OBJKT" />
                                                        <button style={{width : '100%'}} onClick={this.submitForm}>curate</button>
                                                    </div>
                                                    : null
                                            }
                                            {
                                                this.state.test ? <div>oi</div> : null
                                            }
                                            {
                                                this.state.collect ? <div></div> : null
                                            }
                                        </div>
                                    </Card>
                                </Col>
                            </Row>

                        </div>
                        :
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <Card style={cardStyle}>loading...</Card>
                            </Col>
                        </Row>
                    }</div> :
                    <div>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <Menu />
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        )
    }
}
