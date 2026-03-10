import { fetchTopHeadlines, saveApiKey } from './services/news-api.js';
import { renderNewsGrid } from './components/grid.js';
import { categories, tagArticle } from './utils/tagger.js';
import { clusterStories } from './utils/clustering.js';
import { detectTopics } from './utils/topics.js';
import { applyTheme, initThemeController } from './utils/theme.js';

const state = { all: [], filtered: [], category: 'All', query: '', topic: '' };

const heroEl = document.getElementById('heroStory');
const gridEl = document.getElementById('newsGrid');
const filtersEl = document.getElementById('filters');
const searchEl = document.getElementById('searchInput');
const headlinesEl = document.getElementById('trendingHeadlines');
const topicsEl = document.getElementById('topics');
const clustersEl = document.getElementById('clusters');

applyTheme(localStorage.getItem('gng-theme') || 'system');
initThemeController(document.getElementById('themeSelect'));

ensureApiKey();
init();

async function init() {
  try {
    const raw = await fetchTopHeadlines();
    state.all = raw.map(tagArticle);
    buildFilters();
    refresh();
  } catch (error) {
    heroEl.classList.remove('skeleton');
    heroEl.innerHTML = `<div class="hero-content"><h1>Unable to load stories</h1><p>${error.message}</p></div>`;
  }
}

function ensureApiKey() {
  if (new URLSearchParams(location.search).get('apiKey') || localStorage.getItem('gng-api-key')) return;
  const key = prompt('Enter your GNews API key to load headlines:');
  if (key) saveApiKey(key.trim());
}

function refresh() {
  const filtered = state.all.filter((article) => {
    const categoryOk = state.category === 'All' || article.tags.includes(state.category);
    const queryOk = !state.query || `${article.title} ${article.description}`.toLowerCase().includes(state.query);
    const topicOk = !state.topic || article.title.toLowerCase().includes(state.topic);
    return categoryOk && queryOk && topicOk;
  });

  state.filtered = filtered;
  renderHero(filtered[0]);
  renderNewsGrid(gridEl, filtered.slice(1));
  renderHeadlines(filtered.slice(0, 8));
  renderTopics(detectTopics(state.all));
  renderClusters(clusterStories(state.all));
}

function renderHero(article) {
  heroEl.classList.remove('skeleton');
  if (!article) {
    heroEl.innerHTML = '<div class="hero-content"><h1>No matching stories</h1></div>';
    return;
  }

  heroEl.innerHTML = `
    <img class="hero-media" src="${article.image || ''}" alt="${article.title}">
    <div class="hero-content">
      <p class="meta">${article.tags.join(' • ')}</p>
      <h1>${article.title}</h1>
      <p>${article.description}</p>
      <p class="meta">${article.source} • ${new Date(article.publishedAt).toLocaleString()}</p>
      <a class="readmore" href="${article.url}" target="_blank" rel="noopener noreferrer">Read full story</a>
    </div>
  `;
}

function buildFilters() {
  filtersEl.innerHTML = '';
  categories.forEach((category) => {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${category === state.category ? 'active' : ''}`;
    btn.textContent = category;
    btn.onclick = () => {
      state.category = category;
      buildFilters();
      refresh();
    };
    filtersEl.appendChild(btn);
  });
}

function renderHeadlines(items) {
  headlinesEl.innerHTML = items.map((item) => `<li>${item.title}</li>`).join('');
}

function renderTopics(topics) {
  topicsEl.innerHTML = '';
  topics.forEach((topic) => {
    const btn = document.createElement('button');
    btn.className = 'topic-btn';
    btn.textContent = topic;
    btn.onclick = () => {
      state.topic = state.topic === topic ? '' : topic;
      refresh();
    };
    topicsEl.appendChild(btn);
  });
}

function renderClusters(clusters) {
  clustersEl.innerHTML = clusters
    .slice(0, 6)
    .map(
      (cluster) => `
      <article class="cluster-item">
        <strong>${cluster[0].title}</strong>
        <p class="meta">Sources: ${[...new Set(cluster.map((a) => a.source))].join(', ')}</p>
      </article>
    `
    )
    .join('');
}

searchEl.addEventListener('input', (event) => {
  state.query = event.target.value.trim().toLowerCase();
  refresh();
});
