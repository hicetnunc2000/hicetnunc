import React, { useState } from 'react'
import { Page, Container, Padding } from '../../components/layout'
import { Button, Primary } from '../../components/button'
import { Select, Originate } from './tabs'
import { Menu } from '../../components/menu'

const TABS = [
  { title: 'select', component: Select },
  { title: 'originate', component: Originate },
]

export const ProxyContract = () => {
  const [tabIndex, setTabIndex] = useState(0)

  const Tab = TABS[tabIndex].component

  // TODO: button to free from proxy contract? (that just makes field empty)
  // TODO: create new smart contract form with separate page?
  // TODO: add/remove tokens to contract?
  // TODO: validate proxy address?
  // TODO: any way to find all contracts that controlled by user pk?

  return (
    <Page title="proxy">
      <Container>
        <Padding>
          <Menu>
            {TABS.map((tab, index) => {
              return (
                <Button key={tab.title} onClick={() => setTabIndex(index)}>
                  <Primary selected={tabIndex === index}>
                    {tab.title}
                  </Primary>
                </Button>
              )
            })}
          </Menu>
        </Padding>
      </Container>

      <Tab/>
    </Page>
  )
}

