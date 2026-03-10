const rules = {
  Tech: ['tech', 'openai', 'apple', 'google', 'microsoft', 'nvidia', 'software'],
  Finance: ['inflation', 'interest', 'stock', 'economy', 'finance', 'bank'],
  Politics: ['election', 'senate', 'government', 'president', 'minister'],
  World: ['war', 'diplomacy', 'un', 'global', 'ukraine', 'china'],
  Science: ['research', 'nasa', 'space', 'science', 'climate'],
  Business: ['business', 'company', 'startup', 'merger', 'earnings'],
  Markets: ['market', 'dow', 'nasdaq', 's&p', 'bond', 'crypto'],
  AI: ['ai', 'artificial intelligence', 'machine learning', 'chatgpt'],
  Culture: ['film', 'music', 'culture', 'art', 'festival'],
  Opinion: ['opinion', 'editorial', 'analysis', 'commentary']
};

export const categories = ['All', ...Object.keys(rules)];

export function tagArticle(article) {
  const haystack = `${article.title} ${article.description}`.toLowerCase();
  const tags = Object.entries(rules)
    .filter(([, words]) => words.some((word) => haystack.includes(word)))
    .map(([tag]) => tag);
  return { ...article, tags: tags.length ? tags.slice(0, 3) : ['World'] };
}
