import { useState } from 'react'
import classNames from 'classnames'
import { Secondary } from '../../button'
import styles from '../styles.module.scss'
import { ossProjects } from '../constants'

export const ProjectList = ({ beneficiaries, onSelect }) => {
    const [showList, setShowList] = useState(false)

    const beneficiaryAddresses = beneficiaries.map(b => b.address)
    const validBeneficiaries = beneficiaries.filter(b => b.address && b.shares)
    const unselectedProjects = ossProjects.filter(project => beneficiaryAddresses.indexOf(project.address) === -1)
    const btnClass = classNames(styles.btn, {
        [styles.muted]: showList || unselectedProjects.length < ossProjects.length || validBeneficiaries.length > 0,
        [styles.absolute] : showList,
    })

    const _select = (address, name) => {
        onSelect(address, name)
        setShowList(false)
    }

    return unselectedProjects.length > 0 ? (
        <div className={showList ? styles.projectList : null}>
            <button className={btnClass} onClick={() => setShowList(!showList)}>
                <Secondary>
                    {showList ? 'close' : 'choose from popular projects'}
                </Secondary>
            </button>

            {showList && (
                <ul className={styles.list}>
                    {unselectedProjects.map(project => {
                        const { name, address } = project

                        return (
                            <li key={address}>
                                <button className={styles.btn} onClick={() => _select(address, name)}>{name}</button>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    ) : null
}
