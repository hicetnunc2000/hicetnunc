import React, { Component } from 'react'
import { Card, Col, Row, CardTitle, CardText } from 'reactstrap'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { CustomInput, Form, FormGroup, Label, Input, FormText, Button } from 'reactstrap'
const axios = require('axios')

export default class IPFS extends Component {

    constructor(props) {
        super(props)
        this.state = {
            fileTitle: '',
            title: '',
            description: '',
            tags: '',
            amount: 0,
            selectedFile: null,
            imgCid: '',
            jsonCid : '',
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

        const formData = new FormData();

        const files = this.state.selectedFile
        console.log(files[0])

        // 30mb limit
        if (files[0].size < 30000000) {

            formData.append('file', files[0])
            axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
            await axios.post(process.env.REACT_APP_UNGRUND_POST_FILE, formData)
                .then(resp => {
                    console.log(resp.data)
                    this.setState({
                        imgCid: resp.data
                    })
                })
                .catch(error => {
                    console.log(error);
                })

            await axios.post(process.env.REACT_APP_UNGRUND_POST_IPFS, {
                title : this.state.title,
                description : this.state.description,
                sig : '',
                tags : [],
                imgCid : this.state.imgCid
            }).then(res => this.setState({ jsonCid : res.data.hash }))

            await axios.post('http://localhost:5000/objk/mint', {
                tz : this.context.getAuth(),
                amount : this.state.amount,
                ipfs : this.state.jsonCid
            }).then(res => {
                console.log(res.data)
                this.context.operationRequest(res.data)
            })

            this.setState({
                uploaded: true
            })
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
                            <Card style={{ border: 0 , marginTop : '20%'}}>
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
                            <ul style={this.context.menu}>
                                <li><a style={{
                                    color: "#000",
                                    fontStyle: "italic",
                                    "&:hover": {
                                        color: "#000"
                                    }
                                }} href='/feed'>feed</a></li>
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
                                            <li style={{ textDecoration: "line-through" }}>OBJKT</li>
                                        </ul>
                                        
                                        :
                                        null
                                }
                                <li>
                                    <a style={{
                                        color: "#000",
                                        "&:hover": {
                                            color: "#000"
                                        }
                                    }} href="/sync">manage assets
                                    </a>
                                </li>
                                <li>
                                    <a style={{
                                        color: "#000",
                                        "&:hover": {
                                            color: "#000"
                                        }
                                    }} href='/about'>about
                                </a>
                                </li>
                            </ul>
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}
