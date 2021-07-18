import React, { useState, useContext, useEffect } from 'react'
import { walletPreview } from '../../utils/string'
import { GetUserMetadata } from '../../data/api'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Identicon } from '../identicons'
import styles from './styles.module.scss'

const transition = {
  duration: 0.5,
  ease: [0.43, 0.13, 0.23, 0.96],
}

export const Menu = ({ isOpen = false }) => {
  const context = useContext(HicetnuncContext)
  const [logo, setLogo] = useState();

  let userWallet;


  if (context.acc?.address) {
    userWallet = context.acc.address
    // console.log(userWallet)
  }

  return (
    <div className={styles.menu}>
      <div className={`${styles.menu__svg} ${isOpen ? styles.visible : styles.hidden}`}>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="14.5" />
          <path d="M9.16669 9.16666L20.8334 20.8333" stroke-linecap="round"/>
          <path d="M20.8333 9.16666L9.16665 20.8333" stroke-linecap="round"/>
        </svg>
      </div>
      <div className={`${styles.menu__svg} ${isOpen ? styles.hidden : styles.visible}`}>
        {userWallet ? <Identicon small address={userWallet} logo={logo}/> :
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="14.5"/>
          <path d="M7.5 18.5682C7.5 17.4636 8.39543 16.5682 9.5 16.5682H20.5C21.6046 16.5682 22.5 17.4636 22.5 18.5682V19.75C22.5 20.8546 21.6046 21.75 20.5 21.75H9.5C8.39543 21.75 7.5 20.8546 7.5 19.75V18.5682Z" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M18.4091 10.7386C18.4091 12.5273 16.8828 13.9773 15 13.9773C13.1172 13.9773 11.5909 12.5273 11.5909 10.7386C11.5909 8.94999 13.1172 7.5 15 7.5C16.8828 7.5 18.4091 8.94999 18.4091 10.7386Z" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        }
      </div>
    </div>
  )
}
