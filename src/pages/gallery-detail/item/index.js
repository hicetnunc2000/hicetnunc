import { useEffect, useState, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { GetOBJKT } from '../../../data/api'
import { renderMediaType } from '../../../components/media-types'
import styles from './styles.module.scss'

/**
 * Get OBJKT detail page with retries
 */
export const GetOBJKTStubbornly = async ({ id, tries = 3 }) => {
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

export const Item = ({ objkt, onClick, minimal }) => {
  const [data, setData] = useState()
  const { ref, inView } = useInView({
    rootMargin: '0px 0px 50% 0px',
  })
  const shown = useRef(false)
  const nfs = 'not for sale'

  useEffect(() => {
    GetOBJKTStubbornly({ id: objkt })
      .then(async (e) => {
        const { token_info } = e
        const { mimeType, uri } = token_info.formats[0]

        let price = ''
        try {
          const prices = e.swaps.map((s) => parseFloat(s.xtz_per_objkt))
          prices.sort((a, b) => a - b)
          price =
            prices[0] !== undefined ? Number(prices[0]) / 1000000 + 'tez' : nfs
        } catch (e) {
          price = nfs
        }

        let edition = ''
        try {
          const reducer = (accumulator, currentValue) =>
            parseInt(accumulator) + parseInt(currentValue)
          let ed =
            e.swaps.length !== 0
              ? e.swaps.map((e) => e.objkt_amount).reduce(reducer)
              : ''
          edition = price === nfs ? false : `edition ${ed}/${e.total_amount}`
        } catch {
          edition = false
        }
        setData({
          ...e,
          mimeType,
          uri: uri.split('//')[1],
          metadata: e,
          price,
          edition,
        })
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
              <>
                <div className={styles.image} style={{ pointerEvents: 'none' }}>
                  {renderMediaType({
                    mimeType: data.mimeType,
                    artifactUri: data.token_info.artifactUri,
                    displayUri: data.token_info.displayUri,
                    creator: data.token_info.creators[0],
                    objkt: data.token_id,
                    displayView: true
                  })}
                  {/* <div className={styles.number}>OBJKT#{objkt}</div> */}
                </div>
                {minimal !== true && (
                  <div className={styles.info}>
                    {data.edition !== false && <p>{data.edition}</p>}
{/*                     <p
                      style={{
                        opacity: data.price === nfs ? 0.5 : 1,
                      }}
                    >
                      {data.price}
                    </p> */}
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div>
            {/* <Loading /> */}
          </div>
        )}
      </>
    </div>
  )
}
