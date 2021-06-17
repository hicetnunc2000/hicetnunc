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


// export const TipSelector = ({ tip, onUpdate }) => {
//     return (
//         <div className={styles.tipSelect}>
//             {tipOptions.map(percentage => {
//                 const selected = tip ? tip.percentage === percentage : false
//                 const className = classNames(styles.btn, {
//                     [styles.selected]: selected,
//                 })

//                 return (
//                     <button className={className} key={`btn-${percentage}`} onClick={() => onUpdate(percentage)}>
//                         {percentage}%
//                     </button>
//                 )
//             })}
//         </div>
//     )
// }