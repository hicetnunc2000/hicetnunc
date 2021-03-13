import React from 'react'
import { motion } from 'framer-motion'
import styles from './index.module.scss'

const transition = {
  duration: 0.5,
  ease: [0.43, 0.13, 0.23, 0.96],
}

export const Menu = ({ isOpen = false }) => {
  const variant = isOpen ? 'opened' : 'closed'

  const top = {
    closed: {
      rotate: 0,
      translateY: 0,
    },
    opened: {
      rotate: 45,
      translateY: 3,
    },
  }
  const center = {
    closed: {
      opacity: 1,
    },
    opened: {
      opacity: 0,
    },
  }
  const bottom = {
    closed: {
      rotate: 0,
      translateY: 0,
    },
    opened: {
      rotate: -45,
      translateY: -3,
    },
  }
  const lineProps = {
    strokeWidth: 2,
    vectorEffect: 'non-scaling-stroke',
    initial: 'closed',
    animate: variant,
    transition,
  }

  return (
    <div className={styles.menu}>
      <motion.svg
        viewBox="0 0 14 14"
        overflow="visible"
        preserveAspectRatio="none"
      >
        <motion.line
          x1="2"
          x2="12"
          y1="4"
          y2="4"
          variants={top}
          {...lineProps}
        />
        {true && (
          <motion.line
            x1="2"
            x2="12"
            y1="7"
            y2="7"
            variants={center}
            {...lineProps}
          />
        )}
        {true && (
          <motion.line
            x1="2"
            x2="12"
            y1="10"
            y2="10"
            variants={bottom}
            {...lineProps}
          />
        )}
      </motion.svg>
    </div>
  )
}
