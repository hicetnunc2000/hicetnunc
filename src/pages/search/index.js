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

const query_tag = `
query ObjktsByTag($tag: String = "3d", $lastId: bigint = 99999999) {
  hic_et_nunc_token(where: {token_tags: {tag: {tag: {_eq: $tag}}}, id: {_lt: $lastId}, supply: {_gt: "0"}}, order_by: {id: desc}) {
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
      hic_et_nunc_token(where: {id: {_in: $ids}}) {
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
    hic_et_nunc_token(where : { mime : {_in : ["model/gltf-binary"] }}, order_by: {id: desc}) {
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

async function fetchInteractive(offset) {
  const { errors, data } = await fetchGraphQL(`
    query InteractiveObjkts {
      hic_et_nunc_token(where: { mime: {_in : [ "application/x-directory" ]}}, order_by: {id: desc}) {
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
      hic_et_nunc_token(where: { mime: {_in : [ "image/gif" ]}}, order_by: {id: desc}, offset: ${offset}) {
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
    hic_et_nunc_token(where: {mime: {_in: ["audio/ogg", "audio/wav", "audio/mpeg"]}}, order_by: {id: desc}) {
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
  const { errors, data } = await fetchGraphQL(
    query_creations,
    'creatorGallery',
    { 
      address: addr,
      offset: offset
    }
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
  while (uniqueIds.size < 50) {
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

async function fetchSubjkts(subjkt) {
  //console.log(subjkt)
  const { errors, data } = await fetchGraphQL(`
  query subjktsQuery {
    hic_et_nunc_holder(where: { name: {_like: "%${subjkt}%"}}) {
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

async function fetchTag(tag) {
  const { errors, data } = await fetchGraphQL(query_tag, "ObjktsByTag", { "tag" : tag });
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

const query_hdao = `query hDAOFeed($offset: Int = 0) {
  hic_et_nunc_token(order_by: {hdao_balance: desc}, limit: 50, where: {hdao_balance: {_gt: 100}}, offset: $offset) {
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
    tags: [
      { id: 0, value: '○' },
      { id: 1, value: 'random' },
      { id: 2, value: 'glb' },
      { id: 3, value: 'music' },
      { id: 3, value: 'interactive' },
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

  update = async (e) => {

    this.setState({ feed: [], items: [] })

    if (e === '○') {
      this.setState({ items: await fetchHdao(this.state.offset), hdao: true })
    }

    if (e === 'music') {
      console.log(await fetchMusic(this.state.offset + 10))
      this.setState({ items: await fetchMusic() })
    }

    if (e === 'glb') {
      this.setState({ items: await fetchGLB() })
    }

    if (e === 'interactive') {
      this.setState({ items: await fetchInteractive() })
    }

    if (e == 'random') {
      console.log(await fetchRandomObjkts())
      this.setState({ items: await fetchRandomObjkts() })
    }

    if (e == 'gif') {
      console.log(await fetchGifs())
    }

    if (e == 'illustration') {
      console.log(await fetchTag('illustration'))
    }

    this.setState({ feed : this.state.items.slice(0, 10) })
  }

  search = async (e) => {
    //console.log(await fetchGLB())
    //console.log(await fetchMusic())

    this.setState({ items: [], feed: [], search: e })
    // search for alias
    console.log(await fetchSubjkts(e))
    this.setState({ subjkt: await fetchSubjkts(this.state.search) })

    if (this.state.subjkt[0]?.hdao_balance > 30000000) {
      this.setState({ items: await fetchCreations(this.state.subjkt[0].address) })
    } else {
      this.setState({ items: await fetchTag(this.state.search.toLocaleLowerCase()) })
      console.log('tags', await fetchTag(this.state.search))
      // search for objkt titles/descriptions

/*       let title = await fetchTitle(this.state.search)
      console.log('title', title)
      if (await title) this.setState({ items: [...this.state.items, ...(await title)] })
      let description = await fetchDescription(this.state.search)
      console.log('description', description)
      if (await description) this.setState({ items: [...this.state.items, ...(await description)] }) */

      
    }


    var resArr = [];
    this.state.items.forEach(function (item) {
      var i = resArr.findIndex(x => x.id == item.id);
      if (i <= -1) {
        resArr.push(item);
      }
    });
    this.setState({ items : resArr })

    // verify if tz profiles/hdao
    this.setState({ feed: [...this.state.feed, ...(this.state.items.slice(0, 10))] })
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

    if (this.state.feed.length <= this.state.items.length) {
      this.setState({ feed: [...this.state.feed, ...this.state.items.slice(this.state.offset + 10, this.state.offset + 20)], offset: this.state.offset + 10 })
    } else {
      this.setState({ hasMore : false })
    }

    console.log(this.state.feed.length)

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
                {this.state.tags.map(e => <a className='tag' href='#' onClick={() => this.update(e.value)}>{e.value} </a>)}
              </div>
            }
            {
              this.state.subjkt.length > 0 ?
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
