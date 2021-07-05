import React, { useContext } from 'react'
import { Container, Padding } from '../../../components/layout'
import { HicetnuncContext } from '../../../context/HicetnuncContext'

export const History = (token_info) => {
    console.log(token_info)
    return (
        <div>
{/*             {
                token_info.trades.map(e => {
                    return(
                        <div>
                            {e.timestamp} {e.amount}x {e.swap.price} {e.seller.address} {e.buyer.address} 
                        </div>
                    )
                })
            } */}
        </div>
    )
}