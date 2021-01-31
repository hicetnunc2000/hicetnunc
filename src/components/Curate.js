import React, { Component } from 'react'
import { Card, CardBody, CardTitle, CardGroup } from 'reactstrap';
import { HicetnuncContext } from '../context/HicetnuncContext'
import { Col, Row, ListGroupItemHeading } from 'reactstrap'

const axios = require('axios')
export default class Components extends Component {

    constructor(props) {
        super(props)

        this.state = {
            objkt: {},
            loaded: false,
            info: true,
            owners: false,
            collect: false,
            kt: '',
        }
    }

    static contextType = HicetnuncContext

    componentWillMount = async () => {
        this.setState({ kt : window.location.pathname.split('/')[2] })
        await axios.post(process.env.REACT_APP_UNGRUND_OBJKT_SWAPS_METADATA, {
            kt: window.location.pathname.split('/')[2]
        }).then(res => {
            console.log(res.data)
            this.setState({
                objkt: res.data.result
            })
        })
        console.log(this.state)
        await axios.post(process.env.REACT_APP_UNGRUND_OBJKT_ID, {
            objkt_id: this.state.objkt.tk_id
        }).then(res => {
            console.log(res.data)
            this.setState({
                objkt: res.data.result,
                balance: res.data.balance,
                owners_arr: res.data.owners
            })
        })
        await axios.get(process.env.REACT_APP_UNGRUND_OBJKT_SWAPS).then(res => {
            this.setState({ curations_arr: res.data.result })
        })
        this.state.curations_arr.filter(e => {
            if (e.address == this.state.kt) this.setState({ tz_per_objkt : e.tz_per_objkt, objkts : e.objkt_amount, loaded: true })
        })
        console.log(this.state)
    }

    submitForm = async () => {
        if (this.context.address == '') {
            alert('sync')
        } else {
            const res = await axios.post(process.env.REACT_APP_UNGRUND_COLLECT, {
                kt : this.state.kt,
                amount : this.state.tz_per_objkt
            }).then(res => res.data)
            this.context.operationRequest(res)
        }
    }

    info = () => this.setState({ info: true, owners: false, collect: false })
    owners = () => this.setState({ info: false, owners: true, collect: false })
    collect = () => this.setState({ info: false, owners: false, collect: true })

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

                {
                    this.state.loaded ?
                        <div style={{ backgroundColor: 'white' }}>
                            <div style={{ paddingTop: '2%', display: 'table', margin: '0 auto' }}>
                                <img style={{ height: '65vh' }} src={this.state.objkt.view.media} />
                            </div>
                            {/*                 <video controls>
                    <source src="https://ipfs.io/ipfs/QmNWTszpFbLRzt5EnaT7SKZz3GvpszvKyDR6Uj5rEL77hu"/>
                </video> */}
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
                                    <Card style={{ paddingTop: '5%', border: 0 }}>
                                        <div style={{ diplay: 'inline' }}>
                                            <span onClick={this.info}>info</span>
                                            <span onClick={this.owners} style={{ paddingLeft: '25px' }}>owners</span>
                                            <span onClick={this.collect} style={{ paddingLeft: '25px' }}>+collect</span>
                                        </div>
                                        <div style={{ paddingTop: '2.5%' }}>
                                            {
                                                this.state.info ?
                                                    <div>
                                                        {this.state.objkts}x OBJKT#{this.state.objkt.tk_id}<br />
                                                issuer {this.state.objkt.view.issuer}
                                                    </div> : null
                                            }
                                            {
                                                this.state.owners ?
                                                    this.state.owners_arr.map(e => <div>{e.balance}x {e.address}</div>) : null
                                            }
                                            {
                                                this.state.collect ?
                                                    <div>
                                                        <div style={{textAlign : 'right'}}>
                                                        <span style={{textAlign : 'right'}}>{this.state.tz_per_objkt/1000000} $xtz/OBJKT#{this.state.objkt.tk_id}</span>
                                                        </div>
                                                        <button style={{width : '100%'}} onClick={this.submitForm}>collect</button>
                                                    </div>
                                                    : null
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
                }
            </div>
        )
    }
}
