import styles from './styles.module.scss'
import { Button, Secondary } from "../../components/button"
import { ossProjects, tipOptions } from './constants'
import classNames from 'classnames'

export const TipJar = ({ tips, setTips }) => {

    const tipsByAddress = tips.map(t => t.address)

    const toggleTip = (address) => {
        const updatedTips = [...tips]

        const index = tipsByAddress.indexOf(address)

        if (index > -1) {
            updatedTips.splice(index, 1)
        } else {
            const projectsByAddress = ossProjects.map(project => project.address)
            const index = projectsByAddress.indexOf(address)
            const project = ossProjects[index]

            updatedTips.push(project)
        }

        setTips(updatedTips)
    }

    const _updateTip = (index, percentage) => {
        const updatedTips = [...tips]

        // toggle if it's the same value
        const shouldRemove = updatedTips[index] ? (updatedTips[index].percentage === percentage) : false

        updatedTips[index] = {
            ...tips[index],
            percentage: shouldRemove ? undefined : percentage,
        }

        setTips(updatedTips)
    }

    return (
        <div className={styles.mt12}>
            <p className={styles.mb}>Do you want to add a tip to an open source project?</p>
            <ul className={styles.list}>

                {ossProjects.map((project, projectIndex) => {
                    const { name, address } = project
                    const isChecked = tipsByAddress.indexOf(address) > -1

                    return (
                        <li key={project.address}>
                            <div className={styles.flexBetween}>
                                <label className={styles.flex}>
                                    <div>
                                        <input className={styles.check} type="checkbox" onChange={() => toggleTip(address)} />
                                        {name}
                                    </div>
                                </label>

                                {isChecked && (
                                    <div className={styles.tipSelect}>
                                        {tipOptions.map((percentage, index) => {

                                            const selected = tips[projectIndex] ? tips[projectIndex].percentage == percentage : false

                                            const className = classNames(styles.btn, {
                                                [styles.selected]: selected,
                                            })

                                            return (
                                                <button className={className} key={`btn-${index}`} onClick={() => _updateTip(projectIndex, percentage)}>
                                                    {percentage}%
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}