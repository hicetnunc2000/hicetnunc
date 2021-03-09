import React, { Component } from 'react'
import {
  Card,
  Col,
  Row,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap'
import { HicetnuncContext } from '../context/HicetnuncContext'
import Menu from '../components/Menu'
import ItemsForSale from '../components/ItemsForSale'
import ItemsNotForSale from '../components/ItemsNotForSale'
import InfiniteScroll from 'react-infinite-scroll-component'
import { BabelLoading } from 'react-loadingg'

const axios = require('axios')

export default class Feed extends Component {
  static contextType = HicetnuncContext

  state = {
    showItemsForSale: true,
    activeTab: '1',
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
    counter: 0,
  }

  componentWillMount = async () => {
    await axios
      .post(process.env.REACT_APP_FEED, { counter: this.state.counter })
      .then((res) => {
        this.setState({
          items: res.data.result,
        })
      })
  }

  fetchData = async () => {
    //await axios.get('http://localhost:3000/feed').then(res => console.log(res))

    await axios
      .post(process.env.REACT_APP_FEED, { counter: this.state.counter + 1 })
      .then((res) => {
        const invalidIds = [1130, 1131, 1417, 1418, 1419, 641, 1547]
        const filtered = res.data.result.filter((e) => {
          if (!invalidIds.includes(e.token_id)) return e
        })

        this.setState({
          items: this.state.items.concat(filtered),
          counter: this.state.counter + 1,
        })

        if (res.data.result.length < 10) {
          return this.setState({ hasMore: false })
        }
      })
  }

  collect = (event, index) => {
    if (this.context.Tezos == null) {
      alert('sync')
    } else {
      this.context.collect(
        1,
        this.state.items[index].swaps[0].swap_id,
        this.state.items[index].swaps[0].xtz_per_objkt * 1
      )
    }
  }

  toggleItemsToShow = (buttonTitle) => {
    if (buttonTitle === '2') {
      return this.setState({ showItemsForSale: false, activeTab: '2' })
    }
    return this.setState({ showItemsForSale: true, activeTab: '1' })
  }

  render() {
    return (
      <div>
        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Card body style={{ border: 0, animation: 'fadeMe 1.2s' }}>
              <Row style={{ margin: '0 auto', marginTop: '50px' }}>
                <div>
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        style={{ cursor: 'pointer' }}
                        className={
                          this.state.activeTab === '1' ? 'active' : null
                        }
                        onClick={() => {
                          this.toggleItemsToShow('1')
                        }}
                      >
                        For Sale
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: 'pointer' }}
                        className={
                          this.state.activeTab === '2' ? 'active' : null
                        }
                        onClick={() => {
                          this.toggleItemsToShow('2')
                        }}
                      >
                        Not For Sale
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1"></TabPane>
                    <TabPane tabId="2"></TabPane>
                  </TabContent>
                </div>
              </Row>
              {this.context.collapsed ? (
                <InfiniteScroll
                  className="cel"
                  style={{ overflow: 'hidden' }}
                  dataLength={this.state.items.length} //This is important field to render the next data
                  next={this.fetchData}
                  hasMore={this.state.hasMore}
                  loader={
                    <BabelLoading
                      style={{
                        backgroundColor: 'black',
                        display: 'inline-block',
                        position: 'absolute',
                        right: '50%',
                        left: '45%',
                        marginTop: '35vh',
                      }}
                    />
                  }
                  endMessage={
                    <p style={{ textAlign: 'center' }}>mint mint mint ✨</p>
                  }
                >
                  {this.state.items.map((item, index) => {
                    const { items, hasMore } = this.state
                    return item.swaps.length === 0 &&
                      !this.state.showItemsForSale ? (
                      <ItemsNotForSale
                        item={item}
                        index={index}
                        items={items}
                        hasMore={hasMore}
                      />
                    ) : item.swaps.length > 0 && this.state.showItemsForSale ? (
                      <ItemsForSale
                        item={item}
                        index={index}
                        items={items}
                        hasMore={hasMore}
                      />
                    ) : null
                  })}
                </InfiniteScroll>
              ) : (
                <Menu />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
