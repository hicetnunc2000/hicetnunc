import React, { Component } from 'react'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Page, Container, Padding } from '../../components/layout'
import { Loading } from '../../components/loading'
import { FeedItem } from '../../components/feed-item'
import InfiniteScroll from 'react-infinite-scroll-component'

async function fetchGraphQL(operationsDoc, operationName, variables) {
  let result = await fetch(process.env.REACT_APP_GRAPHQL_API, {
    method: 'POST',
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  })
  return await result.json()
}

const query_frenCreations = `
query frensGallery($wallets: [String!], $lastId: bigint!) {
  hic_et_nunc_token(where: {creator_id: {_in: $wallets}, id: {_lt: $lastId}, artifact_uri: {_neq: ""}}, order_by: {id: desc}, limit: 20) {
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
}
`;

const query_frens = `
query collectorGallery($address: String!) {
  hic_et_nunc_token_holder(where: {holder_id: {_eq: $address}, token: {creator_id: {_neq: $address}}}, order_by: {token_id: desc}) {
    token {
      creator_id
    }
  }
}
`;

async function fetchAllFrensAddresses(myWalletAddr) {
  const { errors, data } = await fetchGraphQL(query_frens, "collectorGallery", { "address": myWalletAddr });
  if (errors) console.error(errors);

  let frensAddresses = []
  for (let holding of data.hic_et_nunc_token_holder) {
    frensAddresses.push(holding.token.creator_id)
  }
  // uniq address
  frensAddresses = [...new Set(frensAddresses)]
  return frensAddresses
}

export class Friends extends Component {
  static contextType = HicetnuncContext

  state = {
    wallet: '',
    lastId: 99999999,
    render: false,
    loading: true,
    frens: [],
    creations: [],
  }

  fetchFeed = async () => {
    const { errors, data } = await fetchGraphQL(query_frenCreations, "frensGallery", {
      "wallets": this.state.frens,
      "lastId": this.state.lastId,
    });

    if (errors) console.error(errors);
    const result = data.hic_et_nunc_token

    let lastId = Math.min.apply(Math, result.map(e => e.id))
    this.setState({ lastId: lastId })
    return result
  }

  loadMore = async () => {
    let result = await this.fetchFeed()
    this.setState({
      creations: this.state.creations.concat(result),
    })
  }



  componentWillMount = async () => {
    const id = window.location.pathname.split('/')[1]
    if (id === 'friends') {
      const wallet = window.location.pathname.split('/')[2]
      this.setState({ wallet: wallet })
      this.onReady()
    } else {
      // address not found, redirect to home
      this.props.history.push('/')
    }
  }

  // called if there's no redirect
  onReady = async () => {
    this.context.setPath(window.location.pathname)
    let myWalletAddr = ''
    if (window.location.pathname.split('/')[1] === 'friends') {
      myWalletAddr = window.location.pathname.split('/')[2]
    }

    const getLatestByFrens = async () => {
      try {
        const frensAddresses = await fetchAllFrensAddresses(myWalletAddr);
        this.setState({ frens: frensAddresses })
        return this.fetchFeed()
      } catch (error) {
        console.log(error)
      }
    }

    const frenCreations = await getLatestByFrens()
    this.setState({
      creations: frenCreations,
      loading: false,
    })
  }

  render() {
    return (
      <Page title={this.state.alias}>

        {this.state.loading && (
          <Container>
            <Padding>
              <Loading />
            </Padding>
          </Container>
        )}
        {!this.state.loading && (
          <>
            {this.state.creations == 0 && (
              <Container>
                <Padding>
                  <p style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    No OBJKTs have been collected by this wallet address
                  </p>
                  {JSON.stringify(this.state.creations)}
                </Padding>
              </Container>
            )}
          </>
        )}
        {!this.state.loading && this.state.creations && (
          <Container xlarge>
            <InfiniteScroll
              dataLength={this.state.creations.length}
              next={this.loadMore}
              hasMore={true}
              loader={undefined}
              endMessage={
                <p>
                  mint mint mint{' '}
                  <span role="img" aria-labelledby={'Sparkles emoji'}>
                    ✨
                  </span>
                </p>
              }
            >
              <Container>
                <Padding>
                  {this.state.creations.map((item, index) => (
                    <FeedItem key={`${item.id}-${index}`} {...item} creator_id={item.creator.address} />
                  ))}
                </Padding>
              </Container>
            </InfiniteScroll>
          </Container>
        )}
      </Page>
    )
  }
}