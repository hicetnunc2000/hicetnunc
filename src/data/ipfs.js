const IPFS = require('ipfs-api')
const Buffer = require('buffer').Buffer
const { v4: uuidv4 } = require('uuid')

export const prepareFile = async ({
  name,
  description,
  tags,
  address,
  buffer,
  mimeType,
}) => {
  const ipfs = new IPFS({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  })

  const hash = await ipfs.files.add(buffer)
  const fileCid = `ipfs://${hash[0].hash}`

  const result = await ipfs.files.add(
    Buffer.from(
      JSON.stringify({
        name,
        description,
        tags: tags.replace(/\s/g, '').split(','),
        symbol: 'OBJKT',
        artifactUri: fileCid,
        creators: [address],
        formats: [{ uri: fileCid, mimeType }],
        thumbnailUri: 'ipfs://QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc',
        decimals: 0,
        isBooleanAmount: false,
        shouldPreferSymbol: false,
      })
    )
  )
  return result
}

export const prepareDirectory = async ({
  name,
  description,
  tags,
  address,
  files,
}) => {
  const ipfs = new IPFS({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  })  

  /* WARNING: UNTESTED! */

  console.log('Upload files to IPFS')
  console.log(files)

  // create directory (what path should be used?)
  const dir = `/hicetnunc/${address}/${btoa(uuidv4())}`
  await ipfs.files.mkdir(dir)

  // add all files under directory
  let indexCid
  for (let k in files) {
    const hash = await ipfs.files.add({
      path: `${dir}/${k}`,
      content: files[k],
    })
    if (k === 'index.html') {
      indexCid = `ipfs://${hash[0].hash}`
    }
  }

  console.log('index.html cid', indexCid)

  // create meta file for index.html (or directory?)
  const result = await ipfs.files.add(
    Buffer.from(
      JSON.stringify({
        name,
        description,
        tags: tags.replace(/\s/g, '').split(','),
        symbol: 'OBJKT',
        artifactUri: indexCid,
        creators: [address],
        formats: [{ uri: indexCid, mimeType: 'text/html' }],
        thumbnailUri: 'ipfs://QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc',
        decimals: 0,
        isBooleanAmount: false,
        shouldPreferSymbol: false,
      })
    )
  )

  console.log('result', result)

  return result  
}
