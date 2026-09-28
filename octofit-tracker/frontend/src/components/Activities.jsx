import CollectionView from './CollectionView.jsx'
import { compactId, formatDate, initials, memberName, referenceId } from './formatters.js'
import useCollection from './useCollection.js'

function Activities() {
  const activityRequest = useCollection('activities')
  const usersRequest = useCollection('users')
  const usersById = new Map(usersRequest.items.map((user) => [referenceId(user._id || user.id), user]))

  const columns = [
    {
      key: 'type',
      label: 'Activity',
      render: (activity) => <span className="type-mark">{activity.type || 'Activity'}</span>,
    },
    {
      key: 'user',
      label: 'Member',
      render: (activity) => {
        const user = typeof activity.user === 'object'
          ? activity.user
          : usersById.get(referenceId(activity.user))
        const name = memberName(user) || `Member ${compactId(activity.user)}`
        return (
          <div className="primary-cell">
            <span className="member-avatar">{initials(name)}</span>
            <span className="primary-cell-copy">
              <strong>{name}</strong>
              <span>{user?.username || compactId(activity.user)}</span>
            </span>
          </div>
        )
      },
    },
    { key: 'date', label: 'Date', render: (activity) => formatDate(activity.date) },
    { key: 'duration', label: 'Duration', numeric: true, render: (activity) => `${activity.duration ?? '—'} min` },
    { key: 'calories', label: 'Calories', numeric: true, render: (activity) => activity.calories ?? '—' },
  ]

  return (
    <CollectionView
      collectionLabel="Activities"
      columns={columns}
      description="A shared log of movement, effort, and the people putting in the work."
      eyebrow="The daily log"
      error={activityRequest.error}
      items={activityRequest.items}
      onRefresh={activityRequest.refresh}
      status={activityRequest.status}
      title="Activity feed"
    />
  )
}

export default Activities