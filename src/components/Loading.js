import React, { Component } from 'react'

export default class Loading extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div>
        <div
          className="loading"
          style={{ backgroundColor: 'black', height: '10px' }}
        ></div>
      </div>
    )
  }
}
