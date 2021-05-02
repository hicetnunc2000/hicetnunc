import React, { Component } from 'react'
import { Page } from '../../components/layout'
import { HicetnuncContext } from '../../context/HicetnuncContext'
// const axios = require('axios')

export class Search extends Component {
  static contextType = HicetnuncContext

  state = {}

  render() {
    return (
      <Page>
        <div>search:</div>
      </Page>
    )
  }
}
