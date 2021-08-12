import React, { Component } from 'react'
import { Page, Container, Padding } from '../../components/layout'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { ResponsiveMasonry } from '../../components/responsive-masonry'
import { PATH } from '../../constants'
import { Loading } from '../../components/loading'
import { Button, Primary } from '../../components/button'
import { Input } from '../../components/input'
import InfiniteScroll from 'react-infinite-scroll-component'
import { renderMediaType } from '../../components/media-types'
import './style.css'

const axios = require('axios')
const ls = require('local-storage')

const query_creations = `
query creatorGallery($address: String!) {
  hic_et_nunc_token(where: {creator: {address: {_eq: $address}}, supply: {_gt: 0}}, order_by: {id: desc}) {
    id
    artifact_uri
    display_uri
    thumbnail_uri
    timestamp
    mime
    title
    description
    supply
    token_tags {
      tag {
        tag
      }
    }
  }
}
`

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

async function fetchID(id) {
  const { errors, data } = await fetchGraphQL(`
  query objktId {
    hic_et_nunc_token(where : { id : { _eq : $id }}) {
      id
      artifact_uri
      display_uri
      mime
      creator {
        address
        name
      }
    }
  }
  `, 'objktId', {
    id : id
  })

  try {
    return data.hic_et_nunc_token
  } catch (e) {
    return undefined
  }
}

async function fetchGLB() {
  const { errors, data } = await fetchGraphQL(`
  query GLBObjkts {
    hic_et_nunc_token(where : { mime : {_in : ["model/gltf-binary"]}}) {
      id
      artifact_uri
      display_uri
      mime
      creator {
        address
        name
      }
    }
  }
  `, 'GLBObjkts', {}
  )

  try {
    return data.hic_et_nunc_token
  } catch (e) {
    return undefined
  }
}

async function fetchInteractive() {
  const { errors, data } = await fetchGraphQL(`
    query InteractiveObjkts {
      hic_et_nunc_token(where: { mime: {_in : [ "application/x-directory" ]}}) {
        id
        artifact_uri
        display_uri
        mime
        creator {
          name
          address
        }
      }
    }
  `, 'InteractiveObjkts', {})

  try {
    return data.hic_et_nunc_token
  } catch (e) {
    return undefined
  }
}

async function fetchMusic() {
  const { errors, data } = await fetchGraphQL(`
  query AudioObjkts {
    hic_et_nunc_token(where: { mime: {_in: ["audio/ogg", "audio/wav", "audio/mpeg"]}}) {
      id
      artifact_uri
      display_uri
      mime
      creator {
        address
        name
      }
    }
  }  
  `, 'AudioObjkts', {}
  )

  try {
    return data.hic_et_nunc_token
  } catch (e) {
    return undefined
  }
}

async function fetchTitle(title) {
  const { errors, data } = await fetchGraphQL(`
  query queryTitles($title: String!) {
    hic_et_nunc_token(where: {title: {_like: "%${title}%"}}) {
      id
      artifact_uri
      display_uri
      mime
      creator {
        address
        name
      }
    }
  }
  `, 'queryTitles', {
    title: title
  })

  try {
    return data.hic_et_nunc_token
  } catch (e) {
    return undefined
  }
}

async function fetchCreations(addr) {
  const { errors, data } = await fetchGraphQL(
    query_creations,
    'creatorGallery',
    { address: addr }
  )
  if (errors) {
    console.error(errors)
  }
  const result = data.hic_et_nunc_token
  /* console.log({ result }) */
  return result
}

async function fetchDescription(description) {
  const { errors, data } = await fetchGraphQL(`
  query queryDescriptions($title: String!) {
    hic_et_nunc_token(where: {description: {_like: "%${description}%"}}) {
      id
      artifact_uri
      display_uri
      mime
      creator {
        address
        name
      }
    }
  }
  `, 'queryDescriptions', {
    description: description
  })

  try {
    return data.hic_et_nunc_token
  } catch (e) {
    return undefined
  }
}

