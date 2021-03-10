import React, { useContext } from 'react'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Button } from '../button'
import styles from './style.module.scss'

export const Header = () => {
  const context = useContext(HicetnuncContext)

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <Button to="/" secondary>
            <div className={styles.logo}>〇 hic et nunc</div>
          </Button>

          <div className={styles.right}>
            <Button onClick={context.syncTaquito} secondary>
              sync
            </Button>

            <Button onClick={context.toogleNavbar} secondary>
              <img
                src={require('../../media/menu-black-18dp.svg')}
                alt=""
                className={styles.hamburger}
              />
            </Button>
          </div>
        </div>
      </div>

      {!context.collapsed && (
        <div className={styles.menu}>
          <div className={styles.content}>
            <ul>
              <li>○</li>
              <li>
                <Button to="/mint">
                  OBJKTs<i style={{ fontSize: '15px' }}>(mint NFTs)</i>
                </Button>
              </li>
              <li>
                <Button to="/sync">manage assets</Button>
              </li>
              <li>
                <Button to="/about">about</Button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
