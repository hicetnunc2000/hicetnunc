import React, { Component } from 'react'
import { Card, Col, Row, CardTitle, CardText } from 'reactstrap'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { CustomInput, Form, FormGroup, Label, Input, FormText, Button } from 'reactstrap'
import Menu from './Menu'
const axios = require('axios')
const IPFS = require('ipfs-api');

export default class Mint extends Component {

    constructor(props) {
        super(props)
        this.state = {
            fileTitle: '',
            title: '',
            description: '',
            tags: '',
            amount: 0,
            selectedFile: null,
            media: '',
            json: '',
            uploaded: false,
            reveal: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.onFileUpload = this.onFileUpload.bind(this)
        this.onFileChange = this.onFileChange.bind(this)
    }

    static contextType = HicetnuncContext

    //state = {
    //    selectedFile: null
    //};


    handleChange = (event) => {

        this.setState({ [event.target.name]: event.target.value }, () => console.log(this.state))

    }

    onFileChange = event => {

        // Update the state 
        this.setState({ selectedFile: event.target.files, fileTitle: event.target.files[0].name });

    };

    onFileUpload = async (e) => {
        if (this.context.client == null) {
            alert('sync')
        } else {
            const icon = 'https://ipfs.io/ipfs/QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc'
            const ipfs = 'https://ipfs.io/ipfs/'
            const formData = new FormData();

            const files = this.state.selectedFile
            const ipfss = new IPFS({
                host: 'ipfs.infura.io',
                port: 5001, 
                protocol: 'https'
              });
            // 30mb limit
            if (files[0].size < 10000000) {

                formData.append('file', files[0])
                //console.log(ipfss.add(files))
                await axios.post(process.env.REACT_APP_UNGRUND_POST_FILE2, formData)
                    .then(resp => {
                        console.log(resp.data.result)
                        this.setState({
                            media: ipfs + resp.data.result[0].hash
                        })
                    })

                await axios.post(process.env.REACT_APP_UNGRUND_POST_IPFS, {
                    title: this.state.title,
                    description: this.state.description,
                    mediaType: files[0].type,
                    tags: [],
                    media: this.state.media,
                    issuer: this.context.address
                }).then(res => this.setState({ json: ipfs + res.data.result }))

                const cid = await axios.post(process.env.REACT_APP_UNGRUND_POST_IPFS, {
                    name: 'OBJKT',
                    symbol: 'OBJKT',
                    decimals: 0,
                    icon: icon,
                    NFT: this.state.json
                }).then(res => res.data.result)
                console.log(this.state)

                console.log(cid)
                await axios.post(process.env.REACT_APP_UNGRUND_MINT, {
                    tz: this.context.getAuth(),
                    amount: this.state.amount,
                    cid: cid
                }).then(res => {
                    console.log(res.data)
                    this.context.operationRequest(res.data)
                })

                this.setState({
                    uploaded: true
                })

            }
        }
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
                        {this.context.collapsed ?
                            <Card style={{ border: 0, marginTop: '20%' }}>
                                <input type="text" name="title" onChange={this.handleChange} placeholder="OBJKT title"></input>
                                <input type="text" name="description" onChange={this.handleChange} placeholder="OBJKT description"></input>
                                <input type="text" name="amount" onChange={this.handleChange} placeholder="amount of OBJKTs"></input>
                                <label style={{ marginTop: '5%', paddingTop: '1.25%', paddingBottom: '1.25%', borderStyle: 'dashed', textAlign: 'center' }}>Upload OBJKT
                                <input style={{ display: 'none' }} type="file" name="file" onChange={this.onFileChange} /></label><br />
                                <p>{
                                    this.state.fileTitle
                                }
                                </p>
                                <button style={{ lenght: '100%' }} onClick={this.onFileUpload}>Mint</button>
                                {
                                    this.state.imgCid != '' ? <a style={{
                                        color: "#000",
                                        "&:hover": {
                                            color: "#000"
                                        }
                                    }} href={`https://ipfs.io/ipfs/${this.state.imgCid}`}>{this.state.imgCid}</a> : null
                                }
                            </Card>
                            :
                            <Menu />
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}
