/* eslint-disable */
import React, { createContext, Component } from 'react'
import { withRouter } from 'react-router'
import {
  BeaconWallet,
  BeaconWalletNotInitialized,
} from '@taquito/beacon-wallet'
import { TezosToolkit, OpKind, MichelsonMap } from '@taquito/taquito'
import { Parser, Expr } from "@taquito/michel-codec";
import { Schema } from "@taquito/michelson-encoder";
import { setItem } from '../utils/storage'
import { KeyStoreUtils } from 'conseiljs-softsigner'
import { PermissionScope } from '@airgap/beacon-sdk'
import { UnitValue } from '@taquito/michelson-encoder'
import { contentType } from 'mime-types';

const { NetworkType } = require('@airgap/beacon-sdk')
var ls = require('local-storage')
const axios = require('axios')
const eztz = require('eztz-lib')

export const HicetnuncContext = createContext()

// TODO: move this schema into separate place?
const createProxySchema = `
  (map address (pair (bool %isCore) (nat %share))))
`

//const bandwidth = navigator.connection.downlink
//const connectionType = navigator.connection
//console.log('band', bandwidth, 'type', connectionType)
// This should be moved to a service so it is only done once on page load
//const Tezos = new TezosToolkit('https://api.tez.ie/rpc/mainnet')
//const Tezos = new TezosToolkit('https://mainnet-tezos.giganode.io')
//const Tezos = new TezosToolkit('https://mainnet.smartpy.io')
const Tezos = new TezosToolkit('https://mainnet.api.tez.ie')
//const Tezos = new TezosToolkit('https://api.tez.ie/rpc/mainnet')
// storage fee adjustment

/* export class PatchedBeaconWallet extends BeaconWallet {
  async sendOperations(params) {
    const account = await this.client.getActiveAccount();
    if (!account) {
      throw new BeaconWalletNotInitialized();
    }
    const permissions = account.scopes;
    this.validateRequiredScopesOrFail(permissions, [PermissionScope.OPERATION_REQUEST]);

    const { transactionHash } = await this.client.requestOperation({
      operationDetails: params.map(op => ({
        ...modifyFeeAndLimit(op),
      })),
    });
    return transactionHash;
  }
}

function modifyFeeAndLimit(op) {
  const { fee, gas_limit, storage_limit, ...rest } = op;
  
  if (op.parameters && (op.parameters.entrypoint === "swap") || (op.parameters.entrypoint === "mint_OBJKT") || (op.parameters.entrypoint === "collect")) {
    rest.storage_limit = 310
  }
  return rest;
}


const wallet = new PatchedBeaconWallet({
  name: 'hicetnunc.xyz',
  preferredNetwork: 'mainnet',
}) */

const wallet = new BeaconWallet({
  name: 'hicetnunc.xyz',
  preferredNetwork: 'mainnet',
})

Tezos.setWalletProvider(wallet)

class HicetnuncContextProviderClass extends Component {

