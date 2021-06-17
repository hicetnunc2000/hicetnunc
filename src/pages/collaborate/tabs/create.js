import { useState, useEffect, Fragment } from 'react'
import { groupShareTotal } from '../../../components/collab/functions'
import { Container, Padding } from '../../../components/layout'
import { CollaboratorTable, BenefactorsUI } from '../../../components/collab'
import { AddCollaboratorsButton } from '../../../components/collab/create/AddCollaboratorsButton'
import { ReviewStage } from '../../../components/collab/create/ReviewStage'
import styles from '../styles.module.scss'
import classNames from 'classnames'

export const CreateCollaboration = () => {

    // Core collaborators and benefactors
    const [editCollaborators, setEditCollaborators] = useState(true)
    const [collaborators, setCollaborators] = useState([])
    const [benefactors, setBenefactors] = useState([])

    // For adding people not directly involved with the creation
    const [showBenefactorsUI, setShowBenefactorsUI] = useState(false);

    // For adding people not directly involved with the creation
    const [showReview, setShowReview] = useState(false);

    // Grand total of share allocation
    const totalShares = groupShareTotal(collaborators) + groupShareTotal(benefactors)

    // Check for completed entries - must have a share allocation and address
    const validCollaborators = collaborators.filter(c => c.shares && c.address)

    useEffect(() => {
        if (benefactors.length === 0) {
            setShowBenefactorsUI(false)
        }
    }, [showReview, benefactors.length])

    useEffect(() => {
        if (!editCollaborators && !showBenefactorsUI) {
            setShowBenefactorsUI(true)
        }
    }, [editCollaborators, showBenefactorsUI])

    // When the user clicks a percentage button in the benefactors UI
    const _calculateShares = (index, percentage) => {

        const benefactor = benefactors[index]
        const updatedBenefactors = [...benefactors]

        updatedBenefactors[index] = {
            ...benefactor,
            shares: Math.floor(totalShares * percentage / 100),
        }

        // Now what's left?
        const remaining = totalShares - groupShareTotal(updatedBenefactors)

        // Redistribute to collaborators
        const updatedCollaborators = collaborators.map(collaborator => {
            const proportion = collaborator.shares / groupShareTotal(collaborators)
            const newAllocation = Math.floor( proportion * remaining * 100 ) / 100
            
            return {
                ...collaborator,
                shares: newAllocation,
            }
        })

        setBenefactors(updatedBenefactors)
        setCollaborators(updatedCollaborators)
    }

    const notesClass = classNames(styles.mb2, styles.muted)
    const minimalView = !editCollaborators && (showBenefactorsUI || showReview)

    return showReview ? (
        <ReviewStage
            collaborators={collaborators}
            benefactors={benefactors}
            onEdit={ () => setShowReview(false)}
        />
    ) :
        (
            <Container>
                <Padding>
                    <h1 className={validCollaborators.length === 0 ? styles.mb1 : styles.mb3}>
                        <strong>core collaborators</strong>
                    </h1>

                    {validCollaborators.length === 0 && (
                        <Fragment>
                            <p className={notesClass}>Note: shares don’t have to add up to 100% - splits are calculated as proportions of the total shares.</p>
                            <p className={notesClass}>You can paste multiple addresses to get an auto split</p>
                        </Fragment>
                    )}

                    <CollaboratorTable
                        collaborators={collaborators}
                        setCollaborators={setCollaborators}
                        minimalView={minimalView}
                        onEdit={() => setEditCollaborators(true)}
                    />

                    {!minimalView && (
                        <AddCollaboratorsButton
                            type="creator"
                            collaborators={collaborators}
                            onClick={() => setEditCollaborators(false)}
                        />
                    )}

                    {showBenefactorsUI && (
                        <BenefactorsUI
                            totalShares={totalShares}
                            benefactors={benefactors}
                            setBenefactors={setBenefactors}
                            minimalView={showReview}
                            onComplete={() => setShowReview(true)}
                            onSelectPercentage={(index, percentage) => _calculateShares(index, percentage)}
                        />
                    )}

                </Padding>

            </Container>

        )
}


