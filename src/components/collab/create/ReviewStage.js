import { useContext } from "react"
import { Container, Padding } from "../../layout"
import styles from '../styles.module.scss'
import { groupShareTotal } from '../functions'
import { Button, Curate } from '../../../components/button'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Fragment } from "react"

export const ReviewStage = ({ collaborators, benefactors, onEdit }) => {

    const totalShares = groupShareTotal(collaborators) + groupShareTotal(benefactors)

    const cNum = collaborators.length
    const bNum = benefactors.length

    // Proxy contract creation function
    const { originateProxy } = useContext(HicetnuncContext)

    const originateContract = async () => {
        // TODO: need some UI to select admin contract
        // now using first address as a administrator
        const administratorAddress = collaborators[0]['address']

        // shares should be object where keys are addresses and
        // values are natural numbers (it is not required to have 100% in the sum)
        let participantData = {}

        const validCollaborators = collaborators
            .filter(b => b.shares)
            .map(collaborator => ({
                ...collaborator,
                role: 'collaborator',
            }));

        const validBenefactors = benefactors
            .filter(b => b.shares)
            .map(benefactor => ({
                ...benefactor,
                role: 'benefactor',
            }));

        const allParticipants = validCollaborators.concat(validBenefactors);

        Object.values(allParticipants).forEach(
            participant => participantData[participant.address] = {
                share: parseFloat(Math.floor(participant.shares * 1000)),
                isCore: participant.role === 'collaborator',
            }
        )

        console.log('ReviewStage::originateContract - participantData', participantData)

        // Call the core blockchain function to create the contract
        await originateProxy(administratorAddress, participantData)
    }

    return (
        <Container>
            <Padding>
                <h1 className={styles.mb1}>
                    <strong>review &amp; create</strong>
                </h1>

                <p className={styles.descriptive}>You have a total of {totalShares} shares divided between {cNum + bNum} addresses. Percentages may not total 100% due to rounding.</p>

                <h2 className={styles.mt3}>collaborators</h2>
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


                {benefactors.length > 0 && (
                    <Fragment>
                        <h2 className={styles.mt3}>benefactors</h2>
                        <table className={styles.reviewTable}>
                            <thead>
                                <tr>
                                    <th>address</th>
                                    <th>shares</th>
                                    <th style={{ textAlign: 'right' }}>%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {benefactors.map((collaborator) => {
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