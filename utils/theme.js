export function applyTheme(mode) {
  const root = document.documentElement;
  if (mode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', mode);
  }
}

export function initThemeController(selectEl) {
  if (!selectEl) return;
  const initial = localStorage.getItem('gng-theme') || 'system';
  selectEl.value = initial;
  applyTheme(initial);

  selectEl.addEventListener('change', () => {
    localStorage.setItem('gng-theme', selectEl.value);
    applyTheme(selectEl.value);
  });
}
