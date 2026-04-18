import useSWR from 'swr'
import styles from './TickerStrip.module.css'

var fetcher = function(url) { return fetch(url).then(function(r) { return r.json() }) }

var ETF_TICKERS = [
  { sym: 'SPY', price: 538.40, change: 0.6  },
  { sym: 'QQQ', price: 441.20, change: 0.9  },
  { sym: 'VOO', price: 495.10, change: 0.5  },
  { sym: 'GLD', price: 234.80, change: 0.3  },
  { sym: 'USO', price: 72.10,  change: -1.1 },
]

export default function TickerStrip() {
  var result = useSWR('/api/prices', fetcher, { refreshInterval: 30000 })
  var data = result.data
  var cryptos = data && data.prices ? data.prices : []
  var all = ETF_TICKERS.concat(cryptos.map(function(c) {
    return { sym: c.sym, price: c.price, change: c.change24h }
  }))
  var doubled = all.concat(all)

  return (
    <div className={styles.strip}>
      <div className={styles.label}>LIVE</div>
      <div className={styles.scroll}>
        {doubled.map(function(t, i) {
          return (
            <span key={i} className={styles.item}>
              <span className={styles.sym}>{t.sym}</span>
              <span className={styles.price}>${t.price.toFixed(2)}</span>
              <span className={t.change >= 0 ? styles.up : styles.dn}>
                {t.change >= 0 ? '+' : ''}{t.change.toFixed(2)}%
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
