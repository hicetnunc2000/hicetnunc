import React, { Component } from 'react'
import { Page, Container, Padding } from '../../components/layout'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { ResponsiveMasonry } from '../../components/responsive-masonry'
import { PATH } from '../../constants'
import { Loading } from '../../components/loading'
import { Button, Primary } from '../../components/button'

import InfiniteScroll from 'react-infinite-scroll-component'
import { renderMediaType } from '../../components/media-types'

const axios = require('axios')

const query_tag = `query ObjktsByTag($tag: String = "3d", $lastId: bigint = 99999999) {
  hic_et_nunc_token(where: {token_tags: {tag: {tag: {_eq: $tag}}}, id: {_lt: $lastId}, supply: {_gt: "0"}}, order_by: {id: desc}) {
    id
    artifact_uri
    display_uri
    mime
    creator {
      address
      name
    }
  }
}`

async function fetchSubjkts(subjkt) {
  console.log(subjkt)
  const { errors, data } = await fetchGraphQL(`
  query subjktsQuery($subjkt: String!) {
    hic_et_nunc_holder(where: { name: {_like: "%${subjkt}%"}}) {
      address
      name
      hdao_balance
      metadata
    }
  }
  `, 'subjktsQuery', {
    subjkt: subjkt,
  })
  if (errors) {
    console.error(errors)
  }

  let result = [

  ]
  try {
    result = data.hic_et_nunc_holder
  } catch (e) { }
  /* console.log({ result }) */
  return result
}

async function fetchTag(tag) {
  const { errors, data } = await fetchGraphQL(query_tag, "ObjktsByTag", { "tag": tag });
  if (errors) {
    console.error(errors);
  }
  const result = data.hic_et_nunc_token
  /* console.log({ result }) */
  return result
}

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    "https://api.hicdex.com/v1/graphql",
    {
      method: "POST",
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );
  return await result.json();
}

export class Search extends Component {
  static contextType = HicetnuncContext

  state = {
    subjkt: [],
    tag: [],
    feed: [],
    search: '',
    items: [
      { id: 0, value: '1/1' },
      { id: 1, value: 'glb' },
      { id: 2, value: 'html' }
    ],
    select: [],
    mouse: false,
    hasMore: true,
    offset: 0
  }

  /*   componentWillMount = async () => {
      await axios.get(process.env.REACT_APP_UNIQUE_TAGS).then(res => this.setState({ tags: res.data.result }))
      this.state.tags.map(e => console.log(e))
    } */

  handleChange = (e) => this.setState({ [e.target.name]: e.target.value })

  search = async () => {

    // search for alias

    this.setState({ subjkt: await fetchSubjkts(this.state.search) })

    // search alias creations?

    // search for tags

    this.setState({ tag: await fetchTag(this.state.search) })

    // search for objkt titles/descriptions

    // search for objkt id

    console.log(this.state)

  }

  hoverState = (bool) => this.setState({ mouse: bool })

  select = (id) => this.setState({ select: [...this.state.select, id] })
  loadMore = () => {
    this.setState({ feed: this.state.tag.concat(this.state.tag.slice(this.state.offset, this.state.offset + 20)), offset: this.state.offset + 20 })

    /*     if ((this.state.objkts.slice(this.state.offset, this.state.offset + 20).length < 20) && (this.state.offset !== 20)) {
          this.setState({ hasMore : false })
        } */
  }
  render() {

    let mouse = true

    return (
      <Page>
        <Container>
          <Padding>
            <input
              type="text"
              name="search"
              onMouseEnter={() => this.hoverState(true)}
              onMouseLeave={() => this.hoverState(false)}
              onChange={this.handleChange}
              placeholder="search">
            </input>
            <button onClick={this.search}>x</button>
            {/*             {
              this.state.tags.map(e => {
                return <span>{e._id.tag} </span>
              })
            } */}


            {

              this.state.mouse ?
                <div
                  style={{ display: 'block' }}
                  onMouseEnter={() => this.hoverState(true)}
                  onMouseLeave={() => this.hoverState(false)}
                >
                  {this.state.items.map(e => <div onClick={() => this.select(e.id)}>{e.value}</div>)}
                </div>
                :
                null
            }

            {
              this.state.subjkt.length > 0 ?
                <div>
                  {
                    this.state.subjkt.map(e => <div><a href={`/${e.name}`}>{e.name}</a>{e.metadata.description}</div>)
                  }
                </div>
                :
                undefined
            }
            {
              this.state.tag.length > 0 ?
                <InfiniteScroll
                  dataLength={this.state.feed.length}
                  next={this.loadMore}
                  hasMore={this.state.hasMore}
                  loader={
                    <Container>
                      <Padding>
                        <Loading />
                      </Padding>
                    </Container>
                  }
                  endMessage={<p></p>}
                >
                  <ResponsiveMasonry>
                    {this.state.feed.map((nft) => {
                      return (
                        <Button key={nft.id} to={`${PATH.OBJKT}/${nft.id}`}>
                          <div >
                            {renderMediaType({
                              mimeType: nft.mime,
                              artifactUri: nft.artifact_uri,
                              displayUri: nft.display_uri,
                              displayView: true
                            })}
                          </div>
                        </Button>
                      )
                    })}
                  </ResponsiveMasonry>
                </InfiniteScroll>
                :
                undefined
            }
          </Padding>
        </Container>
      </Page>
    )
  }
}
