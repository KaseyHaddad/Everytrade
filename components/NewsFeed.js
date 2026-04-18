import { useState } from 'react'
import useSWR from 'swr'
import styles from './NewsFeed.module.css'

var fetcher = function(url) { return fetch(url).then(function(r) { return r.json() }) }

var CATS = [
  { id: 'general',     label: 'All news'    },
  { id: 'crypto',      label: 'Crypto'      },
  { id: 'markets',     label: 'Markets'     },
  { id: 'commodities', label: 'Commodities' },
]

var COLORS = { general: 'blue', crypto: 'amber', markets: 'green', commodities: 'red' }

export default function NewsFeed() {
  var s = useState('general')
  var cat = s[0]
  var setCat = s[1]
  var r = useSWR('/api/news?category=' + cat, fetcher, { refreshInterval: 120000 })
  var data = r.data
  var loading = r.isLoading

  var items = []
  if (!loading && data && data.items) {
    for (var i = 0; i < data.items.length; i++) {
      var item = data.items[i]
      var url = item.link ? item.link : '#'
      var colorClass = styles.tag + ' ' + styles[COLORS[cat]]
      items.push(
        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className={styles.item}>
          <div className={styles.itemTop}>
            <span className={colorClass}>{cat}</span>
            <span className={styles.time}>{item.timeAgo}</span>
          </div>
          <div className={styles.title}>{item.title}</div>
          <div className={styles.source}>{item.source}</div>
        </a>
      )
    }
  }

  var tabs = []
  for (var j = 0; j < CATS.length; j++) {
    var c = CATS[j]
    var btnClass = cat === c.id ? styles.tab + ' ' + styles.active : styles.tab
    tabs.push(
      <button key={c.id} className={btnClass} onClick={function(id) { return function() { setCat(id) } }(c.id)}>
        {c.label}
      </button>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs}>{tabs}</div>
      <div className={styles.feed}>
        {loading ? <div className={styles.loading}><div className={styles.skeleton}></div><div className={styles.skeleton}></div><div className={styles.skeleton}></div></div> : null}
        {items}
      </div>
    </div>
  )
}
