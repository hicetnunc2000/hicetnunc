import React, { Component } from 'react'
import { Card, Col, Row, CardTitle, CardText, CardBody, CardImg } from 'reactstrap'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { ErrorBoundary } from 'react-error-boundary'
import Loading from './Loading'
import Menu from './Menu'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BabelLoading } from 'react-loadingg';

import LazyImage from './LazyImage'

var Router = require("react-router");

const axios = require('axios')
function preloader() {
    return <div>oi</div>;
}
export default class Feed extends Component {

    constructor(props) {
        super(props)

        this.state = {
            results: [],
            loading: true,
            back: '',
            curations: true,
            curations_arr: [],
            objkts_arr: [],
            mounted: false,
            blob: null,
            items: [],
            hasMore: true,
            counter: 0
        }
        this.collect = this.collect.bind(this)

    }

    static contextType = HicetnuncContext


    componentWillMount = async () => {

        await axios.post(process.env.REACT_APP_FEED, { counter: this.state.counter }).then(res => {
            this.setState({
                items: res.data.result
            })
        })

    }

    fetchData = async () => {
        //await axios.get('http://localhost:3000/feed').then(res => console.log(res))

        await axios.post(process.env.REACT_APP_FEED, { counter: this.state.counter + 1 }).then(res => {

            const filtered = (res.data.result).filter(e => parseInt(e.tk_id) != 641)
            this.setState({
                items: this.state.items.concat(filtered),
                counter: this.state.counter + 1
            })

            if (res.data.result.length < 5) {
                this.setState({ hasMore: false })
                return
            }

        })

        console.log(this.state)

    }

    collect = (event, index) => {
        console.log(index)
        if (this.context.Tezos == null) {
            alert('sync')
        } else {
            this.context.collect(1, this.state.items[index].swaps[0].swap_id, this.state.items[index].swaps[0].xtz_per_objkt * 1)
        }
    }

    render() {

        const info = (index) => (
            <div style={{ display: 'inline' }} >
                <a style={{
                    color: "#000",
                    "&:hover": {
                        color: "#000",
                    }
                }} href={`/objkt/${this.state.items[index].tk_id}`}>OBJKT#{this.state.items[index].tk_id}</a>
            </div>
        )
        const image = (index) => (
            <div>
                <LazyLoadImage className='media' style={{ maxHeight: '50vh', height: 'auto', width: 'auto' }} src={`https://ipfs.io/ipfs/${(this.state.items[index].metadata.artifactUri).split('//')[1]}`} alt='💥' />
            </div>
        )

        const video = (index) => (
            <div style={{ paddingTop: '4%', display: 'table', margin: '0 auto' }}>
                <video className='media' style={{ maxHeight: '60vh', height: 'auto', width: 'auto' }} controls autoPlay muted loop>
                    <source src={'https://ipfs.io/ipfs/' + (this.state.items[index].metadata.artifactUri).split('//')[1]} alt='💥' type="video/mp4"></source>
                </video>
            </div>
        )

        return (
            <div>
                <Row>
                    <Col sm="12" md={{ size: 6, offset: 3 }}>
                        <Card body style={{ border: 0, animation: "fadeMe 1.2s" }}>
                            {
                                this.context.collapsed ?
                                    <InfiniteScroll
                                        className='cel'
                                        style={{ overflow: 'hidden' }}
                                        dataLength={this.state.items.length} //This is important field to render the next data
                                        next={this.fetchData}
                                        hasMore={this.state.hasMore}
                                        loader={<BabelLoading style={{
                                            backgroundColor: 'black',
                                            display: 'inline-block',
                                            position: 'absolute',
                                            right: '50%',
                                            left: '45%',
                                            marginTop: '35vh'
                                        }} />}
                                        endMessage={
                                            <p style={{ textAlign: "center" }}>mint mint mint ✨</p>
                                        }>
                                        {
                                            this.state.items.map((i, index) => {
                                                return (
                                                    <Card style={{ paddingTop: '4%', border: 0, animation: "fadeMe 1.2s" }}>
                                                        <div style={{ paddingTop: '3%', display: 'table', margin: '0 auto' }} key={index}>
                                                            {this.state.items[index].metadata != undefined ? this.state.items[index].metadata.formats[0].mimeType == 'video/mp4' ? video(index) : image(index) : <p>💥</p>}
                                                        </div>
                                                        <div style={{ display: 'inline', width: '75%', margin: '0 auto' }}>
                                                            <span>
                                                                {info(index)}
                                                                <div style={{ display: 'inline', float: 'right' }} >
                                                                    {this.state.items[index].swaps.length != 0 ? <span style={{ float: 'left', marginTop : '5px' }}>{this.state.items[index].swaps[0].objkt_amount}/{this.state.items[index].total_amount}</span> : <span style={{ float: 'left', marginTop : '5px' }}>{this.state.items[index].total_amount} </span>}
                                                                    <span><button onClick={(event) => this.collect(event, index)} style={{ backgroundColor: 'white', float: 'right' }}>{this.state.items[index].swaps.length != 0 ? <span>collect for {parseInt(this.state.items[index].swaps[0].xtz_per_objkt / 1000000)} tez</span>: <span>not on sale</span>}</button></span>
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </Card>
                                                )
                                            })}
                                    </InfiniteScroll>
                                    :
                                    <Menu />
                            }
                        </Card>
                    </Col>
                </Row>
            </div>
        )

        /*         let subList = {
                    listStyle: "none",
                    fontSize: "26px"
                }
        
                return (
                    <div>
                        {
                            this.state.loading ? <div style={{ marginTop: '35vh', verticalAlign: 'middle' }}>
                                <Row>
                                    <Col sm="12" md={{ position: 'fixed', size: 6, offset: 3 }}>
                                        <span>03.01.2021 OBJKT Swap</span>
                                    </Col>
                                </Row>
                                <Loading style={{ position: 'absolute' }} /></div> : null
                        }
                    </div>
                ) */
    }
}
