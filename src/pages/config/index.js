import React, { Component } from 'react'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Page } from '../../components/layout'

export class Config extends Component {
  static contextType = HicetnuncContext

  state = {}

  componentWillMount = () => this.context.hDAO_vote

  // config alias
  // config hDAO balance
  render() {
    return (
      <Page>
        <input type="text" name="vote" onChange={this.handleChange}></input>
      </Page>
    )
  }
}
