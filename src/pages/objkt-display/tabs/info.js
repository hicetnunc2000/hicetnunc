import React from 'react'
import { Container, Padding } from '../../../components/layout'
import { Tags } from '../../../components/tags'
import '../style.css'

export const Info = (token_info) => {
  const { title, description, metadata, token_tags, mime, artifact_uri } = token_info
  console.log(token_info)
  // cloudflare isn't useful in this case. they don't allow video streaming...
  // const CLOUDFLARE = 'https://cloudflare-ipfs.com/ipfs/'
  const IPFS = 'https://ipfs.io/ipfs/'
  const tag = {
    "&:hover": {
      textDecoration : "underline"
    },
    color : "var(--text-color)"
  }
  return (
    <>
      <Container>
        <Padding>
          <div
            style={{
              fontFamily: 'monospace',
              fontWeight: 'bold',
              fontSize: '20px',
            }}
          >
            {title}
          </div>
        </Padding>
      </Container>

      <Container>
        <Padding>
          <div style={{ whiteSpace: 'pre-wrap' }}>{description}</div>
        </Padding>
      </Container>

      <Container>
        <Padding>
          <Tags token_tags={token_tags} />
        </Padding>
      </Container>

      <Container>
        {/*         <Padding>{royalties / 10}% royalties</Padding>
        <Padding>timestamp: {timestamp}</Padding> */}
        <Padding>mimetype: {mime}</Padding>
        <Padding className="tag">
          <div>
          <br/>
            <a style={tag} href={metadata.replace('ipfs://', IPFS)}>
              metadata
            </a>&nbsp;//&nbsp;  
            <a style={tag} href={artifact_uri.replace('ipfs://', IPFS)}>
                view on ipfs
            </a>
          </div>
        </Padding>
      </Container>
    </>
  )
}
