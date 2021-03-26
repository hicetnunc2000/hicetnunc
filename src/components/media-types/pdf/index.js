import React from 'react'
import styles from './index.module.scss'

export const PdfComponent = ({ src }) => {
    return (
        <div className={styles.container}>
            <iframe
                className={styles.pdf}
                title="hic et nunc PDF renderer"
                src={`${src}#zoom=50`}
                scrolling="no"
            />
        </div>
    )
}
