import { useState } from 'react'
import { PATH } from '../../../constants'
import { walletPreview } from '../../../utils/string'
import { Primary } from '../../button'
import styles from '../styles.module.scss'
import { ParticipantList } from '../../collab/manage/ParticipantList'
import { CollaboratorType } from '../constants'

export const CollabIssuerInfo = ({ creator }) => {
    const { name, address } = creator
    const [showCollabSummary, setShowCollabSummary] = useState(false)

    const coreParticipants = creator.shares[0].shareholder.filter(h => h.holder_type === CollaboratorType.CORE_PARTICIPANT)

    return (
        <div>
            <a className={styles.issuerBtn} href={`${PATH.COLLAB}/${address}`} onMouseOver={() => setShowCollabSummary(true)} onMouseOut={() => setShowCollabSummary(false)}>
                <Primary>{name !== "" ? name : walletPreview(address)}</Primary>
            </a>
            
            {showCollabSummary && (
                <div className={styles.collabInfo}>
                    <ParticipantList title={false} participants={coreParticipants} />
                </div>
            )}
        </div>
    )
}