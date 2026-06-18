function goTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function buildCommands(site) {
  return [
    { id: 'home', label: 'Go to Home', hint: 'section', run: () => goTo('home') },
    { id: 'about', label: 'Go to About', hint: 'section', run: () => goTo('about') },
    { id: 'stats', label: 'Go to GitHub stats', hint: 'section', run: () => goTo('stats') },
    { id: 'projects', label: 'Go to Projects', hint: 'section', run: () => goTo('projects') },
    { id: 'repos', label: 'Go to Repositories', hint: 'section', run: () => goTo('repos') },
    { id: 'contact', label: 'Go to Contact', hint: 'section', run: () => goTo('contact') },
    { id: 'github', label: 'Open GitHub', hint: 'link', run: () => window.open(site.links.github, '_blank', 'noopener') },
    { id: 'linkedin', label: 'Open LinkedIn', hint: 'link', run: () => window.open(site.links.linkedin, '_blank', 'noopener') },
    { id: 'email', label: 'Copy email address', hint: 'action', run: () => navigator.clipboard?.writeText(site.links.email) },
  ]
}
