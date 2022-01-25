import React from 'react'
import styles from './styles.module.scss'

export const VoteBanner = () => {
    return (
        <div className={styles.vote__banner}>
            <div className={styles.content}>
                <h1>
                    Take part in the decision for the next Hicetnunc! Voting starts Jan 26<sup>th</sup> through Jan 30<sup>th</sup> 00:00 UTC <a href="https://community.hicetnunc.xyz/t/info-sheet-for-the-naming-vote-on-henvoite-for-the-platform/462">Learn more</a>
                </h1>
                <a href="https://vote.hencommunity.quest/" className={styles.content__button}>
                    Vote Now
                </a>
            </div>
        </div>
    )
}