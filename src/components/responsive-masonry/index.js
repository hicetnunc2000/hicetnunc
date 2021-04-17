import { useEffect, useState } from 'react'
import Masonry from 'react-masonry-css'
import styles from './styles.module.scss'

export const ResponsiveMasonry = ({ children }) => {
  const getColumns = () => {
    if (global.innerWidth > 1024) {
      return 4
    }

    if (global.innerWidth > 600) {
      return 3
    }

    return 1
  }
  const [colums, setColumns] = useState(getColumns())

  useEffect(() => {
    const resize = () => {
      setColumns(getColumns())
    }
    global.addEventListener('resize', resize)

    return () => global.removeEventListener('resize', resize)
  }, [])

  return (
    <Masonry
      breakpointCols={colums}
      className={styles.grid}
      columnClassName={styles.column}
    >
      {children}
    </Masonry>
  )
}
