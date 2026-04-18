import { useState } from 'react'
import useSWR from 'swr'
import styles from './NewsFeed.module.css'

var fetcher = function(url) { return fetch(url).then(function(r) { return r.json() }) }

var CATEGORIES = [
  { id: 'general',     label: 'All news'     },
  { id: 'crypto',      label: 'Crypto'       },
  { id: 'markets',     label: 'Markets'      },
  { id: 'commodities', label: 'Commodities'  },
]

var TAG_COLORS = {
  general:     'blue',
  crypto:      'amber',
  markets:     'green',
  commodities: 'red',
}

export default function NewsFeed() {
  var catState = useState('general')
  var cat = catState[0]
  var setCat = catState[1]
  var result = useSWR('/api/news?category=' + cat, fetcher, { refreshInterval: 120000 })
  var data = result.data
  var isLoading = result.isLoading

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs}>
        {CATEGORIES.map(function(c) {
          return (
            <button
              key={c.id}
              className={cat === c.id ? styles.tab + ' ' + styles.active : styles.tab}
              onClick={function() { setCat(c.id) }}
            >
              {c.label}
            </button>
          )
        })}
      </div>
      <div className={styles.feed}>
        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.skeleton}></div>
            <div className={styles.skeleton}></div>
            <div className={styles.skeleton}></div>
            <div className={styles.skeleton}></div>
          </div>
        )}
        {!isLoading && data && data.items && data.items.map(function(item, i) {
          return (
            
              key={i}
              href={item.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.item}
            >
              <div className={styles.itemTop}>
                <span className={styles.tag + ' ' + styles[TAG_COLORS[cat]]}>
                  {cat}
                </span>
                <span className={styles.time}>{item.timeAgo}</span>
              </div>
              <div className={styles.title}>{item.title}</div>
              {item.description ? <div className={styles.desc}>{item.description}</div> : null}
              <div className={styles.source}>{item.source}</div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
