import type { Route } from '../App'

type Props = {
  navigate: (r: Route) => void
}

// ─── Decode share data from URL hash ───────────────────────────────
function getShareData(): { type: string; data: any } | null {
  try {
    const hash = window.location.hash // e.g. #/share/cv/BASE64
    const match = hash.match(/^#\/share\/(cv|portfolio|presentation)\/(.+)$/)
    if (!match) return null
    const type = match[1]
    const data = JSON.parse(atob(match[2]))
    return { type, data }
  } catch {
    return null
  }
}

// ─── CV Public View ────────────────────────────────────────────────
function CVPublic({ cv }: { cv: any }) {
  const tmplColors: Record<string, string> = { t1: '#1a3a5c', t2: '#c8401e', t3: '#2d2d2d', t4: '#f5a623', t5: '#2d5a27' }
  const color = tmplColors[cv.template] || '#1a3a5c'
  return (
    <div className="pub-cv" style={{ borderTop: `6px solid ${color}` }}>
      <div className="cv-top">
        <h1>{cv.name || 'Nom'}</h1>
        <h2 style={{ color }}>{cv.title}</h2>
        <div className="cv-contacts">
          {cv.email && <span>✉ {cv.email}</span>}
          {cv.phone && <span>📞 {cv.phone}</span>}
          {cv.city && <span>📍 {cv.city}</span>}
          {cv.linkedin && <span>🔗 {cv.linkedin}</span>}
        </div>
      </div>
      {cv.summary && <div className="cv-s"><h3 style={{ color }}>PROFIL</h3><p>{cv.summary}</p></div>}
      {cv.experience?.some((e: any) => e.company) && (
        <div className="cv-s">
          <h3 style={{ color }}>EXPÉRIENCES</h3>
          {cv.experience.filter((e: any) => e.company).map((e: any, i: number) => (
            <div key={i} className="cv-entry">
              <div className="cv-eh"><strong>{e.role}</strong> — {e.company}<span>{e.period}</span></div>
              {e.desc && <p>{e.desc}</p>}
            </div>
          ))}
        </div>
      )}
      {cv.education?.some((e: any) => e.school) && (
        <div className="cv-s">
          <h3 style={{ color }}>FORMATION</h3>
          {cv.education.filter((e: any) => e.school).map((e: any, i: number) => (
            <div key={i} className="cv-entry"><strong>{e.degree}</strong> · {e.school} <span className="cv-date">{e.year}</span></div>
          ))}
        </div>
      )}
      {cv.skills?.some((s: string) => s) && (
        <div className="cv-s">
          <h3 style={{ color }}>COMPÉTENCES</h3>
          <div className="cv-skills">{cv.skills.filter((s: string) => s).map((s: string, i: number) => <span key={i} style={{ borderColor: color + '40' }}>{s}</span>)}</div>
        </div>
      )}
    </div>
  )
}

// ─── Portfolio Public View ──────────────────────────────────────────
function PortfolioPublic({ pf }: { pf: any }) {
  const tmplColors: Record<string, string> = { p1: '#0f172a', p2: '#f97316', p3: '#7c3aed' }
  const color = tmplColors[pf.template] || '#0f172a'
  return (
    <div className="pub-pf">
      <div className="pf-hero" style={{ background: color }}>
        <h1>{pf.name || 'Portfolio'}</h1>
        <p>{pf.tagline}</p>
      </div>
      {pf.about && <div className="pf-about"><p>{pf.about}</p></div>}
      <div className={`pf-items ${pf.layout || 'grid'}`} style={{ padding: '24px 40px' }}>
        {pf.items?.filter((i: any) => i.title).map((item: any, idx: number) => (
          <div key={idx} className="pf-item">
            <div className="pf-thumb" style={{ background: `hsl(${idx * 55 + 180},50%,88%)` }}>
              <span>{item.type}</span>
            </div>
            <div className="pf-item-info">
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
              {item.link && <a href={item.link} target="_blank" rel="noreferrer">↗ Voir le projet</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Presentation Public View ────────────────────────────────────────
function PresentationPublic({ pres }: { pres: any }) {
  const TMPLS: Record<string, { bg: string; fg: string; accent: string }> = {
    s1: { bg: '#ffffff', fg: '#111111', accent: '#c8401e' },
    s2: { bg: '#0a2463', fg: '#ffffff', accent: '#ffd700' },
    s3: { bg: '#1a0533', fg: '#ffffff', accent: '#ff6bff' },
    s4: { bg: '#0d1117', fg: '#00ff88', accent: '#00ff88' },
  }
  const tmpl = TMPLS[pres.template] || TMPLS.s1
  return (
    <div className="pub-slides">
      {pres.slides?.map((sl: any, i: number) => (
        <div key={sl.id || i} className="sf-slide" style={{ background: tmpl.bg }}>
          {sl.type === 'title' ? (
            <div className="sf-title-layout">
              <div className="sf-accent" style={{ background: tmpl.accent }} />
              <h1 style={{ color: tmpl.fg }}>{sl.title || pres.title}</h1>
              <p style={{ color: tmpl.fg, opacity: 0.65 }}>{sl.content || pres.subtitle}</p>
              <small style={{ color: tmpl.fg, opacity: 0.35 }}>{pres.author}</small>
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
  )
}

// ─── Main Public View Component ─────────────────────────────────────
export default function PublicView({ navigate }: Props) {
  const share = getShareData()

  if (!share) {
    return (
      <div className="pub-error">
        <div className="pub-error-card">
          <span>⚠️</span>
          <h2>Lien invalide ou expiré</h2>
          <p>Ce lien de partage ne correspond à aucun document.</p>
          <button className="btn-primary" onClick={() => navigate('auth')}>Créer mon propre document</button>
        </div>
      </div>
    )
  }

  const labels: Record<string, string> = { cv: 'CV', portfolio: 'Portfolio', presentation: 'Présentation' }

  return (
    <div className="pub-wrap">
      {/* Header public */}
      <header className="pub-header">
        <div className="pub-header-inner">
          <div className="pub-brand">
            <span className="logo-mark">◈</span>
            <span className="logo-text">Sirène</span>
          </div>
          <div className="pub-meta">
            <span className="pub-type-badge">{labels[share.type]}</span>
            <button className="btn-primary pub-cta" onClick={() => navigate('auth')}>
              ✨ Créer le mien gratuitement
            </button>
          </div>
        </div>
      </header>

      {/* Barre d'actions */}
      <div className="pub-actions">
        <button className="btn-outline" onClick={() => window.print()}>⬇ Télécharger PDF</button>
        <button className="btn-outline" onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Lien copié !') }}>🔗 Copier le lien</button>
      </div>

      {/* Contenu du document */}
      <div className="pub-content">
        {share.type === 'cv' && <CVPublic cv={share.data} />}
        {share.type === 'portfolio' && <PortfolioPublic pf={share.data} />}
        {share.type === 'presentation' && <PresentationPublic pres={share.data} />}
      </div>

      {/* Footer */}
      <footer className="pub-footer">
        <p>Créé avec <strong>Sirène</strong> · <button className="pub-footer-link" onClick={() => navigate('auth')}>Créer votre document gratuitement →</button></p>
      </footer>
    </div>
  )
}
