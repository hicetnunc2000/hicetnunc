/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { GetUserMetadata } from '../../data/api'
import { walletPreview } from '../../utils/string'
import styles from './styles.module.scss'

export const ArtistAddress = ({ wallet, feed }) => {
  const [data, setData] = useState({})

  useEffect(() => {
    const getWalletInfo = async () => {
      if (wallet) {
        await GetUserMetadata(wallet).then((response) => {
          setData(response.data)
        })
      }
    }

    if (!feed) {
      getWalletInfo()
    }
  }, [feed])

  const { alias, site, twitter, github, reddit } = data
  const shortWallet = walletPreview(wallet)

  return !alias ? (
    shortWallet
  ) : (
    <div className={styles.artist}>
      <div className={styles.icon}>
        <img
          src={`https://services.tzkt.io/v1/avatars2/${wallet}`}
          alt="profile"
        />
      </div>
      <div className={styles.text}>{alias ? alias : shortWallet}</div>
    </div>
  )
}
