import React from 'react'
import styles from './styles.module.scss'

export const VoteBanner = () => {
    return (
        <div className={styles.vote__banner}>
            <div className={styles.content}>
                <h1>
                SYNQ or TEIA - vote until Jan30<sup>th</sup> (final round) <a className={styles.desktop__link} href="https://community.hicetnunc.xyz/t/info-sheet-for-the-naming-vote-on-henvoite-for-the-platform/462">Learn more</a>
                </h1>
                <a href="https://vote.hencommunity.quest/" className={styles.content__button}>
                    Vote Now
                </a>
            </div>
        </div>
    )
}