import React, { Component } from 'react'
import { Card, Col, Row } from 'reactstrap'
import { HicetnuncContext } from '../context/HicetnuncContext'

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
            reveal : false
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

        let headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }

        /* await axios.post('https://fmn11y0q17.execute-api.us-east-2.amazonaws.com/py-ipfslambda', { */
        let ipfs = await axios.post(process.env.REACT_APP_UNGRUND_POST_IPFS, { // process.env.REACT_APP_POST_IPFS
            title: this.state.title,
            description: this.state.description,
            links : this.state.links
        }, {
            headers: headers
        })
            .then((async res => res.data))

        console.log(ipfs)
        let payload = await axios.post(process.env.REACT_APP_UNGRUND_ORIGINATE, { // process.env.UNGRUND_ORIGINATE //3.129.20.231
            tz: this.context.getAuth(),
            meta: ipfs,
            goal: this.state.goal
        }, {
            headers: headers
        }).then(res => res.data)
        console.log(payload)

/*         const signature = this.context.signPayload(payload)
        console.log(this.context.signature) */
        this.context.operationRequest(payload)
    }

    linkCollapse = () => {

        let links = [...this.state.links]
        let link =  { url : '', placeholder : ''}

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
            fontFamiliy: "Roboto",
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
                                                }} href="/opensource" onClick={this.reveal}>micro funding</a></li>
                                                <li style={{ textDecoration: "line-through" }}>NFTs</li>
                                            </ul>
                                            :
                                            null
                                    }
                                    <li><a style={{
                                        color: "#000",
                                        "&:hover": {
                                            color: "#000"
                                        }
                                    }} href="/ipfs">IPFS</a></li>
                                    <li><a style={{
                                        color: "#000",
                                        "&:hover": {
                                            color: "#000"
                                        }
                                    }} href="/sync">manage assets</a></li>
                                    <li><a style={{
                                        color: "#000",
                                        "&:hover": {
                                            color: "#000"
                                        }
                                    }} href="/about">about</a></li>
                                </ul>
                                :
                                <Card style={{ 'padding': '15% 0', border: 0, animation: "fadeMe 1.2s" }}>
                                    <input type="text" name="title" onChange={this.handleChange} placeholder="micro fund title"></input>
                                    <input type="text" name="description" onChange={this.handleChange} placeholder="micro fund description"></input>
                                    <p style={{ padding: '12px' }} onClick={this.linkCollapse}>+ links</p>

                                    {
                                        this.state.count == -1 ?
                                            null
                                            :

                                            <Card style={{ border: 0 }}>
                                                {this.state.links.map( (e, i) => {
                                                    return (
                                                        <div key={i}>
                                                        <input type="text" name='url' style={{width:'100%'}} onChange={this.handleListChange.bind(this, i)} placeholder='url' /><br />
                                                        <input type='text' name='placeholder' style={{width:'100%'}} onChange={this.handleListChange.bind(this, i)} placeholder='placeholder' />
                                                    </div>      
                                                    )
                                                })}
                                            </Card>
                                    }
                                    <input tpe="text" name="goal" onChange={this.handleChange} placeholder="goal ꜩ > 1"></input>
                                    {/* tags */}
                                    <button onClick={this.submitForm}>open source</button>
                            This operations costs 0.5 ꜩ~

                        </Card>
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}
