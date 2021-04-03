import styles from './index.module.scss'

const coverMeta = '<meta property="og:image" content="path/to/image.jpg">'

export function HTMLWarning () {
  return (
    <div className={styles.warning}>
      IMPORTANT: Please read the <a href="https://github.com/hicetnunc2000/hicetnunc/wiki/Interactive-OBJKTs" target="_blank">Interactive OBJKTs Guide</a> before minting!
    </div>
  )
}