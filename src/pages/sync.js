import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { Page, Container, Padding } from '../components/layout'
import { LoadingContainer } from '../components/loading'
import { PrimaryButton } from '../components/button'

export default class Sync extends Component {
  constructor(props) {
    super(props)

    this.state = {
      addr: '',
    }
  }

  static contextType = HicetnuncContext

  componentWillMount = async () => {
    if (this.context.acc == null) {
      await this.context.syncTaquito()
      await this.context.setAccount()
    } else {
      await this.context.setAccount()
    }
    console.log(this.context)
  }

  render() {
    return this.context.acc !== undefined ? (
      <Redirect to={`/tz/${this.context.acc.address}`} />
    ) : (
      <Page title="">
        <Container>
          <Padding>
            <p>requesting permissions</p>
            <PrimaryButton to="/sync">try again?</PrimaryButton>
            <LoadingContainer />
          </Padding>
        </Container>
      </Page>
    )
  }
}
