import React, { Component } from 'react'
import { AccountInfo, DAppClient, TezosOperationType } from '@airgap/beacon-sdk'
import { encodeMainnet, decodeMainnet } from 'tezos-uri'
import { Helmet } from 'react-helmet'
import { UngrundContext } from '../context/UngrundContext'
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap'
import { Redirect } from 'react-router-dom'
//import { Tezos } from "@taquito/taquito";
//import { BeaconWallet } from "@taquito/beacon-wallet";
//const tezbridge = require('../tezbridge')

const axios = require('axios')
/* import {
    PermissionScope,
    TezosOperationType,
    BeaconEvent,
  } from "@airgap/beacon-sdk";
  import { Tezos } from "@taquito/taquito";
  import { BeaconWallet } from "@taquito/beacon-wallet"; */

export default class Sync extends Component {
  constructor(props) {
    super(props)

    this.state = {
      address: '',
      opHash: '',
      bytes: '',
      client: null,
      operation: {},
    }
  }

  static contextType = UngrundContext

  /* 
    initializes session
    */

  loadScript = async () => {
    const script = document.createElement('script')
    script.src = 'https://www.tezbridge.com/plugin.js'
    script.async = true
    script.onload = () => this.bridgeSource()

    document.body.appendChild(script)
  }

  bridgeSource = async () => {
    const address = await window.tezbridge
      .request({ method: 'get_source' })
      .then((address) => {
        console.log(address)
        this.setState({
          address: address,
        })
      })
      .catch((err) => console.log(err))
    this.tezosContractOrigination()
  }

  componentWillMount = async () => {
    this.airGapClient()
  }

  sync = async () => {
    this.state.loading = true
    this.render()
    this.airGapClient()
  }

  /* 
    https://github.com/airgap-it/beacon-vue-example/blob/master/src/components/Beacon.vue
    */

  airGapClient = async () => {
    const client = new DAppClient({ name: 'ungrund' })

    await client
      .requestPermissions()
      .then((permissions) => {
        console.log('got permissions', permissions)
        console.log(permissions.address)
        this.setState({
          address: permissions.address,
        })
        this.context.setAddress(permissions.address)
        this.context.setAuth()
      })
      .catch((error) => console.log(error))
    //this.contractOrigination(client)
    //.signPayloadRequest('test').catch(e => console.log(e))
    //await client.signPayloadRequest({ payload: 'test' })

    return client
  }

  signPayload = async (data, client) => {
    const response = await client
      .requestSignPayload({
        payload: 'test' /* data.bytes */,
      })
      .then((response) => {
        console.log(response.signature)
        //this.inject(response.signature, data)
      })
      .catch((signPayloadError) => console.error(signPayloadError))
  }

  inject = async (signature, data) => {
    axios
      .post('http://localhost:5000/forge/sign', {
        op: data.operation,
        sig: signature,
        tz: this.context.address,
      })
      .then((res) => console.log(res))
      .catch((e) => console.log(e))
  }

  /*     taquito = async () => {
            const wallet = new BeaconWallet({ name: "ungrund" });
            Tezos.setWalletProvider(wallet);
            // Request permissions
            await wallet.requestPermissions();
            // Get contract
            const contract = await Tezos.wallet.at(
                "KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn" // TZBTC
            );
            // Call a method on a contract
            const result = await contract.methods
                .transfer(
                    "tz1d75oB6T4zUMexzkr5WscGktZ1Nss1JrT7",
                    "tz1Mj7RzPmMAqDUNFBn5t5VbXmWW4cSUAdtT",
                    1
                )
            console.log(result)
        } */
  /* */
  requestOperation = async () => {
    // post address -> forge operation from ungrund
    const client = new DAppClient({ name: 'ungrund' })
    const operationResponse = await client
      .requestOperation({
        operationDetails: [
          {
            kind: TezosOperationType.TRANSACTION,
            amount: '123',
            destination: 'tz1Mj7RzPmMAqDUNFBn5t5VbXmWW4cSUAdtT',
          },
        ],
      })
      .catch((e) => {
        console.log(e)
      })
    //this.operationHash = operationResponse.transactionHash;
  }

  tezosUriTransaction = () => {
    axios.post('https://localhost:5000/forge/transaction')
  }

  contractOrigination = async (client) => {
    axios
      .post('http://localhost:5000/forge/origination', {
        tz: this.state.address,
      })
      .then(async (resp) => {
        console.log(resp.data)
        return resp.data
        //const encoded = encodeMainnet( [{ content : resp.data.contents[0] }] )
        //const decoded = decodeMainnet(resp.data)
        //console.log(decoded)
      })
      .then(async (data) => this.signPayload(data, client))
      .catch((e) => console.log(e))
  }

  /*
        callContract = async () => {
            const wallet = new BeaconWallet({ name: "Ungrund" });
            Tezos.setWalletProvider(wallet);
            // Request permissions
            await wallet.requestPermissions();
            // Get contract
            const contract = await Tezos.wallet.at(
                "KT1HS4h6r1WnHVqsCbZELpC92y4ugrZRFhkT"
            );
            const result = await contract.methods
                .transfer(
                    "tz1d75oB6T4zUMexzkr5WscGktZ1Nss1JrT7",
                    "tz1Mj7RzPmMAqDUNFBn5t5VbXmWW4cSUAdtT",
                    1
                )
                .send();
            this.taquitoOperationHash = result.opHash;
        }
     */

  render() {
    return (
      <div>
        {this.context.address != '' ? (
          <Redirect to={`/hic/${this.context.address}`} />
        ) : null}
        {this.context.address}
        {window.location.pathname}
      </div>
    )
  }
}
