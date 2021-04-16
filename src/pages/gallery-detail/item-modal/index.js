/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'

import { renderMediaType } from '../../../components/media-types'
import { Button, Purchase } from '../../../components/button'
import { PATH } from '../../../constants'
import { GetUserMetadata } from '../../../data/api'
import styles from './styles.module.scss'

export const ItemModal = ({ info }) => {
  const [name, setName] = useState('')
  const [profile, setProfile] = useState()

  let message = ''
  try {
    message =
      info.swaps[0] !== undefined
        ? 'collect for ' +
          Number(info.swaps[0].xtz_per_objkt) / 1000000 +
          ' tez'
        : 'not for sale'
  } catch (e) {
    message = 'not for sale'
  }

  useEffect(() => {
    const creator = info.token_info.creators[0]

    async function fetchData() {
      await GetUserMetadata(creator).then((data) => {
        setProfile(
          `https://services.tzkt.io/v1/avatars2/${info.token_info.creators[0]}`
        )
        setName(data.data.alias)
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
        <Button to={`${PATH.OBJKT}/${info.objectId}`}>
          <div className={styles.number}>OBJKT#{info.objectId}</div>
        </Button>
        <div className={styles.title}>{info.token_info.name}</div>
        <div className={styles.description}>{info.token_info.description}</div>

        <div className={styles.collect}>
          <Button to={`${PATH.OBJKT}/${info.objectId}`}>
            <Purchase>{message}</Purchase>
          </Button>
        </div>

        <div className={styles.artist}>
          <div className={styles.icon}>
            <img src={profile} alt="profile" />
          </div>
          <strong>{name}</strong>
        </div>
      </div>
    </div>
  )
}
