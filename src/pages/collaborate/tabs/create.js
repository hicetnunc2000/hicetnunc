import { useEffect, useState, useContext } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Button, Curate, Primary } from '../../../components/button'
import { Page, Container, Padding } from '../../../components/layout'
import { CollaboratorRow } from '../../../components/collab/CollaboratorRow'
import { TipJar } from '../../../components/collab/TipJar';
import styles from '../styles.module.scss'

export const CreateCollaboration = () => {

    const template = {
        address: '',
        percentage: undefined,
    }

    // Local state
    const [collaborators, setCollaborators] = useState([])
    const [tips, setTips] = useState([])
    const [remainingPercentage, setRemainingPercentage] = useState(100)
    const [autoSplit, setAutoSplit] = useState(false)
    const [textInput, setTextInput] = useState('')
    const [addresses, setAddresses] = useState([])
    const [showTipJar, setShowTipJar] = useState(false)

    // Proxy contract creation
    const { originateProxy } = useContext(HicetnuncContext)

    // Take tips off the top
    const availablePercentage = 100 - tips.reduce((amount, t) => (t.percentage || 0) + amount, 0)

    // Check for completed entries
    const validCollaborators = collaborators.filter(c => c.percentage && c.address)

    const addCollaborator = (collaborator) => {
        setCollaborators([...collaborators, collaborator])
    }

    const removeCollaborator = (index) => {
        const updatedCollaborators = [...collaborators]
        updatedCollaborators.splice(index, 1)
        setCollaborators(updatedCollaborators)
    }

    const _extractAddress = (input) => {
        const tzPattern = /^.*(tz[\w\d]{34}).*$/i
        let matches = tzPattern.exec(input.trim())

        // Check for contract patterns
        if (!matches) {
            const ktPattern = /^.*(kt[\w\d]{34}).*$/i
            matches = ktPattern.exec(input.trim())
        }

        if (!matches) {
            return false
        }

        return matches[1];
    }

    const calculateSplits = () => {
        if (autoSplit) {
            const royaltiesPerCollaborator = availablePercentage / addresses.length
            const updatedCollabs = [...collaborators].map(collaborator => ({
                address: collaborator.address,
                percentage: royaltiesPerCollaborator,
            }))

            setCollaborators(updatedCollabs)
        } else {

            const remaining = collaborators.reduce((remaining, collab) => {
                return remaining - (collab.percentage || 0)
            }, availablePercentage)

            setRemainingPercentage(remaining)
        }
    }

    const parseAddresses = (input) => {
        const updatedAddresses = [...addresses]
        const lines = input.replace(/\r/g, '').split(/\n/)
        const newAddresses = lines.map(l => _extractAddress(l)).filter(a => a)

        // Add new addresses
        const combinedAddresses = updatedAddresses.concat(newAddresses)

        // If we have addresses, create the collab
        setAddresses(combinedAddresses)
    }

    // When the addresses update in auto split mode,
    useEffect(() => {
        const royaltiesPerCollaborator = 100 / addresses.length
        const collaborators = addresses.map(address => ({
            address,
            percentage: royaltiesPerCollaborator,
        }))

        setCollaborators(collaborators)
        setTextInput('')
    }, [addresses])

    useEffect(() => {
        if (textInput.length) {
            parseAddresses(textInput)
        }
    }, [textInput])

    useEffect(() => {
        if (collaborators.length === 0) {
            if (!autoSplit) {
                setCollaborators([{ ...template }])
            }
        }

        if (validCollaborators.length === 0 && collaborators.length === 1) {
            setCollaborators([])
        } else {
            calculateSplits()
        }

    }, [autoSplit, availablePercentage])

    useEffect(() => {
        // 
    }, [collaborators])

    const onUpdate = (index, collabData) => {
        const updatedCollabs = [...collaborators]
        updatedCollabs[index] = collabData
        setCollaborators([...updatedCollabs])
    }

    const originateContract = async () => {
        // TODO: need some UI to select admin contract
        // now using first address as a administrator
        const administratorAddress = collaborators[0]['address']

        // shares should be object where keys are addresses and
        // values are natural numbers (it is not required to have
        // 100% in the sum)
        let shares = {}


        const validTips = tips.filter(t => t.percentage).map(t => ({
            address: t.address,
            percentage: t.percentage,
        }));

        // Merge collaborators with tips
        const allParticipants = validCollaborators.concat(validTips)

        Object.values(allParticipants).forEach(
            value => shares[value['address']] = parseFloat(
                Math.floor(value['percentage']) * 1000))

        console.log('shares', shares)

        // performing call to the blockchain using taquito:
        // await originateProxy(administratorAddress, shares)
    }

    return (
        <Page title="Collaborate">
            <Container>
                <Padding>
                    <h1 className={styles.mb}><strong>add collaborator tz addresses below</strong></h1>

                    <div className={styles.mb}>
                        <label htmlFor="auto-split" className={styles.checkbox}>
                            <input id="auto-split" type="checkbox" checked={autoSplit} onChange={() => setAutoSplit(!autoSplit)} /> Auto-split to multiple addresses
                        </label>
                    </div>

                    <table className={styles.table}>
                        <tbody>
                            {collaborators.map((collaborator, index) => {
                                const { address, percentage } = collaborator
                                const showRemoveButton = (address && percentage && (index < collaborators.length - 1 || autoSplit))
                                const showAddButton = index === collaborators.length - 1 && !autoSplit

                                return (
                                    <CollaboratorRow
                                        key={`collaborator-${index}`}
                                        collaborator={collaborator}
                                        remainingPercentage={remainingPercentage}
                                        onUpdate={(collabData) => onUpdate(index, collabData)}
                                        onRemove={showRemoveButton ? () => removeCollaborator(index) : null}
                                        onAdd={showAddButton ? addCollaborator : null}
                                        minimalView={showTipJar}
                                    />
                                )
                            })}
                        </tbody>
                    </table>

                    {autoSplit && !showTipJar && (
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            autoFocus
                            placeholder="Paste multiple tz... addresses"
                            value={textInput}
                            onChange={event => setTextInput(event.target.value)}
                        />
                    )}

                    {validCollaborators.length > 0 && !showTipJar && (
                        <Button onClick={() => setShowTipJar(true)} disabled={validCollaborators.length < 2}>
                            <Primary>add {validCollaborators.length} collaborator{validCollaborators.length > 1 ? 's' : ''}</Primary>
                        </Button>
                    )}

                    {showTipJar && (
                        <TipJar tips={tips} setTips={setTips} />
                    )}

                    {validCollaborators.length > 0 && showTipJar && (
                        <Padding>
                            <Button onClick={(e) => originateContract()} fit>
                                <Curate>Create new collaborative contract</Curate>
                            </Button>
                        </Padding>
                    )}

                </Padding>

            </Container>
        </Page>
    )
}
