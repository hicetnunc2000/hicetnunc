import React from 'react' // a global import
import { Container, Padding } from '../../components/layout'
import classnames from 'classnames'
import styles from './styles.module.scss' // a sass import

// A type of hero with only text
// In the future we could have different types of heros:
// with featured objkt, or users, trending etc...

export const HeroHeading = ({ children = null, noMarginTop }) => {
    const classes = classnames({
        [styles.container]: true,
        [styles.noMarginTop]: noMarginTop
    })

    return (
        <Container>
            <Padding>
                <div className={classes}>{children}</div>
            </Padding>
        </Container>
    )
}
