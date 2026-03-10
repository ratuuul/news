const FEEDS = [
  { publication: 'NYTimes Opinion', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Opinion.xml' },
  { publication: 'Guardian Opinion', url: 'https://www.theguardian.com/uk/commentisfree/rss' },
  { publication: 'Washington Post Opinions', url: 'https://feeds.washingtonpost.com/rss/opinions' },
  { publication: 'Al Jazeera Opinion', url: 'https://www.aljazeera.com/xml/rss/all.xml' }
];

export async function fetchEditorials() {
  const today = new Date().toDateString();
  const all = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
      const res = await fetch(url);
      const json = await res.json();
      return (json.items || []).slice(0, 6).map((item) => ({
        title: item.title,
        description: stripHtml(item.description || '').slice(0, 220),
        url: item.link,
        author: item.author,
        publication: feed.publication,
        publishedAt: item.pubDate
      }));
    })
  );

  return all
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value)
    .filter((i) => new Date(i.publishedAt).toDateString() === today)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

function stripHtml(value) {
  const div = document.createElement('div');
  div.innerHTML = value;
  return div.textContent || '';
}
