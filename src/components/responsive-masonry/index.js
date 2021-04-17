import { useState } from 'react'
import Masonry from 'react-masonry-css'
import styles from './styles.module.scss'

export const ResponsiveMasonry = ({ children }) => {
  const getColumns = () => {
    return 4
  }
  const [colums, setColumns] = useState(getColumns())

  console.log('responsive masonry', colums)
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
