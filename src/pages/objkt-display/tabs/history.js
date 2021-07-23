import React, { useContext, useState } from 'react'
import { Container, Padding } from '../../../components/layout'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { walletPreview } from '../../../utils/string'


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
                                    <div>
                                        trade {e.timestamp} {encodeURI(e.seller.name) ? <span><a href={`/tz/${encodeURI(e.seller.address)}`}>{encodeURI(e.seller.name)}</a></span> : <span><a href={`/tz/${e.seller.address}`}>{walletPreview(e.seller.address)}</a></span>} {e.amount} ed {parseFloat(e.swap.price / 1000000)} tez {e.buyer.name ? <span><a href={`/${encodeURI(e.buyer.name)}`}>{encodeURI(e.buyer.name)}</a></span> : <span><a href={`/tz/${e.buyer.address}`}>{walletPreview(e.buyer.address)}</a></span>}
                                    </div>
                                )
                            } else {
                                return (
                                    <div>
                                        swap {e.timestamp} {e.creator.name ? <span><a href={`/tz/${e.creator.address}`}>{encodeURI(e.creator.name)}</a></span> : <span><a href={`/tz/${e.creator.address}`}>{walletPreview(e.creator.address)}</a></span>} {e.amount} ed {parseFloat(e.price / 1000000)} tez
                                    </div>
                                )
                            }
                        })
                    }
                    minted {token_info.timestamp} {token_info.supply} ed {token_info.royalties / 10}% royalties
                </Padding>
            </Container>
        </div>
    )
}