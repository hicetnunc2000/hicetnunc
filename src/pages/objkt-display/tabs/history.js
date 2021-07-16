import React, { useContext } from 'react'
import { Container, Padding } from '../../../components/layout'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { walletPreview } from '../../../utils/string'

export const History = (token_info) => {
    console.log(token_info)
    return (
        <div>
            <Container>
                <Padding>
                    {
                        token_info.trades.map(e => {
                            return (
                                <div>
                                    {e.timestamp} {e.amount} editions {e.swap.price} mutez from {encodeURI(e.seller.name) ? <span><a href={`/${encodeURI(e.seller.name)}`}>{encodeURI(e.seller.name)}</a></span> : <span><a href={`/tz/${e.seller.address}`}>{walletPreview(e.seller.address)}</a></span>} to {e.buyer.name ? <span><a href={`/${encodeURI(e.buyer.name)}`}>{encodeURI(e.buyer.name)}</a></span> : <span><a href={`/tz/${e.buyer.address}`}>{walletPreview(e.buyer.address)}</a></span>}
                                </div>
                            )
                        })
                    }
                    minted {token_info.timestamp} {parseInt(token_info.supply) === 1 ? <span>{token_info.supply} edition</span> : <span>{token_info.supply} editions</span>} {token_info.royalties / 10}% royalties
                </Padding>
            </Container>
        </div>
    )
}