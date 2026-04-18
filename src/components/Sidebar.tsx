import type { User, Route } from '../App'

type Props = { user: User; navigate: (r: Route) => void; active: Route }

export default function Sidebar({ user, navigate, active }: Props) {
  const fr = user.language === 'fr'
  const nav = [
    { icon: '▦', label: fr ? 'Dashboard' : 'Dashboard', route: 'dashboard' as Route },
    { icon: '📄', label: fr ? 'Mes CV' : 'My CVs', route: 'cv' as Route },
    { icon: '🗂', label: 'Portfolio', route: 'portfolio' as Route },
    { icon: '📊', label: fr ? 'Présentations' : 'Presentations', route: 'presentation' as Route },
  ]
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <span className="sb-logo">◈</span>
        <span className="sb-name">Sirène</span>
      </div>
      <nav className="sb-nav">
        {nav.map(n => (
          <button key={n.route} className={`sb-item ${active === n.route ? 'active' : ''}`} onClick={() => navigate(n.route)}>
            <span>{n.icon}</span><span>{n.label}</span>
          </button>
        ))}
      </nav>
      <div className="sb-footer">
        <div className="sb-avatar">{user.name[0].toUpperCase()}</div>
        <div>
          <div className="sb-uname">{user.name.split(' ')[0]}</div>
          <div className="sb-plan">{user.plan === 'freemium' ? '🟡 Gratuit' : '⭐ Premium'}</div>
        </div>
      </div>
    </aside>
  )
}