  constructor(props) {
    super(props)

    this.state = {
      // smart contracts

      hDAO: 'KT1AFA2mwNUMNd4SsujE1YYp29vd8BZejyKW',
      subjkt: 'KT1My1wDZHDGweCrJnQJi3wcFaS67iksirvj',
      v1: 'KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9',
      unregistry: 'KT18xby6bb1ur1dKe7i6YVrBaksP4AgtuLES',
      v2: 'KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn',
      objkts: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton',
      hDAO_curation: 'KT1TybhR7XraG75JFYKSrh7KnxukMBT5dor6',
      hDAO_marketplace: 'KT1QPvv7sWVaT9PcPiC4fN9BgfX8NB2d5WzL',

      subjktInfo: {},
      setSubjktInfo: (subjkt) => this.setState({ subjktInfo: subjkt }),

      // hdao marketplace

      cancel_hdao: undefined,

      collect_hdao: async (from, swap_id, token_address, token_id) => {

        let hDAO = await Tezos.wallet.at(this.state.hDAO)
        let marketplace = await Tezos.wallet.at(this.state.hDAO_marketplace)

        let list = [
          {
            kind: OpKind.TRANSACTION,
            ...hDAO.methods.update_operators([{ add_operator: { operator: this.state.hDAO_marketplace, token_id: parseFloat(0), owner: from } }]).toTransferParams({ amount: 0, mutez: true, storageLimit: 150 })
          },
          {
            kind: OpKind.TRANSACTION,
            ...marketplace.methods.collect(swap_id).toTransferParams({ amount: 0, mutez: true, storageLimit: 250 })
          }
        ]

        let batch = await Tezos.wallet.batch(list);
        return await batch.send()

      },

      swap_hDAO: async (from, royalties, token_per_objkt, objkt_id, creator, objkt_amount) => {

        let objkts = await Tezos.wallet.at(this.state.objkts)
        let marketplace = await Tezos.wallet.at(this.state.hDAO_marketplace)

        let list = [
          {
            kind: OpKind.TRANSACTION,
            ...objkts.methods.update_operators([{ add_operator: { operator: this.state.hDAO_marketplace, token_id: parseFloat(objkt_id), owner: from } }]).toTransferParams({ amount: 0, mutez: true, storageLimit: 150 })
          },
          {
            kind: OpKind.TRANSACTION,
            ...marketplace.methods.swap(this.state.hDAO_marketplace, creator, parseFloat(objkt_amount), parseFloat(objkt_id), parseFloat(royalties), parseFloat(0), parseFloat(token_per_objkt)).toTransferParams({ amount: 0, mutez: true, storageLimit: 250 })
          }
        ]

        let batch = await Tezos.wallet.batch(list);
        return await batch.send()

      },

      // marketplace v2

      collectv2: async (swap_id, xtz_amount) => {
        return await Tezos.wallet
          .at(this.state.v2)
          .then((c) =>
            c.methods
              .collect(parseFloat(swap_id))
              .send({
                amount: parseFloat(xtz_amount),
                mutez: true,
                storageLimit: 310,
              })
          )
      },

      swapv2: async (from, royalties, xtz_per_objkt, objkt_id, creator, objkt_amount) => {
        // If using proxy: both calls are made through this.state.proxyAddress:
        const objktsAddress = this.state.proxyAddress || this.state.objkts;
        const marketplaceAddress = this.state.proxyAddress || this.state.v2;
        const ownerAddress = this.state.proxyAddress || from;

        let objkts = await Tezos.wallet.at(objktsAddress)
        let marketplace = await Tezos.wallet.at(marketplaceAddress)

        let list = [
          {
            kind: OpKind.TRANSACTION,
            ...objkts.methods.update_operators([{ add_operator: { operator: this.state.v2, token_id: parseFloat(objkt_id), owner: ownerAddress } }])
              .toTransferParams({ amount: 0, mutez: true, storageLimit: 100 })
          },
          {
            kind: OpKind.TRANSACTION,
            ...marketplace.methods.swap(creator, parseFloat(objkt_amount), parseFloat(objkt_id), parseFloat(royalties), parseFloat(xtz_per_objkt)).toTransferParams({ amount: 0, mutez: true, storageLimit: 270 })
          }
        ]

        let batch = await Tezos.wallet.batch(list);
        return await batch.send()
      },

      batch_cancel: async (arr) => {
        let v1 = await Tezos.wallet.at(this.state.v1)

        /*         const batch = await arr
                  .map((e) => parseInt(e.id))
                  .reduce((batch, id) => {
                    return { kind : OpKind.TRANSACTION, ...batch.withContractCall(v1.methods.cancel_swap(id)).toTransferParams({ amount: 0, mutez: true, storageLimit: 150 }) }
                  }, Tezos.wallet.batch()) */
        const batch = await arr
          .map((e) => parseInt(e.id))
          .reduce((batch, id) => {
            return batch.withContractCall(v1.methods.cancel_swap(id))
          }, Tezos.wallet.batch())
        return await batch.send()
      },

      // fullscreen. DO NOT CHANGE!
      fullscreen: false,
      setFullscreen: (fullscreen) => this.setState({ fullscreen }),

      // theme, DO NO CHANGE!
      theme: 'light',
      setTheme: (theme) => {
        let root = document.documentElement

        const light = theme === 'light'

        setItem('theme', light ? 'light' : 'dark')

        root.style.setProperty(
          '--background-color',
          light ? '#ffffff' : '#111111'
        )
        root.style.setProperty('--text-color', light ? '#000000' : '#dedede')
        root.style.setProperty(
          '--border-color',
          light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.3)'
        )
        root.style.setProperty(
          '--shadow-color',
          light ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)'
        )

        this.setState({ theme })
      },

