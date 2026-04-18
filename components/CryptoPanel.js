import useSWR from 'swr'
import styles from './CryptoPanel.module.css'

var fetcher = function(url) { return fetch(url).then(function(r) { return r.json() }) }

function fmt(n) {
  if (n >= 1000000000) return '$' + (n / 1000000000).toFixed(1) + 'B'
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(0) + 'M'
  return '$' + n
}

export default function CryptoPanel(props) {
  var onSelect = props.onSelect
  var selected = props.selected
  var result = useSWR('/api/prices', fetcher, { refreshInterval: 30000 })
  var data = result.data
  var isLoading = result.isLoading
  var prices = data && data.prices ? data.prices : []

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>Live crypto prices</span>
        <span className={styles.updated}>
          {data && data.updatedAt ? 'Updated ' + new Date(data.updatedAt).toLocaleTimeString() : 'Loading...'}
        </span>
      </div>
      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.skeleton}></div>
          <div className={styles.skeleton}></div>
          <div className={styles.skeleton}></div>
          <div className={styles.skeleton}></div>
          <div className={styles.skeleton}></div>
        </div>
      )}
      {prices.map(function(coin) {
        return (
          <div
            key={coin.sym}
            className={selected === coin.sym ? styles.row + ' ' + styles.selected : styles.row}
            onClick={function() { if (onSelect) onSelect(coin) }}
          >
            <div className={styles.left}>
              <div className={styles.sym}>{coin.sym}</div>
              <div className={styles.name}>{coin.name}</div>
            </div>
            <div className={styles.right}>
              <div className={styles.price}>${coin.price.toFixed(2)}</div>
              <div className={coin.change24h >= 0 ? styles.up : styles.dn}>
                {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
              </div>
              <div className={styles.mcap}>{fmt(coin.marketCap)}</div>
            </div>
          </div>
        )
      })}
      <div className={styles.footer}>
        <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" className={styles.attrib}>
          Data: CoinGecko
        </a>
      </div>
    </div>
  )
}
