export default async function handler(req, res) {
  var category = req.query.category || 'general'
  var feeds = {
    general: 'https://finance.yahoo.com/rss/topstories',
    crypto: 'https://finance.yahoo.com/rss/crypto',
    markets: 'https://finance.yahoo.com/rss/2.0/headline?s=^GSPC&region=US&lang=en-US',
    commodities: 'https://finance.yahoo.com/rss/2.0/headline?s=CL=F,GC=F&region=US&lang=en-US',
  }
  var feedUrl = feeds[category] || feeds.general
  var fallbackItems = [
    { title: 'Markets open higher as investors eye Fed minutes', source: 'Yahoo Finance', timeAgo: '12m ago', description: 'US equity markets opened in positive territory.' },
    { title: 'Bitcoin holds above $80K amid institutional buying', source: 'Yahoo Finance', timeAgo: '34m ago', description: 'Bitcoin continues to trade above the $80,000 level.' },
    { title: 'Oil prices dip on demand concerns from Asia', source: 'Yahoo Finance', timeAgo: '1h ago', description: 'Crude oil prices fell slightly on weaker China data.' },
    { title: 'Gold near record highs as dollar weakens', source: 'Yahoo Finance', timeAgo: '2h ago', description: 'Gold prices remained near all-time highs.' },
  ]
  try {
    var response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Everytrade/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    })
    if (!response.ok) throw new Error('RSS fetch failed')
    var xml = await response.text()
    var items = []
    var itemRegex = /<item>([\s\S]*?)<\/item>/g
    var match
    while ((match = itemRegex.exec(xml)) !== null && items.length < 10) {
      var block = match[1]
      var titleMatch = block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>|<title>([\s\S]*?)<\/title>/)
      var linkMatch = block.match(/<link>([\s\S]*?)<\/link>/)
      var pubDateMatch = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)
      var descMatch = block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/)
      var title = titleMatch ? (titleMatch[1] || titleMatch[2] || '').trim() : ''
      var link = linkMatch ? linkMatch[1].trim() : ''
      var pubDate = pubDateMatch ? pubDateMatch[1].trim() : ''
      var desc = descMatch ? (descMatch[1] || descMatch[2] || '').replace(/<[^>]+>/g, '').slice(0, 160) : ''
      if (title) {
        var diff = Date.now() - new Date(pubDate).getTime()
        var mins = Math.floor(diff / 60000)
        var timeAgo = mins < 60 ? mins + 'm ago' : mins < 1440 ? Math.floor(mins/60) + 'h ago' : Math.floor(mins/1440) + 'd ago'
        items.push({ title: title, link: link, description: desc, timeAgo: timeAgo, source: 'Yahoo Finance' })
      }
    }
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate')
    res.status(200).json({ items: items.length > 0 ? items : fallbackItems, category: category })
  } catch (err) {
    res.status(200).json({ items: fallbackItems, category: category, fallback: true })
  }
}
