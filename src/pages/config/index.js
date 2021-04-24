import React, { Component } from 'react'
import { HicetnuncContext } from '../../context/HicetnuncContext'

export class Config extends Component {
  static contextType = HicetnuncContext

  state = {}

  componentWillMount = () => console.log('oi')

  // config alias
  // config hDAO balance
  render() {
    return <div></div>
  }
}
