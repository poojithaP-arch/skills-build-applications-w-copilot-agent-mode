import CollectionView from './CollectionView.jsx'
import useCollection from './useCollection.js'

function Workouts() {
  const request = useCollection('workouts')
  const columns = [
    {
      key: 'title',
      label: 'Workout',
      render: (workout) => (
        <div className="primary-cell">
          <span className="member-avatar">{String(workout.activityType || 'W').slice(0, 1).toUpperCase()}</span>
          <span className="primary-cell-copy">
            <strong>{workout.title || 'Workout'}</strong>
            <span>{workout.activityType || 'Training'}</span>
          </span>
        </div>
      ),
    },
    {
      key: 'difficulty',
      label: 'Level',
      render: (workout) => <span className={`status-tag ${workout.difficulty || 'beginner'}`}>{workout.difficulty || 'beginner'}</span>,
    },
    { key: 'duration', label: 'Duration', numeric: true, render: (workout) => `${workout.duration ?? '—'} min` },
    { key: 'calories', label: 'Calories', numeric: true, render: (workout) => workout.calories ?? '—' },
    { key: 'description', label: 'Focus', render: (workout) => <span className="secondary-copy">{workout.description || '—'}</span> },
  ]

  return (
    <CollectionView
      collectionLabel="Workouts"
      columns={columns}
      description="Pick a session that fits your energy, experience, and time today."
      eyebrow="A plan for today"
      error={request.error}
      items={request.items}
      onRefresh={request.refresh}
      status={request.status}
      title="Workout library"
    />
  )
}

export default Workouts