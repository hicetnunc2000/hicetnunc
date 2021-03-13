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
          case '676C5446':
            mimeType = MIMETYPE.GLB
            break
          case '7BA2020':
            mimeType = MIMETYPE.GLTF
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
