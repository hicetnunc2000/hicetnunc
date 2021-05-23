import { useEffect, useState } from 'react'
import { Button, Primary } from '../../../components/button';
import { Page, Container, Padding } from '../../../components/layout'
import { CollaboratorRow } from '../CollaboratorRow'
import styles from '../styles.module.scss'
import { TipJar } from '../TipJar';

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
    const [lineCount, setLineCount] = useState(2)
    const [textInput, setTextInput] = useState('')
    const [addresses, setAddresses] = useState([])
    const [showTipJar, setShowTipJar] = useState(false)

    // Check for completed entries
    const completeCollaborators = collaborators.filter(c => c.percentage && c.address)


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
            const royaltiesPerCollaborator = 100 / addresses.length
            const updatedCollabs = [...collaborators].map(collaborator => ({
                address: collaborator.address,
                percentage: royaltiesPerCollaborator,
            }))

            setCollaborators(updatedCollabs)
        } else {

            const remaining = collaborators.reduce((remaining, collab) => {
                return remaining - (collab.percentage || 0)
            }, 100)

            setRemainingPercentage(remaining)
        }
    }

    const parseAddresses = (input) => {
        const updatedAddresses = [...addresses]
        const lines = input.replace(/\r/g, '').split(/\n/)
        const newAddresses = lines.map(l => _extractAddress(l)).filter(a => a)

        // Add new addresses
        const combinedAddresses = updatedAddresses.concat(newAddresses)

        // Update the size of the textbox to show all pasted
        setLineCount(lines.length)

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

        if (completeCollaborators.length === 0 && collaborators.length === 1) {
            setCollaborators([])
        } else {
            calculateSplits()
        }

    }, [autoSplit])

    useEffect(() => {
        // 
    }, [collaborators])

    const onUpdate = (index, collabData) => {
        const updatedCollabs = [...collaborators]
        updatedCollabs[index] = collabData
        setCollaborators([...updatedCollabs])
    }

    return (
        <Page title="Collaborate">
            <Container>
                <Padding>
                    <h1 className={styles.mb}><strong>add collaborator tz addresses below</strong></h1>
                    {/* {collaborators.length === 0 && (
                        <h1 className={styles.mb}><strong>add collaborator tz addresses below</strong></h1>
                    )} */}

                    <div className={styles.mb}>
                        <label htmlFor="auto-split" className={styles.checkbox}>
                            <input id="auto-split" type="checkbox" checked={autoSplit} onChange={() => setAutoSplit(!autoSplit)} /> Auto-split to multiple addresses
                        </label>
                    </div>

                    <table className={styles.table}>
                        <tbody>
                            {collaborators.map((collaborator, index) => {
                                const { address, percentage } = collaborator
                                const showRemoveButton = (address && percentage && index < collaborators.length - 1)

                                return (
                                    <CollaboratorRow
                                        key={`collaborator-${index}`}
                                        collaborator={collaborator}
                                        remainingPercentage={remainingPercentage}
                                        onUpdate={(collabData) => onUpdate(index, collabData)}
                                        onRemove={showRemoveButton ? () => removeCollaborator(index) : null}
                                        onAdd={index === collaborators.length - 1 ? addCollaborator : null}
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

                    {completeCollaborators.length > 0 && !showTipJar && (
                        <Button onClick={() => setShowTipJar(true)} disabled={completeCollaborators.length < 2}>
                            <Primary>add {completeCollaborators.length} collaborator{completeCollaborators.length > 1 ? 's' : ''}</Primary>
                        </Button>
                    )}

                    {showTipJar && (
                        <TipJar tips={tips} setTips={setTips} />
                    )}

                </Padding>
            </Container>
        </Page>
    )
}
