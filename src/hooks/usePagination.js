import { useEffect, useMemo, useState } from 'react'

// Paginates a list. Pass a `resetKey` (e.g. a filter signature) to jump back to
// page 1 whenever the underlying set changes.
export function usePagination(items, perPage = 6, resetKey = '') {
  const [page, setPage] = useState(0)
  const pageCount = Math.max(1, Math.ceil(items.length / perPage))

  useEffect(() => {
    setPage(0)
  }, [resetKey, perPage])

  useEffect(() => {
    if (page > pageCount - 1) setPage(0)
  }, [page, pageCount])

  const pageItems = useMemo(
    () => items.slice(page * perPage, page * perPage + perPage),
    [items, page, perPage],
  )

  return { page, setPage, pageCount, pageItems }
}
