import { useGitHub } from './hooks/useGitHub.js'
import { useTheme } from './hooks/useTheme.js'
import { site } from './config/site.js'
import Background from './components/Background.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import GitHubStats from './components/GitHubStats.jsx'
import Featured from './components/Featured.jsx'
import RepoGrid from './components/RepoGrid.jsx'
import Orgs from './components/Orgs.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const { repos, orgs, stats, loading, error } = useGitHub(site.username)
  const { theme, toggle } = useTheme()

  return (
    <>
      <Background />
      <Nav theme={theme} onToggleTheme={toggle} />
      <main>
        <Hero stats={stats} loading={loading} />
        <About />
        <Skills />
        <GitHubStats stats={stats} loading={loading} />
        <Featured repos={repos} />
        <RepoGrid repos={repos} loading={loading} error={error} />
        <Orgs orgs={orgs} />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
