import CollectionView from './CollectionView.jsx'
import { initials, memberName, referenceId } from './formatters.js'
import { API_BASE_URL, buildApiEndpoint } from '../api.js'
import useCollection from './useCollection.js'

function Leaderboard() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  const leaderboardEndpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
    : `${API_BASE_URL}/api/leaderboard/`
  const leaderboardRequest = useCollection(leaderboardEndpoint)
  const usersRequest = useCollection(buildApiEndpoint('users'))
  const usersById = new Map(usersRequest.items.map((user) => [referenceId(user._id || user.id), user]))

  const columns = [
    {
      key: 'rank',
      label: 'Rank',
      render: (_entry, index) => <span className="rank-number">{String(index + 1).padStart(2, '0')}</span>,
    },
    {
      key: 'user',
      label: 'Member',
      render: (entry) => {
        const user = typeof entry.user === 'object'
          ? entry.user
          : usersById.get(referenceId(entry.user))
        const name = memberName(user) || `Member ${referenceId(entry.user).slice(-6)}`
        return (
          <div className="primary-cell">
            <span className="member-avatar">{initials(name)}</span>
            <span className="primary-cell-copy">
              <strong>{name}</strong>
              <span>{user?.username || 'OctoFit member'}</span>
            </span>
          </div>
        )
      },
    },
    { key: 'activitiesCompleted', label: 'Activities', numeric: true, render: (entry) => entry.activitiesCompleted ?? 0 },
    { key: 'points', label: 'Points', numeric: true, render: (entry) => <strong>{entry.points ?? 0}</strong> },
  ]

  return (
    <CollectionView
      collectionLabel="Rankings"
      columns={columns}
      description="Consistency counts. See how the community is stacking up this season."
      eyebrow="Friendly competition"
      error={leaderboardRequest.error}
      items={leaderboardRequest.items}
      onRefresh={leaderboardRequest.refresh}
      status={leaderboardRequest.status}
      title="Leaderboard"
    />
  )
}

export default Leaderboard