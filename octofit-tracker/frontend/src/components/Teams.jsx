import CollectionView from './CollectionView.jsx'
import { compactId } from './formatters.js'
import useCollection from './useCollection.js'

function Teams() {
  const request = useCollection('teams')
  const columns = [
    {
      key: 'name',
      label: 'Team',
      render: (team) => (
        <div className="primary-cell">
          <span className="member-avatar">{String(team.name || 'T').slice(0, 1).toUpperCase()}</span>
          <span className="primary-cell-copy">
            <strong>{team.name || 'Unnamed team'}</strong>
            <span>{compactId(team._id || team.id)}</span>
          </span>
        </div>
      ),
    },
    { key: 'members', label: 'Members', numeric: true, render: (team) => team.members?.length ?? 0 },
    { key: 'totalPoints', label: 'Team points', numeric: true, render: (team) => <strong>{team.totalPoints ?? 0}</strong> },
  ]

  return (
    <CollectionView
      collectionLabel="Teams"
      columns={columns}
      description="Training is better together. Browse the crews moving toward their goals."
      eyebrow="Find your crew"
      error={request.error}
      items={request.items}
      onRefresh={request.refresh}
      status={request.status}
      title="Team roster"
    />
  )
}

export default Teams