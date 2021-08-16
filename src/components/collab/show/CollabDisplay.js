import axios from 'axios'
import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { PATH } from '../../../constants'
import { Loading } from '../../loading'
import { renderMediaType } from '../../media-types'
import { CollabHeader } from './CollabHeader'
import { Page, Container, Padding } from '../../layout'
import { ResponsiveMasonry } from '../../responsive-masonry'
import { Button } from '../../button'
import styles from '../../../pages/display/styles.module.scss'

export const CollabDisplay = () => {

    // The collaborator addresses in the contract
    const [collaborators, setCollaborators] = useState([])
    const [creations, setCreations] = useState([])
    const [loading, setLoading] = useState(true)

    // Core storage data from the KT smart contract
    const [collabData, setCollabData] = useState(null)

    // The route passes the contract address in as parameter "id"
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            // Get the collaborators in this contract
            axios.get(`https://api.tzkt.io/v1/contracts/${id}/storage`)
                .then(({ data }) => setCollabData(data))
        }
    }, [id])

    useEffect(() => {
        if (collabData) {

            console.log(collabData)

            const participants = [];

            for (let address in collabData.shares) {
                participants.push({
                    address,
                    share: Number(collabData.shares[address]),
                    role: undefined, // placeholder - we need this
                })
            }

            // Set both now
            setCollaborators(participants)
        }
    }, [collabData])

    const sortByTokenId = (a, b) => b.token_id - a.token_id

    return (
        <Page title="Collaboration">
            <CollabHeader collaborators={collaborators} />

            {loading && (
                <Container>
                    <Padding>
                        <Loading />
                    </Padding>
                </Container>
            )}

            {creations.length > 0 && (
                <Container xlarge>
                    <ResponsiveMasonry>
                        {creations.map(nft => {
                            const { mimeType, uri } = nft.token_info.formats[0]

                            return (
                                <Button key={nft.token_id} to={`${PATH.OBJKT}/${nft.token_id}`}>
                                    <div className={styles.container}>
                                        {renderMediaType({
                                            mimeType,
                                            uri: uri.split('//')[1],
                                            metadata: nft,
                                        })}
                                    </div>
                                </Button>
                            )
                        })}
                    </ResponsiveMasonry>
                </Container>
            )}
        </Page>
    )
}