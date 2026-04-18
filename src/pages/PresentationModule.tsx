import { useState } from 'react'
import type { User, Project, Route } from '../App'
import Sidebar from '../components/Sidebar'
import ShareModal from '../components/ShareModal'
import { generateShareLink } from '../lib/share'

type Props = { user: User; projects: Project[]; navigate: (r: Route, p?: Project) => void; addProject: (p: Project) => void; selectedProject: Project | null }
type Slide = { id: string; title: string; content: string; type: 'title' | 'content' | 'split' }
type Pres = { title: string; subtitle: string; author: string; template: string; slides: Slide[] }

const TMPLS = [
  { id: 's1', name: 'Minimal', bg: '#ffffff', fg: '#111111', accent: '#c8401e', premium: false },
  { id: 's2', name: 'Corporate', bg: '#0a2463', fg: '#ffffff', accent: '#ffd700', premium: false },
  { id: 's3', name: 'Créatif', bg: '#1a0533', fg: '#ffffff', accent: '#ff6bff', premium: false },
  { id: 's4', name: 'Dark Tech', bg: '#0d1117', fg: '#00ff88', accent: '#00ff88', premium: true },
]

const DEFAULT: Pres = {
  title: '', subtitle: '', author: '', template: 's1',
  slides: [
    { id: '1', title: 'Titre de la présentation', content: 'Sous-titre ou accroche', type: 'title' },
    { id: '2', title: 'Introduction', content: 'Décrivez votre sujet ici...', type: 'content' },
    { id: '3', title: 'Points clés', content: '• Point 1\n• Point 2\n• Point 3', type: 'content' },
  ]
}

