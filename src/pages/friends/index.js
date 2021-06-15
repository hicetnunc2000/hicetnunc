import React, { Component } from 'react'
import { Button, Primary } from '../../components/button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Page, Container, Padding } from '../../components/layout'
import { Loading } from '../../components/loading'
import { renderMediaType } from '../../components/media-types'
import { PATH } from '../../constants'
import styles from './styles.module.scss'

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
  /* console.log({ result }) */
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

  // console.log({ results })

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

export default class Display extends Component {
  static contextType = HicetnuncContext

  state = {
    wallet: '',
    render: false,
    loading: true,
    creations: [],
  }

  componentWillMount = async () => {
    const id = window.location.pathname.split('/')[1]
    console.log("this.context.acc " + this.context.acc)
    if (id === 'tz') {
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
    //console.log(window.location.pathname.split('/'))
  }


  // called if there's no redirect
  onReady = async () => {
    this.context.setPath(window.location.pathname)

    let myWalletAddr = ''
    
    if (window.location.pathname.split('/')[1] === 'tz') {
      myWalletAddr = window.location.pathname.split('/')[2]
    }

    const creations = await fetchFrenCreations(myWalletAddr)
    // console.log(creations)

    const getLatestByFrens = async () => {
      try {
        const frensAddresses = await fetchAllFrensAddresses(myWalletAddr);
        
        const allCreationsPromise = frensAddresses.map(async fren => {
          const frenCreations = await fetchFrenCreations(fren)
          return frenCreations
        })

        const allCreations = await Promise.all(allCreationsPromise)
        console.log(allCreations)
        
        const allSortedCreations = await sortCreations(allCreations);
        console.log(allSortedCreations)
        
        return allSortedCreations

      } catch (error) {
        console.log(error)
      }
    }

    const frenCreations = await getLatestByFrens()
    console.log(frenCreations)

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
          <Container>
            <div>
              {this.state.creations.map((nft, i) => {
                const mimeType = nft.mime
                const uri = nft.artifact_uri

                return (
                  <Button
                    key={nft.id}
                    to={`${PATH.OBJKT}/${nft.id}`}
                  >
                    <div className={styles.container}>
                      {renderMediaType({
                        mimeType,
                        uri: uri.split('//')[1],
                        metadata: nft,
                      })}
                    </div>
                  </Button>
                )
              })}
            </div>
          </Container>
        )}
      </Page>
    )
  }
}