async function fetchSubjkts(subjkt) {
  //console.log(subjkt)
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

  let result = []

  try {
    result = data.hic_et_nunc_holder
  } catch (e) {}

  return result
}

async function fetchTag(tag) {
  const { errors, data } = await fetchGraphQL(query_tag, "ObjktsByTag", { "tag": tag });
  if (errors) {
    console.error(errors);
  }
  const result = data.hic_et_nunc_token
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
    items: [],
    feed: [],
    search: '',
    tags: [
      { id: 0, value: '○'},
      { id: 1, value: 'random' },
      { id: 2, value: 'glb' },
      { id: 3, value: 'music' },
      { id: 3, value: 'interactive' },
      { id: 4, value: 'illustration' },
      { id: 5, value: 'gif' }
    ],
    select: [],
    mouse: false,
    hasMore: true,
    offset: 20
  }

  /*   componentWillMount = async () => {
      await axios.get(process.env.REACT_APP_UNIQUE_TAGS).then(res => this.setState({ tags: res.data.result }))
      this.state.tags.map(e => console.log(e))
    } */

  handleChange = (e) => { 
    this.setState({ [e.target.name]: e.target.value })

    if (this.state.search.length >= 1) this.search()
  }

  update = async (e) => {

    if (e === 'music') {
      console.log(await fetchMusic())
    }

    if (e === 'glb') {
      console.log(await fetchGLB())
    }

    if (e === 'interactive') {
      console.log(await fetchInteractive())
    }
  }

  search = async () => {
    console.log(await fetchGLB())
    console.log(await fetchMusic())
    this.setState({ items: [], feed : [] })
    // search for alias

    this.setState({ subjkt: await fetchSubjkts(this.state.search) })

    // results from creator
    //if (this.state.subjkt.length > 0) {
      //console.log('address', this.state.subjkt[0].address)
      //console.log('creations', await fetchCreations(this.state.subjkt[0].address))
      //this.setState({ items : await fetchCreations(this.state.subjkt[0].address) })
      //this.setState({ feed: [...this.state.feed, this.state.items.slice(0, 20)] })
    //}

    // search alias creations?

    // search for itemss

    this.setState({ items: await fetchTag(this.state.search) })

    // search for objkt titles/descriptions

    let title = await fetchTitle(this.state.search)
    if (await title) this.setState({ items: [...this.state.items, ...(await title)] })
    let description = await fetchDescription(this.state.search)
    if (await description) this.setState({ items: [...this.state.items, ...(await description)] })

    this.setState({ feed: [...this.state.feed, this.state.items.slice(0, 20)] })
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
            <Input
              type="text"
              name="search"
              onMouseEnter={() => this.hoverState(true)}
              onMouseLeave={() => this.hoverState(false)}
              onChange={e => console.log(e.target.name, e.target.value)}
              label="objkt id, artists, titles, tags"
              placeholder="objkt id, artists, titles, tags"
            />
{/*             <button onClick={this.search}>search</button>
 */}            {/*             {
              this.state.tags.map(e => {
                return <span>{e._id.tag} </span>
              })
            } */}
            {
              <div style={{ marginTop : '15px' }}>
                {this.state.tags.map(e => <a className='tag' href='#' onClick={() => this.update(e.value)}>{e.value} </a>)}
              </div>
            }
            {
              this.state.subjkt.length > 0 ?
                <div style={{ maxHeight : '200px', overflow : 'scroll' }}>
                  {
                    this.state.subjkt.map(e => <div style={{ marginTop: '10px' }}><a href={`/${e.name}`}>{e.name}</a> {e.metadata.description}</div>)
                  }
                </div>
                :
                undefined
            }
          </Padding>
        </Container>
        <Container xlarge>
          {
            this.state.items.length > 0 ?
              <InfiniteScroll
                dataLength={this.state.feed.length}
                next={this.loadMore}
                hasMore={this.state.hasMore}
                loader={undefined}
                endMessage={undefined}
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
        </Container>
      </Page>
    )
  }
}
