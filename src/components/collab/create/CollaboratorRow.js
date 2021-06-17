import { useEffect, useState } from "react"
import { Button, Secondary } from "../../../components/button"
import { } from '../../media-types/'
import styles from '../styles.module.scss'
import inputStyles from '../../../components/input/styles.module.scss'
import { CloseIcon } from '../'
import classNames from "classnames"

export const CollaboratorRow = ({ collaborator, onUpdate, onAdd, onRemove, onPasteMulti, minimalView, onEdit }) => {

    const [address, setAddress] = useState(collaborator.address)
    const [shares, setShares] = useState(collaborator.shares)

    useEffect(() => {
        setAddress(collaborator.address)
        setShares(collaborator.shares)
    }, [collaborator])

    const _update = (field, value) => {

        // If we have multiple lines, don't handle here
        const lines = value.replace(/\r/g, '').split(/\n/);

        if (lines.length > 1) {
            // send to parent to do the multi-split function
            onPasteMulti(value);
        } else {
            const updatedCollaborator = {
                ...collaborator,
                [field]: isNaN(value) ? value : Number(value),
            }

            onUpdate(updatedCollaborator)
        }
    }

    // Combine H=N styles with module
    const cellClass = classNames(inputStyles.container, styles.input);

    const _onKeyDown = (event) => {
        if (event.keyCode === 13 && onAdd) {
            onAdd(collaborator)
        }
    }

    /**
     * In some situations we may want to show less UI information
     * eg. when adding benefactors, you don't need the whole
     * collaborator UI open, so just show addresses and shares
     */
    return minimalView ? (
        <tr className={styles.row} onClick={onEdit}>
            <td className={styles.cellWithPadding}>{address}</td>
            <td className={styles.cellWithPadding}>{collaborator.shares} shares</td>
        </tr>
    ) : (
        <tr className={styles.row}>
            <td className={styles.addressCell}>
                <div className={cellClass}>
                    <label>
                        <textarea
                            rows={1}
                            className={styles.textInput}
                            onChange={event => _update('address', event.target.value)}
                            placeholder="address (tz... or KT...)"
                            value={address || ''}
                            autoFocus={!address}
                        />
                        <p>address {!address ? `(tz... or KT...)` : ''}</p>
                    </label>
                </div>
            </td>

            <td className={styles.percentageCell}>
                <div className={cellClass}>
                    <label>
                        <input
                            type="number"
                            onChange={event => _update('shares', event.target.value)}
                            onKeyDown={_onKeyDown}
                            placeholder="shares"
                            label="shares"
                            value={shares || ''}
                            autoFocus={address && !shares}
                        />
                        <p>shares</p>
                    </label>
                </div>
            </td>

            {/* If there is an onRemove or onAdd function passed in, show a button to call the function */}

            {onRemove && (
                <td className={styles.actionCell}>
                    <Button onClick={onRemove}>
                        <Secondary>
                            <CloseIcon />
                        </Secondary>
                    </Button>
                </td>
            )}
        </tr>
    )
}