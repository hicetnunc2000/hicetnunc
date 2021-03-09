export const walletPreview = (wallet) => {
  return `${wallet.slice(0, 5)}...${wallet.slice(
    wallet.length - 5,
    wallet.length
  )}`
}
