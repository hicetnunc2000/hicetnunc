import React, { useContext, useState } from 'react'
import { Container, Padding } from '../../../components/layout'
import { Primary } from '../../../components/button'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { walletPreview } from '../../../utils/string'
import styles from '../styles.module.scss'
import { parse } from '@babel/core'


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

    const getTimeAgo = (props) => {
        let stamp = Math.round(new Date(props).getTime() / 1000)
        let now = Math.round(new Date().getTime() / 1000)

        let difference = now - stamp
        let unit, value;

        if (difference / 60 < 60) {
            unit = 'minutes'
            value = Math.round(difference / 60)

            if (value <= 1) {
                unit = 'minute'
            }
        } else if (difference / (60 * 60) < 24) {
            unit = 'hours'
            value = Math.round(difference / (60 * 60))

            if (value <= 1) {
                unit = 'hour'
            }
        } else {
            unit = 'days'
            value = Math.round(difference / (60 * 60 * 24))

            if (value <= 1) {
                unit = 'day'
            }
        }

        // console.log(unit, value)
        return `${value} ${unit} ago`
    }

    return (
        <div>
            <Container>
                <Padding>
                    <div className={styles.history__labels}>
                        <div className={styles.history__event} style={{ width: 'calc(7% + 35px)' }}>event</div>
                        <div className={styles.history__from}>from</div>
                        <div className={styles.history__to}>to</div>
                        <div className={styles.history__ed}>ed.</div>
                        <div className={styles.history__price}>price</div>
                        <div className={styles.history__date}>date</div>
                    </div>
                    {
                        history.map(e => {
                            if (e.trade) {
                                return (
                                    <div className={`${styles.history}`} key={`t-${e.ophash}`}>
                                        <div className={styles.history__event__container}>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <line x1="0.75" y1="-0.75" x2="9.57625" y2="-0.75" transform="matrix(0.693707 0.720257 -0.693707 0.720257 1.5155 6.98877)" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                                                <path d="M2.06618 10.708V6.70315H5.92339" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <line x1="0.75" y1="-0.75" x2="9.57625" y2="-0.75" transform="matrix(0.693707 0.720257 -0.693707 0.720257 5.92212 2.41162)" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                                                <path d="M10.2153 10.0547H14.0725V6.04987" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>

                                            <a href={`https://tzkt.io/${e.ophash}`}><b>trade</b></a>
                                        </div>

                                        <div className={styles.history__from}>
                                            <div className={`${styles.history__mobile} ${styles.history__secondary}`}>from</div>{e.seller.name ? <span><a href={`/tz/${encodeURI(e.seller.address)}`}><Primary>{encodeURI(e.seller.name)}</Primary></a></span> : <span><a href={`/tz/${e.seller.address}`}><Primary>{walletPreview(e.seller.address)}</Primary></a></span>}
                                        </div>

                                        <div className={styles.history__to}>
                                            <div className={`${styles.history__mobile} ${styles.history__secondary}`}>to</div>{e.buyer.name ? <span><a href={`/${encodeURI(e.buyer.name)}`}><Primary>{encodeURI(e.buyer.name)}</Primary></a></span> : <span><a href={`/tz/${e.buyer.address}`}><Primary>{walletPreview(e.buyer.address)}</Primary></a></span>}
                                        </div>

                                        <div className={`${styles.history__ed} ${styles.history__desktop}`}>
                                            {e.amount}
                                        </div>
                                            
                                        <div className={`${styles.history__price} ${styles.history__desktop}`}>
                                            {parseFloat(e.swap.price / 1e6)} tez
                                        </div>

                                        <div className={`${styles.history__date} ${styles.history__desktop}`}>
                                            {getTimeAgo(e.timestamp)}
                                        </div>

                                        <div className={styles.history__inner__mobile}>
                                            <div className={styles.history__date}>
                                                {getTimeAgo(e.timestamp)}
                                            </div>

                                            <div className={styles.history__ed}>
                                                ed. {e.amount}
                                            </div>
                                            
                                            <div className={styles.history__price}>
                                                {parseFloat(e.swap.price / 1e6)} tez
                                            </div>
                                        </div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div className={`${styles.history}`} key={`s-${e.ophash}`}>
                                        <div className={styles.history__event__container}>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M2.75327 2.75308L3.13537 8.64172L9.15184 14.6582C9.34813 14.8545 9.66639 14.8545 9.86268 14.6582L14.6584 9.86249C14.8547 9.66619 14.8547 9.34794 14.6584 9.15164L8.64192 3.13518L2.75327 2.75308ZM7.28169 7.21072C7.81059 6.68182 7.81059 5.8243 7.28169 5.2954C6.75279 4.7665 5.89527 4.7665 5.36637 5.2954C4.83747 5.8243 4.83747 6.68182 5.36637 7.21072C5.89527 7.73962 6.75279 7.73962 7.28169 7.21072Z"/>
                                            </svg>
                                            
                                            <a href={`https://tzkt.io/${e.ophash}`}><b>swap</b></a>
                                        </div>

                                        <div className={styles.history__from}>
                                            <div className={`${styles.history__mobile} ${styles.history__secondary}`}>from</div>{e.creator.name ? <span><a href={`/tz/${encodeURI(e.creator.address)}`}><Primary>{encodeURI(e.creator.name)}</Primary></a></span> : <span><a href={`/tz/${e.creator.address}`}><Primary>{walletPreview(e.creator.address)}</Primary></a></span>}
                                        </div>

                                        <div className={styles.history__to} />

                                        {/* <div className={styles.history__inner__desktop}> */}
                                            <div className={styles.history__ed}>
                                                {e.amount}
                                            </div>
                                            
                                            <div className={styles.history__price}>
                                                {parseFloat(e.price / 1e6)} tez
                                            </div>

                                            <div className={styles.history__date}>
                                                {getTimeAgo(e.timestamp)}
                                            </div>
                                        {/* </div> */}

                                        <div className={styles.history__inner__mobile}>
                                            <div className={styles.history__date}>
                                                {getTimeAgo(e.timestamp)}
                                            </div>

                                            <div className={styles.history__ed}>
                                                ed. {e.amount}
                                            </div>
                                            
                                            <div className={styles.history__price}>
                                                {parseFloat(e.price / 1e6)} tez
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }

                    <div className={styles.history} key="mint-op">
                        <div className={styles.history__event__container}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M2.75327 2.75308L3.13537 8.64172L9.15184 14.6582C9.34813 14.8545 9.66639 14.8545 9.86268 14.6582L14.6584 9.86249C14.8547 9.66619 14.8547 9.34794 14.6584 9.15164L8.64192 3.13518L2.75327 2.75308ZM7.28169 7.21072C7.81059 6.68182 7.81059 5.8243 7.28169 5.2954C6.75279 4.7665 5.89527 4.7665 5.36637 5.2954C4.83747 5.8243 4.83747 6.68182 5.36637 7.21072C5.89527 7.73962 6.75279 7.73962 7.28169 7.21072Z"/>
                            </svg>
                            
                            <div className={styles.history__mint__op}><b>minted</b></div>
                        </div>
                    
                    
                        <div className={styles.history__from}>
                            {token_info.creator.name ? <span><a href={`/tz/${encodeURI(token_info.creator.address)}`}><Primary>{encodeURI(token_info.creator.name)}</Primary></a></span> : <span><a href={`/tz/${token_info.creator.address}`}><Primary>{walletPreview(token_info.creator.address)}</Primary></a></span>}
                        </div>

                        <div className={styles.history__to} />

                        <div className={styles.history__ed}>
                            {token_info.supply}
                        </div>
                        
                        <div className={styles.history__price} />

                        <div className={styles.history__date}>
                            {getTimeAgo(token_info.timestamp)}
                        </div>

                        <div className={styles.history__inner__mobile}>
                            <div className={styles.history__date}>
                                {getTimeAgo(token_info.timestamp)}
                            </div>

                            <div className={styles.history__ed}>
                                ed. {token_info.amount}
                            </div>
                            
                            <div className={styles.history__price} />
                        </div>
                    </div>

                    <div className={styles.history__royalties}>
                        {token_info.royalties / 10}% Royalties
                    </div>
                </Padding>
            </Container>
        </div>
    )
}