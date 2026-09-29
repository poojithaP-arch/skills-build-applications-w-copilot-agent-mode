export function referenceId(value) {
  if (!value) return ''
  if (typeof value === 'object') return String(value._id || value.id || '')
  return String(value)
}

export function compactId(value) {
  const id = referenceId(value)
  return id ? `#${id.slice(-6)}` : '—'
}

export function memberName(member) {
  if (!member || typeof member !== 'object') return ''
  const fullName = [member.firstName, member.lastName].filter(Boolean).join(' ')
  return fullName || member.username || member.email || ''
}

export function initials(label) {
  const parts = String(label || '?').trim().split(/[\s.@_-]+/).filter(Boolean)
  return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join('') || '?'
}

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}