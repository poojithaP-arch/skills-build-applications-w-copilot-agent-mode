function CollectionView({
  eyebrow,
  title,
  description,
  collectionLabel,
  columns,
  items,
  status,
  error,
  onRefresh,
}) {
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="page-kicker">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-description">{description}</p>
        </div>
        <div className="record-total" aria-live="polite">
          <strong>{status === 'ready' ? items.length : '—'}</strong>
          <span>{collectionLabel}</span>
        </div>
      </div>

      <div className="collection-panel">
        <div className="table-toolbar">
          <span className="table-toolbar-label">{collectionLabel} directory</span>
          <button className="refresh-button" onClick={onRefresh} type="button">
            Refresh data
          </button>
        </div>

        {status === 'loading' && (
          <div className="state-panel" role="status">
            <span className="state-mark">...</span>
            <strong>Loading {collectionLabel.toLowerCase()}</strong>
          </div>
        )}

        {status === 'error' && (
          <div className="state-panel" role="alert">
            <span className="state-mark">!</span>
            <strong>Could not load {collectionLabel.toLowerCase()}</strong>
            <p>{error}</p>
            <button className="refresh-button" onClick={onRefresh} type="button">
              Try again
            </button>
          </div>
        )}

        {status === 'ready' && items.length === 0 && (
          <div className="state-panel">
            <span className="state-mark">0</span>
            <strong>No {collectionLabel.toLowerCase()} yet</strong>
            <p>New records will appear here when they are added to OctoFit Tracker.</p>
          </div>
        )}

        {status === 'ready' && items.length > 0 && (
          <div className="table-scroll">
            <table className="records-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th className={column.numeric ? 'numeric' : ''} key={column.key} scope="col">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item._id || item.id || `${collectionLabel}-${index}`}>
                    {columns.map((column) => (
                      <td className={column.numeric ? 'numeric' : ''} key={column.key}>
                        {column.render ? column.render(item, index) : item[column.key] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default CollectionView