const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export function normalizeCollection(payload) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []

  for (const key of ['results', 'items', 'records', 'content', 'data']) {
    const collection = payload[key]
    if (Array.isArray(collection)) return collection
    const nestedCollection = normalizeCollection(collection)
    if (nestedCollection.length > 0) return nestedCollection
  }

  return []
}

export async function fetchCollection(collection, signal) {
  const response = await fetch(`${API_BASE_URL}/api/${collection}/`, { signal })
  if (!response.ok) {
    throw new Error(`Could not load ${collection} (${response.status})`)
  }

  return normalizeCollection(await response.json())
}