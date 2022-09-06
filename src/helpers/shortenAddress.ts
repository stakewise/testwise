const shortenAddress = (address: string | null | undefined, size: number) => (
  address ? `${address.substr(0, 6)}...${address.substr(size)}` : ''
)


export default shortenAddress
