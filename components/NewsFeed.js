import { useState } from 'react'
import useSWR from 'swr'
import styles from './NewsFeed.module.css'

var fetcher = function(url) { return fetch(url).then(function(r) { return r.json() }) }

var CATEGORIES = [
  { id: 'general',     label: 'All news'    },
  { id: 'crypto',      label: 'Crypto'      },
  { id: 'markets',     label: 'Markets'     },
  { id: 'commodities', label: 'Commodities' },
]

var TAG_COLORS = {
  general:     'blue',
  crypto:      'amber',
  markets:     'green',
  commodities: 'red',
}

function NewsItem(props) {
  var item = props.item
  var tagClass = props.tagClass
  var cat = props.cat
  var href = item.link ? item.link : '#'
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.item}>
      <div className={styles.itemTop}>
        <span className={tagClass}>{cat}</span>
        <span className={styles.time}>{item.timeAgo}</span>
      </div>
      <div className={styles.title}>{item.title}</div>
      {item.description ? <div className={styles.desc}>{item.description}</div> : null}
      <div className={styles.source}>{item.source}</div>
    </a>
  )
}

export default function NewsFeed() {
  var catState = useState('general')
  var cat = catState[0]
  var setCat = catState[1]
  var result = useSWR('/api/news?category=' + cat, fetcher, { refreshInterval: 120000 })
  var data = result.data
  var isLoading = result.isLoading
  var tagColor = TAG_COLORS[cat]
  var tagClass = styles.tag + ' ' + styles[tagColor]

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs}>
        {CATEGORIES.map(function(c) {
          var btnClass = cat === c.id ? styles.tab + ' ' + styles.active : styles.tab
          return (
            <button key={c.id} className={btnClass} onClick={function() { setCat(c.id) }}>
              {c.label}
            </button>
          )
        })}
      </div>
      <div className={styles.feed}>
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.skeleton}></div>
            <div className={styles.skeleton}></div>
            <div className={styles.skeleton}></div>
            <div className={styles.skeleton}></div>
          </div>
        ) : null}
        {!isLoading && data && data.items ? data.items.map(function(item, i) {
          return <NewsItem key={i} item={item} tagClass={tagClass} cat={cat} />
