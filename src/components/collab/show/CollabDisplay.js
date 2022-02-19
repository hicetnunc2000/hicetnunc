import { Redirect, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { PATH } from '../../../constants'
import { Loading } from '../../loading'
import { renderMediaType } from '../../media-types'
import { Page, Container, Padding } from '../../layout'
import { ResponsiveMasonry } from '../../responsive-masonry'
import { Button, Primary } from '../../button'
import styles from '../../../pages/display/styles.module.scss'
import { walletPreview } from '../../../utils/string'
import { Identicon } from '../../identicons'
import { fetchGraphQL, fetchUserMetadataFile, getCollabCreationsByAddress, getCollabCreationsBySubjkt } from '../../../data/hicdex'
import InfiniteScroll from 'react-infinite-scroll-component'
import collabStyles from '../styles.module.scss'
import classNames from 'classnames'
import { CollaboratorType } from '../constants'
import { ParticipantList } from '../manage/ParticipantList'
import axios from 'axios'
// import QRCode from 'react-qr-code'

export const CollabDisplay = () => {

    // Local state
    const [creations, setCreations] = useState([])
    const [contractInfo, setContractInfo] = useState()
    const [showBeneficiaries] = useState(false)
    const [logo, setLogo] = useState()

    const chunkSize = 20
    const [items, setItems] = useState([])
    const [offset, setOffset] = useState(chunkSize)
    const [loading, setLoading] = useState(true)

    // The route passes the contract address in as parameter "id"
    const { id, name } = useParams()

    // one of the two will be supplied

    // contract id route - ie. /kt/:id
    useEffect(() => {
        if (!id && !name) {
            return
        }

        // The query will depend on what has been supplied
        const queryToUse = name ?
            getCollabCreationsBySubjkt :
            getCollabCreationsByAddress

        const key = name ? 'subjkt' : 'address'
        const value = name || id

        fetchGraphQL(queryToUse, 'GetCollabCreations', {
            [key]: value,
        }).then(({ data, errors }) => {
            if (data) {
                setCreations(data.hic_et_nunc_token)
                setContractInfo(data.hic_et_nunc_splitcontract[0])
            }

            setLoading(false)
        })
    }, [id, name])

    useEffect(() => {
        if (items.length === 0 && creations.length > 0) {
            setItems(creations.slice(0, chunkSize))
        }
    }, [creations]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!loading) {
            setItems(creations.slice(0, offset))
        }
    }, [offset]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!contractInfo) {
            return;
        }

        const fetchMeta = async () => {
            const res = await fetchUserMetadataFile(contractInfo.contract.name)
            const metadataFile = res[0] ? res[0].metadata_file : false;

            if (metadataFile) {
                axios.get(`https://cloudflare-ipfs.com/ipfs/${metadataFile.split('//')[1]}`)
                    .then(({ data }) => {
                        setLogo(data.identicon)
                    })
            }
        }

        fetchMeta().catch(error => console.log("Error retrieving meta file", error));

    }, [contractInfo])

    const headerClass = classNames(
        styles.profile,
        collabStyles.mb4,
        collabStyles.pb2,
        collabStyles.borderBottom,
    )

    const infoPanelClass = classNames(collabStyles.flex, collabStyles.flexBetween)
    const displayName = contractInfo?.contract.name || contractInfo?.contract.address || ''
    const address = contractInfo?.contract.address
    const description = contractInfo?.contract.description
    const descriptionClass = classNames(collabStyles.pt1, collabStyles.muted)

    // Core participants
    const coreParticipants = contractInfo?.shareholder
        .filter(({ holder_type }) => holder_type === CollaboratorType.CORE_PARTICIPANT);

    // Beneficiaries
    const beneficiaries = contractInfo?.shareholder
        .filter(({ holder_type }) => holder_type === CollaboratorType.BENEFICIARY);


    const oldContractAddresses = [
        'KT1CSfR6kx3uwDEXpwuCPnqp3MhpzfPmnLKj',
        'KT1XhXv6jBpkahnvrtdiSi8foWXneWEjcz6F',
    ]

    if (oldContractAddresses.indexOf(id) > -1) {
        return <Redirect to={`${PATH.ISSUER}/${id}`} />
    }

    return (
        <Page title={`Collab: ${displayName}`}>
            {/* <CollabHeader collaborators={collaborators} /> */}

            {loading && (
                <Container>
                    <Padding>
                        <Loading />
                    </Padding>
                </Container>
            )}

            {contractInfo && (
                <Container>
                    <Padding>
                        <div className={headerClass}>
                            <Identicon address={address} logo={logo} />

                            <div className={infoPanelClass} style={{ flex: 1 }}>
                                <div>
                                    <div className={styles.info}>
                                        <h2><strong>{displayName}</strong></h2>
                                    </div>

                                    <div className={styles.info}>
                                        {coreParticipants.length > 0 && (
                                            <ParticipantList title={false} participants={coreParticipants} />)
                                        }

                                        {showBeneficiaries && beneficiaries.length > 0 && (
                                            <ParticipantList title="beneficiaries" participants={beneficiaries} />
                                        )}
                                    </div>

                                    <div className={styles.info}>
                                        {description && <p className={descriptionClass}>{description}</p>}
                                        <Button href={`https://tzkt.io/${address}`}>
                                            <Primary>{walletPreview(address)}</Primary>
                                        </Button>
                                    </div>
                                </div>
                                {/* <div className={collabStyles.qr}>
                                    <QRCode value={address} size={120} />
                                </div> */}
                            </div>

                        </div>
                    </Padding>
                </Container>
            )}


            {/* <div>Tab selection here</div> */}

            {!loading && items.length === 0 && (
                <Container>
                    <p>This collab has no OBJKT creations to display</p>
                </Container>
            )}

            {!loading && (
                <Container xlarge>
                    <InfiniteScroll
                        dataLength={items.length}
                        next={() => setOffset(offset + chunkSize)}
                        hasMore={items.length < creations.length}
                        loader={undefined}
                        endMessage={undefined}
                    >
                        <ResponsiveMasonry>
                            {items.map(({ id, mime, artifact_uri, display_uri }) => {
                                return (
                                    <Button key={id} to={`${PATH.OBJKT}/${id}`}>
                                        <div className={styles.container}>
                                            {renderMediaType({
                                                mimeType: mime,
                                                artifactUri: artifact_uri,
                                                displayUri: display_uri,
                                                displayView: true
                                            })}
                                        </div>
                                    </Button>
                                )
                            })}
                        </ResponsiveMasonry>
                    </InfiniteScroll>
                </Container>
            )}
        </Page>
    )
}
