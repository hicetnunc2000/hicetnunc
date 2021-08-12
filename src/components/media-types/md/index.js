import Markdown from 'markdown-to-jsx';
import { Container, Padding } from '../../layout';
const axios = require('axios')

export const MD = async ({
    artifactUri
}) => {

    let data = await axios.get(`https://cloudflare-ipfs.com/ipfs/${artifactUri.split('//')}`).then(res => res.data)

    return (
        <div>
            <Container>
                <Padding>
                <Markdown>
                {data}
            </Markdown>
                </Padding>
            </Container>
        </div>
    )
}