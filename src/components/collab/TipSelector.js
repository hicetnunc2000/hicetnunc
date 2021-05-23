import styles from './styles.module.scss'
import { tipOptions } from './constants'
import classNames from 'classnames'

export const TipSelector = ({ tip, index, onUpdate }) => {
    return (
        <div className={styles.tipSelect}>
            {tipOptions.map(percentage => {
                const selected = tip ? tip.percentage == percentage : false
                const className = classNames(styles.btn, {
                    [styles.selected]: selected,
                })

                return (
                    <button className={className} key={`btn-${percentage}`} onClick={() => onUpdate(index, percentage)}>
                        {percentage}%
                    </button>
                )
            })}
        </div>
    )
}