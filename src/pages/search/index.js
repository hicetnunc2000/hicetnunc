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
const _ = require('lodash')

const isFloat = (n) => Number(n) === n && n % 1 !== 0

const latest_feed = `
query LatestFeed($lastId: bigint = 99999999) {
  hic_et_nunc_token(order_by: {id: desc}, limit: 15, where: {id: {_lt: $lastId}, artifact_uri: {_neq: ""}}) {
    artifact_uri
    display_uri
    creator_id
    id
    mime
    thumbnail_uri
    timestamp
    title
    creator {
      name
      address
    }
  }
}`

async function fetchFeed(lastId) {
  const { errors, data } = await fetchGraphQL(latest_feed, "LatestFeed", { "lastId": lastId });
  if (errors) {
    console.error(errors);
  }
  const result = data.hic_et_nunc_token
  /* console.log({ result }) */
  return result
}

const query_creations = `
query creatorGallery($address: String!) {
  hic_et_nunc_token(where: {creator: {address: {_eq: $address}}, supply: {_gt: 0}}, order_by: {id: desc}, limit : 15, offset : $offset ) {
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

const query_tag = `
query ObjktsByTag {
  hic_et_nunc_token(where: {supply : { _neq : 0 }, token_tags: {tag: {tag: {_eq: $tag}}}, id: {_lt: $lastId}}, limit : 15, order_by: {id: desc}) {
    id
    artifact_uri
    display_uri
    mime
    token_tags {
      tag {
        tag
      }
    }
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
    id: id
  })

  try {
    return data.hic_et_nunc_token
  } catch (e) {
    return undefined
  }
}

async function fetchObjkts(ids) {
  const { errors, data } = await fetchGraphQL(`
    query Objkts($ids: [bigint!] = "") {
      hic_et_nunc_token(where: {id: {_in: $ids}, supply : { _neq : 0 }}) {
        artifact_uri
        display_uri
        creator_id
        id
        mime
        thumbnail_uri
        timestamp
        title
        creator {
          name
          address
        }
      }
    }`, "Objkts", { "ids": ids });
  if (errors) {
    console.log(errors)
  }
  return data
}

async function getLastId() {
  const { errors, data } = await fetchGraphQL(`
    query LastId {
      hic_et_nunc_token(limit: 1, order_by: {id: desc}) {
        id
      }
    }`, "LastId");
  return data.hic_et_nunc_token[0].id
}

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

