import { useEffect, useState } from 'react'
import { fetchGitHub, deriveStats } from '../lib/github.js'

export function useGitHub(username) {
  const [state, setState] = useState({
    user: null,
    repos: [],
    orgs: [],
    stats: deriveStats(null, []),
    loading: true,
    error: null,
  })

  useEffect(() => {
    let alive = true
    fetchGitHub(username)
      .then(({ user, repos, orgs }) => {
        if (!alive) return
        setState({
          user,
          repos,
          orgs,
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
  }, [username])

  return state
}
