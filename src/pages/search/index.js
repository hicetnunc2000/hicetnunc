import React, { Component } from 'react'
import { Page, Container, Padding } from '../../components/layout'
import { HicetnuncContext } from '../../context/HicetnuncContext'
const axios = require('axios')

export class Search extends Component {
  static contextType = HicetnuncContext

  state = {
    tags: [],
    search: ''
  }

  componentWillMount = async () => {
    await axios.get(process.env.REACT_APP_UNIQUE_TAGS).then(res => this.setState({ tags: res.data.result }))
    this.state.tags.map(e => console.log(e))
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  search = async () => {

    // search for alias
    // regex search
    // 

    console.log(this.state.search)
  }

  render() {
    return (
      <Page>
        <Container>
          <Padding>
            <input
              type="text"
              name="search"
              onChange={this.handleChange}
              placeholder="search">
            </input>
            <button onClick={this.search}>x</button>
            {
              this.state.tags.map(e => {
                return <span>{e._id.tag} </span>
              })
            }
          </Padding>
        </Container>
      </Page>
    )
  }
}
