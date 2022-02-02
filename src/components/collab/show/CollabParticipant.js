import { useEffect, useState } from "react"
import { PATH } from "../../../constants"
import { Link } from 'react-router-dom'
import { GetUserMetadata } from "../../../data/api"
import styles from '../styles.module.scss'

export const CollabParticipant = ({ collabData }) => {

    const { name, address } = collabData
    const [displayName, setDisplayName] = useState(name)

    useEffect(() => {
        if (!displayName) {
            GetUserMetadata(address)
            .then(({ data }) => setDisplayName(data.alias || address))
        }
    }, [collabData.address, displayName]) // eslint-disable-line react-hooks/exhaustive-deps

    return displayName && (
        <Link className={styles.link} to={`${PATH.ISSUER}/${address}`}>{displayName}</Link>
    )
}