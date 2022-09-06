const getNetworkQuery = (network?: StoreFixture.Network): string => {
  let query = 'e2e='

  if (network === 'gnosis') {
    query += JSON.stringify({ gnosis: 31337 })
  }
  else {
    query += JSON.stringify({ mainnet: 31337, harbour_mainnet: 31337 })
  }

  return query
}


export default getNetworkQuery
