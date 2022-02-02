import React from 'react'
import { Container, Padding } from '../../../components/layout'
import { Primary } from '../../../components/button'
import { walletPreview } from '../../../utils/string'
import styles from '../styles.module.scss'


export const History = (token_info) => {

    let trades = token_info.trades.map(e => {
        e.trade = true
        return e
    })

    let swaps = token_info.swaps.map(e => {
        e.trade = false
        return e
    })

    let history = [...trades, ...swaps].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)).reverse()

    return (
        <div>
            <Container>
                <Padding>
                    {
                        history.map(e => {
                            if (e.trade) {
                                return (
                                    <div className={styles.history}>
                                        trade {e.timestamp} { encodeURI(e.seller.name) ? <span><a href={`/tz/${encodeURI(e.seller.address)}`}> <Primary>&nbsp;{encodeURI(e.seller.name)}</Primary></a></span> : <span><a href={`/tz/${e.seller.address}`}><Primary>&nbsp;{walletPreview(e.seller.address)}</Primary></a></span>}&nbsp;{e.amount} ed. {parseFloat(e.swap.price / 1000000)} tez{e.buyer.name ? <span><a href={`/${encodeURI(e.buyer.name)}`}><Primary>&nbsp;{encodeURI(e.buyer.name)}</Primary></a></span> : <span><a href={`/tz/${e.buyer.address}`}><Primary>&nbsp;{walletPreview(e.buyer.address)}</Primary></a></span>}
                                    </div>
                                )
                            } else {
                                return (
                                    <div className={styles.history}>
                                        swap {e.timestamp} {e.creator.name ? <span><a href={`/tz/${e.creator.address}`}><Primary>&nbsp;{encodeURI(e.creator.name)}&nbsp;</Primary></a></span> : <span><a href={`/tz/${e.creator.address}`}><Primary>&nbsp;{walletPreview(e.creator.address)}</Primary></a></span>} {e.amount} ed. {parseFloat(e.price / 1000000)} tez
                                    </div>
                                )
                            }
                        })
                    }
                    minted {token_info.timestamp} {token_info.supply} ed. {token_info.royalties / 10}% royalties
                </Padding>
            </Container>
        </div>
    )
}