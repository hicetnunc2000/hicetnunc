import React from 'react'
import styles from './styles.module.scss'

export const VoteBanner = () => {
    return (
        <div className={styles.vote__banner}>
            <div className={styles.content}>
                <h1>
                    Take part in the decision for the next Hicetnunc!
                </h1>
                <a href="#" className={styles.content__button}>
                    Vote Now
                </a>
            </div>
        </div>
    )
}