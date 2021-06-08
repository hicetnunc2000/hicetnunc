import { MIMETYPE } from '../constants'

/**
 * If a OBJKT is missing a relevant property, we filter it out.
 * As example http://localhost:3000/objkt/2862 (has no token_info)
 */
export const SanitiseOBJKT = (objkt) => {
  return objkt.filter((o) => {
    if (Object.keys(o).length === 0) {
      // if empty object ignore
      return true
    } else if (!o.token_info) {
      // if missing token_info flag as corrupt
      console.warn('objkt flagged as corrupt', objkt)
      return false
    }
    return true
  })
}

export const SanitizeDipDup = (objkt) => {
  objkt.token_id = objkt.owner
  objkt.artifactUri = objkt.artifact_uri
  return objkt
}

// check for mymetype using FileReader API (should read any file including binaries)
export const getMimeType = (file) => {
  return new Promise((resolve) => {
    const filereader = new FileReader()
    filereader.onloadend = function (e) {
      if (e.target.readyState === FileReader.DONE) {
        const uint = new Uint8Array(e.target.result)
        let bytes = []
        uint.forEach((byte) => {
          bytes.push(byte.toString(16))
        })
        const hex = bytes.join('').toUpperCase()

        let mimeType

        switch (hex) {
          case '7BA2020':
            mimeType = MIMETYPE.GLTF
            break
          case '676C5446':
            mimeType = MIMETYPE.GLB
            break
          default:
            mimeType = 'Unknown MimeType'
        }

        resolve(mimeType)
      }
    }
    filereader.onerror = () => resolve('Unknown MimeType')
    filereader.readAsArrayBuffer(file.slice(0, 4))
  })
}

/**
 * TODO:
 * Receives an array of objects and filters them out if they're part of the blocklist (o.json)
 */
export const filterObjkts = (items) => {
  return items
}

export const getTotalSales = ({ owners, creators }) => {
  if (!owners) return 0
  return Object.keys(owners).reduce((edition, ownerID) => {
    // not the platform or the creator
    if (
      ownerID !== 'KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9' &&
      !creators.includes(ownerID)
    ) {
      // add the count of market owned editions
      edition = edition + Number(owners[ownerID])
    }
    return edition
  }, 0)
}

/**
 * Human-readable file size
 *
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const GetIPFSLink = (hash) => {
  const CLOUDFLARE = 'https://cloudflare-ipfs.com/ipfs/'
  // const PINATA = 'https://gateway.pinata.cloud/ipfs/'
  const IPFS = 'https://ipfs.io/ipfs/'

  function getInfuraUrl(hash) {
    const cidv1 = new ipfsClient.CID(hash).toV1()
    const subomain = cidv1.toString()
    return `https://${subomain}.ipfs.infura-ipfs.io/`
  }
}
