import React, { useContext } from 'react'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import styles from './styles.module.scss'

export const ButtonTheme = () => {
  const context = useContext(HicetnuncContext)
  return (
    <div
      className={styles.container}
      onClick={() =>
        context.setTheme(context.theme === 'light' ? 'dark' : 'light')
      }
    >
      {context.theme === 'light' ?
      <div className={styles.button__dark}>
        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.3223 16.2776C11.2798 16.7549 10.1465 17.0013 8.99999 17C6.87826 17 4.84343 16.1571 3.34314 14.6569C1.84285 13.1566 1 11.1217 1 9C1 6.87827 1.84285 4.84344 3.34314 3.34315C4.84343 1.84286 6.87826 1.00001 8.99999 1.00001C10.1473 0.998369 11.2815 1.24478 12.3247 1.72236C10.9298 2.3597 9.74753 3.38454 8.91863 4.67481C8.08974 5.96508 7.64917 7.46642 7.64941 9C7.64897 10.5333 8.08918 12.0345 8.91764 13.3247C9.74611 14.615 10.9279 15.64 12.3223 16.2776Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        dark
      </div>
      : <div className={styles.button__light}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8.99895 12.3436C8.55982 12.3437 8.12497 12.2573 7.71924 12.0894C7.31351 11.9214 6.94486 11.6751 6.63435 11.3646C6.32385 11.0541 6.07757 10.6854 5.90959 10.2797C5.74162 9.87399 5.65524 9.43914 5.6554 9.00001C5.65571 8.11397 6.00783 7.2643 6.63435 6.63777C7.26088 6.01124 8.11055 5.65913 8.99659 5.65881C9.88264 5.65913 10.7323 6.01124 11.3588 6.63777C11.9854 7.2643 12.3375 8.11397 12.3378 9.00001C12.3381 9.88606 11.9866 10.736 11.3605 11.3629C10.7344 11.9899 9.88499 12.3426 8.99895 12.3436Z" stroke="#DEDEDE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9.00098 3.22707V1" stroke="#DEDEDE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="bevel"/>
          <path d="M14.7731 8.99982H17.0001" stroke="#DEDEDE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="bevel"/>
          <path d="M4.91435 13.087L3.34375 14.6576" stroke="#DEDEDE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="bevel"/>
          <path d="M13.0819 13.087L14.6478 14.6576" stroke="#DEDEDE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="bevel"/>
          <path d="M9.00098 17V14.7788" stroke="#DEDEDE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="bevel"/>
          <path d="M1 8.99982H3.22119" stroke="#DEDEDE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="bevel"/>
          <path d="M14.6479 3.35297L13.0773 4.92356" stroke="#DEDEDE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="bevel"/>
          <path d="M3.34375 3.35297L4.91435 4.92356" stroke="#DEDEDE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="bevel"/>
        </svg>
        light
      </div>
      }
    </div>
  )
}
