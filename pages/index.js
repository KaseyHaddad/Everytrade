import { useState } from 'react'
import Head from 'next/head'
import TickerStrip from '../components/TickerStrip'
import NewsFeed from '../components/NewsFeed'
import CryptoPanel from '../components/CryptoPanel'
import ShipTracker from '../components/ShipTracker'
import styles from '../styles/Terminal.module.css'

var PANELS = [
  { id: 'markets',   label: 'Markets'              },
  { id: 'etfs',      label: 'ETFs'                 },
  { id: 'crypto',    label: 'Crypto'               },
  { id: 'tracking',  label: 'Ship tracking'        },
  { id: 'portfolio', label: 'Portfolio'            },
]

var ETF_DATA = [
  { sym: 'SPY',  name: 'S&P 500 ETF',      price: 538.40, change: 0.6,  category: 'Equity',    exp: '0.09%' },
  { sym: 'QQQ',  name: 'Nasdaq-100 ETF',   price: 441.20, change: 0.9,  category: 'Tech',      exp: '0.20%' },
  { sym: 'VOO',  name: 'Vanguard S&P 500', price: 495.10, change: 0.5,  category: 'Equity',    exp: '0.03%' },
  { sym: 'GLD',  name: 'Gold ETF',         price: 234.80, change: 0.3,  category: 'Commodity', exp: '0.40%' },
  { sym: 'USO',  name: 'Oil ETF',          price: 72.10,  change: -1.1, category: 'Commodity', exp: '0.81%' },
  { sym: 'ARKK', name: 'ARK Innovation',   price: 54.30,  change: -0.4, category: 'Disruptive',exp: '0.75%' },
  { sym: 'VTI',  name: 'Total Market ETF', price: 242.60, change: 0.4,  category: 'Equity',    exp: '0.03%' },
  { sym: 'XLE',  name: 'Energy Select',    price: 88.20,  change: -0.9, category: 'Energy',    exp: '0.09%' },
]

var PORTFOLIO = [
  { sym: 'BTC', name: 'Bitcoin',    value: 6200, change: 2.4  },
  { sym: 'SPY', name: 'S&P 500',    value: 3100, change: 0.6  },
  { sym: 'ETH', name: 'Ethereum',   value: 1800, change: -0.8 },
  { sym: 'QQQ', name: 'Nasdaq-100', value: 1100, change: 0.9  },
  { sym: 'SOL', name: 'Solana',     value: 780,  change: -1.2 },
  { sym: 'GLD', name: 'Gold ETF',   value: 500,  change: 0.3  },
]

var WATCHLIST = [
  { sym: 'BTC', name: 'Bitcoin',     price: 84210,  change: 2.4  },
  { sym: 'ETH', name: 'Ethereum',    price: 1590,   change: -0.8 },
  { sym: 'SPY', name: 'S&P 500 ETF', price: 538.40, change: 0.6  },
  { sym: 'OIL', name: 'Crude oil',   price: 82.40,  change: -1.1 },
  { sym: 'SOL', name: 'Solana',      price: 131.50, change: -1.2 },
  { sym: 'GLD', name: 'Gold ETF',    price: 234.80, change: 0.3  },
]

var ALERTS = [
  { label: 'BTC > $90,000', active: true  },
  { label: 'OIL > $85',     active: true  },
  { label: 'ETH < $1,500',  active: false },
]

