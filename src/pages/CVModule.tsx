import { useState } from 'react'
import type { User, Project, Route } from '../App'
import Sidebar from '../components/Sidebar'

type Props = { user: User; projects: Project[]; navigate: (r: Route, p?: Project) => void; addProject: (p: Project) => void; selectedProject: Project | null }
type Exp = { company: string; role: string; period: string; desc: string }
type Edu = { school: string; degree: string; year: string }
type CV = { name: string; title: string; email: string; phone: string; city: string; linkedin: string; summary: string; experience: Exp[]; education: Edu[]; skills: string[]; template: string }

const TEMPLATES = [
  { id: 't1', name: 'Classique', color: '#1a3a5c', premium: false },
  { id: 't2', name: 'Moderne', color: '#c8401e', premium: false },
  { id: 't3', name: 'Minimaliste', color: '#2d2d2d', premium: false },
  { id: 't4', name: 'Creative', color: '#f5a623', premium: true },
  { id: 't5', name: 'Executive', color: '#2d5a27', premium: true },
]

const DEFAULT: CV = {
  name: '', title: '', email: '', phone: '', city: '', linkedin: '', summary: '',
  experience: [{ company: '', role: '', period: '', desc: '' }],
  education: [{ school: '', degree: '', year: '' }],
  skills: [''], template: 't1'
}

