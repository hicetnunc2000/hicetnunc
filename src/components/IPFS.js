import React, { Component } from 'react'
import { Card, Col, Row, CardTitle, CardText } from 'reactstrap'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { CustomInput, Form, FormGroup, Label, Input, FormText, Button } from 'reactstrap'
const axios = require('axios')

export default class IPFS extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: '',
            description: '',
            tags: '',
            selectedFile: null,
            cid: '',
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
        this.setState({ selectedFile: event.target.files, title: event.target.files[0].name });

    };

    onFileUpload = async (e) => {

        const formData = new FormData();

        const files = this.state.selectedFile
        console.log(files[0])
        if (files[0].size < 10000000) {

            //console.log(await ipfs.files.add(buffer))

            formData.append('file', files[0])
            axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
            axios.post(process.env.REACT_APP_UNGRUND_POST_FILE, formData)
                .then(resp => {
                    console.log(resp.data)
                    this.setState({
                        cid: resp.data
                    })
                })
                .catch(error => {
                    console.log(error);
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
                            <Card style={{ border: 0 }}>
                                <label style={{ marginTop: '25%', paddingTop: '2%', paddingBottom: '2%', borderStyle: 'dashed', textAlign: 'center' }}>Upload file
                                <input style={{ display: 'none' }} type="file" name="file" onChange={this.onFileChange} /></label><br />
                        <p>{
                            this.state.title
                            }
                            </p>
                                <button style={{ lenght: '100%' }} onClick={this.onFileUpload}>Submit</button>
                                {
                                    this.state.cid != '' ? <a style={{
                                        color: "#000",
                                        "&:hover": {
                                            color: "#000"
                                        }
                                    }} href={`https://ipfs.io/ipfs/${this.state.cid}`}>{this.state.cid}</a> : null
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
                                            <li style={{ textDecoration: "line-through" }}>hicetnuncNFTs</li>
                                            <li style={{ textDecoration: "line-through" }}>FA1.2</li>
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
                                    }} href="/sync">sync
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
