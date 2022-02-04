import React, { useContext, useEffect, useState } from 'react'
import { Page, Container, Padding } from '../../components/layout'
import { Button, Primary } from '../../components/button'
import { CollabDisplay } from '../../components/collab/show/CollabDisplay'
import { CreateCollaboration } from './tabs'
import { Menu } from '../../components/menu'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { CollabContractsOverview } from './tabs/manage'
import { useParams } from 'react-router'

const TABS = [
    { title: 'manage', component: CollabContractsOverview },
    { title: 'create', component: CreateCollaboration },
]

const Collaborate = () => {
    const [tabIndex, setTabIndex] = useState(0)
    const Tab = TABS[tabIndex].component

    // We watch for this being created so we can change from create to manage
    const { originationOpHash } = useContext(HicetnuncContext)

    const { action } = useParams();

    useEffect(() => {
        const tabIndex = TABS.findIndex(t => t.title === action)
        setTabIndex(Math.max(tabIndex, 0))
    }, [action])

    // If an address is created, update the tab
    useEffect(() => {
        console.log({originationOpHash})
        if (originationOpHash) {
            setTabIndex(0)
        }
    }, [originationOpHash])

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
