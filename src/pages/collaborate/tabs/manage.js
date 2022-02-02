import React, { useState, useContext, useEffect } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import styles from '../../../components/collab/styles.module.scss'
import { fetchGraphQL, getCollabsForAddress } from '../../../data/hicdex'
// import { Input } from '../../../components/input'
import { CountdownTimer } from '../../../components/collab/manage/CountdownTimer'
import { CollabList } from '../../../components/collab/manage/CollabList'

export const CollabContractsOverview = ({ showAdminOnly = false }) => {

    const { acc, originatedContract, originationOpHash, findOriginatedContractFromOpHash } = useContext(HicetnuncContext)
    const [collabs, setCollabs] = useState([])
    // const [managedCollabs, setManagedCollabs] = useState([])
    const [loadingCollabs, setLoadingCollabs] = useState(true)

    const [checkInterval, setCheckInterval] = useState(30)
    const [timerEndDate, setTimerEndDate] = useState()

    // TODO - maybe allow manual input of a KT address
    // const [addAddressManually, setAddAddressManually] = useState(false)
    // const [manualAddress, setManualAddress] = useState('')

    useEffect(() => {
        // const isChecking = originationOpHash && !checkingForOrigination
        // setCheckingForOrigination(isChecking)

        if (originationOpHash && !timerEndDate) {
            const timerDate = new Date()
            timerDate.setTime(timerDate.getTime() + (checkInterval * 1000))
            setTimerEndDate(timerDate)
        }

    }, [originationOpHash, timerEndDate]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!acc) {
            return
        }

        setLoadingCollabs(true)
        console.log("Now checking for available collabs")

        // On boot, see what addresses the synced address can manage 
        fetchGraphQL(getCollabsForAddress, 'GetCollabs', {
            address: acc.address,
        }).then(({ data }) => {

            setLoadingCollabs(false)

            if (data) {
                const allCollabs = data.hic_et_nunc_splitcontract || []
                const adminCollabs = allCollabs.filter(c => c.administrator === acc.address)
                const participantCollabs = allCollabs.filter(c => c.administrator !== acc.address)

                // Show admin followed by participant
                const availableCollabs = showAdminOnly ? allCollabs.filter(c => c.administrator === acc.address) : [...adminCollabs, ...participantCollabs]
                
                setCollabs(availableCollabs)
            }
        })
    }, [acc, originatedContract]) // eslint-disable-line react-hooks/exhaustive-deps

    const _onTimerComplete = () => {
        findOriginatedContractFromOpHash(originationOpHash)
        setCheckInterval(10)
    }

    return (
        <Container>
            <Padding>
                {originationOpHash && timerEndDate && (
                    <p className={styles.mb3}>Collab contract creation in progress... <CountdownTimer endDate={timerEndDate} onComplete={_onTimerComplete} /></p>
                )}

                {originatedContract && (
                    <div className={styles.mb3}>
                        <p><strong>collaborative contract created successfully!</strong></p>
                        <p>address: {originatedContract.address}</p>
                    </div>
                )}

                {collabs.length > 0 && (
                    <CollabList
                        description={showAdminOnly ? "you can mint with these collab contracts:" : "you are part of these collab contracts:"}
                        collabs={collabs}
                    />
                )}

                {/* {collabs.length > 0 && (
                    <CollabList
                        description="You are a participant in these collabs:"
                        collabs={collabs}
                    />
                )} */}

                {collabs.length === 0 && !originationOpHash && (
                    <p>{loadingCollabs ? 'Looking for collabs...' : 'You aren’t part of any collaborations at the moment'}</p>
                )}

            </Padding>
        </Container>
    )
}

