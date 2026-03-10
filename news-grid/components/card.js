const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1000&q=60';

const slug = (name) => name.toLowerCase();

export function createNewsCard(article) {
  const el = document.createElement('article');
  el.className = 'card news-card';

  const tags = article.tags
    .map((tag) => `<span class="tag tag-${slug(tag)}">${tag}</span>`)
    .join('');

  el.innerHTML = `
    <img class="news-image" src="${article.image || FALLBACK_IMAGE}" alt="${article.title}" loading="lazy">
    <div class="news-content">
      <div class="tags">${tags}</div>
      <h3 class="news-title"><a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a></h3>
      <p class="meta">${article.source} • ${relativeTime(article.publishedAt)}</p>
    </div>
  `;
  return el;
}

export function createEditorialCard(item) {
  const el = document.createElement('article');
  el.className = 'card news-card';
  el.innerHTML = `
    <div class="news-content">
      <span class="tag tag-opinion">Opinion</span>
      <h3 class="news-title"><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.title}</a></h3>
      <p>${item.description}</p>
      <p class="meta">${item.author || 'Editorial Board'} • ${item.publication} • ${relativeTime(item.publishedAt)}</p>
    </div>
  `;
  return el;
}

function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.max(1, Math.floor(diff / 3600000));
  return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;
}
