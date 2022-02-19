import { useState, useEffect } from 'react'
import { CollaboratorRow, collaboratorTemplate } from '../'
import { extractAddress } from '../functions'
import styles from '../styles.module.scss'

export const CollaboratorTable = ({ collaborators, setCollaborators, availableShares, minimalView, onEdit }) => {

    // For when users paste multiline content
    const [multilineInput, setMultilineInput] = useState('')
    const [autoSplit, setAutoSplit] = useState(false)

    // Add collaborator
    const addCollaborator = () => {
        setCollaborators([
            ...collaborators, {
                ...collaboratorTemplate
            }
        ])

        // If we are in minimal view, go back to full editing mode
        if (minimalView) {
            onEdit()
        }
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

        if (updatedCollabs.length > 1 && updatedCollabs.some((collaborator, i) => collaborator.address === collabData.address && i !== index)) {
            console.log("Address exists")
        } else {
            updatedCollabs[index] = collabData
        }

        // Remove duplicates
        setCollaborators(updatedCollabs)
    }

    // Handle multiline input - this will set an array of address
    // the useEffect will catch this and calculate the distribution
    useEffect(() => {
        if (multilineInput.length) {
            const currentAddresses = collaborators.filter(c => c.address).map(c => c.address)
            const lines = multilineInput.replace(/\r/g, '').split(/\n/)
            const newAddresses = lines.map(l => extractAddress(l)).filter(a => !!a && currentAddresses.indexOf(a) === -1)

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

        if (collaborators.length === 0) {
            if (!autoSplit) {
                setCollaborators([{ ...collaboratorTemplate }])
            }
        }
    }, [multilineInput, collaborators, setCollaborators, autoSplit, setAutoSplit])

    const lastCollab = collaborators[collaborators.length - 1]
    const disableAddButton = lastCollab ? (!lastCollab.address) : true

    return (
        <div>
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
                            <td colSpan={minimalView ? 2 : 3}>
                                <button className={styles.btn} onClick={() => addCollaborator()} disabled={disableAddButton}>add another collaborator</button>
                            </td>
                        </tr>
                    </tfoot>
                )}

            </table>
        </div>
    )
}
