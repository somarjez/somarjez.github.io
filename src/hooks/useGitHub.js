import { useEffect, useState } from 'react'
import { fetchGitHub, deriveStats } from '../lib/github.js'

export function useGitHub(username, featuredOrgs = []) {
  const orgsKey = featuredOrgs.join(',')
  const [state, setState] = useState({
    user: null,
    repos: [],
    orgs: [],
    orgGroups: [],
    stats: deriveStats(null, []),
    loading: true,
    error: null,
  })

  useEffect(() => {
    let alive = true
    fetchGitHub(username, orgsKey ? orgsKey.split(',') : [])
      .then(({ user, repos, orgs, orgGroups }) => {
        if (!alive) return
        setState({
          user,
          repos,
          orgs,
          orgGroups: orgGroups || [],
          stats: deriveStats(user, repos),
          loading: false,
          error: null,
        })
      })
      .catch((error) => {
        if (!alive) return
        setState((s) => ({ ...s, loading: false, error: error.message }))
      })
    return () => {
      alive = false
    }
  }, [username, orgsKey])

  return state
}
