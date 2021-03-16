import React, { createContext, Component } from 'react'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { TezosToolkit } from '@taquito/taquito'

const { NetworkType } = require('@airgap/beacon-sdk')
var ls = require('local-storage')
const axios = require('axios')

export const HicetnuncContext = createContext()

// This should be moved to a service so it is only done once on page load
const Tezos = new TezosToolkit('https://mainnet.smartpy.io')
const wallet = new BeaconWallet({
  name: 'hicetnunc.xyz',
  preferredNetwork: 'mainnet',
})
Tezos.setWalletProvider(wallet)

export default class HicetnuncContextProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pathname: '',

      address: '',

      op: undefined,

      contract: '',

      setAddress: (address) => this.setState({ address: address }),

      setAuth: (address) => {
        ls.set('auth', address)
      },

      updateLs: (key, value) => {
        ls.set(key, value)
      },

      getLs: (key) => {
        return ls.get(key)
      },

      getAuth: () => {
        return ls.get('auth')
      },

      client: null,

      setClient: (client) => {
        this.setState({
          client: client,
        })
      },

      dAppClient: async () => {
        this.state.client = wallet.client

        // It doesn't look like this code is called, otherwise the active account should be checked, see below.
        this.state.client
          .requestPermissions({
            network: {
              type: NetworkType.MAINNET,
              rpcUrl: 'https://mainnet.smartpy.io',
            },
          })
          .then((permissions) => {
            this.setState({
              address: permissions.address,
            })

            this.state.setAuth(permissions.address)
          })
          .catch((error) => console.log(error))
      },

      objkt: 'KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9',

      mint: async (tz, amount, cid, royalties) => {
        return new Promise((resolve, reject) => {
          Tezos.wallet
            .at(this.state.objkt)
            .then((c) =>
              c.methods
                .mint_OBJKT(
                  tz,
                  parseFloat(amount),
                  ('ipfs://' + cid)
                    .split('')
                    .reduce(
                      (hex, c) =>
                        (hex += c.charCodeAt(0).toString(16).padStart(2, '0')),
                      ''
                    ),
                  parseFloat(royalties) * 10
                )
                .send({ amount: 0 })
            )
            .then((op) =>
              op.confirmation(1).then(() => {
                resolve(op)
                this.setState({ op: op.hash })
              })
            )
        })
      },

      collect: async (objkt_amount, swap_id, amount) => {
        return await Tezos.wallet
          .at(this.state.objkt)
          .then((c) =>
            c.methods
              .collect(parseFloat(objkt_amount), parseFloat(swap_id))
              .send({ amount: parseFloat(amount), mutez: true })
          )
          .catch((e) => e)
      },

      swap: async (objkt_amount, objkt_id, xtz_per_objkt) => {
        return await Tezos.wallet
          .at(this.state.objkt)
          .then((c) =>
            c.methods
              .swap(
                parseFloat(objkt_amount),
                parseFloat(objkt_id),
                parseFloat(xtz_per_objkt)
              )
              .send({ amount: 0 })
          )
          .catch((e) => e)
      },

      curate: async (objkt_id) => {
        await Tezos.wallet
          .at(this.state.objkt)
          .then((c) =>
            c.methods.curate(10, objkt_id).send()
          )
      },

      claim_hDAO: async (hDAO_amount, objkt_id) => {
        await Tezos.wallet
          .at('KT1TybhR7XraG75JFYKSrh7KnxukMBT5dor6')
          .then((c) => {
            c.methods
              .claim_hDAO(parseInt(hDAO_amount), parseInt(objkt_id))
              .send()
          })
      },

      burn: async (tz, objkt_id, amount) => {
        await Tezos.wallet
          .at('KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton')
          .then((c) =>
            c.methods
              .transfer([
                {
                  from_: tz,
                  txs: [
                    {
                      to_: 'tz1burnburnburnburnburnburnburjAYjjX',
                      token_id: parseInt(objkt_id),
                      amount: parseInt(amount),
                    },
                  ],
                },
              ])
              .send()
          )
      },

      cancel: async (swap_id) => {
        return await Tezos.wallet
          .at(this.state.objkt)
          .then((c) =>
            c.methods.cancel_swap(parseFloat(swap_id)).send({ amount: 0 })
          )
          .catch((e) => e)
      },

      load: false,
      loading: () => this.setState({ load: !this.state.load }),
      /* taquito */
      Tezos: null,
      wallet: null,

      syncTaquito: async () => {
        const network = {
          type: 'mainnet',
          rpcUrl: 'https://mainnet.smartpy.io',
        }

        // We check the storage and only do a permission request if we don't have an active account yet
        // This piece of code should be called on startup to "load" the current address from the user
        // If the activeAccount is present, no "permission request" is required again, unless the user "disconnects" first.
        const activeAccount = await wallet.client.getActiveAccount()
        if (!activeAccount) {
          await wallet.requestPermissions({ network })
        }

        this.setState({
          Tezos: Tezos,
          address: await wallet.getPKH(),
          wallet: wallet,
        })
        this.state.setAuth(await wallet.getPKH())
        console.log(this.state)
      },

      disconnect: async () => {
        // This will clear the active account and the next "syncTaquito" will trigger a new sync
        await wallet.client.clearActiveAccount()
        this.setState({
          address: undefined,
        })
      },

      /* 
                airgap/thanos interop methods
            */
      operationRequest: async (obj) => {
        var op = obj.result
        delete op.mutez
        op.destination = op.to
        op.kind = 'transaction'
        delete op.to
        console.log(obj.result)

        this.state.client.requestOperation({
          operationDetails: [obj.result],
        })
      },

      timeout: (delay) => {
        return new Promise((res) => setTimeout(res, delay))
      },

      signPayload: async (obj) => {
        await wallet.client
          .requestSignPayload({
            payload: obj.payload,
          })
          .then(async (response) => {
            return response.signature
          })
          .catch((signPayloadError) => console.error(signPayloadError))
      },

      curate: async (objkt_id) => {
        await Tezos.wallet
          .at(this.state.objkt)
          .then((c) => c.methods.curate(10, objkt_id).send())
      },

      balance: 0,

      getBalance: (address) => {
        axios
          .get(`https://api.tzkt.io/v1/accounts/${address}/balance_history`, {
            params: {
              address: address,
            },
          })
          .then((res) => {
            console.log(
              'balance',
              parseFloat(res.data[res.data.length - 1].balance / 1000000)
            )
          })
          .catch((e) => console.log('balance error', e))
      },

      collapsed: true,

      toogleNavbar: () => {
        this.setState({ collapsed: !this.state.collapsed })
      },

      setMenu: (collapsed) => {
        this.setState({ collapsed })
      },

      getStyle: (style) =>
        style ? { background: 'white' } : { display: 'none' },

      lastPath: '',

      setPath: (path) => {
        this.setState({
          lastPath: path,
        })
      },
      title: '',
      setTitle: (title) => {
        this.setState({
          title: title,
        })
      },
    }
  }

  render() {
    return (
      <HicetnuncContext.Provider
        value={{
          ...this.state,
        }}
      >
        {this.props.children}
      </HicetnuncContext.Provider>
    )
  }
}
