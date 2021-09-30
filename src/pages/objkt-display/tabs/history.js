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
                    <div className={styles.history__container}>
                        <div className={styles.history__labels}>
                            <div className={styles.history__event} style={{ width: 'calc(7% + 35px)' }}>event</div>
                            <div className={styles.history__from}>from</div>
                            <div className={styles.history__to}>to</div>
                            <div className={styles.history__ed}>ed.</div>
                            <div className={styles.history__price}>price</div>
                            <div className={styles.history__date}>time</div>
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

                                                <a href={`https://tzkt.io/${e.ophash}`} target="_blank">trade</a>
                                            </div>

                                            <div className={styles.history__from}>
                                                <div className={`${styles.history__mobile} ${styles.history__secondary}`}>from</div>{e.seller.name ? <span><a href={`/tz/${encodeURI(e.seller.address)}`} target="_blank"><Primary>{encodeURI(e.seller.name)}</Primary></a></span> : <span><a href={`/tz/${e.seller.address}`}><Primary>{walletPreview(e.seller.address)}</Primary></a></span>}
                                            </div>

                                            <div className={styles.history__to}>
                                                <div className={`${styles.history__mobile} ${styles.history__secondary}`}>to</div>{e.buyer.name ? <span><a href={`/${encodeURI(e.buyer.name)}`} target="_blank"><Primary>{encodeURI(e.buyer.name)}</Primary></a></span> : <span><a href={`/tz/${e.buyer.address}`}><Primary>{walletPreview(e.buyer.address)}</Primary></a></span>}
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
                                                <svg width="16" height="16" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.13537 10.6417L4.38695 10.6903C4.39874 10.872 4.47626 11.0433 4.60504 11.1721L5.13537 10.6417ZM10.6419 5.13518L11.1722 4.60485C11.0435 4.47607 10.8722 4.39854 10.6905 4.38675L10.6419 5.13518ZM4.75327 4.75308L4.80184 4.00465C4.58648 3.99068 4.37554 4.07015 4.22294 4.22275C4.07034 4.37535 3.99087 4.58628 4.00485 4.80164L4.75327 4.75308ZM11.8627 16.6582L12.393 17.1885L11.8627 16.6582ZM16.6584 11.8625L16.1281 11.3322L16.6584 11.8625ZM10.1116 5.66551L16.1281 11.682L17.1887 10.6213L11.1722 4.60485L10.1116 5.66551ZM16.1281 11.3322L11.3324 16.1279L12.393 17.1885L17.1887 12.3928L16.1281 11.3322ZM11.6822 16.1279L5.6657 10.1114L4.60504 11.1721L10.6215 17.1885L11.6822 16.1279ZM5.8838 10.5932L5.5017 4.70451L4.00485 4.80164L4.38695 10.6903L5.8838 10.5932ZM4.70471 5.5015L10.5934 5.8836L10.6905 4.38675L4.80184 4.00465L4.70471 5.5015ZM11.3324 16.1279C11.429 16.0313 11.5856 16.0313 11.6822 16.1279L10.6215 17.1885C11.1107 17.6777 11.9038 17.6777 12.393 17.1885L11.3324 16.1279ZM16.1281 11.682C16.0315 11.5854 16.0315 11.4288 16.1281 11.3322L17.1887 12.3928C17.6779 11.9036 17.6779 11.1105 17.1887 10.6213L16.1281 11.682Z"/>
                                                </svg>

                                                
                                                <a href={`https://tzkt.io/${e.ophash}`} target="_blank">swap</a>
                                            </div>

                                            <div className={styles.history__from}>
                                                <div className={`${styles.history__mobile} ${styles.history__secondary}`}>from</div>{e.creator.name ? <span><a href={`/tz/${encodeURI(e.creator.address)}`} target="_blank"><Primary>{encodeURI(e.creator.name)}</Primary></a></span> : <span><a href={`/tz/${e.creator.address}`}><Primary>{walletPreview(e.creator.address)}</Primary></a></span>}
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
                                <svg style={{ fill: 'none' }} width="16" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.45251 1.685C7.62484 1.15463 8.37516 1.15464 8.54749 1.685L9.66687 5.13009C9.74393 5.36728 9.96496 5.52786 10.2144 5.52786H13.8367C14.3944 5.52786 14.6263 6.24147 14.1751 6.56925L11.2445 8.69843C11.0428 8.84502 10.9583 9.10486 11.0354 9.34205L12.1548 12.7871C12.3271 13.3175 11.7201 13.7585 11.2689 13.4307L8.33837 11.3016C8.1366 11.155 7.8634 11.155 7.66163 11.3016L4.73107 13.4307C4.27991 13.7585 3.67288 13.3175 3.84521 12.7871L4.96458 9.34205C5.04165 9.10486 4.95723 8.84502 4.75546 8.69843L1.8249 6.56925C1.37374 6.24147 1.6056 5.52786 2.16326 5.52786H5.78564C6.03504 5.52786 6.25607 5.36728 6.33313 5.13009L7.45251 1.685Z" stroke="black" stroke-width="1.5"/>
                                </svg>

                                <div className={styles.history__mint__op}>minted</div>
                            </div>
                        
                        
                            <div className={styles.history__from}>
                                {token_info.creator.name ? <span><a href={`/tz/${encodeURI(token_info.creator.address)}`} target="_blank"><Primary>{encodeURI(token_info.creator.name)}</Primary></a></span> : <span><a href={`/tz/${token_info.creator.address}`}><Primary>{walletPreview(token_info.creator.address)}</Primary></a></span>}
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
                                    ed. {token_info.supply}
                                </div>
                                
                                <div className={styles.history__price} />
                            </div>
                        </div>

                        <div className={styles.history__royalties}>
                            {token_info.royalties / 10}% royalties
                        </div>
                    </div>
                </Padding>
            </Container>
        </div>
    )
}