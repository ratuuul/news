const CACHE_KEY = 'gng-news-cache-v1';
const TTL_MS = 10 * 60 * 1000;

export function getCachedNews() {
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  if (Date.now() - parsed.timestamp > TTL_MS) return null;
  return parsed.data;
}

export function setCachedNews(data) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
}
