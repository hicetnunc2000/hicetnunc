import { useEffect, useState } from "react"
import { Button, Secondary } from "../../button"
import { TipSelector } from './TipSelector'
import styles from '../styles.module.scss'
import inputStyles from '../../../components/input/styles.module.scss'
import classNames from "classnames"
import { CloseIcon } from ".."
import { GetUserMetadata } from "../../../data/api"

export const BenefactorRow = ({ benefactor, onUpdate, onAdd, onRemove, onPasteMulti, onSelectPercentage, minimalView }) => {

    const [meta, setMeta] = useState()
    const [address, setAddress] = useState(benefactor.address)
    const [shares, setShares] = useState(benefactor.shares)

    useEffect(() => {
        const { address, shares } = benefactor
        
        if (!meta && address) {
            GetUserMetadata(address)
            .then(({ data }) => setMeta(data))
        }

        if (meta && !address) {
            setMeta()
        }

        setAddress(address)
        setShares(shares)
    }, [benefactor])

    const _update = (field, value) => {

        // If we have multiple lines, don't handle here
        const lines = value.replace(/\r/g, '').split(/\n/);

        if (lines.length > 1) {
            // send to parent to do the multi-split function
            onPasteMulti(value);
        } else {
            const updatedBenefactor = {
                ...benefactor,
                [field]: isNaN(value) ? value : Number(value),
            }

            onUpdate(updatedBenefactor)
        }
    }

    // Combine H=N styles with module
    const cellClass = classNames(inputStyles.container, styles.input);

    const _onKeyDown = (event) => {
        if (event.keyCode === 13 && onAdd) {
            onAdd(benefactor)
        }
    }

    // If the user has chosen from the popular projects list
    // the benefactor data will contain the name of the project
    // otherwise just show "address" and the KT or tz hint if not populated

    const benefactorName = meta ? meta.alias : null
    const placeholderText = benefactorName || `address ${!address ? `(tz... or KT...)` : ''}`

    /**
     * In some situations we may want to show less UI information
     * eg. when adding benefactors, you don't need the whole
     * benefactor UI open, so just show addresses and shares
     */
    return minimalView ? (
        <tr className={styles.row}>
            <td className={styles.addressCell}>{address}</td>
            <td className={styles.percentageCell}>{benefactor.share}%</td>
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
                            autoFocus={!address || address === ''}
                        />
                        <p>{placeholderText}</p>
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
                            autoFocus={Boolean(address)}
                            onChange={event => _update('shares', event.target.value)}
                            onKeyDown={_onKeyDown}
                            placeholder="shares"
                            label="shares"
                            value={shares || ''}
                        />
                        <p>shares</p>
                    </label>
                    {!shares && <TipSelector onSelect={onSelectPercentage} />}
                </div>
            </td>

            {/* If there is an onRemove or onAdd function passed in, show a button to call the function */}

            <td className={styles.actionCell}>
                <Button onClick={onRemove}>
                    <Secondary>
                        <CloseIcon />
                    </Secondary>
                </Button>
            </td>

        </tr>
    )
}