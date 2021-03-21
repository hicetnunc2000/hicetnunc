const IPFS = require('ipfs-api')
const Buffer = require('buffer').Buffer

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

  console.log('Upload files to IPFS!')
  console.log(files)

  return Promise.resolve()
}
