import React, { Fragment, useContext } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Button, Purchase } from '../../button'
import classNames from 'classnames'
import styles from '../styles.module.scss'
import { CollaboratorType } from '../constants'
import { PATH } from '../../../constants'
import { ParticipantList } from './ParticipantList'
import { Link } from 'react-router-dom'

export const CollabParticipantInfo = ({ collabData, expanded = false }) => {

    const { proxyAddress, setProxyAddress, acc } = useContext(HicetnuncContext)
    const { administrator, contract, shareholder } = collabData

    const isAdmin = acc?.address === administrator;

    // Core participants
    const coreParticipants = shareholder
        .filter(({ holder_type }) => holder_type === CollaboratorType.CORE_PARTICIPANT);

    // beneficiaries
    const beneficiaries = shareholder
        .filter(({ holder_type }) => holder_type === CollaboratorType.BENEFACTOR);

    // Combine various styles
    const listStyle = classNames(styles.flex, styles.flexBetween, styles.alignStart, styles.mb2, {
        [styles.border]: contract.address === proxyAddress,
    })

    const headerStyle = classNames(styles.flex, styles.flexBetween, styles.alignStart, styles.fullWidth)

    // We'll show the name of the contract if set
    const { name, address } = contract

    const displayName = name || address

    // TODO: Sort out better path naming in constants file for /kt vs. /collab
    const path = name ? `/collab/${name}` : `${PATH.COLLAB}/${address}`

    return (
        <li className={listStyle} key={address}>
            <div className={styles.fullWidth}>
                <div className={headerStyle}>

                    {displayName && (
                        <Fragment>
                            <h3>
                                <strong>
                                    <Link to={path}>{displayName}</Link>
                                </strong>
                            </h3>
                        </Fragment>
                    )}

                    {address !== proxyAddress && isAdmin && (
                        <Button onClick={() => setProxyAddress(address, name)}>
                            <Purchase>sign in</Purchase>
                        </Button>
                    )}

                    {address === proxyAddress && isAdmin && (
                        <Button onClick={() => setProxyAddress(null)}>
                            <Purchase>sign out</Purchase>
                        </Button>
                    )}
                </div>

                {!name && isAdmin && (
                    <p>to set the name of this collab, { address !== proxyAddress ? 'sign in and' : ''} visit <Link to='/config' style={{ textDecoration: 'underline' }}>settings</Link></p>
                )}

                {expanded && (
                    <Fragment>
                        <p>
                            <span className={styles.infoLabel}>address:</span>
                            <Link className={styles.link} to={`${PATH.ISSUER}/${address}`}>{address}</Link>
                        </p> {/* <span className={styles.muted}>(admin)</span> */}

                        {coreParticipants.length > 0 && (
                            <ParticipantList title="participants" participants={coreParticipants} />)
                        }

                        {beneficiaries.length > 0 && (
                            <Fragment>
                                <ParticipantList title="beneficiaries" participants={beneficiaries} />
                            </Fragment>
                        )}
                    </Fragment>
                )}
            </div>


        </li>
    )
}