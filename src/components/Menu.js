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
                            <ul style={this.context.subList}>
                                <li><a style={{
                                    color: "#000",
                                    "&:hover": {
                                        color: "#000"
                                    }
                                }} href="/opensource" onClick={this.reveal}>micro funding</a></li>
                                <li><a style={{
                                    color: "#000",
                                    "&:hover": {
                                        color: "#000"
                                    }
                                }} href="/mint">NFTs</a></li>
                                <li><a style={{
                                    color: "#000",
                                    "&:hover": {
                                        color: "#000"
                                    }
                                }} href="/curation">curation</a></li>
                            </ul>
                            :
                            null
                    }
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
