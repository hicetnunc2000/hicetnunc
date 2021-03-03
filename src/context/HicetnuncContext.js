import React, { createContext, Component } from 'react'
import { BeaconWallet } from '@taquito/beacon-wallet';
import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
const { DAppClient, NetworkType } = require('@airgap/beacon-sdk')
var ls = require('local-storage');
const axios = require('axios')

export const HicetnuncContext = createContext()

const Tezos = new TezosToolkit('https://mainnet.smartpy.io')
const wallet = new BeaconWallet({
    name: 'hicetnunc.xyz',
    preferredNetwork: 'mainnet'
});

export default class HicetnuncContextProvider extends Component {

    constructor(props) {
        super(props)

        this.state = {
            pathname: "",

            address: "",

            op : undefined,

            contract: "",

            setAddress: (address) => this.setState({ address: address }),

            setAuth: (address) => {
                ls.set('auth', address)
            },

            updateLs : (key, value) => {
                ls.set(key, value)
            },

            getLs : (key) => {
                return ls.get(key)
            },

            getAuth: () => {
                return ls.get('auth')
            },

            client : null,

            setClient : (client) => {
                this.setState({
                    client : client
                })
            },

            dAppClient: async () => {

                this.state.client = await new DAppClient({ name: 'hicetnunc' })

                this.state.client
                    .requestPermissions({
                        network: {
                            type: NetworkType.MAINNET,
                            rpcUrl: 'https://mainnet.smartpy.io'
                        }
                    })
                    .then((permissions) => {

                        console.log('got permissions', permissions)
                        console.log(permissions.address)

                        this.setState({
                            address: permissions.address
                        })

                        this.state.setAuth(permissions.address)

                    })
                    .catch((error) => console.log(error))

    
            },
            
            objkt : 'KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9',

            op : undefined,

            mint : async (tz, amount, cid, royalties) => {
                console.log([tz, amount, cid, royalties])
                //Tezos.setProvider({ wallet : this.state.wallet })
                try {
                var result = await Tezos.wallet.at(this.state.objkt).then(c => c.methods.mint_OBJKT(tz, parseInt(amount), ('ipfs://' + cid).split("").reduce((hex,c)=>hex+=c.charCodeAt(0).toString(16).padStart(2,"0"),""), parseInt(royalties) * 10).send({amount : 0}))
                console.log(result)
                result.then(op => op.confirmation(1).then(() => {
                    console.log(op.hash)
                    this.setState({ op : op.hash, load : !this.state.load})})
                )} catch (e) {
                    this.setState({ load : !this.state.load })
                }

            },

            collect : async (objkt_amount, swap_id, amount) => {
                await Tezos.wallet.at(this.state.objkt).then(c => c.methods.collect(parseInt(objkt_amount), parseInt(swap_id)).send({amount : parseInt(amount), mutez : true}))
            },

            swap : async (objkt_amount, objkt_id, xtz_per_objkt) => {
                await Tezos.wallet.at(this.state.objkt).then(c => c.methods.swap(parseInt(objkt_amount), parseInt(objkt_id), parseInt(xtz_per_objkt)).send({amount : 0}))
            },

            load : false,
            loading : () => this.setState({ load : !this.state.load }),
            /* taquito */
            Tezos : null,
            wallet : null,

            syncTaquito : async () => {

                const network = {
                    type: 'mainnet',
                    rpcUrl: 'https://mainnet.smartpy.io'
                };

                Tezos.setWalletProvider(wallet)

                await wallet.requestPermissions({ network })

                this.setState({
                    Tezos : Tezos,
                    address : await wallet.getPKH(),
                    wallet : wallet
                })
                this.state.setAuth(await wallet.getPKH())
                console.log(this.state)
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
                    operationDetails: [obj.result]
                })
            },

            timeout : (delay) => {
                return new Promise( res => setTimeout(res, delay) );
            },

            signPayload: async (obj) => {

                const client = new DAppClient({ name: 'hicetnunc' })
                const signature = await client.requestSignPayload({
                    payload: obj.payload
                })
                    .then(async (response) => {
                        return response.signature
                    })
                    .catch((signPayloadError) => console.error(signPayloadError))

            },

            balance: 0,

            getBalance: (address) => {

                axios.get(`https://api.tzkt.io/v1/accounts/${address}/balance_history`, {
                    params: {
                        address: address
                    }
                }).then(res => {
                    console.log((parseInt(res.data[res.data.length - 1].balance / 1000000)))
                })

            },

            collapsed: true,

            toogleNavbar: () => { this.setState({ collapsed: !this.state.collapsed }) },

            getStyle: (style) => style ? { background: "white" } : { display: "none" },

            lastPath: '',

            setPath: (path) => {
                this.setState({
                    lastPath: path
                })
            },
            title : '',
            setTitle : (title) => {
                this.setState({
                    title : title
                })
            },
            menu: {
                position: "absolute",
                listStyle: "none",
                right: "0",
                marginTop: "20%",
                marginRight: "25px",
                textAlign: "right",
                fontSize: "30px",
                animation: "fadeMe 1.2s"
            },
            subList: {
                listStyle: "none",
                fontSize: "26px"
            }
        }
    }

    render() {
        return (
            <HicetnuncContext.Provider value={{
                ...this.state
            }}>
                {this.props.children}
            </HicetnuncContext.Provider>
        )
    }
}
