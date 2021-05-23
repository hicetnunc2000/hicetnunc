/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { GetUserMetadata } from '../../../data/api'
import { ArtistLogo } from '../artist-icon'
import styles from './styles.module.scss'

export const Artist = ({ artist }) => {
  const [data, setData] = useState(false)

  useEffect(() => {
    const getWalletInfo = async () => {
      if (artist.wallet) {
        await GetUserMetadata(artist.wallet).then((response) => {
          setData(response.data)
        })
      }
    }

    getWalletInfo()
  }, [])

  return (
    <>
      {artist.artist && (
        <div className={styles.container}>
          <ArtistLogo
            wallet={artist.wallet}
            name={data.alias}
            site={data.site}
            telegram={data.telegram}
            twitter={data.twitter}
            github={data.github}
            reddit={data.reddit}
          />
          {data?.description && (
            <p className={styles.bio}>{data.description}</p>
          )}
        </div>
      )}
    </>
  )
}
