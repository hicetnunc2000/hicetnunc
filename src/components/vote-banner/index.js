import React from 'react'
import styles from './styles.module.scss'

export const VoteBanner = () => {
    return (
        <div className={styles.vote__banner}>
            <div className={styles.content}>
                <h1>
                    Take part in the decision for the next Hicetnunc! Votes will be accepted until Tue 00:00 UTC <a href="https://community.hicetnunc.xyz/t/info-sheet-for-the-naming-vote-on-henvoite-for-the-platform/462">Learn more</a>
                </h1>
                <a href="https://vote.hencommunity.quest/vote/QmU7zZepzHiLMUme1xRHZyTdbyD4j2EfUodiGJeA1Rv6QQ" className={styles.content__button}>
                    Vote Now
                </a>
            </div>
        </div>
    )
}