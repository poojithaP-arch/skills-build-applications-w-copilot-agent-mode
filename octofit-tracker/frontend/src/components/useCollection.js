import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

export default function useCollection(endpoint) {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    fetchCollection(endpoint, controller.signal)
      .then((records) => {
        setItems(records)
        setStatus('ready')
      })
      .catch((requestError) => {
        if (requestError.name === 'AbortError') return
        setError(requestError.message || 'The API request failed.')
        setStatus('error')
      })

    return () => controller.abort()
  }, [endpoint, refreshKey])

  function refresh() {
    setError('')
    setStatus('loading')
    setRefreshKey((current) => current + 1)
  }

  return {
    items,
    status,
    error,
    refresh,
  }
}