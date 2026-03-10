import { createNewsCard } from './card.js';

export function renderNewsGrid(container, articles) {
  container.innerHTML = '';
  const frag = document.createDocumentFragment();
  articles.forEach((article, idx) => {
    const card = createNewsCard(article);
    if (idx === 0) card.style.gridRow = 'span 2';
    if (idx === 3) card.style.gridColumn = 'span 2';
    frag.appendChild(card);
  });
  container.appendChild(frag);
}
