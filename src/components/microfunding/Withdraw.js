import React, { Component } from 'react'

export default class Withdraw extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             amount : 0
        }

    }

    static contextType = HicetnuncContext

    componentWillMount = () => { console.log(this.context.pathname) }

    handleChange = (e) => {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    submitForm = async () => {

        this.context.operationRequest(payload)
    }
    
    render() {
        return (
            <div>
                <input type="text" name="amount" onChange={this.handleChange} placeholder="withdraw ꜩ"></input>
                <button onClick={this.submitForm}>open source</button>
            </div>
        )
    }
}
