import { useState, useEffect, Fragment } from "react"
import styles from '../styles.module.scss'
import { Button, Purchase, Secondary } from "../../button"
import { BenefactorRow, collaboratorTemplate } from "../"
import { extractAddress } from "../functions"
import classNames from "classnames"
import { ProjectList } from "./ProjectList"
import { AddCollaboratorsButton } from "./AddCollaboratorsButton"

export const BenefactorsUI = ({ benefactors, setBenefactors, onSelectPercentage, onComplete }) => {

    // For when users paste multiline content
    const [multilineContent, setMultilineContent] = useState('')

    // Add benefactor - the name will be available if coming from the OSS project list
    const addBenefactor = (address, name) => {
        const validBenefactors = benefactors.filter(b => b.address)
        const newBenefactor = {
            ...collaboratorTemplate,
            address: address || '',
            name,
        }

        setBenefactors([...validBenefactors, newBenefactor])
    }

    // Remove benefactor
    const removeBenefactor = (index) => {
        const updatedBenefactors = [...benefactors]
        updatedBenefactors.splice(index, 1)
        setBenefactors(updatedBenefactors)
    }

    // Update the benefactor data
    const onUpdate = (index, benefactorData) => {
        const updatedBenefactors = [...benefactors]

        updatedBenefactors[index] = {
            ...benefactorData,
            share: benefactorData.percentage,
        }

        setBenefactors([...updatedBenefactors])
    }

    if (multilineContent.length) {
        const currentAddresses = benefactors.filter(c => c.address).map(c => c.address)
        const lines = multilineContent.replace(/\r/g, '').split(/\n/)
        const newAddresses = lines.map(l => extractAddress(l)).filter(a => a)

        // Combine with existing
        const allAddresses = currentAddresses.concat(newAddresses)

        // With benefactors we don't know what they get percentage-wise so just add the addresses

        // Convert to collaborator format with shares
        const allBenefactors = allAddresses.map(address => ({
            ...collaboratorTemplate,
            address,
        }))

        // We now turn autosplit on
        setBenefactors(allBenefactors)
        setMultilineContent('')
    }

    const headingClass = classNames(styles.mt3, {
        [styles.mb1]: benefactors.length === 0,
        [styles.mb2]: benefactors.length > 0,
    })
    const notesClass = classNames(styles.muted, {
        [styles.mb1]: benefactors.length === 0,
        [styles.mb2]:  benefactors.length > 0,
    })

    const validBenefactors = benefactors.filter(b => b.address && b.shares)

    return (
        <Fragment>
            <h2 className={headingClass}><strong>benefactors</strong></h2>
            {benefactors.length === 0 && (
                <p className={notesClass}>Do you want to include anyone that wasn’t a collaborator, eg. a donation to the H=N Tezos Fountain?</p>
            )}

            {benefactors.length === 0 && (
                <button className={styles.btn} onClick={() => addBenefactor()}>
                    <Secondary>
                        add address manually
                    </Secondary>
                </button>
            )}

            {benefactors.length > 0 && (
                <table className={styles.table}>
                    <tbody>
                        {benefactors.map((benefactor, index) => {
                            return (
                                <BenefactorRow
                                    key={`benefactor-${index}`}
                                    benefactor={benefactor}
                                    onUpdate={benefactorData => onUpdate(index, benefactorData)}
                                    onRemove={() => removeBenefactor(index)}
                                    onAdd={addBenefactor}
                                    onPasteMulti={setMultilineContent}
                                    onSelectPercentage={ percentage => onSelectPercentage(index, percentage) }
                                />
                            )
                        })}
                    </tbody>
                </table>
            )}

            <ProjectList benefactors={benefactors} onSelect={addBenefactor} />

            {validBenefactors.length > 0 && (
                <AddCollaboratorsButton
                    type="benefactor"
                    threshold={1}
                    collaborators={benefactors}
                    onClick={onComplete}
                />
            )}

            {validBenefactors.length === 0 && (
                <div className={styles.mt2}>
                    <Button onClick={onComplete}>
                        <Purchase>
                            Skip
                        </Purchase>
                    </Button>
                </div>
            )}

        </Fragment>
    )
}