import { useContext, useState } from 'react';
import { Container, Padding } from "../../layout"
import { TxRow } from './TxRow';
import styles from '../../collab/styles.module.scss';
import { HicetnuncContext } from '../../../context/HicetnuncContext';
import classNames from 'classnames';
import { Button, Purchase } from '../../button';

export const Transfer = ({ id, creator, token_holders }) => {
    //const [title, setTitle] = useState()
    const { transfer, setProgress, acc, proxyAddress } = useContext(HicetnuncContext);

    // See if the creator of this token is also the admin
    const proxyAdminAddress = creator.is_split ? creator.shares[0].administrator : null

    // How many editions are held by the contract?
    const editionsHeld = token_holders.find(
        e => (e.holder_id === proxyAddress && acc?.address === proxyAdminAddress)
    )

    console.log(token_holders);

    // The basic schema for a transaction
    const txSchema = {
        to_: undefined,
        amount: undefined,
        token_id: id,
    }

    const [txs, setTxs] = useState([{
        ...txSchema,
    }])

    const _update = (index, { to_, amount }) => {
        const updatedTxs = [...txs]

        updatedTxs[index] = ({
            ...txSchema,
            to_,
            amount: Number(amount),
        })

        setTxs(updatedTxs);
    }

    const _addTransfer = () => {
        setTxs([
            ...txs,
            { ...txSchema },
        ])
    }

    const _deleteTransfer = ({ address }) => {
        const updatedTxs = [...txs];
        const toDeleteIndex = updatedTxs.findIndex(t => t.address === address);
        updatedTxs.splice(toDeleteIndex, 1);
        setTxs(updatedTxs);
    }

    /*
    const handleUpload = async (event) => {
        const { files } = event.target
        const file = files[0]

        setTitle(file.name)
        const mimeType = file.type !== '' ? file.type : await getMimeType(file)
        const buffer = Buffer.from(await file.arrayBuffer())

        // set reader for preview
        const reader = new FileReader()
        reader.addEventListener('load', event => {
            console.log(file, event.target.result, buffer, mimeType);
            // onChange({ title, mimeType, file, buffer, reader: e.target.result })
        })

        reader.readAsDataURL(file)
    }
    */

    const onClick = () => {
        setProgress(true);
        const validTxs = txs.filter(tx => tx.to_ && tx.amount)
        transfer(validTxs);
    }

    const tableStyle = classNames(styles.table, styles.mt3, styles.mb3)

    const validTxs = txs.filter(t => t.to_ && t.amount)

    const tokenCount = editionsHeld ? editionsHeld.quantity : 0;

    return (
        <Container>
            {tokenCount === 0 ? (
                <Padding>
                    <p>You do not have any editions available to transfer.</p>
                </Padding>
            ) : (
                <Padding>
                    <p>Add addresses below along with how many tokens you wish to send to each.</p>
                    <p>You currently have {tokenCount} editions available.</p>

                    <table className={tableStyle}>
                        <thead>
                            <tr>
                                <td>OBJKT quantity</td>
                                <td colSpan={2}>to address (tz...)</td>
                            </tr>
                        </thead>
                        <tbody>
                            {txs.map((tx, index) => (
                                <TxRow
                                    key={`transfer-${index}`}
                                    tx={tx}
                                    onUpdate={tx => _update(index, tx)}
                                    onAdd={_addTransfer}
                                    onRemove={index < txs.length - 1 ? _deleteTransfer : null}
                                />
                            ))}
                        </tbody>
                    </table>

                    {/* <div className={styles.upload_container}>
                    <label>
                        <span>Upload CSV</span>
                        <input type="file" name="file" onChange={handleUpload} />
                    </label>
                </div> */}

                    <Button onClick={onClick} disabled={validTxs.length === 0} className={styles.btnSecondary}>
                        <Purchase>send</Purchase>
                    </Button>
                </Padding>
            )}

        </Container>
    )
}