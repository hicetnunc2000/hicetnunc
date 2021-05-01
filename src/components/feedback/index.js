import { useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Loading } from '../loading'
import { Button, Purchase } from '../button'
import { fadeIn } from '../../utils/motion'
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
        <motion.div className={styles.container} {...fadeIn()}>
          <div className={styles.content}>
            {progress && <Loading />}
            <div className={styles.message}>{message}</div>

            {confirm && (
              <div className={styles.buttons}>
                <Button onClick={() => confirmCallback()}>
                  <Purchase>close</Purchase>
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
