import { useGitHub } from './hooks/useGitHub.js'
import { usePointerSpotlight } from './hooks/usePointerSpotlight.js'
import { useCommandPalette } from './hooks/useCommandPalette.js'
import { buildCommands } from './lib/commands.js'
import { site } from './config/site.js'
import Background from './components/Background.jsx'
import Spotlight from './components/Spotlight.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Certifications from './components/Certifications.jsx'
import GitHubStats from './components/GitHubStats.jsx'
import Featured from './components/Featured.jsx'
import RepoGrid from './components/RepoGrid.jsx'
import Orgs from './components/Orgs.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const { repos, orgs, stats, loading, error } = useGitHub(site.username)
  usePointerSpotlight()
  const { open, setOpen } = useCommandPalette()
  const commands = buildCommands(site)

  return (
    <>
      <Background />
      <Spotlight />
      <Nav onOpenPalette={() => setOpen(true)} />
      <main>
        <Hero stats={stats} loading={loading} />
        <About />
        <Skills />
        <Certifications />
        <GitHubStats stats={stats} loading={loading} />
        <Featured repos={repos} />
        <RepoGrid repos={repos} loading={loading} error={error} />
        <Orgs orgs={orgs} />
        <Contact />
      </main>
      <Footer />
      <CommandPalette open={open} commands={commands} onClose={() => setOpen(false)} />
    </>
  )
}
