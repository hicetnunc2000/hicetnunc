import React, { Component } from 'react'
import { HicetnuncContext } from '../context/HicetnuncContext'

export default class Menu extends Component {

    constructor(props) {
        super(props)
        this.state = { reveal: false }
    }

    static contextType = HicetnuncContext

    reveal = () => {
        this.setState({
            reveal: !this.state.reveal
        })
    }

    render() {
        return (
            <div>
                <ul style={this.context.menu}>
                    <li style={{textDecoration : 'line-through'}}>○</li>
                    <li><a style={{
                        color: "#000",
                        "&:hover": {
                            color: "#000"
                        }
                    }} href="/mint">OBJKTs<i style={{fontSize : '15px'}}>(mint NFTs)</i></a></li>
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
            </div>
        )
    }
}
