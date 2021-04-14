import { useEffect, useState } from 'react'
import { GetOBJKT } from '../../../data/api'
import { renderMediaType } from '../../../components/media-types'
import { Loading } from '../../../components/loading'
import { PATH } from '../../../constants'
import { Button } from '../../../components/button'

import styles from './styles.module.scss'

export const Item = ({ objkt }) => {
  const [data, setData] = useState()

  useEffect(() => {
    GetOBJKT({ id: objkt })
      .then(async (e) => {
        const { token_info } = e
        const { mimeType, uri } = token_info.formats[0]

        setData({ mimeType, uri: uri.split('//')[1], metadata: e })
      })
      .catch((e) => console.log('error loading', objkt))
  }, [objkt])

  return (
    <div className={styles.container}>
      <div>
        {data ? (
          <Button to={`${PATH.OBJKT}/${objkt}`} key={objkt}>
            <div className={styles.image}>
              {renderMediaType({
                ...data,
              })}
              <div className={styles.number}>OBJKT#{objkt}</div>
            </div>
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
