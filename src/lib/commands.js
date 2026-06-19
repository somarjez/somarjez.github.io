function goTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function buildCommands(site) {
  return [
    { id: 'home', label: 'Go to Home', hint: 'section', run: () => goTo('home') },
    { id: 'about', label: 'Go to About', hint: 'section', run: () => goTo('about') },
    { id: 'certs', label: 'Go to Certifications', hint: 'section', run: () => goTo('certs') },
    { id: 'projects', label: 'Go to Projects', hint: 'section', run: () => goTo('projects') },
    { id: 'github', label: 'Go to GitHub', hint: 'section', run: () => goTo('github') },
    { id: 'orgs', label: 'Go to Organizations', hint: 'section', run: () => goTo('orgs') },
    { id: 'contact', label: 'Go to Contact', hint: 'section', run: () => goTo('contact') },
    { id: 'open-resume', label: 'Open resume', hint: 'link', run: () => window.open(site.links.resume, '_blank', 'noopener') },
    { id: 'open-github', label: 'Open GitHub', hint: 'link', run: () => window.open(site.links.github, '_blank', 'noopener') },
    { id: 'open-linkedin', label: 'Open LinkedIn', hint: 'link', run: () => window.open(site.links.linkedin, '_blank', 'noopener') },
    { id: 'copy-email', label: 'Copy email address', hint: 'action', run: () => navigator.clipboard?.writeText(site.links.email) },
  ]
}
