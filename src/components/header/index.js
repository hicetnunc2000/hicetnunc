/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { ButtonLanguage } from '../button-language'
import { ButtonTheme } from '../button-theme'
import { getLanguage } from '../../constants'
import { Identicon } from '../identicons'
import { Footer } from '../footer'
import { Container, Padding } from '../layout'
import { Button, Primary } from '../button'
import { fadeIn } from '../../utils/motion'
import { Menu } from '../icons'
import { GetUserMetadata } from '../../data/api'
import { walletPreview } from '../../utils/string'
import { VisuallyHidden } from '../visually-hidden'
import styles from './styles.module.scss'
import { getItem, setItem } from '../../utils/storage'

/* import { BeaconWallet } from '@taquito/beacon-wallet'

const wallet = new BeaconWallet({
  name: 'hicetnunc.xyz',
  preferredNetwork: 'mainnet',
}) */

async function fetchGraphQL(operationsDoc, operationName, variables) {
  let result = await fetch('https://api.hicdex.com/v1/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  })
  return await result.json()
}

const query_subjkts = `
query subjktsQuery($address: String!) {
  hic_et_nunc_holder(where: { address: {_eq: $address}}) {
    name
  }
}
`

async function fetchSubjkts(addr) {
  const { errors, data } = await fetchGraphQL(query_subjkts, 'subjktsQuery', {
    address: addr,
  })
  if (errors) {
    console.error(errors)
  }
  const result = data.hic_et_nunc_holder
  /* console.log({ result }) */
  return result
}

export const Header = () => {
  const language = getLanguage()
  const history = useHistory()
  const context = useContext(HicetnuncContext)

  const [alias, setAlias] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    context.setAccount()
    context.setTheme(getItem('theme') || setItem('theme', 'dark'))

  }, [])

  // we assume user isn't connected
  let userWallet;
  let headerButtonHandler = () => context.syncTaquito()
  let headerButtonText = 'sync'
  let aliasText;

  async function getUserMeta() {
    if (context.acc?.address && !alias) {
      userWallet = context.acc.address

      let res = await fetchSubjkts(userWallet)
      // console.log(res)
  
      if (res.length >= 1) {
        setAlias(res[0].name)
        // console.log(alias)
      }
    }
  }

  // but if they are
  if (context.acc?.address) {
    getUserMeta()
    //does alias exist?
    if (alias) {
      aliasText = alias
    } else {
      aliasText = walletPreview(context.acc.address)
    }

    // is menu closed?
    if (context.collapsed) {
      headerButtonHandler = () => handleRoute('/sync', 'tz')
      if (alias) {
        headerButtonText = alias
      } else {
        headerButtonText = walletPreview(context.acc.address)
      }
    } else {
      // menu is open
      headerButtonHandler = () => context.disconnect()
      headerButtonText = 'unsync'
    }
  }

  //const activeAccount = await wallet.client.getActiveAccount()
  //console.log(activeAccount)
  const handleRoute = (path) => {
    context.setMenu(true)
    history.push(path)
  }

  const handleSyncUnsync = () => {
    if (context.acc?.address && !context.collapsed) {
      // disconnect wallet
      context.disconnect()
    } else {
      // connect wallet
      context.syncTaquito()
    }
  }

  return (
    <>
      <header className={styles.container}>
        <div className={styles.content}>
          <Button onClick={() => handleRoute('/')}>
            <div className={styles.logo}>
              {/* HIC LOGO */}
              {true && (
                <svg viewBox="0 0 196.87 53.23" fill={'var(--text-color)'}>
                  <path
                    d="M228.9,79.31H211.51a2.26,2.26,0,0,1-.35-.34.75.75,0,0,1-.16-.42c0-11.42,0-22.85,0-34.43H193.24v35H175.41V26.27H228.9Z"
                    transform="translate(-32.03 -26.27)"
                  />
                  <path
                    d="M67.74,43.78V26.42H85.41V79.19H67.91V62.38a4.24,4.24,0,0,0-.52-.57.77.77,0,0,0-.42-.17H50V79.08H32V26.48H49.78v17.3Z"
                    transform="translate(-32.03 -26.27)"
                  />
                  <path
                    d="M103.62,43.79V26.43h53.6c.09,5.62,0,11.41.05,17.36Z"
                    transform="translate(-32.03 -26.27)"
                  />
                  <path
                    d="M103.71,61.71h53.38V78.84c-4.05.69-38.16.91-53.38.31Z"
                    transform="translate(-32.03 -26.27)"
                  />
                </svg>
              )}
              {/* PRIDE LOGO */}
              {false && <img src="/hen-pride.gif" alt="pride 2021" />}
            </div>
          </Button>

          <div className={styles.right}>
            <Button onClick={headerButtonHandler}>
              <Primary>{aliasText}</Primary>
            </Button>
            <Button onClick={context.toogleNavbar} secondary>
              <VisuallyHidden>
                {`${context.collapsed ? 'show' : 'hide'} menu`}
              </VisuallyHidden>
              <Menu isOpen={!context.collapsed}/>
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {!context.collapsed && (
          <motion.div className={styles.menu} {...fadeIn()}>
              <Padding>
                <nav className={styles.content}>
                    <ul>
                      {headerButtonText === 'sync' ? <>
                      <li>
                        <Button onClick={headerButtonHandler} secondary>
                          <div className={`${styles.icon__button} ${styles.sync}`}>
                            <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0.999997 8.93506L11.174 8.93506" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M7.94748 5.65248L11.2372 8.94332L7.9625 12.2111" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M4.70039 12.9771V14.2835C4.70069 14.9649 4.97113 15.6185 5.45245 16.1009C5.93377 16.5833 6.58669 16.8552 7.26814 16.857H11.4265C12.1089 16.8567 12.7633 16.5855 13.2459 16.1029C13.7284 15.6203 13.9997 14.9659 14 14.2835V3.57353C13.9997 2.89108 13.7284 2.23667 13.2459 1.75411C12.7633 1.27154 12.1089 1.00031 11.4265 1H7.26814C6.58669 1.00183 5.93377 1.27375 5.45245 1.75614C4.97113 2.23854 4.70069 2.89208 4.70039 3.57353V4.87993" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <Primary>{headerButtonText}</Primary>
                          </div>
                        </Button>
                      </li>
                      <hr /> </>: <>
                      <li>
                        <Button onClick={() => handleRoute('/mint')}>
                          <Primary>create OBJKT</Primary>
                        </Button>
                      </li>
                      <li>
                        <Button onClick={() => handleRoute('/sync')}>
                          <Primary>my creations</Primary>
                        </Button>
                      </li>
                      <li>
                        <Button onClick={() => handleRoute(`/tz/${context.acc.address}/collection`)}>
                          <Primary>my collection</Primary>
                        </Button>
                      </li>
                      <li>
                      <Button onClick={() => handleRoute('/config')}>
                        <Primary>settings</Primary>
                      </Button>
                      </li>
                      <hr />
                      </>}
                    <li>
                      <Button onClick={() => handleRoute('/hdao')}>
                        <div className={`${styles.icon__button} ${styles.hdao}`}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="7" cy="7" r="6" stroke-width="1.5"/>
                          </svg>
                          <Primary>hDAO feed</Primary>
                        </div>
                      </Button>
                    </li>
                    <li>
                      <Button onClick={() => handleRoute('/random')}>
                        <Primary>random feed</Primary>
                      </Button>
                    </li>
                    <li>
                      <Button onClick={() => handleRoute('/galleries')}>
                        <Primary>galleries</Primary>
                      </Button>
                    </li>
                    <hr />
                    <li>
                      <Button onClick={() => handleRoute('/about')}>
                        <Primary>about hicetnunc</Primary>
                      </Button>
                    </li>
                    <li>
                      <Button onClick={() => handleRoute('/faq')}>
                        <Primary>faq</Primary>
                      </Button>
                    </li>
                    <hr />
                    <li>
                      <div className={styles.buttons} style={{ marginLeft: -10 }}>
                        {false && <ButtonLanguage />}
                        <ButtonTheme />
                      </div>
                    </li>
                    {/* <li>
                      {walletPreview(userWallet)}
                    </li> */}
                    {headerButtonText !== 'sync' ? <>
                    <hr />
                      <li className={styles.list__unsync}>
                          <Button onClick={headerButtonHandler} secondary>
                            <div className={`${styles.icon__button} ${styles.unsync}`}>
                              <svg style={{ marginRight: 10 }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.2371 8.92853H1.06311" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M4.28969 12.211L1 8.9202L4.27467 5.65247" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M7.70044 12.9771V14.2835C7.70074 14.9649 7.97119 15.6185 8.4525 16.1009C8.93382 16.5833 9.58675 16.8552 10.2682 16.857H14.4265C15.109 16.8567 15.7634 16.5855 16.2459 16.1029C16.7285 15.6203 16.9997 14.9659 17 14.2835V3.57353C16.9997 2.89108 16.7285 2.23667 16.2459 1.75411C15.7634 1.27154 15.109 1.00031 14.4265 1H10.2682C9.58675 1.00183 8.93382 1.27375 8.4525 1.75614C7.97119 2.23854 7.70074 2.89208 7.70044 3.57353V4.87993" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              <Primary>{headerButtonText}</Primary>
                            </div>
                          </Button>
                          <div className={styles.wallet}>
                              {walletPreview(context.acc.address)}                             
                          </div>
                        </li>
                    </> : null
                    }
                  </ul>
                </nav>
              </Padding>
              <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
