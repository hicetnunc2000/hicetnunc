import React, { Component } from 'react'
import { Button, Primary } from '../../components/button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Page, Container, Padding } from '../../components/layout'
import { Loading } from '../../components/loading'
import { renderMediaType } from '../../components/media-types'
import { PATH } from '../../constants'
import styles from './styles.module.scss'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FeedItem } from '../../components/feed-item'

const axios = require('axios')
const fetch = require('node-fetch')

const query_frenCreations = `
query creatorGallery($address: String!) {
  hic_et_nunc_token(limit: 3, where: {creator: {address: {_eq: $address}}, supply: {_gt: 0}}, order_by: {id: desc}) {
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
`;

async function fetchFrenCreationsGraphQL(operationsDoc, operationName, variables) {
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
  return await result.json()
}

async function fetchFrenCreations(frensAddress) {
  const { errors, data } = await fetchFrenCreationsGraphQL(query_frenCreations, "creatorGallery", { "address": frensAddress });
  if (errors) {
    console.error(errors);
  }
  const result = data.hic_et_nunc_token
  return result
}

const query_frens = `
  query collectorGallery($address: String!) {
    hic_et_nunc_token_holder(where: {holder_id: {_eq: $address}}, order_by: {token_id: desc}) {
      token {
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
        creator {
          address
        }
      }
    }
  }
`;

async function fetchFrensGraphQL(operationsDoc, operationName, variables) {
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

async function fetchAllFrensAddresses(myWalletAddr) {
  const { errors, data } = await fetchFrensGraphQL(query_frens, "collectorGallery", {"address": myWalletAddr});
  if (errors) {
    console.error(errors);
  }
  let results = data.hic_et_nunc_token_holder.map(function(result) {
    return result['token'];
  });

  let frensAddresses = []

  results.forEach(function(result) {
    frensAddresses.push(result.creator.address);
  })

  let frensAddressesFiltered = frensAddresses.filter((item,index) =>{
    return frensAddresses.indexOf(item) === index;
  })

  // console.log({ frensAddressesFiltered })

  return frensAddressesFiltered
}

async function sortCreations(creations) {
  let allFrenCreations = []

  creations.forEach(function(creation) {
    creation.forEach(function(a) {
      allFrenCreations.push(a)
    })
  })
  
  const allSorted = allFrenCreations.sort(function(a, b) {
    return b.id - a.id
  })

  return allFrenCreations  
}

export default class Friends extends Component {
  static contextType = HicetnuncContext

  state = {
    wallet: '',
    render: false,
    loading: true,
    creations: [],
  }

  componentWillMount = async () => {
    const id = window.location.pathname.split('/')[1]

    if (id === 'friends') {
      const wallet = window.location.pathname.split('/')[2]
      this.setState({
        wallet,
      })
      this.onReady()
    } else {
      await axios
        .then((res) => {
          if (res.data.result.length === 0) {
            // if alias is not found, redirect to homepage
            this.props.history.push('/')
          } else {
            this.setState({
              wallet: res.data.result[0].tz,
            })

            this.onReady()
          }
        })
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
        
        const allCreationsPromise = frensAddresses.map(async fren => {
          const frenCreations = await fetchFrenCreations(fren)
          return frenCreations
        })

        const allCreations = await Promise.all(allCreationsPromise)
        const allSortedCreations = await sortCreations(allCreations);
        
        return allSortedCreations

      } catch (error) {
        console.log(error)
      }
    }

    const frenCreations = await getLatestByFrens()
    // console.log(frenCreations)

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
        
        <div>
          <Container>
            <Padding>
              {this.state.creations.map((item, index) => (
                <FeedItem key={`${item.id}-${index}`} {...item} />
              ))}
            </Padding>
          </Container>
        </div>
      </Page>
    )
  }
}
