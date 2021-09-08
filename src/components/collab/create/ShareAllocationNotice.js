import styles from '../styles.module.scss'

export const ShareAllocationNotice = ({ collaborators, muted }) => {

    // Add everything up and see if the total is less than 100. If so, show this notice
    const totalAllocated = Math.min(collaborators.reduce((total, c) => total + (Number(c.percentage) || 0), 0), 100)
    const validCollaborators = collaborators.filter(c => c.percentage && c.address)
    const showPercentageMismatchNotice = (totalAllocated > 0 && collaborators.length > 1 && validCollaborators.length > 0)

    return showPercentageMismatchNotice ? (
        <div className={muted ? styles.muted : null}>
            <p>{totalAllocated}% allocated</p>
            {totalAllocated < 100 && (
                <p><em>Please make sure your shares add up to 100%</em></p>
            )}
        </div>
    ) : null
}