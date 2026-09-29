import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import './App.css'
import './octofit.css'

const sections = [
  { path: '/activities', label: 'Activities', number: '01' },
  { path: '/leaderboard', label: 'Leaderboard', number: '02' },
  { path: '/teams', label: 'Teams', number: '03' },
  { path: '/users', label: 'Members', number: '04' },
  { path: '/workouts', label: 'Workouts', number: '05' },
]

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-main">
          <NavLink className="brand" to="/activities" aria-label="OctoFit Tracker home">
            <img className="brand-logo" src="/octofitapp-small.png" alt="" />
            <span className="brand-name">OctoFit<span>Tracker</span></span>
          </NavLink>
          <div className="header-context">
            <span className="context-dot" />
            <span>TRAIN TOGETHER</span>
          </div>
        </div>
        <nav className="section-nav" aria-label="Main navigation">
          {sections.map((section) => (
            <NavLink
              className={({ isActive }) => `section-link${isActive ? ' is-active' : ''}`}
              key={section.path}
              to={section.path}
            >
              <span className="section-number">{section.number}</span>
              <span>{section.label}</span>
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate replace to="/activities" />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Navigate replace to="/activities" />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <span>OCTOFIT TRACKER</span>
        <span>Move well. Move together.</span>
      </footer>
    </div>
  )
}

export default App
