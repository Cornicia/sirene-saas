import { useState } from 'react'
import type { User, Project, Route } from '../App'
import Sidebar from '../components/Sidebar'

type Props = { user: User; projects: Project[]; navigate: (r: Route, p?: Project) => void; addProject: (p: Project) => void; selectedProject: Project | null }
type Item = { id: string; title: string; type: string; desc: string; link: string }
type PF = { name: string; tagline: string; about: string; layout: 'grid' | 'one-page'; items: Item[]; template: string }

const TMPLS = [
  { id: 'p1', name: 'Grid Moderne', color: '#0f172a', premium: false },
  { id: 'p2', name: 'One-Page Light', color: '#f97316', premium: false },
  { id: 'p3', name: 'Dark Creative', color: '#7c3aed', premium: true },
]

const DEFAULT: PF = { name: '', tagline: '', about: '', layout: 'grid', items: [{ id: '1', title: '', type: 'web', desc: '', link: '' }], template: 'p1' }

export default function PortfolioModule({ user, navigate }: Props) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<PF>(DEFAULT)
  const fr = user.language === 'fr'
  const set = (f: keyof PF, v: any) => setData(d => ({ ...d, [f]: v }))
  const tmpl = TMPLS.find(t => t.id === data.template) || TMPLS[0]

  const updateItem = (i: number, f: keyof Item, v: string) => {
    const items = [...data.items]; items[i] = { ...items[i], [f]: v }; set('items', items)
  }

  return (
    <div className="layout">
      <Sidebar user={user} navigate={navigate} active="portfolio" />
      <main className="main">
        <div className="mod-header">
          <button className="btn-back" onClick={() => navigate('dashboard')}>← Dashboard</button>
          <h2>🗂 {fr ? 'Créer mon Portfolio' : 'Create my Portfolio'}</h2>
          <div className="steps">
            {[fr ? 'Template' : 'Template', fr ? 'Projets' : 'Projects', fr ? 'Aperçu' : 'Preview'].map((s, i) => (
              <div key={i} className={`step ${step === i ? 'active' : step > i ? 'done' : ''}`} onClick={() => step > i && setStep(i)}>
                <span className="sn">{step > i ? '✓' : i + 1}</span><span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {step === 0 && (
          <div className="card">
            <h3>{fr ? 'Choisissez votre layout' : 'Choose your layout'}</h3>
            <div className="tmpl-grid">
              {TMPLS.map(t => (
                <div key={t.id} className={`tmpl-card ${data.template === t.id ? 'sel' : ''} ${t.premium && user.plan !== 'premium' ? 'locked' : ''}`}
                  onClick={() => (!t.premium || user.plan === 'premium') && set('template', t.id)}>
                  <div className="tmpl-thumb" style={{ background: t.color }}>
                    <div className="pg-grid"><div/><div/><div/><div/></div>
                  </div>
                  <div className="tmpl-info"><strong>{t.name}</strong>{t.premium && <span className="prem">✨ Premium</span>}</div>
                </div>
              ))}
            </div>
            <div className="radio-group mt16">
              <label><input type="radio" checked={data.layout === 'grid'} onChange={() => set('layout', 'grid')} /> Grid</label>
              <label><input type="radio" checked={data.layout === 'one-page'} onChange={() => set('layout', 'one-page')} /> One-Page</label>
            </div>
            <button className="btn-primary mt16" onClick={() => setStep(1)}>{fr ? 'Continuer →' : 'Continue →'}</button>
          </div>
        )}

        {step === 1 && (
          <div className="form-wrap">
            <div className="fsec">
              <h4>👤 {fr ? 'Votre profil' : 'Your profile'}</h4>
              <div className="frow">
                <div className="field"><label>{fr ? 'Nom / Marque' : 'Name / Brand'}</label><input value={data.name} onChange={e => set('name', e.target.value)} placeholder="Jean Studio" /></div>
                <div className="field"><label>Tagline</label><input value={data.tagline} onChange={e => set('tagline', e.target.value)} placeholder={fr ? 'Designer UI/UX Freelance' : 'Freelance UI/UX Designer'} /></div>
              </div>
              <div className="field"><label>{fr ? 'À propos' : 'About'}</label><textarea rows={3} value={data.about} onChange={e => set('about', e.target.value)} placeholder={fr ? 'Présentez-vous...' : 'Tell about yourself...'} /></div>
            </div>
            <div className="fsec">
              <h4>📁 {fr ? 'Vos projets' : 'Your projects'}</h4>
              {data.items.map((item, i) => (
                <div key={item.id} className="sub-entry">
                  <div className="frow">
                    <div className="field"><label>{fr ? 'Titre' : 'Title'}</label><input value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} /></div>
                    <div className="field"><label>Type</label>
                      <select value={item.type} onChange={e => updateItem(i, 'type', e.target.value)}>
                        {['web','design','mobile','data','video','autre'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="field"><label>Lien</label><input value={item.link} onChange={e => updateItem(i, 'link', e.target.value)} placeholder="https://..." /></div>
                  </div>
                  <div className="field"><label>Description</label><textarea rows={2} value={item.desc} onChange={e => updateItem(i, 'desc', e.target.value)} /></div>
                </div>
              ))}
              <button className="btn-add" onClick={() => set('items', [...data.items, { id: Date.now().toString(), title: '', type: 'web', desc: '', link: '' }])}>＋ {fr ? 'Ajouter un projet' : 'Add project'}</button>
            </div>
            <div className="form-actions">
              <button className="btn-outline" onClick={() => setStep(0)}>← {fr ? 'Retour' : 'Back'}</button>
              <button className="btn-primary" onClick={() => setStep(2)}>{fr ? 'Aperçu →' : 'Preview →'}</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="preview-wrap">
            <div className="preview-bar">
              <button className="btn-outline" onClick={() => setStep(1)}>← {fr ? 'Modifier' : 'Edit'}</button>
              <button className="btn-primary">🔗 {fr ? 'Publier & Partager' : 'Publish & Share'}</button>
              <button className="btn-outline">⬇ PDF</button>
            </div>
            <div className="pf-doc">
              <div className="pf-hero" style={{ background: tmpl.color }}>
                <h1>{data.name || 'Votre Nom'}</h1>
                <p>{data.tagline || 'Votre tagline'}</p>
              </div>
              {data.about && <div className="pf-about"><p>{data.about}</p></div>}
              <div className={`pf-items ${data.layout}`}>
                {data.items.filter(i => i.title).map((item, idx) => (
                  <div key={idx} className="pf-item">
                    <div className="pf-thumb" style={{ background: `hsl(${idx * 55 + 180}, 50%, 88%)` }}>
                      <span>{item.type}</span>
                    </div>
                    <div className="pf-item-info">
                      <strong>{item.title}</strong>
                      <p>{item.desc}</p>
                      {item.link && <a href={item.link} target="_blank" rel="noreferrer">↗ {fr ? 'Voir' : 'View'}</a>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
