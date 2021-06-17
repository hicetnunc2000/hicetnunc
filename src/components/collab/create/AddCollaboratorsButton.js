import { Button, Purchase } from "../../button"
import styles from '../styles.module.scss'

export const AddCollaboratorsButton = ({ type, collaborators, onClick, threshold = 2 }) => {

    // Add up everything else
    // const totalAllocated = Math.min(collaborators.reduce((total, collaborator) => total + (Number(collaborator.percentage) || 0), 0), 100)

    // Extract valid collaborators
    const validCollaborators = collaborators.filter(c => c.shares && c.address)

    return validCollaborators.length > 0 ? (
        <div className={styles.mt3}>
            <Button onClick={onClick} disabled={validCollaborators.length < threshold} className={styles.btnSecondary}>
                {/* <Purchase>add {validCollaborators.length} {type}{validCollaborators.length > 1 ? 's' : ''}</Purchase> */}
                <Purchase>next</Purchase>
            </Button>
        </div>
    ) : null
}