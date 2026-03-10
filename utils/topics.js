const stopwords = new Set(['the', 'and', 'for', 'with', 'from', 'this', 'that', 'into', 'over', 'after', 'about']);

export function detectTopics(articles, limit = 8) {
  const counts = new Map();
  articles.forEach((a) => {
    a.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stopwords.has(w))
      .forEach((w) => counts.set(w, (counts.get(w) || 0) + 1));
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([topic]) => topic);
}
