import { PrimaryButton } from '../../button'
import styles from './index.module.scss'

export function HTMLWarning() {
  return (
    <div className={styles.warning}>
      <p>IMPORTANT: Please read the guide before minting!</p>
      <PrimaryButton href="https://github.com/hicetnunc2000/hicetnunc/wiki/Interactive-OBJKTs">
        <strong>Interactive OBJKTs Guide</strong>
      </PrimaryButton>
    </div>
  )
}
