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
addr : ''
    }
  }

  static contextType = HicetnuncContext

  componentWillMount = async () => {
    if (this.context.address == undefined) {
      await this.context.syncTaquito()
      await this.context.setAccount()
      this.context.address = this.context.addr
    } else {
      return
    }
    console.log(this.context)
  }

  render() {
    return (
      <Page>
        { this.context.address !== undefined ?
          <Redirect to={`/tz/${this.context.address}`} />
          :
          <Container>
            <Padding>
              <p>requesting permissions</p>
              <Button to="/sync">
                <Primary>try again?</Primary>
              </Button>
              <LoadingContainer />
            </Padding>
          </Container>

        }
      </Page>
    )
  }
}