export default function CVModule({ user, navigate }: Props) {
  const [step, setStep] = useState(0)
  const [cv, setCv] = useState<CV>(DEFAULT)
  const fr = user.language === 'fr'
  const tmpl = TEMPLATES.find(t => t.id === cv.template) || TEMPLATES[0]
  const set = (f: keyof CV, v: any) => setCv(c => ({ ...c, [f]: v }))

  return (
    <div className="layout">
      <Sidebar user={user} navigate={navigate} active="cv" />
      <main className="main">
        <div className="mod-header">
          <button className="btn-back" onClick={() => navigate('dashboard')}>← Dashboard</button>
          <h2>📄 {fr ? 'Créer mon CV' : 'Create my CV'}</h2>
          <div className="steps">
            {[fr ? 'Template' : 'Template', fr ? 'Infos' : 'Info', fr ? 'Aperçu' : 'Preview'].map((s, i) => (
              <div key={i} className={`step ${step === i ? 'active' : step > i ? 'done' : ''}`} onClick={() => step > i && setStep(i)}>
                <span className="sn">{step > i ? '✓' : i + 1}</span><span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {step === 0 && (
          <div className="card">
            <h3>{fr ? 'Choisissez votre style' : 'Choose your style'}</h3>
            <div className="tmpl-grid">
              {TEMPLATES.map(t => (
                <div key={t.id} className={`tmpl-card ${cv.template === t.id ? 'sel' : ''} ${t.premium && user.plan !== 'premium' ? 'locked' : ''}`}
                  onClick={() => (!t.premium || user.plan === 'premium') && set('template', t.id)}>
                  <div className="tmpl-thumb" style={{ background: t.color }}>
                    <div className="tl"/><div className="tl2"/><div className="tl3"/><div className="tl3" style={{width:'55%'}}/>
                  </div>
                  <div className="tmpl-info"><strong>{t.name}</strong>{t.premium && <span className="prem">✨ Premium</span>}</div>
                </div>
              ))}
            </div>
            <button className="btn-primary mt16" onClick={() => setStep(1)}>{fr ? 'Continuer →' : 'Continue →'}</button>
          </div>
        )}

        {step === 1 && (
          <div className="form-wrap">
            <div className="fsec">
              <h4>👤 {fr ? 'Informations personnelles' : 'Personal information'}</h4>
              <div className="frow">
                <div className="field"><label>{fr ? 'Nom complet' : 'Full name'}</label><input value={cv.name} onChange={e => set('name', e.target.value)} placeholder="Jean Dupont" /></div>
                <div className="field"><label>{fr ? 'Titre' : 'Title'}</label><input value={cv.title} onChange={e => set('title', e.target.value)} placeholder="Développeur Web" /></div>
              </div>
              <div className="frow">
                <div className="field"><label>Email</label><input type="email" value={cv.email} onChange={e => set('email', e.target.value)} placeholder="jean@email.com" /></div>
                <div className="field"><label>{fr ? 'Téléphone' : 'Phone'}</label><input value={cv.phone} onChange={e => set('phone', e.target.value)} placeholder="+237 6XX XXX XXX" /></div>
                <div className="field"><label>{fr ? 'Ville' : 'City'}</label><input value={cv.city} onChange={e => set('city', e.target.value)} placeholder="Douala" /></div>
              </div>
              <div className="field"><label>{fr ? 'Résumé' : 'Summary'}</label><textarea rows={3} value={cv.summary} onChange={e => set('summary', e.target.value)} placeholder={fr ? 'Présentez-vous en 2-3 phrases...' : '2-3 sentences about you...'} /></div>
            </div>

            <div className="fsec">
              <h4>💼 {fr ? 'Expériences' : 'Experience'}</h4>
              {cv.experience.map((exp, i) => (
                <div key={i} className="sub-entry">
                  <div className="frow">
                    <div className="field"><label>{fr ? 'Entreprise' : 'Company'}</label><input value={exp.company} onChange={e => { const ex = [...cv.experience]; ex[i].company = e.target.value; set('experience', ex) }} /></div>
                    <div className="field"><label>{fr ? 'Poste' : 'Position'}</label><input value={exp.role} onChange={e => { const ex = [...cv.experience]; ex[i].role = e.target.value; set('experience', ex) }} /></div>
                    <div className="field"><label>{fr ? 'Période' : 'Period'}</label><input value={exp.period} onChange={e => { const ex = [...cv.experience]; ex[i].period = e.target.value; set('experience', ex) }} placeholder="2022 – 2024" /></div>
                  </div>
                  <div className="field"><label>Description</label><textarea rows={2} value={exp.desc} onChange={e => { const ex = [...cv.experience]; ex[i].desc = e.target.value; set('experience', ex) }} /></div>
                </div>
              ))}
              <button className="btn-add" onClick={() => set('experience', [...cv.experience, { company: '', role: '', period: '', desc: '' }])}>＋ {fr ? 'Ajouter une expérience' : 'Add experience'}</button>
            </div>

            <div className="fsec">
              <h4>🎓 {fr ? 'Formation' : 'Education'}</h4>
              {cv.education.map((edu, i) => (
                <div key={i} className="frow sub-entry">
                  <div className="field"><label>{fr ? 'École' : 'School'}</label><input value={edu.school} onChange={e => { const ed = [...cv.education]; ed[i].school = e.target.value; set('education', ed) }} /></div>
                  <div className="field"><label>{fr ? 'Diplôme' : 'Degree'}</label><input value={edu.degree} onChange={e => { const ed = [...cv.education]; ed[i].degree = e.target.value; set('education', ed) }} /></div>
                  <div className="field" style={{maxWidth:100}}><label>{fr ? 'Année' : 'Year'}</label><input value={edu.year} onChange={e => { const ed = [...cv.education]; ed[i].year = e.target.value; set('education', ed) }} placeholder="2021" /></div>
                </div>
              ))}
              <button className="btn-add" onClick={() => set('education', [...cv.education, { school: '', degree: '', year: '' }])}>＋ {fr ? 'Ajouter' : 'Add'}</button>
            </div>

            <div className="fsec">
              <h4>⚡ {fr ? 'Compétences' : 'Skills'}</h4>
              <div className="skills-wrap">
                {cv.skills.map((sk, i) => (
                  <input key={i} className="skill-chip" value={sk} placeholder={`Skill ${i+1}`} onChange={e => { const s = [...cv.skills]; s[i] = e.target.value; set('skills', s) }} />
                ))}
                <button className="btn-add-sm" onClick={() => set('skills', [...cv.skills, ''])}>＋</button>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-outline" onClick={() => setStep(0)}>← {fr ? 'Retour' : 'Back'}</button>
              <button className="btn-primary" onClick={() => setStep(2)}>{fr ? 'Voir l\'aperçu →' : 'Preview →'}</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="preview-wrap">
            <div className="preview-bar">
              <button className="btn-outline" onClick={() => setStep(1)}>← {fr ? 'Modifier' : 'Edit'}</button>
              <button className="btn-primary" onClick={() => window.print()}>⬇ PDF</button>
              <button className="btn-outline">🔗 {fr ? 'Partager' : 'Share'}</button>
            </div>
            <div className="cv-doc" style={{ borderTop: `6px solid ${tmpl.color}` }}>
              <div className="cv-top">
                <h1>{cv.name || 'Votre Nom'}</h1>
                <h2 style={{ color: tmpl.color }}>{cv.title || 'Titre Professionnel'}</h2>
                <div className="cv-contacts">
                  {cv.email && <span>✉ {cv.email}</span>}
                  {cv.phone && <span>📞 {cv.phone}</span>}
                  {cv.city && <span>📍 {cv.city}</span>}
                </div>
              </div>
              {cv.summary && <div className="cv-s"><h3 style={{ color: tmpl.color }}>{fr ? 'PROFIL' : 'SUMMARY'}</h3><p>{cv.summary}</p></div>}
              {cv.experience.some(e => e.company) && (
                <div className="cv-s">
                  <h3 style={{ color: tmpl.color }}>{fr ? 'EXPÉRIENCES' : 'EXPERIENCE'}</h3>
                  {cv.experience.filter(e => e.company).map((e, i) => (
                    <div key={i} className="cv-entry">
                      <div className="cv-eh"><strong>{e.role}</strong> — {e.company}<span>{e.period}</span></div>
                      {e.desc && <p>{e.desc}</p>}
                    </div>
                  ))}
                </div>
              )}
              {cv.education.some(e => e.school) && (
                <div className="cv-s">
                  <h3 style={{ color: tmpl.color }}>{fr ? 'FORMATION' : 'EDUCATION'}</h3>
                  {cv.education.filter(e => e.school).map((e, i) => <div key={i} className="cv-entry"><strong>{e.degree}</strong> · {e.school} <span className="cv-date">{e.year}</span></div>)}
                </div>
              )}
              {cv.skills.some(s => s) && (
                <div className="cv-s">
                  <h3 style={{ color: tmpl.color }}>{fr ? 'COMPÉTENCES' : 'SKILLS'}</h3>
                  <div className="cv-skills">{cv.skills.filter(s => s).map((s, i) => <span key={i} style={{ borderColor: tmpl.color + '40' }}>{s}</span>)}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
