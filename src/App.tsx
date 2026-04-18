import { useState, useEffect } from 'react'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import CVModule from './pages/CVModule'
import PortfolioModule from './pages/PortfolioModule'
import PresentationModule from './pages/PresentationModule'
import PublicView from './pages/PublicView'

export type Route = 'auth' | 'dashboard' | 'cv' | 'portfolio' | 'presentation' | 'public'
export type User = { id: string; email: string; name: string; region: string; language: 'fr' | 'en'; plan: 'freemium' | 'premium' }
export type Project = { id: string; user_id: string; type: 'cv' | 'portfolio' | 'presentation'; title: string; status: 'draft' | 'published'; created_at: string; updated_at: string }

// Check if URL contains a share link on load
function detectShareRoute(): Route {
  const hash = window.location.hash
  if (hash.startsWith('#/share/')) return 'public'
  return 'auth'
}

function App() {
  const [route, setRoute] = useState<Route>(detectShareRoute())
  const [user, setUser] = useState<User | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', user_id: 'u1', type: 'cv', title: 'Mon CV Principal', status: 'published', created_at: '2025-04-01', updated_at: '2025-04-10' },
    { id: '2', user_id: 'u1', type: 'portfolio', title: 'Portfolio Design 2025', status: 'draft', created_at: '2025-04-05', updated_at: '2025-04-12' },
    { id: '3', user_id: 'u1', type: 'presentation', title: 'Pitch Startup Africa', status: 'published', created_at: '2025-04-08', updated_at: '2025-04-15' },
  ])

  // Listen for hash changes (for share links)
  useEffect(() => {
    const onHash = () => {
      if (window.location.hash.startsWith('#/share/')) setRoute('public')
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (r: Route, project?: Project) => {
    if (project) setSelectedProject(project)
    // Clear hash when leaving public view
    if (r !== 'public' && window.location.hash.startsWith('#/share/')) {
      window.history.replaceState(null, '', window.location.pathname)
    }
    setRoute(r)
  }
  const addProject = (p: Project) => setProjects(prev => [...prev, p])

  if (route === 'public') return <PublicView navigate={navigate} />
  if (route === 'auth') return <AuthPage onLogin={(u) => { setUser(u); setRoute('dashboard') }} />

  const props = { user: user!, projects, navigate, addProject, selectedProject }
  return (
    <>
      {route === 'dashboard' && <Dashboard {...props} />}
      {route === 'cv' && <CVModule {...props} />}
      {route === 'portfolio' && <PortfolioModule {...props} />}
      {route === 'presentation' && <PresentationModule {...props} />}
    </>
  )
}
export default App
