const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  HTML: '#e34c26', Dart: '#00B4AB', Blade: '#f7523f',
  'Jupyter Notebook': '#DA5B0B', CSS: '#563d7c', Java: '#b07219',
}

export function langColor(name) {
  return LANG_COLORS[name] || '#64748b'
}
