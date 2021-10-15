import React from 'react' // a global import
import styles from './index.module.scss' // a sass import

// A type of hero with only text
// In the future we could have different types of heros:
// with featured objkt, or users, trending etc...

export const HeroHeading = ({ children = null }) => {
    return <div className={styles.container}>{children}</div>
}