export default function PresentationModule({ user, navigate }: Props) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<Pres>(DEFAULT)
  const [active, setActive] = useState(0)
  const [shareLink, setShareLink] = useState<string | null>(null)
  const fr = user.language === 'fr'
  const set = (f: keyof Pres, v: any) => setData(d => ({ ...d, [f]: v }))
  const tmpl = TMPLS.find(t => t.id === data.template) || TMPLS[0]
  const updateSlide = (i: number, f: keyof Slide, v: string) => {
    const slides = [...data.slides]; slides[i] = { ...slides[i], [f]: v }; set('slides', slides)
  }
  const addSlide = () => {
    const s: Slide = { id: Date.now().toString(), title: fr ? 'Nouveau slide' : 'New slide', content: '', type: 'content' }
    set('slides', [...data.slides, s]); setActive(data.slides.length)
  }
  const deleteSlide = (i: number) => {
    if (data.slides.length <= 1) return
    const slides = data.slides.filter((_, idx) => idx !== i)
    set('slides', slides); setActive(Math.max(0, i - 1))
  }

  return (
    <div className="layout">
      <Sidebar user={user} navigate={navigate} active="presentation" />
      <main className="main">
        <div className="mod-header">
          <button className="btn-back" onClick={() => navigate('dashboard')}>← Dashboard</button>
          <h2>📊 {fr ? 'Créer ma Présentation' : 'Create my Presentation'}</h2>
          <div className="steps">
            {['Template', 'Slides', fr ? 'Aperçu' : 'Preview'].map((s, i) => (
              <div key={i} className={`step ${step === i ? 'active' : step > i ? 'done' : ''}`} onClick={() => step > i && setStep(i)}>
                <span className="sn">{step > i ? '✓' : i + 1}</span><span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {step === 0 && (
          <div className="card">
            <h3>{fr ? 'Choisissez votre thème' : 'Choose your theme'}</h3>
            <div className="tmpl-grid">
              {TMPLS.map(t => (
                <div key={t.id} className={`tmpl-card ${data.template === t.id ? 'sel' : ''} ${t.premium && user.plan !== 'premium' ? 'locked' : ''}`}
                  onClick={() => (!t.premium || user.plan === 'premium') && set('template', t.id)}>
                  <div className="tmpl-thumb slide-prev" style={{ background: t.bg }}>
                    <div className="sp-title" style={{ background: t.fg, opacity: 0.8 }} />
                    <div className="sp-sub" style={{ background: t.fg, opacity: 0.4 }} />
                    <div className="sp-line" style={{ background: t.accent, opacity: 0.7 }} />
                    <div className="sp-line" style={{ background: t.fg, opacity: 0.2, width: '60%' }} />
                  </div>
                  <div className="tmpl-info"><strong style={{ color: t.bg === '#ffffff' ? '#111' : t.bg }}>{t.name}</strong>{t.premium && <span className="prem">✨ Premium</span>}</div>
                </div>
              ))}
            </div>
            <div className="fsec mt16">
              <h4>{fr ? 'Infos générales' : 'General info'}</h4>
              <div className="frow">
                <div className="field"><label>{fr ? 'Titre' : 'Title'}</label><input value={data.title} onChange={e => set('title', e.target.value)} placeholder="Mon Pitch 2025" /></div>
                <div className="field"><label>{fr ? 'Sous-titre' : 'Subtitle'}</label><input value={data.subtitle} onChange={e => set('subtitle', e.target.value)} /></div>
                <div className="field"><label>{fr ? 'Auteur' : 'Author'}</label><input value={data.author} onChange={e => set('author', e.target.value)} placeholder={user.name} /></div>
              </div>
            </div>
            <button className="btn-primary mt16" onClick={() => setStep(1)}>{fr ? 'Éditer les slides →' : 'Edit slides →'}</button>
          </div>
        )}

        {step === 1 && (
          <div className="slide-editor">
            <div className="slide-panel">
              <div className="slide-list">
                {data.slides.map((sl, i) => (
                  <div key={sl.id} className={`slide-thumb ${i === active ? 'active' : ''}`} onClick={() => setActive(i)}
                    style={{ background: tmpl.bg, border: `2px solid ${i === active ? tmpl.accent : 'transparent'}` }}>
                    <span className="slide-num" style={{ color: tmpl.fg, opacity: 0.4 }}>{i + 1}</span>
                    <div className="st-title" style={{ color: tmpl.fg }}>{sl.title}</div>
                  </div>
                ))}
                <button className="btn-add mt8" onClick={addSlide}>＋ Slide</button>
              </div>
              <div className="slide-edit">
                <div className="field"><label>{fr ? 'Titre' : 'Title'}</label><input value={data.slides[active]?.title || ''} onChange={e => updateSlide(active, 'title', e.target.value)} /></div>
                <div className="field"><label>Type</label>
                  <select value={data.slides[active]?.type} onChange={e => updateSlide(active, 'type', e.target.value as any)}>
                    <option value="title">{fr ? 'Slide titre' : 'Title slide'}</option>
                    <option value="content">{fr ? 'Contenu' : 'Content'}</option>
                  </select>
                </div>
                <div className="field"><label>{fr ? 'Contenu' : 'Content'}</label>
                  <textarea rows={5} value={data.slides[active]?.content || ''} onChange={e => updateSlide(active, 'content', e.target.value)} />
                </div>
                {data.slides.length > 1 && <button className="btn-del" onClick={() => deleteSlide(active)}>🗑 {fr ? 'Supprimer' : 'Delete'}</button>}
              </div>
              <div className="slide-live" style={{ background: tmpl.bg }}>
                {data.slides[active]?.type === 'title' ? (
                  <div className="sl-title-layout">
                    <div className="sl-accent-line" style={{ background: tmpl.accent }} />
                    <h2 style={{ color: tmpl.fg }}>{data.slides[active]?.title}</h2>
                    <p style={{ color: tmpl.fg, opacity: 0.6 }}>{data.slides[active]?.content}</p>
                    <small style={{ color: tmpl.fg, opacity: 0.3 }}>{data.author || user.name}</small>
                  </div>
                ) : (
                  <div className="sl-content-layout">
                    <h3 style={{ color: tmpl.accent }}>{data.slides[active]?.title}</h3>
                    <div style={{ color: tmpl.fg, opacity: 0.8, fontSize: 13, whiteSpace: 'pre-line', lineHeight: 1.7 }}>{data.slides[active]?.content}</div>
                  </div>
                )}
                <div className="sl-footer" style={{ color: tmpl.fg, opacity: 0.25 }}>{active + 1}/{data.slides.length}</div>
              </div>
            </div>
            <div className="form-actions mt16">
              <button className="btn-outline" onClick={() => setStep(0)}>←</button>
              <button className="btn-primary" onClick={() => setStep(2)}>{fr ? 'Aperçu →' : 'Preview →'}</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="preview-wrap">
            <div className="preview-bar">
              <button className="btn-outline" onClick={() => setStep(1)}>← {fr ? 'Modifier' : 'Edit'}</button>
              <button className="btn-primary" onClick={() => window.print()}>⬇ PDF</button>
              <button className="btn-share" onClick={() => setShareLink(generateShareLink('presentation', data))}>🔗 {fr ? 'Partager' : 'Share'}</button>
            </div>
            <div className="slides-full">
              {data.slides.map((sl, i) => (
                <div key={sl.id} className="sf-slide" style={{ background: tmpl.bg }}>
                  {sl.type === 'title' ? (
                    <div className="sf-title-layout">
                      <div className="sf-accent" style={{ background: tmpl.accent }} />
                      <h1 style={{ color: tmpl.fg }}>{sl.title || data.title}</h1>
                      <p style={{ color: tmpl.fg, opacity: 0.65 }}>{sl.content || data.subtitle}</p>
                      <small style={{ color: tmpl.fg, opacity: 0.35 }}>{data.author || user.name}</small>
                    </div>
                  ) : (
                    <div className="sf-content-layout">
                      <h2 style={{ color: tmpl.accent }}>{sl.title}</h2>
                      <div style={{ color: tmpl.fg, opacity: 0.85, whiteSpace: 'pre-line', lineHeight: 1.8 }}>{sl.content}</div>
                    </div>
                  )}
                  <div className="sf-num" style={{ color: tmpl.fg, opacity: 0.2 }}>{i + 1}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      {shareLink && <ShareModal link={shareLink} onClose={() => setShareLink(null)} lang={user.language} />}
    </div>
  )
}
