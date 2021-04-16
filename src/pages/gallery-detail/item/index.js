import { useEffect, useState, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { GetOBJKT } from '../../../data/api'
import { renderMediaType } from '../../../components/media-types'
import { Loading } from '../../../components/loading'
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

export const Item = ({ objkt, onClick }) => {
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
        setData({ ...e, mimeType, uri: uri.split('//')[1], metadata: e })
      })
      .catch((e) => console.log('error loading', objkt))
  }, [objkt])

  if (inView && !shown.current) {
    shown.current = true
  }

  return (
    <div className={styles.container} ref={ref}>
      <>
        {data ? (
          <div key={`item-${objkt}`} onClick={() => onClick(data)}>
            {(inView || shown) && (
              <div className={styles.image} style={{ pointerEvents: 'none' }}>
                {renderMediaType({
                  ...data,
                  shown: shown.current, //README: What's this?
                  inView, // README: and this? Not used on renderMediaType
                  interactive: false,
                })}
                <div className={styles.number}>OBJKT#{objkt}</div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Loading />
          </div>
        )}
      </>
    </div>
  )
}
