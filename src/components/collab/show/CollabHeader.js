import { Fragment } from 'react'
import { Container, Padding } from '../../layout'
import { CollabParticipant } from './CollabParticipant'

export const CollabHeader = ({ collaborators }) => {
    return (
        <Container>
            <Padding>
                <h1>
                    {collaborators.length > 0 && (
                        <Fragment>
                            <span>A collaboration between </span>

                            {collaborators.map((collabData, index) =>
                                [
                                    (index > 0 && index < collaborators.length - 1) && ", ",
                                    (index === collaborators.length - 1) && ' and ',
                                    <CollabParticipant
                                        key={collabData.address}
                                        collabData={collabData}
                                    />
                                ]
                            )}

                        </Fragment>
                    )}
                </h1>
            </Padding>
        </Container>
    )
}