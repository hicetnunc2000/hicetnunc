import React, { Component } from 'react'
import { Page, Container, Padding } from '../../components/layout'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Input } from '../../components/input'
import { FeedItem } from '../../components/feed-item'
import InfiniteScroll from 'react-infinite-scroll-component'
import './style.css'

const axios = require('axios')
const _ = require('lodash')

async function fetchFeed(lastId) {
  const { errors, data } = await fetchGraphQL(`
query LatestFeed {
  hic_et_nunc_token(order_by: {id: desc}, limit: 15, where: {id: {_lt: ${lastId}}, artifact_uri: {_neq: ""}}) {
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
}`, "LatestFeed", {});
  if (errors) {
    console.error(errors);
  }
  const result = data.hic_et_nunc_token
  /* console.log({ result }) */
  return result
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
  const { data } = await fetchGraphQL(`
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
  const { data } = await fetchGraphQL(`
  query GLBObjkts {
    hic_et_nunc_token(where : { mime : {_in : ["model/gltf-binary"] }, supply : { _neq : 0 }}, limit : 15, offset : ${offset}, order_by: {id: desc}) {
      id
      artifact_uri
      display_uri
      mime
      creator_id
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

async function fetchInteractive(offset) {
  const { data } = await fetchGraphQL(`
    query InteractiveObjkts {
      hic_et_nunc_token(where: { mime: {_in : [ "application/x-directory", "image/svg+xml" ]}, supply : { _neq : 0 } }, limit : 30, offset : ${offset}, order_by: {id: desc}) {
        id
        artifact_uri
        display_uri
        mime
        creator_id
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
  const { data } = await fetchGraphQL(`
    query Gifs ($offset: Int = 0) {
      hic_et_nunc_token(where: { mime: {_in : [ "image/gif" ]}, supply : { _neq : 0 }}, order_by: {id: desc}, limit: 15, offset: ${offset}) {
        id
        artifact_uri
        display_uri
        mime
        creator_id
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
  const { data } = await fetchGraphQL(`
  query AudioObjkts {
    hic_et_nunc_token(where: {mime: {_in: ["audio/ogg", "audio/wav", "audio/mpeg"]}, supply : { _neq : 0 }}, limit : 15, offset : ${offset}, order_by: {id: desc}) {
      id
      artifact_uri
      display_uri
      mime
      creator_id
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

async function fetchRandomObjkts() {
  const firstId = 196
  const lastId = await getLastId()

  const uniqueIds = new Set()
  while (uniqueIds.size < 15) {
    uniqueIds.add(rnd(firstId, lastId))
  }

  const { errors } = await fetchObjkts(Array.from(uniqueIds));

  let objkts = await fetchObjkts(Array.from(uniqueIds));

  if (errors) {
    console.error(errors);
  }

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
        creator {
          name
          address
        }
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

async function fetchSales(offset) {
  const { errors, data } = await fetchGraphQL(`
  query sales {
    hic_et_nunc_trade(order_by: {timestamp: desc}, limit : 15, offset : ${offset}, where: {swap: {price: {_gte: "500000"}}}) {
      timestamp
      swap {
        price
      }
      token {
        artifact_uri
        display_uri
        id
        mime
        creator_id
        creator {
          name
          address
        }
      }
    }
  }`, 'sales', {})

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
    hic_et_nunc_holder(where: { name: {_ilike: "%${subjkt}%"}}, order_by: {hdao_balance: desc}) {
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
    creator_id
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

const getRestrictedAddresses = async () =>
  await axios
    .get(
      'https://raw.githubusercontent.com/hicetnunc2000/hicetnunc-reports/main/filters/w.json'
    )
    .then((res) => res.data)

export class Search extends Component {
  static contextType = HicetnuncContext

  state = {
    subjkt: [],
    items: [],
    feed: [],
    search: '',
    prev: '',
    reset: false,
    flag: false,
    lastId: undefined,
    tags: [
      { id: 0, value: '○ hDAO' },
      { id: 1, value: 'random' },
      { id: 2, value: 'glb' },
      { id: 3, value: 'music' },
      { id: 4, value: 'html/svg' }, // algorithimc?
      { id: 5, value: 'gif' },
      { id: 6, value: 'new OBJKTs' },
      { id: 7, value: 'recent sales' },
      { id: 8, value: '1D' },
      { id: 9, value: '1W' },
      { id: 10, value: '1M' },
      { id: 11, value: 'ATH' }
    ],
    select: [],
    mouse: false,
    hasMore: true,
    offset: 0
  }

  componentWillMount = async () => {
    let arr = await getRestrictedAddresses()
    this.setState({ select: 'recent sales' })
    let tokens = await fetchSales(this.state.offset)
    tokens = tokens.map(e => e.token)
    tokens = tokens.filter(e => !arr.includes(e.creator_id))
    this.setState({ feed: _.uniqBy(_.uniqBy([...this.state.feed, ...tokens], 'id'), 'creator_id') })
    //this.latest(999999)
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })

    //if (this.state.search.length >= 1) this.search()
  }

  update = async (e, reset) => {

    let arr = await getRestrictedAddresses()

    this.setState({ select: e })
    if (reset) {
      this.state.feed = []
      this.state.offset = 0
    }

    if (e === '1D') {

      let list = await fetchDay(new Date((new Date()).getTime() - 60 * 60 * 24 * 1000).toISOString(), this.state.offset)
      list = list.map(e => e.token)
      list = [...this.state.feed, ...(list)]
      list = list.filter(e => !arr.includes(e.creator.address))
      list = _.uniqBy(list, 'id')

      this.setState({
        feed: list
      })
    }

    if (e === '1W') {
      let list = await fetchDay(new Date((new Date()).getTime() - 60 * 60 * 24 * 7 * 1000).toISOString(), this.state.offset)
      list = list.map(e => e.token)
      list = [...this.state.feed, ...(list)]
      list = list.filter(e => !arr.includes(e.creator.address))

      list = _.uniqBy(list, 'id')

      this.setState({
        feed: list
      })
    }


    if (e === '1M') {
      let list = await fetchDay(new Date((new Date()).getTime() - 60 * 60 * 24 * 30 * 1000).toISOString(), this.state.offset)
      list = list.map(e => e.token)
      list = [...this.state.feed, ...(list)]
      list = list.filter(e => !arr.includes(e.creator.address))

      list = _.uniqBy(list, 'id')

      this.setState({
        feed: list
      })
    }

    if (e === 'ATH') {
      let list = await fetchDay(new Date('2021-05-01').toISOString(), this.state.offset)
      list = list.map(e => e.token)
      list = [...this.state.feed, ...(list)]
      list = _.uniqBy(list, 'id')
      console.log('ath', list)
      this.setState({
        feed: list
      })
    }

    if (e === 'num') {
      let res = await fetchFeed(Number(this.state.search) + 1 - this.state.offset)
      res = res.filter(e => !arr.includes(e.creator_id))
      this.setState({
        feed: [...this.state.feed, ...(res)]
      })
    }

    if (e === '○ hDAO') {
      //let res = await fetchHdao(this.state.offset)
      //res = res.filter(e => !arr.includes(e.creator_id))
      this.setState({ feed: _.uniqBy(_.uniqBy([...this.state.feed, ...(await fetchHdao(this.state.offset))], 'id'), 'creator_id'), hdao: true })
    }

    if (e === 'music') {
      this.setState({ feed: _.uniqBy([...this.state.feed, ...(await fetchMusic(this.state.offset))], 'creator_id') })
    }

    if (e === 'video') {

    }

    if (e === 'glb') {
      //let res = await fetchGLB(this.state.offset)
      //res = res.filter(e => !arr.includes(e.creator_id))
      this.setState({ feed: _.uniqBy([...this.state.feed, ...(await fetchGLB(this.state.offset))], 'creator_id') })
    }

    if (e === 'html/svg') {
      let res = await fetchInteractive(this.state.offset)
      res = res.filter(e => !arr.includes(e.creator_id))
      this.setState({ feed: _.uniqBy([...this.state.feed, ...(res)], 'creator_id') })
    }

    if (e === 'random') {
      let res = await fetchRandomObjkts()
      res = res.filter(e => !arr.includes(e.creator_id))
      this.setState({ feed: [...this.state.feed, ...(res)] })
    }

    if (e === 'gif') {
      //let res = await fetchGifs(this.state.offset)
      //res = res.filter(e => !arr.includes(e.creator_id))
      this.setState({ feed: _.uniqBy([...this.state.feed, ...(await fetchGifs(this.state.offset))], 'creator_id') })
    }

    if (e === 'illustration') {
      console.log(await fetchTag('illustration'))
    }

    if (e === 'tag') {
      let res = await fetchTag(this.state.search, this.state.feed[this.state.feed.length - 1].id)
      res = res.filter(e => !arr.includes(e.creator_id))
      this.setState({ feed: _.uniqBy([...this.state.feed, ...(res)], 'creator_id') })
    }

    if (e === 'recent sales') {
      let tokens = await fetchSales(this.state.offset)
      tokens = tokens.map(e => e.token)
      tokens = tokens.filter(e => !arr.includes(e.creator_id))
      this.setState({ feed: _.uniqBy(_.uniqBy([...this.state.feed, ...tokens], 'id'), 'creator_id') })
    }

    if (this.state.select === 'new OBJKTs') {
      this.latest()
    }

    // new listings

    this.setState({ reset: false })

  }

  latest = async () => {
    let result = []
    if (this.state.flag) {
      result = await fetchFeed(Math.min.apply(Math, this.state.feed.map(e => e.id)))
    } else {
      result = await fetchFeed(999999)
    }
    console.log(result)
    let restricted = await getRestrictedAddresses()
    result = _.uniqBy([...this.state.feed, ...result], 'creator_id')
    result = result.filter(e => !restricted.includes(e.creator_id))
    this.setState({ feed: [...result], flag: true })
  }


  search = async (e) => {

    console.log(e)

    this.setState({ items: [], feed: [], search: e })
    this.setState({ subjkt: await fetchSubjkts(this.state.search) })

    if (!isNaN(this.state.search)) {
      this.setState({ feed: await fetchFeed(Number(this.state.search) + 1), select: 'num' })
    } else {
      this.setState({ feed: _.uniqBy(await fetchTag(this.state.search.toLowerCase(), 9999999), 'creator_id'), select: 'tag' })
    }


    console.log(this.state.feed)
  }

  hoverState = (bool) => this.setState({ mouse: bool })

  select = (id) => this.setState({ select: [...this.state.select, id] })

  loadMore = () => {
    this.setState({ offset: this.state.offset + 15 })
    this.update(this.state.select, false)
  }

  handleKey = (e) => {
    console.log(this.state.search)
    if (e.key === 'Enter') this.search(this.state.search)
  }

  render() {

    return (
      <Page>
        <Container>
          <Padding>
                <Input
                  type="text"
                  name="search"
                  onChange={this.handleChange}
                  label="search ↵"
                  placeholder="search ↵"
                  onKeyPress={this.handleKey}
                />
            {
              <div style={{ marginTop: '15px' }}>
                {this.state.tags.map(e => <a className='tag' href='#' onClick={() => { // eslint-disable-line jsx-a11y/anchor-is-valid
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
                <Container>
                  <Padding>
                    {this.state.feed.map((item, index) => (
                      <FeedItem key={`${item.id}-${index}`} {...item} />
                    ))}
                  </Padding>
                </Container>
              </InfiniteScroll>
              :
              undefined
          }
        </Container>
      </Page>
    )
  }
}
