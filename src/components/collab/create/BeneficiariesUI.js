import { useState, Fragment } from "react"
import styles from '../styles.module.scss'
import { Button, Purchase, Secondary } from "../../button"
import { BeneficiaryRow, collaboratorTemplate } from ".."
import { extractAddress } from "../functions"
import classNames from "classnames"
import { ProjectList } from "./ProjectList"
import { AddCollaboratorsButton } from "./AddCollaboratorsButton"

export const BeneficiariesUI = ({
    beneficiaries,
    setBeneficiaries,
    onSelectPercentage,
    totalParticipants,
    onComplete
}) => {

    // For when users paste multiline content
    const [multilineContent, setMultilineContent] = useState('')

    // Add beneficiary - the name will be available if coming from the OSS project list
    const addBeneficiary = (address, name) => {
        const validBeneficiaries = beneficiaries.filter(b => b.address)
        const newBeneficiary = {
            ...collaboratorTemplate,
            address: address || '',
            name,
        }

        setBeneficiaries([
            ...validBeneficiaries,
            newBeneficiary
        ])
    }

    // Remove beneficiary
    const removeBeneficiary = (index) => {

        // Select a zero percentage for this one
        onSelectPercentage(index, 0);

        const updatedBeneficiaries = [...beneficiaries]
        updatedBeneficiaries.splice(index, 1)
        setBeneficiaries(updatedBeneficiaries)
    }

    // Update the beneficiary data
    const onUpdate = (index, beneficiaryData) => {
        const updatedBeneficiaries = [...beneficiaries]

        updatedBeneficiaries[index] = {
            ...beneficiaryData,
            share: beneficiaryData.percentage,
        }

        setBeneficiaries([...updatedBeneficiaries])
    }

    if (multilineContent.length) {
        const currentAddresses = beneficiaries.filter(c => c.address).map(c => c.address)
        const lines = multilineContent.replace(/\r/g, '').split(/\n/)
        const newAddresses = lines.map(l => extractAddress(l)).filter(a => a)

        // Combine with existing
        const allAddresses = currentAddresses.concat(newAddresses)

        // With beneficiaries we don't know what they get percentage-wise so just add the addresses

        // Convert to collaborator format with shares
        const allBeneficiaries = allAddresses.map(address => ({
            ...collaboratorTemplate,
            address,
        }))

        // We now turn autosplit on
        setBeneficiaries(allBeneficiaries)
        setMultilineContent('')
    }

    const headingClass = classNames(styles.mt3, {
        [styles.mb1]: beneficiaries.length === 0,
        [styles.mb2]: beneficiaries.length > 0,
    })

    const notesClass = classNames(styles.muted, {
        [styles.mb1]: beneficiaries.length === 0,
        [styles.mb2]: beneficiaries.length > 0,
    })

    const validBeneficiaries = beneficiaries.filter(b => b.address && b.shares)
    const lastBenefactor = beneficiaries[beneficiaries.length - 1]
    const disableAddButton = lastBenefactor ? (!lastBenefactor.address) : true
    const noCollaborators = totalParticipants === beneficiaries.length

    return (
        <Fragment>
            <h2 className={headingClass}><strong>beneficiaries</strong></h2>

            {beneficiaries.length === 0 && (
                <p className={notesClass}>Do you want to include anyone that wasn’t a collaborator, eg. the team who made the collab contract ;)</p>
            )}

            {beneficiaries.length === 0 && (
                <button className={styles.btn} onClick={addBeneficiary}>
                    <Secondary>
                        add address manually
                    </Secondary>
                </button>
            )}

            {beneficiaries.length > 0 && (
                <table className={styles.table}>
                    <tbody>
                        {beneficiaries.map((beneficiary, index) => {
                            return (
                                <BeneficiaryRow
                                    key={`beneficiary-${index}`}
                                    beneficiary={beneficiary}
                                    onUpdate={beneficiaryData => onUpdate(index, beneficiaryData)}
                                    onRemove={() => removeBeneficiary(index)}
                                    onAdd={addBeneficiary}
                                    onPasteMulti={setMultilineContent}
                                    onSelectPercentage={noCollaborators ? null : percentage => onSelectPercentage(index, percentage)}
                                />
                            )
                        })}
                    </tbody>

                    {beneficiaries.filter(b => b.address).length > 0 && (
                        <tfoot>
                            <tr>
                                <td>
                                    <button className={styles.btn} onClick={() => addBeneficiary()} disabled={disableAddButton}>add another beneficiary</button>
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            )}

            <ProjectList beneficiaries={beneficiaries} onSelect={addBeneficiary} />

            {validBeneficiaries.length > 0 && totalParticipants >= 2 && (
                <AddCollaboratorsButton
                    threshold={1}
                    collaborators={beneficiaries}
                    onClick={onComplete}
                />
            )}

            {(validBeneficiaries.length === 0 || totalParticipants < 2) && (
                <div className={styles.mt2}>
                    {totalParticipants >= 2 && (
                        <Button onClick={onComplete}>
                            <Purchase>
                                Skip
                            </Purchase>
                        </Button>
                    )}
                    {totalParticipants < 2 && (
                        <p className={styles.muted}>You need to have at least two participants to create a collaborative contract</p>
                    )}
                </div>
            )}

        </Fragment>
    )
}