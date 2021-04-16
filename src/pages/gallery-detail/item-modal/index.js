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
          <Button onClick={() => alert('not working yet')}>
            <Purchase>collect for X tez</Purchase>
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
