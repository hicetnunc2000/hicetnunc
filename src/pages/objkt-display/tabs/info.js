import React from 'react'
import { Container, Padding } from '../../../components/layout'
import { Button, Primary, Purchase } from '../../../components/button'
import { Tags } from '../../../components/tags'
import styles from '../styles.module.scss'
import '../style.css'

export const Info = (token_info) => {
  const { title, description, metadata, token_tags, mime, artifact_uri, royalties, timestamp } = token_info
  console.log(token_info)
  // cloudflare isn't useful in this case. they don't allow video streaming...
  // const CLOUDFLARE = 'https://cloudflare-ipfs.com/ipfs/'
  const IPFS = 'https://ipfs.io/ipfs/'
  const tag = {
    "&:hover": {
      textDecoration : "underline"
    },
    color : "var(--gray-80)"
  }
  return (
    <>
      <Container>
        <Padding>
          <div
            className={styles.objkt__title}
            style={{
              margin: '0 1em'
            }}
          >
            {title}
          </div>
        </Padding>
      </Container>

      <Container>
        <Padding>
          <div style={{ whiteSpace: 'pre-wrap', margin: '0 1em' }}>{description}</div>
        </Padding>
      </Container>

      <Container>
        <Padding>
          <Tags token_tags={token_tags} />
        </Padding>
      </Container>

      <Container>
        <div style={{ margin: '0 1em' }}>
          <hr style={{ color: 'var(--gray-20)', marginBottom: '1em' }}/>
          <div style={{ marginBottom: '0.5em' }}>
            <Padding>mimetype: {mime}</Padding>
          </div>
          <Padding className="tag">
            <div style={{ fontWeight: 'bold' }}>
              <a style={tag} href={metadata.replace('ipfs://', IPFS)}>
                metadata
              </a>&nbsp;//&nbsp;  
              <a style={tag} href={artifact_uri.replace('ipfs://', IPFS)}>
                  view on ipfs
              </a>
            </div>
          </Padding>
        </div>
      </Container>
    </>
  )
}
