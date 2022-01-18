import { useState } from "react"
import { Button, Purchase } from "../../button"
import { CollabParticipantInfo } from "./CollabParticipantInfo"
import styles from '../../../components/collab/styles.module.scss'
import classNames from 'classnames'

export const CollabList = ({ description, collabs }) => {
    const [showDetail, setShowDetail] = useState(false)

    const headerStyle = classNames(styles.flex, styles.flexBetween)
    const componentStyle = classNames(styles.borderBottom, styles.mb3)

    return (
        <div className={componentStyle}>
            <div className={headerStyle}>
                {description && (
                    <p className={styles.mb1}>{ description }</p>

                )}

                <div className={styles.mb2}>
                    <Button onClick={() => setShowDetail(!showDetail)}>
                        <Purchase>{showDetail ? 'less detail' : 'more detail'}</Purchase>
                    </Button>
                </div>
            </div>

            <ul>
                {collabs.map(collab => (
                    <CollabParticipantInfo
                        key={collab.contract.address}
                        collabData={collab}
                        expanded={showDetail}
                    />
                ))}
            </ul>

            {/* {!addAddressManually && (
                            <Button onClick={() => setAddAddressManually(true)}>
                                <Secondary>
                                    add address manually
                                </Secondary>
                            </Button>
                        )}

                        {addAddressManually && (
                            <div className={headerStyle}>
                                <Input
                                    type="text"
                                    label="KT address"
                                    onChange={event => setManualAddress(event.target.value)}
                                    placeholder="KT..."
                                    value={manualAddress}
                                    autoFocus={true}
                                />
                                <Button onClick={() => setProxyAddress(manualAddress)}>
                                    <Purchase>
                                        sign in
                                    </Purchase>
                                </Button>
                            </div>
                        )} */}
        </div>
    )
}