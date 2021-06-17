import { useState } from 'react'
import { Secondary } from '../../button'
import { Container } from '../../media-types/container'
import styles from '../styles.module.scss'
import { ossProjects } from '../constants'
import classNames from 'classnames'
import { Padding } from '../../layout'

export const ProjectList = ({ benefactors, onSelect }) => {
    const [showList, setShowList] = useState(false)

    const benefactorAddresses = benefactors.map(b => b.address)
    const validBenefactors = benefactors.filter(b => b.address && b.shares)
    const unselectedProjects = ossProjects.filter(project => benefactorAddresses.indexOf(project.address) === -1)
    const btnClass = classNames(styles.btn, {
        [styles.muted]: showList || unselectedProjects.length < ossProjects.length || validBenefactors.length > 0,
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