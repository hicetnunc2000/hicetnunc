import React, { useState, useContext } from 'react'
import { Textarea } from '../../../components/input'
import { Container, Padding } from '../../../components/layout'
import { Button, Purchase } from '../../../components/button'
import { HicetnuncContext } from '../../../context/HicetnuncContext'


export const Comments = (token_info) => {

    const [comment, setComment] = useState(undefined)
    const { signPayload } = useContext(HicetnuncContext)

    const handleSubmit = async () => {

        // The data to format
        signPayload(comment)

    }

    return (
        <div>
            <Container>
                <Padding>
                    <Textarea
                        type="text"
                        style={{ whiteSpace: 'pre', marginTop: '25px' }}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="comment"
                        label="comment"
                        value={comment}
                    >
                    </Textarea>
                    <Button onClick={handleSubmit}>
                        <Purchase>submit comment</Purchase>
                    </Button>
                </Padding>
            </Container>
        </div>
    )
}