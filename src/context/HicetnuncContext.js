import React, { createContext, Component } from 'react'
const { DAppClient, NetworkType } = require('@airgap/beacon-sdk')
var ls = require('local-storage');
const axios = require('axios')

export const HicetnuncContext = createContext()

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

            getNavbar: (pathname) => {

                switch (pathname) {
                    case "/sync":
                    case "/about":
                    default:
                }

            },

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
