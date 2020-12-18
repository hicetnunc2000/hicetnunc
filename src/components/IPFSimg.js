import React, { Component } from 'react'

export default class IPFSimg extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }




    render() {
        return (
            <div style={{backgroundColor: 'black'}}>
                <div style={{ marginTop : '2.5%', display : 'table', margin : '0 auto'}}>
                    <img style = {{height : '80vh'}} src="https://ipfs.io/ipfs/QmdsBhfZFjWugDi531Bs7h19TCmp6zA1EXfoDkjx4D5QPR" />
                </div>
            </div>
        )
    }
}
