import { walletPreview } from '../../../utils/string'
import styles from '../styles.module.scss'

export const SigningSummary = ({ coreParticipants, signatures }) => {
    return (
        <div>
            <h2 className={styles.mb1}><strong>Signing status</strong></h2>
            <ul className={styles.list}>
                {coreParticipants.map(({ holder }) => {
                    console.log(holder, signatures)
                    const hasSigned = signatures.some(({ holder_id }) => holder.address === holder_id)

                    return (
                        <li>{holder.name || walletPreview(holder.address)}: {hasSigned ? '✓' : '❌'}</li>
                    )
                })}
            </ul>
        </div>
    )
}