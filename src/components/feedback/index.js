import { useContext } from 'react'
import { AnimatePresence } from 'framer-motion'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Loading } from '../loading'
import styles from './styles.module.scss'

export const FeedbackComponent = () => {
  const context = useContext(HicetnuncContext)
  const {
    visible,
    message,
    progress,
    confirm,
    confirmCallback,
  } = context.feedback

  return (
    <AnimatePresence>
      {visible && (
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.message}>
              {progress && <Loading />}
              {message}
            </div>

            {confirm && (
              <div className={styles.buttons}>
                <button onClick={() => confirmCallback()}>close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
