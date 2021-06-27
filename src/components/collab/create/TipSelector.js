import styles from '../styles.module.scss'
import { tipOptions } from '../constants'

export const TipSelector = ({ onSelect }) => {
    return (
        <div className={styles.tipSelect}>
            {tipOptions.map(percentage => {
                return (
                    <button key={`btn-${percentage}`} onClick={() => onSelect(percentage)}>
                        {percentage}{!isNaN(percentage) ? '%' : ''}
                    </button>
                )
            })}
        </div>
    )
}