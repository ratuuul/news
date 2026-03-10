import { getCachedNews, setCachedNews } from './cache.js';

const API_KEY_STORAGE = 'gng-api-key';

function getApiKey() {
  return new URLSearchParams(location.search).get('apiKey') || localStorage.getItem(API_KEY_STORAGE) || '';
}

export function saveApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE, key);
}

function normalize(article) {
  return {
    id: article.url,
    title: article.title,
    description: article.description || 'No summary available.',
    url: article.url,
    image: article.image,
    source: article.source?.name || 'Unknown source',
    publishedAt: article.publishedAt,
    tags: []
  };
}

export async function fetchTopHeadlines() {
  const cached = getCachedNews();
  if (cached) return cached;

  const key = getApiKey();
  if (!key) return [];

  const endpoint = `https://gnews.io/api/v4/top-headlines?lang=en&max=30&apikey=${key}`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error('Failed to fetch headlines');

  const data = await res.json();
  const normalized = (data.articles || []).map(normalize);
  setCachedNews(normalized);
  return normalized;
}
