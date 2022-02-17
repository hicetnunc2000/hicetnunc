import { useEffect, useState } from "react"
import { PATH } from "../../../constants"
import { Link } from 'react-router-dom'
import { GetUserMetadata } from "../../../data/api"
import styles from '../styles.module.scss'

export const CollabParticipant = ({ collabData }) => {

    const [meta, setMeta] = useState({})

    useEffect(() => {
        GetUserMetadata(collabData.address)
        .then(({ data }) => setMeta(data))
    }, [collabData.address])

    return (
        <Link className={styles.link} to={`${PATH.ISSUER}/${collabData.address}`}>{meta.alias || collabData.address}</Link>
    )
}