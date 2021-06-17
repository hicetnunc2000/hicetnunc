import React, { useContext, useEffect, useState } from 'react'
import { Page, Container, Padding } from '../../components/layout'
import { Button, Primary } from '../../components/button'
import { CollabDisplay } from '../../components/collab/show/CollabDisplay'
import { SelectProxyContract, CreateCollaboration } from './tabs'
import { Menu } from '../../components/menu'
import { HicetnuncContext } from '../../context/HicetnuncContext'

const TABS = [
    { title: 'create collaboration', component: CreateCollaboration },
    { title: 'use collaboration', component: SelectProxyContract },
]

const Collaborate = () => {
    const [tabIndex, setTabIndex] = useState(0)
    const Tab = TABS[tabIndex].component

    const { proxyAddress, originatedContract } = useContext(HicetnuncContext)

    // If an address is created, update the tab
    useEffect(() => {
        if (originatedContract) {
            setTabIndex(1)
        }
    }, [proxyAddress, originatedContract])

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
            <Tab />
        </Page>
    )
}


export {
    Collaborate,
    CollabDisplay,
}