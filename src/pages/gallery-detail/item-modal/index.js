/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'

import { renderMediaType } from '../../../components/media-types'
import { Button, Purchase } from '../../../components/button'
import { PATH } from '../../../constants'
import { GetUserMetadata } from '../../../data/api'
import { ArtistLogo } from '../artist-icon'
import styles from './styles.module.scss'

export const ItemModal = ({ info }) => {
  const [data, setData] = useState(false)
  const creator = info.token_info.creators[0]

  let message = ''
  try {
    const prices = info.swaps.map((s) => parseFloat(s.xtz_per_objkt))
    prices.sort((a, b) => a - b)
    message =
      prices[0] !== undefined
        ? 'collect for ' + Number(prices[0]) / 1000000 + ' tez'
        : 'not for sale'
  } catch (e) {
    message = 'not for sale'
  }

  useEffect(() => {
    async function fetchData() {
      await GetUserMetadata(creator).then((response) => {
        setData(response.data)
      })
    }
    fetchData()
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.image}>
        {renderMediaType({
          ...info,
          interactive: true,
        })}
      </div>
      <div className={styles.info}>
        <div>
          <Button to={`${PATH.OBJKT}/${info.objectId}`}>
            <div className={styles.number}>OBJKT#{info.objectId}</div>
          </Button>
          <div className={styles.title}>{info.token_info.name}</div>
          <div className={styles.description}>
            {info.token_info.description}
          </div>

          <div className={styles.links}>
            <ArtistLogo
              wallet={creator}
              name={data.alias}
              site={data.site}
              telegram={data.telegram}
              twitter={data.twitter}
              github={data.github}
              reddit={data.reddit}
            />

            <div className={styles.collect}>
              <Button to={`${PATH.OBJKT}/${info.objectId}`}>
                <Purchase>{message}</Purchase>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
