import { useEffect, useState } from "react"
import { Button, Secondary } from "../../components/button"
import styles from './styles.module.scss'
import inputStyles from '../../components/input/styles.module.scss'
import classNames from "classnames"

export const CollaboratorRow = ({ collaborator, remainingPercentage, onUpdate, onAdd, onRemove, minimalView }) => {

    const [address, setAddress] = useState(collaborator.address)
    const [percentage, setPercentage] = useState(collaborator.percentage)

    useEffect(() => {
        setAddress(collaborator.address)
        setPercentage(collaborator.percentage)
    }, [collaborator])

    const _update = (field, value) => {
        const updatedCollaborator = {
            ...collaborator,
            [field]: value,
        }

        onUpdate(updatedCollaborator)
    }
    
    const limit = (input) => {
        const limited = Math.min(remainingPercentage, Number(input))
        return limited;
    }

    // Combine H=N styles with module
    const cellClass = classNames(inputStyles.container, styles.input);

    const _onKeyDown = (event) => {
        if (event.keyCode === 13 && onAdd) {
            onAdd(collaborator)
        }
    }

    return minimalView ? (
        <tr className={styles.row}>
            <td className={styles.addressCell}>{ address }</td>
            <td className={styles.percentageCell}>{ percentage }%</td>
        </tr>
    ) : (
        <tr className={styles.row}>
            <td className={styles.addressCell}>
                <div className={cellClass}>
                    <label>
                        <input
                            type="text"
                            onChange={event => _update('address', event.target.value)}
                            placeholder="address (tz... or KT...)"
                            value={address || ''}
                            autoFocus
                        />
                        <p>address</p>
                    </label>
                </div>
            </td>
            <td className={styles.percentageCell}>
                <div className={cellClass}>
                    <label>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            onChange={event => _update('percentage', event.target.value)}
                            onKeyDown={ _onKeyDown }
                            placeholder={`share (1-${remainingPercentage}%)`}
                            label={'share (%)'}
                            value={ limit(percentage) || '' }
                        />
                        <p>share</p>
                    </label>
                </div>
            </td>

            {onRemove && (
                <td className={styles.actionCell}>
                    <Button onClick={onRemove}>
                        <Secondary>remove</Secondary>
                    </Button>
                </td>
            )}

            {onAdd && (
                <td className={styles.actionCell}>
                    <Button onClick={onAdd} disabled={ !address || !percentage }>
                        <Secondary>add</Secondary>
                    </Button>
                </td>
            )}
        </tr>
    )
}