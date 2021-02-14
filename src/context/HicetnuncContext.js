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
            
            mint : async (tz, amount, cid) => {
                const objkt = 'KT1PAV4ayvsDYi9zBFsLepnkPkpEspeYefNX'
                console.log([tz, amount, cid])
                //Tezos.setProvider({ wallet : this.state.wallet })
                await Tezos.contract.at(objkt).then(c => c.methods.mint(tz, parseInt(amount), MichelsonMap.fromLiteral({'' : ('ipfs://' + cid).split("").reduce((hex,c)=>hex+=c.charCodeAt(0).toString(16).padStart(2,"0"),"")})).send({amount : 0}))
            },

            /* taquito */
            Tezos : null,
            wallet : null,

            syncTaquito : async () => {

                const network = {
                    type: 'mainnet',
                    rpcUrl: 'https://mainnet.smartpy.io'
                };

                await Tezos.setWalletProvider(wallet)

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
                top: "0",
                marginTop: "15%",
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
