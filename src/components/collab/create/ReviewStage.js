import { useContext } from "react"
import { Container, Padding } from "../../layout"
import styles from '../styles.module.scss'
import { groupShareTotal } from '../functions'
import { Button, Curate } from '../../../components/button'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Fragment } from "react"

export const ReviewStage = ({ collaborators, beneficiaries, onEdit }) => {

    const totalShares = groupShareTotal(collaborators) + groupShareTotal(beneficiaries)

    const cNum = collaborators.length
    const bNum = beneficiaries.length

    // Proxy contract creation function
    const { originateProxy } = useContext(HicetnuncContext) // use mockProxy instead for fake return data
    // const { mockProxy } = useContext(HicetnuncContext) // use mockProxy instead for fake return data

    const originateContract = async () => {
        // shares should be object where keys are addresses and
        // values are natural numbers (it is not required to have 100% in the sum)
        // admin will be the signed in address that creates it
        let participantData = {}

        const validCollaborators = collaborators
            .filter(b => b.shares)
            .map(collaborator => ({
                ...collaborator,
                role: 'collaborator',
            }));

        const validBeneficiaries = beneficiaries
            .filter(b => b.shares)
            .map(beneficiary => ({
                ...beneficiary,
                role: 'benefactor',
            }));

        const allParticipants = validCollaborators.concat(validBeneficiaries);

        Object.values(allParticipants).forEach(
            participant => participantData[participant.address] = {
                share: parseFloat(Math.floor(participant.shares * 1000)),
                isCore: participant.role === 'collaborator',
            }
        )

        // Call the core blockchain function to create the contract
        // await mockProxy(participantData)
        await originateProxy(participantData)
    }

    return (
        <Container>
            <Padding>
                <h1 className={styles.mb1}>
                    <strong>review &amp; create</strong>
                </h1>

                <p className={styles.descriptive}>You have a total of {totalShares} shares divided between {cNum + bNum} addresses. Percentages may not total 100% due to rounding.</p>

                <h2 className={styles.mt3}>collaborators</h2>
                {collaborators.length > 0 && (
                    <table className={styles.reviewTable}>
                        <thead>
                            <tr>
                                <th>address</th>
                                <th>shares</th>
                                <th style={{ textAlign: 'right' }}>%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {collaborators.map(collaborator => {
                                const { address, shares, name } = collaborator
                                const percentage = ((shares / totalShares) * 100).toFixed(2)
                                return (
                                    <tr key={address}>
                                        <td className={styles.cellWithPadding}>
                                            {name && <p className={styles.muted}>{name}</p>}
                                            {address}
                                        </td>
                                        <td className={styles.cellWithPadding}>{shares}</td>
                                        <td className={styles.cellWithPadding} style={{ textAlign: 'right' }}>{percentage}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}

                { collaborators.length === 0 && (
                    <p className={styles.muted}>No core collaborators</p>
                )}

                {beneficiaries.length > 0 && (
                    <Fragment>
                        <h2 className={styles.mt3}>beneficiaries</h2>
                        <table className={styles.reviewTable}>
                            <thead>
                                <tr>
                                    <th>address</th>
                                    <th>shares</th>
                                    <th style={{ textAlign: 'right' }}>%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {beneficiaries.map((collaborator) => {
                                    const { address, shares, name } = collaborator
                                    const percentage = (shares / totalShares * 100).toFixed(2)
                                    return (
                                        <tr key={address}>
                                            <td className={styles.cellWithPadding}>
                                                {name && <p className={styles.muted}>{name}</p>}
                                                {address}
                                            </td>
                                            <td className={styles.cellWithPadding}>{shares}</td>
                                            <td className={styles.cellWithPadding} style={{ textAlign: 'right' }}>{percentage}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </Fragment>
                )}

                <div className={styles.mt3}>
                    <Button onClick={() => originateContract()}>
                        <Curate>create collaborative contract</Curate>
                    </Button>
                </div>

                <button className={styles.btn} onClick={onEdit}>
                    &lt; go back
                </button>

            </Padding>

        </Container>
    )
}