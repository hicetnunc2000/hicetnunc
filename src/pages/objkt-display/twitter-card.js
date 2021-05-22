/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Helmet } from 'react-helmet'


export const TwitterCard = (args) => {
  console.group("------ NFT DEETS ------")
  const nft = args.nft;
  const { token_info } = nft;
  const { name, description } = token_info;
  // TODO: Get a real image URL
  const imageUrl = "https://paessel.com/images/mesmallopt.jpg"
  console.dir(args)
  console.dir(nft)
  console.dir(token_info)
  console.dir(name)
  console.groupEnd()
  return(
    <Helmet>
      <title>{`${name} TESTING HELMET`}</title>
      <meta property="og:title" content="BLARG BLARG BLARG" />
      <meta property="og:description" content={description} />
<meta property="og:image" content={imageUrl}/>

    </Helmet>
  )
}
