export const walletPreview = (wallet) => {
  try {
  return `${wallet.slice(0, 5)}...${wallet.slice(
    wallet.length - 5,
    wallet.length
  )}`
  } catch (e) {
    return ''
  }
} 
