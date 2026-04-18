import { useState } from 'react'
import type { User, Project, Route } from '../App'
import Sidebar from '../components/Sidebar'

type Props = { user: User; projects: Project[]; navigate: (r: Route, p?: Project) => void; addProject: (p: Project) => void; selectedProject: Project | null }

const ICONS: Record<string, string> = { cv: '📄', portfolio: '🗂', presentation: '📊' }
const COLORS: Record<string, string> = { cv: 'tag-cv', portfolio: 'tag-portfolio', presentation: 'tag-pres' }

export default function Dashboard({ user, projects, navigate, addProject }: Props) {
  const [filter, setFilter] = useState<'all' | 'cv' | 'portfolio' | 'presentation'>('all')
  const fr = user.language === 'fr'

  const create = (type: 'cv' | 'portfolio' | 'presentation') => {
    const titles: Record<string, string> = { cv: fr ? 'Nouveau CV' : 'New CV', portfolio: fr ? 'Nouveau Portfolio' : 'New Portfolio', presentation: fr ? 'Nouvelle Présentation' : 'New Presentation' }
    const p: Project = { id: Date.now().toString(), user_id: user.id, type, title: titles[type], status: 'draft', created_at: new Date().toISOString().slice(0,10), updated_at: new Date().toISOString().slice(0,10) }
    addProject(p); navigate(type, p)
  }

  const filtered = filter === 'all' ? projects : projects.filter(p => p.type === filter)
  const counts = { cv: projects.filter(p => p.type === 'cv').length, portfolio: projects.filter(p => p.type === 'portfolio').length, presentation: projects.filter(p => p.type === 'presentation').length }

  return (
    <div className="layout">
      <Sidebar user={user} navigate={navigate} active="dashboard" />
      <main className="main">
        <div className="dash-header">
          <div>
            <h1>{fr ? 'Bonjour' : 'Hello'}, {user.name.split(' ')[0]} 👋</h1>
            <p className="sub">{fr ? 'Votre espace de création professionnelle' : 'Your professional creation space'}</p>
          </div>
          <div className="plan-info">
            <span className="plan-badge">{fr ? 'Plan gratuit' : 'Free plan'}</span>
            <button className="btn-upgrade">✨ {fr ? 'Passer Premium' : 'Go Premium'}</button>
          </div>
        </div>

        <div className="stats-grid">
          {[{ icon: '📄', count: counts.cv, label: fr ? 'CV créés' : 'CVs created', color: '#1a3a5c' },
            { icon: '🗂', count: counts.portfolio, label: 'Portfolios', color: '#2d5a27' },
            { icon: '📊', count: counts.presentation, label: fr ? 'Présentations' : 'Presentations', color: '#7a2a6e' }
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
              <span className="stat-icon">{s.icon}</span>
              <div><strong className="stat-num">{s.count}</strong><small>{s.label}</small></div>
            </div>
          ))}
          <div className="stat-card quota">
            <div className="quota-label">{fr ? 'Projets gratuits' : 'Free projects'}</div>
            <div className="quota-bar"><div className="quota-fill" style={{ width: `${Math.min((projects.length / 3) * 100, 100)}%` }} /></div>
            <small>{projects.length}/3 {fr ? 'utilisés' : 'used'}</small>
          </div>
        </div>

        <div className="create-row">
          <button className="create-btn cv" onClick={() => create('cv')}>＋ {fr ? 'Nouveau CV' : 'New CV'}</button>
          <button className="create-btn portfolio" onClick={() => create('portfolio')}>＋ {fr ? 'Nouveau Portfolio' : 'New Portfolio'}</button>
          <button className="create-btn pres" onClick={() => create('presentation')}>＋ {fr ? 'Nouvelle Présentation' : 'New Presentation'}</button>
        </div>

        <div className="filter-row">
          {(['all', 'cv', 'portfolio', 'presentation'] as const).map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? (fr ? 'Tous' : 'All') : f === 'cv' ? 'CV' : f === 'portfolio' ? 'Portfolio' : (fr ? 'Présentations' : 'Presentations')}
              <span className="badge">{f === 'all' ? projects.length : counts[f as 'cv' | 'portfolio' | 'presentation']}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty"><span>✦</span><p>{fr ? 'Aucun projet pour le moment' : 'No projects yet'}</p><button className="btn-primary" onClick={() => create('cv')}>{fr ? 'Créer mon premier projet' : 'Create first project'}</button></div>
        ) : (
          <div className="projects-grid">
            {filtered.map(p => (
              <div key={p.id} className="pcard">
                <div className={`pcard-bar ${p.type}`} />
                <div className="pcard-body">
                  <span className="pcard-icon">{ICONS[p.type]}</span>
                  <div className="pcard-info">
                    <h3>{p.title}</h3>
                    <div className="pcard-tags">
                      <span className={`tag ${COLORS[p.type]}`}>{p.type === 'cv' ? 'CV' : p.type === 'portfolio' ? 'Portfolio' : (fr ? 'Présentation' : 'Presentation')}</span>
                      <span className={`tag status-${p.status}`}>{p.status === 'draft' ? (fr ? 'Brouillon' : 'Draft') : (fr ? 'Publié' : 'Published')}</span>
                    </div>
                    <small className="pcard-date">{fr ? 'Modifié le' : 'Updated'} {p.updated_at}</small>
                  </div>
                </div>
                <div className="pcard-actions">
                  <button className="btn-sm" onClick={() => navigate(p.type, p)}>{fr ? 'Modifier' : 'Edit'}</button>
                  <button className="btn-sm outline">{fr ? 'Aperçu' : 'Preview'}</button>
                  <button className="btn-sm ghost">↗</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
