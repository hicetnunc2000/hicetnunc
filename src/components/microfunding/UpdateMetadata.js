import React, { Component } from 'react'
import { Card, Col, Row } from 'reactstrap'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import OpenSource from '../OpenSource'

export default class UpdateMetadata extends OpenSource {

    constructor(props) {
        super(props)

        this.state = {
            ...this.state
        }
    }

    static contextType = HicetnuncContext

    componentWillMount = () => {
        console.log(this.context.pathname)
    }

    handleChange = (e) => {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
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


    submitForm = async () => {

        console.log(this.state)
        //this.context.operationRequest(payload)
    }


    render() {
        return (
            <div>
                <Row>
                    <Col sm="12" md={{ size: 6, offset: 3 }}>
                        <Card style={{ 'padding': '15% 0', border: 0, animation: "fadeMe 1.2s" }}>
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
                            <button onClick={this.submitForm}>update metadata</button>
                        </Card>
                    </Col>
                </Row>
            </div >
        )
    }
}