async function fetchGLB(offset) {
  const { errors, data } = await fetchGraphQL(`
  query GLBObjkts {
    hic_et_nunc_token(where : { mime : {_in : ["model/gltf-binary"] }, supply : { _neq : 0 }}, limit : 15, offset : ${offset}, order_by: {id: desc}) {
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
  console.log('glb', data.hic_et_nunc_token)
  try {
    return data.hic_et_nunc_token
  } catch (e) {
    return undefined
  }
}

async function fetchInteractive(offset) {
  const { errors, data } = await fetchGraphQL(`
    query InteractiveObjkts {
      hic_et_nunc_token(where: { mime: {_in : [ "application/x-directory" ]}, supply : { _neq : 0 } }, limit : 15, offset : ${offset}, order_by: {id: desc}) {
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

async function fetchGifs(offset) {
  const { errors, data } = await fetchGraphQL(`
    query Gifs ($offset: Int = 0) {
      hic_et_nunc_token(where: { mime: {_in : [ "image/gif" ]}, supply : { _neq : 0 }}, order_by: {id: desc}, limit: 15, offset: ${offset}) {
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
  `, 'Gifs', {})

  try {
    return data.hic_et_nunc_token
  } catch (e) {
    return undefined
  }
}

async function fetchMusic(offset) {
  const { errors, data } = await fetchGraphQL(`
  query AudioObjkts {
    hic_et_nunc_token(where: {mime: {_in: ["audio/ogg", "audio/wav", "audio/mpeg"]}, supply : { _neq : 0 }}, limit : 15, offset : ${offset}, order_by: {id: desc}) {
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

async function fetchTitle(title, offset) {
  const { errors, data } = await fetchGraphQL(`
  query queryTitles {
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
  `, 'queryTitles', {})

  try {
    return data.hic_et_nunc_token
  } catch (e) {
    return undefined
  }
}

async function fetchCreations(addr, offset) {
  const { errors, data } = await fetchGraphQL(`
query creatorGallery {
  hic_et_nunc_token(where: {creator: {address: {_eq: ${addr}}}, supply: {_gt: 0}}, order_by: {id: desc}, limit : 15, offset : ${offset} ) {
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
`,
    'creatorGallery',
    {}
  )
  if (errors) {
    console.error(errors)
  }
  const result = data.hic_et_nunc_token
  /* console.log({ result }) */
  return result
}

async function fetchDescription(description, offset) {
  const { errors, data } = await fetchGraphQL(`
  query queryDescriptions {
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
  `, 'queryDescriptions', {})

  try {
    return data.hic_et_nunc_token
  } catch (e) {
    return undefined
  }
}

async function fetchRandomObjkts() {
  const firstId = 196
  const lastId = await getLastId()

  const uniqueIds = new Set()
  while (uniqueIds.size < 15) {
    uniqueIds.add(rnd(firstId, lastId))
  }

  const { errors, data } = await fetchObjkts(Array.from(uniqueIds));

  let objkts = await fetchObjkts(Array.from(uniqueIds));

  if (errors) {
    console.error(errors);
  }

  const result = data
  return objkts.hic_et_nunc_token
}

async function fetchDay(day, offset) {
  const { errors, data } = await fetchGraphQL(`query dayTrades {
    hic_et_nunc_trade(where: {timestamp: {_gte: "${day}"}}, order_by: {swap: {price: desc}}, limit : 15, offset : ${offset}) {
      timestamp
      swap {
        price
      }
      token {
        artifact_uri
        display_uri
        id
        mime
      }
    }
  }`, 'dayTrades', {})

  if (errors) {
    console.log(errors)
  }

  let result = []

  try {
    result = data.hic_et_nunc_trade
  } catch (e) { }

  return result

}

async function fetchSubjkts(subjkt) {
  //console.log(subjkt)
  const { errors, data } = await fetchGraphQL(`
  query subjktsQuery {
    hic_et_nunc_holder(where: { name: {_like: "%${subjkt}%"}}, order_by: {hdao_balance: desc}) {
      address
      name
      hdao_balance
      metadata
    }
  }
  `, 'subjktsQuery', {})
  if (errors) {
    console.error(errors)
  }

  let result = []

  try {
    result = data.hic_et_nunc_holder
  } catch (e) { }

  return result
}

async function fetchTag(tag, offset) {
  const { errors, data } = await fetchGraphQL(
    `query ObjktsByTag {
  hic_et_nunc_token(where: {supply : { _neq : 0 }, token_tags: {tag: {tag: {_eq: ${tag}}}}, id: {_lt: ${offset}}}, limit : 15, order_by: {id: desc}) {
    id
    artifact_uri
    display_uri
    mime
    token_tags {
      tag {
        tag
      }
    }
    creator {
      address
      name
    }
  }
}`
    , "ObjktsByTag", {});
  if (errors) {
    console.error(errors);
  }
  const result = data.hic_et_nunc_token
  return result
}

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    process.env.REACT_APP_GRAPHQL_API,
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

const query_hdao = `query hDAOFeed($offset: Int = 0) {
  hic_et_nunc_token(order_by: {hdao_balance: desc}, limit: 15, where: {hdao_balance: {_gt: 100}}, offset: $offset) {
    artifact_uri
    display_uri
    creator_id
    id
    mime
    thumbnail_uri
    timestamp
    title
    hdao_balance
    creator {
      name
      address
    }
  }
}`

async function fetchHdao(offset) {
  const { errors, data } = await fetchGraphQL(query_hdao, "hDAOFeed", { "offset": offset })
  if (errors) {
    console.error(errors);
  }
  const result = data.hic_et_nunc_token
  return result
}

export class Search extends Component {
  static contextType = HicetnuncContext

  state = {
    subjkt: [],
    items: [],
    feed: [],
    search: '',
    select: '',
    prev: '',
    reset: false,
    flag: false,
    tags: [
      { id: 0, value: '○' },
      { id: 1, value: 'random' },
      { id: 2, value: 'glb' },
      { id: 3, value: 'music' },
      { id: 4, value: 'interactive' },
      { id: 5, value: 'gif' },
      { id: 6, value: '1D'},
      { id: 7, value: '1W'},
      /*       { id: 4, value: 'illustration' }, */
      /*       { id: 5, value: 'gif' } */

      // video/mp4

      // filter
      // day
      // week

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

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })

    if (this.state.search.length >= 1) this.search()
  }

  update = async (e, reset) => {

    this.setState({ select: e })
    if (reset) {
      this.state.feed = []
      this.state.offset = 0
    }

    if (e === '1D') {
      console.log(new Date((new Date()).getTime() - 60*60*24*1000))

      let list = await fetchDay(new Date((new Date()).getTime() - 60*60*24*1000).toISOString(), this.state.offset)
      list = list.map(e => e.token)
      list = [...this.state.feed, ...(list)]
      list = _.uniqBy(list, 'id')

      this.setState({
        feed : list
      })
    }

    if (e === '1W') {
      let list = await fetchDay(new Date((new Date()).getTime() - 60*60*24*30*1000).toISOString(), this.state.offset)
      list = list.map(e => e.token)
      list = [...this.state.feed, ...(list)]
      list = _.uniqBy(list, 'id')

      this.setState({
        feed : list
      })
    }

    if (e === 'num') {
      this.setState({
        feed: [...this.state.feed, ...(await fetchFeed(Number(this.state.search) + 1 - this.state.offset))]
      })
    }

    if (e === '○') {
      this.setState({ feed: [...this.state.feed, ...(await fetchHdao(this.state.offset))], hdao: true })
    }

    if (e === 'music') {
      this.setState({ feed: [...this.state.feed, ...(await fetchMusic(this.state.offset))] })
    }

    if (e === 'video') {

    }

    if (e === 'glb') {
      this.setState({ feed: [...this.state.feed, ...(await fetchGLB(this.state.offset))] })
    }

    if (e === 'interactive') {
      this.setState({ feed: [...this.state.feed, ...(await fetchInteractive(this.state.offset))] })
    }

    if (e == 'random') {
      this.setState({ feed: [...this.state.feed, ...(await fetchRandomObjkts())] })
    }

    if (e == 'gif') {
      this.setState({ feed: [...this.state.feed, ...(await fetchGifs(this.state.offset))] })
      //this.setState({ feed: [...this.state.feed, ...(await fetchGifs(this.state.offset))] })
    }

    if (e == 'illustration') {
      console.log(await fetchTag('illustration'))
    }

    if (e == 'tag') {
      console.log(this.state.feed.length)
      this.setState({ feed: [...this.state.feed, ...(await fetchTag(this.state.search, this.state.feed[this.state.feed.length - 1].id))] })
    }

    this.setState({ reset: false })

    //this.setState({ feed : this.state.feed })

  }

  search = async (e) => {
    //console.log(await fetchGLB())
    //console.log(await fetchMusic())

    this.setState({ items: [], feed: [], search: e })
    // search for alias
    console.log(await fetchSubjkts(e))
    this.setState({ subjkt: await fetchSubjkts(this.state.search) })

    if ((this.state.subjkt[0]?.hdao_balance > 30000000) || (isFloat(Number(this.state.search)))) {
      this.setState({ feed: await fetchCreations(this.state.subjkt[0].address, this.state.offset), select: 'creations' })
    } else if (!isNaN(this.state.search)) {
      //await fetchLatest(this.state.search)
      this.setState({ feed: await fetchFeed(Number(this.state.search) + 1), select: 'num' })
    } else {
      this.setState({ feed: await fetchTag(this.state.search.toLowerCase(), 9999999), select: 'tag' })
      //console.log('tags', await fetchTag(this.state.search.toLowerCase()))
      // search for objkt titles/descriptions

      /*       
            let title = await fetchTitle(this.state.search)
            console.log('title', title)
            if (await title) this.setState({ items: [...this.state.items, ...(await title)] })
            let description = await fetchDescription(this.state.search)
            console.log('description', description)
            if (await description) this.setState({ items: [...this.state.items, ...(await description)] })       
      */

    }



    // verify if tz profiles/hdao
    console.log('test', this.state.feed)

    // results from creator
    //if (this.state.subjkt.length > 0) {
    //console.log('address', this.state.subjkt[0].address)
    //console.log('creations', await fetchCreations(this.state.subjkt[0].address))
    //this.setState({ items : await fetchCreations(this.state.subjkt[0].address) })
    //this.setState({ feed: [...this.state.feed, this.state.items.slice(0, 20)] })
    //}

    // search alias creations?

    // search for itemss

    // search for objkt id

    console.log(this.state)

  }

  hoverState = (bool) => this.setState({ mouse: bool })

  select = (id) => this.setState({ select: [...this.state.select, id] })

  loadMore = () => {
    this.setState({ offset: this.state.offset + 15 })
    console.log(this.context.offset)
    //this.setState({ feed: [...this.state.feed, ...this.state.items.slice(this.state.offset + 20, this.state.offset + 40)], offset: this.state.offset + 20 })
    this.update(this.state.select, false)

    // console.log(this.state.feed.length)

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
              onChange={e => this.search(e.target.value)}
              label="objkt id, artists, tags"
              placeholder="objkt id, artists, tags"
            />
            {/*             <button onClick={this.search}>search</button>
 */}            {/*             {
              this.state.tags.map(e => {
                return <span>{e._id.tag} </span>
              })
            } */}
            {
              <div style={{ marginTop: '15px' }}>
                {this.state.tags.map(e => <a className='tag' href='#' onClick={() => {
                  this.update(e.value, true)
                }}>{e.value} </a>)}
              </div>
            }
            {
              (this.state.subjkt.length > 0) && (this.state.search !== "") ?
                <div style={{ maxHeight: '200px', overflow: 'scroll' }}>
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
            this.state.feed.length > 0 ?
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
