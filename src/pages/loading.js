import React, { Component } from 'react'

export default class Loading extends Component {
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
