import { useContext } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Button, Purchase } from '../../button'
import styles from '../styles.module.scss'

export const SigningUI = ({ id, hasSigned }) => {

    const context = useContext(HicetnuncContext);

    const sign = () => {
        context
            .sign(id)
            .then(response => console.log(response))
    }

    return hasSigned ? (
        <p>You have signed this work</p>
    ) : (
        <div className={styles.border}>
            <div className={styles.flexBetween}>
                <p style={{ width: '50%' }}>You are a core participant in this work but you haven’t signed it yet</p>
                <Button onClick={() => sign()}>
                    <Purchase>sign work now</Purchase>
                </Button>
            </div>
        </div>

    )
}