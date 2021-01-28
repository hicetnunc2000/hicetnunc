import React, { Component } from 'react'
import { Card, Col, Row } from 'reactstrap'
import { HicetnuncContext } from '../context/HicetnuncContext'
import Menu from './Menu'

const axios = require('axios')

export default class OpenSource extends Component {

    constructor(props) {
        super(props)

        this.state = {
            title: "",
            description: "",
            links: [],
            goal: "",
            auth: "",
            count: 0,
            reveal: false
        }
    }

    /*     this.setState(prevState => ({
            links: [...prevState.links, e]
          })) */


    static contextType = HicetnuncContext

    handleChange = (e) => {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    submitForm = async () => {

        if (this.context.client == null) {
            alert('sync')
        } else {
            let ipfs = await axios.post(process.env.REACT_APP_UNGRUND_POST_IPFS, { // process.env.REACT_APP_POST_IPFS
                title: this.state.title,
                description: this.state.description,
                links: this.state.links
            }).then((async res => res.data))

            console.log(ipfs)
            let payload = await axios.post(process.env.REACT_APP_UNGRUND_ORIGINATE, { // process.env.UNGRUND_ORIGINATE //3.129.20.231
                tz: this.context.getAuth(),
                meta: ipfs,
                goal: this.state.goal
            }).then(res => res)
            console.log(payload)

            /*         const signature = this.context.signPayload(payload)
                    console.log(this.context.signature) */
            this.context.operationRequest(payload)
        }
    }

    linkCollapse = () => {

        let links = [...this.state.links]
        let link = { url: '', placeholder: '' }

        links[this.state.count] = link
        this.setState({ links })

        this.setState({
            count: this.state.count + 1
        })

        console.log(this.state)
    }

    handleListChange = (i, e) => {

        let links = [...this.state.links];
        let item = { ...links[i] };
        if (e.target.name == 'url') item.url = e.target.value
        if (e.target.name == 'placeholder') item.placeholder = e.target.value
        links[i] = item;
        this.setState({ links });

    }

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
            fontSize: "40px",
            animation: "fadeMe 1.2s"
        }

        let subList = {
            listStyle: "none",
            fontSize: "26px"
        }

        return (
            <div>
                <Row>
                    <Col sm="12" md={{ size: 6, offset: 3 }}>
                        {
                            !this.context.collapsed ?
                                <Menu />
                                :
                                <Card style={{ 'padding': '10% 0', border: 0, animation: "fadeMe 1.2s" }}>
                                    <p style={{ textAlign: 'justify', paddingBottom: '25px', fontSize: "15px" }}>
                                        >>> this smart contract allows one to publish a crowd funding by decentralized means.
                                        it has a 38 days timelock for withdrawing funds.
                                    </p>
                                    <input type="text" name="title" onChange={this.handleChange} placeholder="micro fund title"></input>
                                    <input type="text" name="description" onChange={this.handleChange} placeholder="micro fund description"></input>
                                    <p style={{ padding: '12px' }} onClick={this.linkCollapse}>+ links</p>

                                    {
                                        this.state.count == -1 ?
                                            null
                                            :

                                            <Card style={{ border: 0 }}>
                                                {this.state.links.map((e, i) => {
                                                    return (
                                                        <div key={i}>
                                                            <input type="text" name='url' style={{ width: '100%' }} onChange={this.handleListChange.bind(this, i)} placeholder='url' /><br />
                                                            <input type='text' name='placeholder' style={{ width: '100%' }} onChange={this.handleListChange.bind(this, i)} placeholder='placeholder' />
                                                        </div>
                                                    )
                                                })}
                                            </Card>
                                    }
                                    <input tpe="text" name="goal" onChange={this.handleChange} placeholder="goal ꜩ > 1"></input>
                                    {/* tags */}
                                    <button onClick={this.submitForm}>open source</button>
                                    <p style={{ textAlign: 'justify', paddingBottom: '25px', fontSize: "15px" }}>This operation costs 0.5 ꜩ~</p>
                                </Card>
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}
