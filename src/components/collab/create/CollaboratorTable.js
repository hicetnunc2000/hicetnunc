import { useState, useEffect } from 'react'
import { CollaboratorRow, collaboratorTemplate } from '../'
import { extractAddress } from '../functions'
import styles from '../styles.module.scss'

export const CollaboratorTable = ({ collaborators, setCollaborators, availableShares, minimalView, onEdit }) => {

    // For when users paste multiline content
    const [multilineInput, setMultilineInput] = useState('')
    const [autoSplit, setAutoSplit] = useState(false)

    // Extract valid collaborators
    const validCollaborators = collaborators.filter(c => c.shares && c.address)

    // Add collaborator
    const addCollaborator = () => {
        setCollaborators([...collaborators, { ...collaboratorTemplate }])
    }

    // Remove collaborator
    const removeCollaborator = (index) => {
        const updatedCollaborators = [...collaborators]
        updatedCollaborators.splice(index, 1)
        setCollaborators(updatedCollaborators)
    }

    // Update collaborator data
    const onUpdate = (index, collabData) => {
        const updatedCollabs = [...collaborators]
        updatedCollabs[index] = collabData
        setCollaborators([...updatedCollabs])
    }

    // Handle multiline input - this will set an array of address
    // the useEffect will catch this and calculate the distribution
    useEffect(() => {
        if (multilineInput.length) {
            const currentAddresses = collaborators.filter(c => c.address).map(c => c.address)
            const lines = multilineInput.replace(/\r/g, '').split(/\n/)
            const newAddresses = lines.map(l => extractAddress(l)).filter(a => a)

            // Combine with existing
            const allAddresses = currentAddresses.concat(newAddresses)

            // Work out the new distribution
            const sharesPerCollaborator = Math.floor(100 / allAddresses.length)

            // Convert to collaborator format with shares
            const allCollaborators = allAddresses.map(address => ({
                address,
                shares: sharesPerCollaborator,
            }))

            // We now turn autosplit on
            setAutoSplit(true)
            setCollaborators(allCollaborators)
            setMultilineInput('')
        }
    }, [multilineInput, collaborators, setCollaborators, setAutoSplit])



    const calculateSplits = () => {
        if (!collaborators.length) {
            return false;
        }

        let updatedCollaborators;

        if (autoSplit) {
            const sharesPerCollaborator = availableShares / validCollaborators.length

            // Even split
            updatedCollaborators = collaborators.map(collaborator => ({
                address: collaborator.address,
                shares: sharesPerCollaborator,
            }))
        } else {
            // Map the percentages to the available amounts
            updatedCollaborators = collaborators.map(collaborator => ({
                ...collaborator,
                shares: collaborator.shares / 100 * availableShares,
            }))
        }

        setCollaborators(updatedCollaborators)
    }

    // When the available percentage changes or we get an autosplit
    // after multiline paste, recalculate the split
    // useEffect(() => {
    //     if (collaborators.length === 0) {
    //         if (!autoSplit) {
    //             setCollaborators([{ ...collaboratorTemplate }])
    //         }
    //     }

    //     if (validCollaborators.length === 0 && collaborators.length === 1) {
    //         setCollaborators([])
    //     } else {
    //         calculateSplits()
    //     }
    // }, [autoSplit, availablePercentage])

    if (collaborators.length === 0) {
        if (!autoSplit) {
            setCollaborators([{ ...collaboratorTemplate }])
        }
    }

    // if (validCollaborators.length === 0 && collaborators.length === 1) {
    //     setCollaborators([])
    // } else {
    //     calculateSplits()
    // }

    const lastCollab = collaborators[collaborators.length - 1]
    const disableAddButton = lastCollab ? (!lastCollab.address) : true

    return (
        <div className={minimalView ? styles.borderBottom : null}>
            <table className={styles.table}>
                <tbody>
                    {collaborators.map((collaborator, index) => {
                        return (
                            <CollaboratorRow
                                key={`collaborator-${index}`}
                                collaborator={collaborator}
                                availableShares={availableShares}
                                onUpdate={collabData => onUpdate(index, collabData)}
                                onRemove={() => removeCollaborator(index)}
                                onAdd={addCollaborator}
                                onEdit={onEdit}
                                onPasteMulti={setMultilineInput}
                                minimalView={minimalView}
                            />
                        )
                    })}
                </tbody>

                {collaborators.filter(c => c.address).length > 0 && (
                    <tfoot>
                        <tr>
                            <td>
                                <button className={styles.btn} onClick={() => addCollaborator()} disabled={disableAddButton}>add another collaborator</button>
                            </td>
                        </tr>
                    </tfoot>
                )}

            </table>
        </div>
    )
}