import { useEffect, useState, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { GetOBJKT } from '../../../data/api'
import { renderMediaType } from '../../../components/media-types'
import { Loading } from '../../../components/loading'
import { PATH } from '../../../constants'
import { Button } from '../../../components/button'

import styles from './styles.module.scss'

/**
 * Get OBJKT detail page with retries
 */
export const GetOBJKTStubbornly = async ({ id, tries = 5 }) => {
  let count = 0
  while (count < tries) {
    try {
      return await GetOBJKT({ id })
    } catch (err) {
      if (++count === tries) {
        throw new Error(err)
      }
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve()
        }, 1000)
      )
    }
  }
}

export const Item = ({ objkt }) => {
  const [data, setData] = useState()
  const { ref, inView } = useInView({
    rootMargin: '0px 0px 50% 0px',
  })
  const shown = useRef(false)

  useEffect(() => {
    GetOBJKTStubbornly({ id: objkt })
      .then(async (e) => {
        const { token_info } = e
        const { mimeType, uri } = token_info.formats[0]
        setData({ mimeType, uri: uri.split('//')[1], metadata: e })
      })
      .catch((e) => console.log('error loading', objkt))
  }, [objkt])

  if (inView && !shown.current) {
    shown.current = true
  }

  return (
    <div className={styles.container} ref={ref}>
      <div>
        {data ? (
          <Button to={`${PATH.OBJKT}/${objkt}`} key={objkt}>
            {inView || shown ? (
              <div className={styles.image}>
                {renderMediaType({
                  ...data,
                  shown: shown.current,
                  inView,
                })}
                <div className={styles.number}>OBJKT#{objkt}</div>
              </div>
            ) : (
              <div className={styles.image}>OFFSCREEN</div>
            )}
          </Button>
        ) : (
          <div>
            <Loading />
          </div>
        )}
      </div>
    </div>
  )
}