export default function Terminal() {
  var panelState = useState('markets')
  var panel = panelState[0]
  var setPanel = panelState[1]

  var coinState = useState(null)
  var selectedCoin = coinState[0]
  var setSelectedCoin = coinState[1]

  var modeState = useState('buy')
  var tradeMode = modeState[0]
  var setTradeMode = modeState[1]

  var assetState = useState('BTC')
  var tradeAsset = assetState[0]
  var setTradeAsset = assetState[1]

  var amtState = useState('500')
  var tradeAmt = amtState[0]
  var setTradeAmt = amtState[1]

  var orderState = useState('market')
  var tradeOrder = orderState[0]
  var setTradeOrder = orderState[1]

  var placedState = useState(false)
  var orderPlaced = placedState[0]
  var setOrderPlaced = placedState[1]

  var totalPortfolio = PORTFOLIO.reduce(function(s, p) { return s + p.value }, 0)
  var todayGain = PORTFOLIO.reduce(function(s, p) { return s + p.value * p.change / 100 }, 0)

  function handleTrade() {
    setOrderPlaced(true)
    setTimeout(function() { setOrderPlaced(false) }, 2500)
  }

  return (
    <div>
      <Head>
        <title>Everytrade</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.terminal}>

        <div className={styles.topbar}>
          <div className={styles.logo}>
            <span className={styles.logoAccent}>every</span>trade
          </div>
          <input className={styles.search} placeholder="Search ETFs, crypto, stocks..." />
          <nav className={styles.nav}>
            {PANELS.map(function(p) {
              return (
                <button
                  key={p.id}
                  className={panel === p.id ? styles.navBtn + ' ' + styles.navActive : styles.navBtn}
                  onClick={function() { setPanel(p.id) }}
                >
                  {p.label}
                </button>
              )
            })}
          </nav>
          <div className={styles.topRight}>
            <div className={styles.portSummary}>
              <span className={styles.portVal}>${totalPortfolio.toLocaleString()}</span>
              <span className={todayGain >= 0 ? styles.up : styles.dn}>
                {todayGain >= 0 ? '+' : ''}${Math.abs(todayGain).toFixed(0)} today
              </span>
            </div>
          </div>
        </div>

        <TickerStrip />

        <div className={styles.body}>
          <div className={styles.left}>

            {panel === 'markets' && (
              <div className={styles.panelWrap}>
                <div className={styles.panelHeader}>
                  <span className={styles.panelTitle}>Market news</span>
                  <span className={styles.disclaimer}>For information only — not financial advice</span>
                </div>
                <NewsFeed />
              </div>
            )}

            {panel === 'etfs' && (
              <div className={styles.panelWrap}>
                <div className={styles.panelHeader}>
                  <span className={styles.panelTitle}>ETF overview</span>
                  <span className={styles.disclaimer}>15-min delayed — not financial advice</span>
                </div>
                <div className={styles.etfGrid}>
                  {ETF_DATA.map(function(e) {
                    return (
                      <div key={e.sym} className={styles.etfCard}>
                        <div className={styles.etfTop}>
                          <div>
                            <div className={styles.etfSym}>{e.sym}</div>
                            <div className={styles.etfName}>{e.name}</div>
                          </div>
                          <span className={styles.etfCat}>{e.category}</span>
                        </div>
                        <div className={styles.etfPrice}>${e.price.toFixed(2)}</div>
                        <div className={e.change >= 0 ? styles.up : styles.dn}>
                          {e.change >= 0 ? '+' : ''}{e.change}% today
                        </div>
                        <div className={styles.etfExp}>Expense ratio: {e.exp}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {panel === 'crypto' && (
              <div className={styles.panelWrap}>
                <div className={styles.panelHeader}>
                  <span className={styles.panelTitle}>Live crypto prices</span>
                  <span className={styles.disclaimer}>Updates every 30s — CoinGecko</span>
                </div>
                <CryptoPanel onSelect={setSelectedCoin} selected={selectedCoin ? selectedCoin.sym : null} />
              </div>
            )}

            {panel === 'tracking' && (
              <div className={styles.panelWrap}>
                <div className={styles.panelHeader}>
                  <span className={styles.panelTitle}>Ship and commodity tracking</span>
                  <span className={styles.disclaimer}>Vessel alerts — MarineTraffic coming soon</span>
                </div>
                <ShipTracker />
              </div>
            )}

            {panel === 'portfolio' && (
              <div className={styles.panelWrap}>
                <div className={styles.panelHeader}>
                  <span className={styles.panelTitle}>My portfolio</span>
                  <span className={styles.disclaimer}>Manual tracking — not connected to broker</span>
                </div>
                <div className={styles.portGrid}>
                  <div className={styles.portMetrics}>
                    <div className={styles.metric}>
                      <div className={styles.metricLabel}>Total value</div>
                      <div className={styles.metricVal}>${totalPortfolio.toLocaleString()}</div>
                    </div>
                    <div className={styles.metric}>
                      <div className={styles.metricLabel}>Today</div>
                      <div className={styles.metricVal + ' ' + (todayGain >= 0 ? styles.up : styles.dn)}>
                        {todayGain >= 0 ? '+' : ''}${Math.abs(todayGain).toFixed(0)}
                      </div>
                    </div>
                    <div className={styles.metric}>
                      <div className={styles.metricLabel}>Return</div>
                      <div className={styles.metricVal + ' ' + styles.up}>+28.4%</div>
                    </div>
                    <div className={styles.metric}>
                      <div className={styles.metricLabel}>Positions</div>
                      <div className={styles.metricVal}>{PORTFOLIO.length}</div>
                    </div>
                  </div>
                  <div className={styles.portTable}>
                    <div className={styles.portTableHeader}>
                      <span>Asset</span><span>Value</span><span>Today</span>
                    </div>
                    {PORTFOLIO.map(function(p) {
                      return (
                        <div key={p.sym} className={styles.portRow}>
                          <div>
                            <div className={styles.portSym}>{p.sym}</div>
                            <div className={styles.portName}>{p.name}</div>
                          </div>
                          <div className={styles.portValue}>${p.value.toLocaleString()}</div>
                          <div className={p.change >= 0 ? styles.up : styles.dn}>
                            {p.change >= 0 ? '+' : ''}{p.change}%
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className={styles.right}>
            <div className={styles.sideSection}>
              <div className={styles.sideTitle}>Watchlist</div>
              {WATCHLIST.map(function(w) {
                return (
                  <div key={w.sym} className={styles.watchRow}>
                    <div>
                      <div className={styles.watchSym}>{w.sym}</div>
                      <div className={styles.watchName}>{w.name}</div>
                    </div>
                    <div className={styles.watchRight}>
                      <div className={styles.watchPrice}>${w.price.toFixed(2)}</div>
                      <div className={w.change >= 0 ? styles.up : styles.dn}>
                        {w.change >= 0 ? '+' : ''}{w.change}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className={styles.sideSection}>
              <div className={styles.sideTitle}>Quick trade</div>
              <div className={styles.tradeTabs}>
                <button
                  className={tradeMode === 'buy' ? styles.tradeTab + ' ' + styles.tradeBuy : styles.tradeTab}
                  onClick={function() { setTradeMode('buy') }}
                >Buy</button>
                <button
                  className={tradeMode === 'sell' ? styles.tradeTab + ' ' + styles.tradeSell : styles.tradeTab}
                  onClick={function() { setTradeMode('sell') }}
                >Sell</button>
              </div>
              <label className={styles.tradeLabel}>Asset</label>
              <input className={styles.tradeInput} value={tradeAsset} onChange={function(e) { setTradeAsset(e.target.value) }} />
              <label className={styles.tradeLabel}>Amount (USD)</label>
              <input className={styles.tradeInput} type="number" value={tradeAmt} onChange={function(e) { setTradeAmt(e.target.value) }} />
              <label className={styles.tradeLabel}>Order type</label>
              <select className={styles.tradeInput} value={tradeOrder} onChange={function(e) { setTradeOrder(e.target.value) }}>
                <option value="market">Market order</option>
                <option value="limit">Limit order</option>
                <option value="stop">Stop loss</option>
              </select>
              <button
                className={tradeMode === 'sell' ? styles.tradeBtn + ' ' + styles.tradeBtnSell : styles.tradeBtn}
                onClick={handleTrade}
              >
                {orderPlaced ? 'Order placed' : 'Review order'}
              </button>
              <p className={styles.tradeNote}>Execution via EasyEquities / VALR coming soon</p>
            </div>

            <div className={styles.sideSection}>
              <div className={styles.sideTitle}>Price alerts</div>
              {ALERTS.map(function(a, i) {
                return (
                  <div key={i} className={styles.alertRow}>
                    <span className={styles.alertLabel}>{a.label}</span>
                    <span className={a.active ? styles.alertOn : styles.alertOff}>
                      {a.active ? 'Active' : 'Off'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
