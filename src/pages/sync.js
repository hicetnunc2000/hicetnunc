import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { Container, Padding } from '../components/layout'
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
    console.log(this.context)
  }

  render() {
    return this.context.acc !== undefined ? (
      <Redirect to={`/tz/${this.context.acc.address}`} />
    ) : (
      <Container>
        <Padding>
          <p>requesting permissions</p>
          <Button to="/sync">
            <Primary>try again?</Primary>
          </Button>
          <LoadingContainer />
        </Padding>
      </Container>
    )
  }
}