      // --------------------
      // feedback component
      // --------------------
      feedback: {
        visible: false, // show or hide the component
        message: 'OBJKT minted', // what message to display?
        progress: true, // do we need to display a progress indicator?
        confirm: true, // do we display a confirm button?
        confirmCallback: () => null, // any function to run when the user clicks confirm
      },

      setFeedback: (props) =>
        this.setState({ feedback: { ...this.state.feedback, ...props } }),

      progress : undefined,
      setProgress : (bool) => this.setState({ progress : bool }),
      message: undefined,
      setMessage : (str) => this.setState({ message : str }),
      // --------------------
      // feedback component end
      // --------------------
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

      proxyAddress: null,

      // This will be set after creating a new collab
      // but we don't want to auto-sign in
      originatedContract: null,

      setProxyAddress: (proxyAddress) => {
        // setting proxy updates objkt contract as well:
        this.setState({
          proxyAddress: proxyAddress,
          // objkt: proxyAddress || 'KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9'
        });
      },

      // Do we need this? proxyAddress will push to UI via context
      getProxy: () => this.state.proxyAddress,

      objkt: 'KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9',

      mint: async (tz, amount, cid, royalties) => {
        // show feedback component with followind message and progress indicator

        console.log(cid)

        this.state.setFeedback({
          visible: true,
          message: 'preparing OBJKT',
          progress: true,
          confirm: false,
        })

        // call mint method
        await Tezos.wallet
          .at(this.state.proxyAddress || this.state.v1)
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
              .send({ amount: 0, storageLimit: 310 })
          )
          .then((op) =>
            op.confirmation(1).then(() => {
              this.setState({ op: op.hash }) // save hash
              // if everything goes okay, show the success message and redirect to profile
              this.state.setFeedback({
                message: 'OBJKT minted successfully',
                progress: true,
                confirm: false,
              })

              // hide after 1 second
              setTimeout(() => {
                this.state.setFeedback({
                  visible: false,
                })
              }, 1000)
            })
          )
          .catch((err) => {
            // if any error happens
            this.state.setFeedback({
              message: 'an error occurred ❌',
              progress: true,
              confirm: false,
            })

            // hide after 1 second
            setTimeout(() => {
              this.state.setFeedback({
                visible: false,
              })
            }, 1000)
          })
      },

      collect: async (swap_id, amount) => {
        return await Tezos.wallet
          .at(this.state.proxyAddress || this.state.v2)
          .then((c) =>
            c.methods
              .collect(parseFloat(swap_id))
              .send({
                amount: parseFloat(amount),
                mutez: true,
                storageLimit: 350,
              })
          )
          .catch((e) => e)
      },

      swap: async (objkt_amount, objkt_id, xtz_per_objkt) => {
        return await Tezos.wallet
          .at(this.state.v1)
          .then((c) =>
            c.methods
              .swap(
                parseFloat(objkt_amount),
                parseFloat(objkt_id),
                parseFloat(xtz_per_objkt)
              )
              .send({ amount: 0, storageLimit: 310 })
          )
          .catch((e) => e)
      },

      curate: async (objkt_id) => {
        await axios
          .get(process.env.REACT_APP_REC_CURATE)
          .then((res) => {
            return res.data.amount
          })
          .then((amt) => {
            Tezos.wallet
              .at(this.state.proxyAddress || this.state.v1)
              .then((c) =>
                c.methods
                  .curate(
                    ls.get('hDAO_config') != null
                      ? parseInt(ls.get('hDAO_config'))
                      : amt,
                    objkt_id
                  )
                  .send()
              )
          })
      },

      claim_hDAO: async (hDAO_amount, objkt_id) => {
        await Tezos.wallet
          .at(this.state.hDAO_curation)
          .then((c) => {
            c.methods
              .claim_hDAO(parseInt(hDAO_amount), parseInt(objkt_id))
              .send()
          })
      },

      burn: async (objkt_id, amount) => {
        var tz = await wallet.client.getActiveAccount()

        await Tezos.wallet
          .at(this.state.objkts)
          .then(async (c) =>
            c.methods
              .transfer([
                {
                  from_: tz.address,
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

          this.state.setProgress(false)
      },

      cancelv1: async (swap_id) => {
        return await Tezos.wallet
          .at(this.state.v1)
          .then((c) =>
            c.methods
              .cancel_swap(parseFloat(swap_id))
              .send({ amount: 0, storageLimit: 310 })
          )
          .catch((e) => e)
      },

      cancel: async (swap_id) => {
        return await Tezos.wallet
          .at(this.state.proxyAddress || this.state.v2)
          .then((c) =>
            c.methods
              .cancel_swap(parseFloat(swap_id))
              .send({ amount: 0, storageLimit: 310 })
          )
          .catch((e) => e)
      },

      signStr: async (payload) => {
        const signedPayload = await wallet.client.requestSignPayload(payload)
        // console.log(signedPayload, payload)
        const signature = signedPayload
        // console.log(signature.signature, payload.payload, await wallet.getPKH())
        /*         const r = await KeyStoreUtils.checkSignature(
          signature.signature,
          payload.payload,
          await axios.get(`https://tezos-prod.cryptonomic-infra.tech/chains/main/blocks/head/context/contracts/${await wallet.getPKH()}/manager_key`).then(res => res.data)
        ) */

        const r = await eztz.crypto.verify(
          payload.payload.toString(),
          signature.signature,
          await axios.get(
            `https://tezos-prod.cryptonomic-infra.tech/chains/main/blocks/head/context/contracts/${await wallet.getPKH()}/manager_key`
          )
        )
        // console.log(r)
      },

      registry: async (alias, metadata) => {
        console.log(metadata)
        const subjktAddressOrProxy = this.state.proxyAddress || this.state.subjkt
        return await Tezos.wallet.at(this.state.subjkt).then((c) =>
          c.methods
            .registry(
              ('ipfs://' + metadata.path)
                .split('')
                .reduce(
                  (hex, c) =>
                    (hex += c.charCodeAt(0).toString(16).padStart(2, '0')),
                  ''
                ),
              alias
                .split('')
                .reduce(
                  (hex, c) =>
                    (hex += c.charCodeAt(0).toString(16).padStart(2, '0')),
                  ''
                )
            )
            .send({ amount: 0 })
        )
      },

      hDAO_update_operators: async (address) => {
        return await Tezos.wallet.at(this.state.hDAO).then((c) =>
          c.methods
            .update_operators([
              {
                add_operator: {
                  owner: address,
                  operator: this.state.subjkt,
                  token_id: 0,
                },
              },
            ])
            .send({ amount: 0 })
        )
      },

      unregister: async () => {
        return await Tezos.wallet.at(this.state.unregistry).then((c) => {
          c.methods.sign(undefined).send({ amount: 0 })
        })
      },

      load: false,
      loading: () => this.setState({ load: !this.state.load }),
      /* taquito */
      Tezos: null,
      wallet: null,
      acc: null,

      updateMessage: (message) => this.setState({ message: message }),

      setAccount: async () => {
        this.setState({
          acc:
            Tezos !== undefined
              ? await wallet.client.getActiveAccount()
              : undefined,
          address: await wallet.client.getActiveAccount(),
        })
      },

      syncTaquito: async () => {
        const network = {
          type: 'mainnet',
          rpcUrl: 'https://mainnet.smartpy.io',
        }

        // We check the storage and only do a permission request if we don't have an active account yet
        // This piece of code should be called on startup to "load" the current address from the user
        // If the activeAccount is present, no "permission request" is required again, unless the user "disconnects" first.
        const activeAccount = await wallet.client.getActiveAccount()
        // console.log(activeAccount)
        if (activeAccount === undefined) {
          console.log('permissions')
          await wallet.requestPermissions({ network })
        }

        this.setState({
          Tezos: Tezos,
          address: await wallet.getPKH(),
          acc: await wallet.client.getActiveAccount(),
          wallet,
        })
        this.state.setAuth(await wallet.getPKH())
        // console.log(this.state)
      },

      disconnect: async () => {
        // console.log('disconnect wallet')
        // This will clear the active account and the next "syncTaquito" will trigger a new sync
        await wallet.client.clearActiveAccount()
        this.setState({
          address: undefined,
          acc: undefined,
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
        // console.log(obj.result)

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
          .catch((e) => console.error('balance error', e))
      },

      collapsed: true,

      feed : [],

      offset : 0,

      setFeed : (arr) => this.setState({ feed : arr }),

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
      
      hDAO_vote: ls.get('hDAO_vote'),

      proxyFactoryAddress: 'KT1DoyD6kr8yLK8mRBFusyKYJUk2ZxNHKP1N',

      mockProxy: async () => {

        this.state.setFeedback({
          visible: true,
          message: 'creating collaborative contract',
          progress: true,
          confirm: false,
        })

        setTimeout(() => {
          const result = {
            opHash: 'opQ2gLDiqHCqhQTKK5h9vCnL3c3izFeB11SQRuFzUricptKH6pJ',
          }

          axios
            .get(`https://api.tzkt.io/v1/operations/originations/${result.opHash}`)
            .then(({ data }) => {
              const { originatedContract } = data[0]

              // We can either sign in now, or force a button to do so
              // this.state.setProxyAddress(originatedContract.address)

              this.setState({
                originatedContract,
              })

              // We have got our contract address
              this.state.setFeedback({
                message: 'Collaborative contract created successfully',
                progress: true,
                confirm: false,
              })

              // Hide after a second
              setTimeout(() => {
                this.state.setFeedback({
                  visible: false,
                })
              }, 2000)
            })
        }, 2000)

      },

      originateProxy: async (administratorAddress, participantData) => {
      
        // Show progress during creation
        this.state.setFeedback({
          visible: true,
          message: 'creating collaborative contract',
          progress: true,
          confirm: false,
        })

        // packing participants data:
        // (TODO: move to separate func)
        const participantMap = MichelsonMap.fromLiteral(participantData);

        const parser = new Parser();
        const michelsonType = parser.parseData(createProxySchema);
        const schema = new Schema(michelsonType);
        const data = schema.Encode(participantMap);

        // Is it okay to make it blocking?:
        const { packed } = await Tezos.rpc.packData({
          data,
          type: michelsonType,
        });

        // Blockchain ops
        await Tezos.wallet
          .at(this.state.proxyFactoryAddress)
          .then(c =>
            c.methods
              .create_proxy(packed, 'hic_proxy')
              .send({ amount: 0 })
          )
          .then(result => {

            // TODO: this is a bit too nested for my liking
            
            // Keep the operation hash for further queries if required (do we need this?)
            this.setState({ op: result.opHash })

            // Query tzkt.io to get the originated contract address
            axios
              .get(`https://api.tzkt.io/v1/operations/originations/${result.opHash}`)
              .then(response => {

                // Send the originated contract to the UI via context
                const { originatedContract } = response
                this.setState({ originatedContract }) // save hash

                // We have got our contract address
                this.state.setFeedback({
                  message: 'Collaborative contract created successfully',
                  progress: true,
                  confirm: false,
                })

                // Hide after a second
                setTimeout(() => {
                  this.state.setFeedback({
                    visible: false,
                  })
                }, 1000)
              })
          })
          .catch(e => {
            this.state.setFeedback({
              message: e.message || 'an error occurred',
              progress: false,
              confirm: true,
              confirmCallback: () => {
                this.state.setFeedback({
                  visible: false,
                })
              }
            })
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

const HicetnuncContextProvider = withRouter(HicetnuncContextProviderClass)
export default HicetnuncContextProvider
