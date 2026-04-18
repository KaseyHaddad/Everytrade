import styles from './ShipTracker.module.css'

var VESSELS = [
  { name: 'VLCC Poseidon',   type: 'oil',       status: 'delayed', cargo: 'Crude oil', from: 'Kuwait',       to: 'Rotterdam'   },
  { name: 'VLCC Atlas',      type: 'oil',       status: 'delayed', cargo: 'Crude oil', from: 'Saudi Arabia', to: 'China'       },
  { name: 'LNG Arctic Star', type: 'lng',       status: 'transit', cargo: 'LNG',       from: 'Qatar',        to: 'Japan'       },
  { name: 'VLCC Titan',      type: 'oil',       status: 'delayed', cargo: 'Crude oil', from: 'Iraq',         to: 'South Korea' },
  { name: 'CMA CGM Jade',    type: 'container', status: 'transit', cargo: 'General',   from: 'Shanghai',     to: 'Hamburg'     },
  { name: 'Maersk Nordic',   type: 'container', status: 'transit', cargo: 'General',   from: 'Singapore',    to: 'Rotterdam'   },
]

var ALERTS = [
  {
    level: 'high',
    title: 'Strait of Hormuz — 3 VLCC tankers delayed',
    detail: 'Poseidon, Atlas and Titan delayed 12-24hrs. Around 60M barrels affected. Watch crude oil and USO ETF for upward pressure.',
    assets: ['OIL', 'USO', 'XLE'],
  },
  {
    level: 'medium',
    title: 'Red Sea — Houthi activity elevated',
    detail: 'Container ships rerouting via Cape of Good Hope. Adds 10-14 days to Europe routes. Watch shipping and energy stocks.',
    assets: ['ZIM', 'GLD'],
  },
]

var TYPE_COLOR   = { oil: 'red', lng: 'amber', container: 'green' }
var STATUS_COLOR = { delayed: 'red', transit: 'green', anchored: 'amber' }

export default function ShipTracker() {
  return (
    <div className={styles.wrap}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Commodity vessel alerts</div>
        {ALERTS.map(function(alert, i) {
          return (
            <div key={i} className={styles.alert + ' ' + styles[alert.level]}>
              <div className={styles.alertTitle}>{alert.title}</div>
              <div className={styles.alertDetail}>{alert.detail}</div>
              <div className={styles.alertAssets}>
                <span className={styles.assetLabel}>Watch: </span>
                {alert.assets.map(function(a) {
                  return <span key={a} className={styles.assetTag}>{a}</span>
                })}
              </div>
            </div>
          )
        })}
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Tracked vessels</div>
        <div className={styles.legend}>
          <span className={styles.dot + ' ' + styles.red}></span> Oil tanker
          <span className={styles.dot + ' ' + styles.amber} style={{marginLeft:'10px'}}></span> LNG
          <span className={styles.dot + ' ' + styles.green} style={{marginLeft:'10px'}}></span> Container
        </div>
        {VESSELS.map(function(v, i) {
          return (
            <div key={i} className={styles.vessel}>
              <div className={styles.vesselLeft}>
                <span className={styles.dot + ' ' + styles[TYPE_COLOR[v.type]]}></span>
                <div>
                  <div className={styles.vesselName}>{v.name}</div>
                  <div className={styles.vesselRoute}>{v.from} to {v.to}</div>
                </div>
              </div>
              <div className={styles.vesselRight}>
                <span className={styles.status + ' ' + styles[STATUS_COLOR[v.status]]}>{v.status}</span>
                <div className={styles.cargo}>{v.cargo}</div>
              </div>
            </div>
          )
        })}
      </div>
      <div className={styles.footer}>Real ship tracking via MarineTraffic API coming soon</div>
    </div>
  )
}
