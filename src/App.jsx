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
import OrgProjects from './components/OrgProjects.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const { repos, orgGroups, stats, loading, error } = useGitHub(site.username, site.featuredOrgs)
  usePointerSpotlight()
  const { open, setOpen } = useCommandPalette()
  const commands = buildCommands(site)

  return (
    <>
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>
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
        <OrgProjects orgGroups={orgGroups} />
        <Contact />
      </main>
      <Footer />
      <CommandPalette open={open} commands={commands} onClose={() => setOpen(false)} />
    </>
  )
}