/*


    // Add / remove collabs
    // const addCollaborator = () => {
    //     if (totalAllocated < 100) {
    //         setCollaborators([...collaborators, { ...template }])
    //     }
    // }

    // const removeCollaborator = (index) => {
    //     const updatedCollaborators = [...collaborators]
    //     updatedCollaborators.splice(index, 1)
    //     setCollaborators(updatedCollaborators)
    // }

    // Add / remove benefactors
    // const addBenefactor = () => {
    //     setBenefactors([
    //         ...collaborators,
    //         { ...collaboratorTemplate }
    //     ])
    // }

    // const removeBenefactor = (index) => {
    //     const updatedBenefactors = [...benefactors]
    //     updatedBenefactors.splice(index, 1)
    //     setBenefactors(updatedBenefactors)
    // }

    // const _extractAddress = (input) => {
    //     const tzPattern = /^.*(tz[\w\d]{34}).*$/i
    //     let matches = tzPattern.exec(input.trim())

    //     // Check for contract patterns
    //     if (!matches) {
    //         const ktPattern = /^.*(kt[\w\d]{34}).*$/i
    //         matches = ktPattern.exec(input.trim())
    //     }

    //     if (!matches) {
    //         return false
    //     }

    //     return matches[1];
    // }

    // const calculateSplits = () => {
    //     if (!collaborators.length) {
    //         return false;
    //     }

    //     let updatedCollaborators;

    //     if (autoSplit) {
    //         const royaltiesPerCollaborator = availablePercentage / validCollaborators.length

    //         // Even split
    //         updatedCollaborators = [...collaborators].map(collaborator => ({
    //             address: collaborator.address,
    //             percentage: royaltiesPerCollaborator,
    //             share: royaltiesPerCollaborator,
    //         }))

    //     } else {

    //         // Map the percentages to the available amounts
    //         updatedCollaborators = collaborators.map(collaborator => ({
    //             ...collaborator,
    //             share: collaborator.shares / 100 * availablePercentage,
    //         }))
    //     }

    //     setCollaborators(updatedCollaborators)
    // }

    // const parseCollabAddresses = (input) => {
    //     const updatedAddresses = [...addresses]
    //     const lines = input.replace(/\r/g, '').split(/\n/)
    //     const newAddresses = lines.map(l => extractAddress(l)).filter(a => a)

    //     // Add new addresses
    //     const combinedAddresses = updatedAddresses.concat(newAddresses)

    //     // If we have addresses, create the collab
    //     setAddresses(combinedAddresses)
    // }

    // When the addresses update in autosplit mode
    // useEffect(() => {
    //     const royaltiesPerCollaborator = 100 / addresses.length

    //     const collaborators = addresses.map(address => ({
    //         address,
    //         percentage: royaltiesPerCollaborator,
    //         share: royaltiesPerCollaborator,
    //     }))

    //     setCollaborators(collaborators)
    //     setMultiCollabInput('')
    // }, [addresses])

    // useEffect(() => {
    //     if (multiCollabInput.length) {
    //         parseCollabAddresses(multiCollabInput)
    //     }
    // }, [multiCollabInput])

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

    // const onUpdate = (index, collabData) => {
    //     const updatedCollabs = [...collaborators]

    //     updatedCollabs[index] = {
    //         ...collabData,
    //         share: collabData.shares / 100 * availablePercentage,
    //     }

    //     setCollaborators([...updatedCollabs])
    // }



    // const [tips, setTips] = useState([])
    // const [autoSplit, setAutoSplit] = useState(false)
    // const [multiCollabInput, setMultiCollabInput] = useState('')
    // const [multiBenefactorInput, setMultiBenefactorInput] = useState('')
    // const [addresses, setAddresses] = useState([])

    */