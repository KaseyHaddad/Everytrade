export default async function handler(req, res) {
  try {
    const ids = 'bitcoin,ethereum,solana,ripple,cardano'
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=' + ids + '&vs_currencies=usd&include_24hr_change=true&include_market_cap=true'
    const response = await fetch(url, { headers: { 'Accept': 'application/json' } })
    if (!response.ok) throw new Error('CoinGecko error')
    const data = await response.json()
    const coins = [
      { id: 'bitcoin',  sym: 'BTC', name: 'Bitcoin'  },
      { id: 'ethereum', sym: 'ETH', name: 'Ethereum' },
      { id: 'solana',   sym: 'SOL', name: 'Solana'   },
      { id: 'ripple',   sym: 'XRP', name: 'XRP'      },
      { id: 'cardano',  sym: 'ADA', name: 'Cardano'  },
    ]
    const prices = coins.map(function(c) {
      return {
        sym: c.sym,
        name: c.name,
        price: data[c.id] ? data[c.id].usd : 0,
        change24h: data[c.id] ? data[c.id].usd_24h_change : 0,
        marketCap: data[c.id] ? data[c.id].usd_market_cap : 0,
      }
    })
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate')
    res.status(200).json({ prices: prices, updatedAt: new Date().toISOString() })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prices' })
  }
}
