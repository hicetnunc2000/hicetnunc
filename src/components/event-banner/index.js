import React from 'react'
import styles from './styles.module.scss'

export const EventBanner = () => {
    return (
        <div className={styles.event__banner}>
            <div className={styles.content}>
                <h1>
                The TEIA community has moved to teia.art!  <a className={styles.desktop__link} href="https://blog.teia.art/blog/teia-art-launch-announcement">Learn more</a>
                </h1>
                <a href="https://teia.art/" className={styles.content__button}>
                    teia.art
                </a>
            </div>
        </div>
    )
}
