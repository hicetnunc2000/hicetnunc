/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { GetUserMetadata } from '../../../data/api'
import styles from './styles.module.scss'

export const Artist = ({ artist }) => {
  const [data, setData] = useState(false)

  useEffect(() => {
    const getWalletInfo = async () => {
      if (artist.wallet) {
        await GetUserMetadata(artist.wallet).then((response) => {
          setData(response.data)
          //   if (data.data.alias) this.setState({ alias: data.data.alias })
          //   if (data.data.description)
          //     this.setState({ description: data.data.description })
          //   if (data.data.site) this.setState({ site: data.data.site })
          //   if (data.data.twitter) this.setState({ twitter: data.data.twitter })
          //   if (data.data.github) this.setState({ github: data.data.github })
          //   if (data.data.reddit) this.setState({ reddit: data.data.reddit })
          //   if (data.data.instagram)
          //     this.setState({ instagram: data.data.instagram })
          //   if (data.data.logo) this.setState({ logo: data.data.logo })
        })
      }
    }

    getWalletInfo()
  }, [])

  return (
    <>
      {artist.artist && (
        <div className={styles.container}>
          <div className={styles.artist}>
            {artist.wallet && (
              <div className={styles.icon}>
                <img
                  src={`https://services.tzkt.io/v1/avatars2/${artist.wallet}`}
                  alt="profile"
                />
              </div>
            )}
            {data.alias && <strong>{data.alias}</strong>}
          </div>
          {data?.description && (
            <p className={styles.bio}>{data.description}</p>
          )}
        </div>
      )}
    </>
  )
}
