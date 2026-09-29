import CollectionView from './CollectionView.jsx'
import { compactId, formatDate, initials, memberName, referenceId } from './formatters.js'
import { API_BASE_URL, buildApiEndpoint } from '../api.js'
import useCollection from './useCollection.js'

function Users() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  const usersEndpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/users/`
    : `${API_BASE_URL}/api/users/`
  const usersRequest = useCollection(usersEndpoint)
  const teamsRequest = useCollection(buildApiEndpoint('teams'))
  const teamsById = new Map(teamsRequest.items.map((team) => [referenceId(team._id || team.id), team]))

  const columns = [
    {
      key: 'member',
      label: 'Member',
      render: (user) => {
        const name = memberName(user) || `Member ${compactId(user._id || user.id)}`
        return (
          <div className="primary-cell">
            <span className="member-avatar">{initials(name)}</span>
            <span className="primary-cell-copy">
              <strong>{name}</strong>
              <span>{user.username || 'OctoFit member'}</span>
            </span>
          </div>
        )
      },
    },
    { key: 'email', label: 'Email', render: (user) => user.email || '—' },
    {
      key: 'team',
      label: 'Team',
      render: (user) => {
        const team = typeof user.team === 'object' ? user.team : teamsById.get(referenceId(user.team))
        return team?.name || (user.team ? `Team ${compactId(user.team)}` : 'Unassigned')
      },
    },
    { key: 'createdAt', label: 'Joined', render: (user) => formatDate(user.createdAt) },
  ]

  return (
    <CollectionView
      collectionLabel="Members"
      columns={columns}
      description="Meet the people building stronger habits across OctoFit."
      eyebrow="The community"
      error={usersRequest.error}
      items={usersRequest.items}
      onRefresh={usersRequest.refresh}
      status={usersRequest.status}
      title="Member directory"
    />
  )
}

export default Users