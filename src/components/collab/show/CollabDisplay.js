import { Redirect, useParams } from 'react-router'
import { useEffect, useState, useContext } from 'react'
import { PATH } from '../../../constants'
import { Loading } from '../../loading'
import { renderMediaType } from '../../media-types'
import { Page, Container, Padding } from '../../layout'
import { ResponsiveMasonry } from '../../responsive-masonry'
import { Button, Primary } from '../../button'
import styles from '../../../pages/display/styles.module.scss'
import { walletPreview } from '../../../utils/string'
import { Identicon } from '../../identicons'
import { fetchGraphQL, getCollabCreations } from '../../../data/hicdex'
import InfiniteScroll from 'react-infinite-scroll-component'
import collabStyles from '../styles.module.scss'
import classNames from 'classnames'
import { CollaboratorType, TabIndex } from '../constants'
import { ParticipantList } from '../manage/ParticipantList'
// import QRCode from 'react-qr-code'

export const CollabDisplay = () => {

    console.log("CollabDisplay loaded")

    // Local state
    const [tabIndex, setTabIndex] = useState(TabIndex.CREATIONS)
    const [creations, setCreations] = useState([])
    const [contractInfo, setContractInfo] = useState()
    const [showBeneficiaries, setShowBeneficiaries] = useState(false)
    // const [collaborators, setCollaborators] = useState([])
    // const [displayName, setDisplayName] = useState()
    // const [address, setAddress] = useState()

    const chunkSize = 20
    const [items, setItems] = useState([])
    const [offset, setOffset] = useState(chunkSize)
    const [loading, setLoading] = useState(true)

    // The route passes the contract address in as parameter "id"
    const { id, tab } = useParams()

    useEffect(() => {
        fetchGraphQL(getCollabCreations, 'GetCollabCreations', {
            address: id,
        }).then(({ data, errors }) => {
            // console.log("CollabDisplay", data)
            if (data) {
                setCreations(data.hic_et_nunc_token)
                setContractInfo(data.hic_et_nunc_splitcontract[0])
            }

            setLoading(false)
        })
    }, [id])

    useEffect(() => {
        if (items.length === 0 && creations.length > 0) {
            setItems(creations.slice(0, chunkSize))
        }
    }, [creations])

    useEffect(() => {
        if (!loading) {
            setItems(creations.slice(0, offset))
        }
    }, [offset])

    const headerClass = classNames(
        styles.profile,
        collabStyles.mb4,
        collabStyles.pb2,
        collabStyles.borderBottom,
    )

    const infoPanelClass = classNames(collabStyles.flex, collabStyles.flexBetween)

    const displayName = contractInfo ? (contractInfo.contract.name || contractInfo.contract.address) : ''
    const address = contractInfo?.contract.address
    const description = contractInfo?.contract.description
    const descriptionClass = classNames(collabStyles.pt1, collabStyles.muted)
    const logo = null // TODO: where does this come from?

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