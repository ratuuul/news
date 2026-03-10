function tokenize(text) {
  return new Set(text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 2));
}

function similarity(a, b) {
  const sa = tokenize(a);
  const sb = tokenize(b);
  const intersection = [...sa].filter((word) => sb.has(word)).length;
  const union = new Set([...sa, ...sb]).size;
  return union ? intersection / union : 0;
}

export function clusterStories(articles, threshold = 0.35) {
  const clusters = [];
  for (const article of articles) {
    let matched = false;
    for (const cluster of clusters) {
      if (similarity(article.title, cluster[0].title) >= threshold) {
        cluster.push(article);
        matched = true;
        break;
      }
    }
    if (!matched) clusters.push([article]);
  }
  return clusters.filter((c) => c.length > 1);
}
