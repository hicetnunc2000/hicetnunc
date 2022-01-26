import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { Page, Container, Padding } from '../components/layout'
import { LoadingContainer } from '../components/loading'
import { Button, Primary } from '../components/button'

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
  }

  render() {
    return this.context.acc !== undefined ? (
      <Redirect to={`/${this.props.location.state}/${this.context.getProxy() || this.context.acc.address}`} />
    ) : (
      <Page title="">
        <Container>
          <Padding>
            <p>requesting permissions</p>
            <Button to="/sync">
              <Primary>try again?</Primary>
            </Button>
            <LoadingContainer />
          </Padding>
        </Container>
      </Page>
    )
  }
}
