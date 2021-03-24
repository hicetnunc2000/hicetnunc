import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { Page, Container, Padding } from '../components/layout'
import { LoadingContainer } from '../components/loading'
import { Button, Primary } from '../components/button'

export default class Sync extends Component {
  static contextType = HicetnuncContext

  componentWillMount = async () => {
    if (this.context.acc == null) {
      await this.context.syncTaquito()
    } else {
      return
    }
    console.log(this.context)
  }

  render() {
    return (
      <Page>
        { this.context.acc !== null ?
          <Redirect to={`/tz/${this.context.acc.address}`} />
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
