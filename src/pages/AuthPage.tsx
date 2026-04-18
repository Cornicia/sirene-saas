import { useState } from 'react'
import type { User } from '../App'

export default function AuthPage({ onLogin }: { onLogin: (u: User) => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [region, setRegion] = useState('CM')
  const fr = lang === 'fr'

  const submit = () => onLogin({ id: 'u1', email: email || 'demo@sirene.app', name: name || 'Utilisateur Demo', region, language: lang, plan: 'freemium' })

  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="auth-brand"><span className="logo-mark">◈</span><span className="logo-text">Sirène</span></div>
        <div className="auth-hero">
          <h1>CV · Portfolio<br/>Présentations</h1>
          <p>{fr ? 'Construisez votre identité professionnelle en quelques minutes.' : 'Build your professional identity in minutes.'}</p>
        </div>
        <div className="auth-pills">
          <span>✓ {fr ? '3 modules' : '3 modules'}</span>
          <span>✓ {fr ? 'Gratuit' : 'Free'}</span>
          <span>✓ {fr ? 'Export PDF' : 'PDF Export'}</span>
          <span>✓ {fr ? 'Lien public' : 'Public link'}</span>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="lang-row">
            <button className={lang === 'fr' ? 'lang-btn active' : 'lang-btn'} onClick={() => setLang('fr')}>FR</button>
            <button className={lang === 'en' ? 'lang-btn active' : 'lang-btn'} onClick={() => setLang('en')}>EN</button>
          </div>
          <div className="auth-tabs">
            <button className={mode === 'login' ? 'tab active' : 'tab'} onClick={() => setMode('login')}>{fr ? 'Connexion' : 'Login'}</button>
            <button className={mode === 'signup' ? 'tab active' : 'tab'} onClick={() => setMode('signup')}>{fr ? 'Inscription' : 'Sign up'}</button>
          </div>
          {mode === 'signup' && <div className="field"><label>{fr ? 'Nom complet' : 'Full name'}</label><input placeholder="Jean Dupont" value={name} onChange={e => setName(e.target.value)} /></div>}
          <div className="field"><label>Email</label><input type="email" placeholder="jean@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="field"><label>{fr ? 'Mot de passe' : 'Password'}</label><input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} /></div>
          {mode === 'signup' && (
            <div className="field"><label>{fr ? 'Pays' : 'Country'}</label>
              <select value={region} onChange={e => setRegion(e.target.value)}>
                <option value="CM">🇨🇲 Cameroun</option><option value="CI">🇨🇮 Côte d'Ivoire</option>
                <option value="SN">🇸🇳 Sénégal</option><option value="GH">🇬🇭 Ghana</option>
                <option value="NG">🇳🇬 Nigeria</option><option value="FR">🇫🇷 France</option><option value="OTHER">Autre</option>
              </select>
            </div>
          )}
          <button className="btn-primary w-full" onClick={submit}>{mode === 'login' ? (fr ? 'Se connecter' : 'Sign in') : (fr ? 'Créer mon compte' : 'Create account')}</button>
          <p className="auth-switch" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? (fr ? 'Pas de compte ? Inscrivez-vous' : "No account? Sign up") : (fr ? 'Déjà inscrit ? Connexion' : 'Already registered? Login')}
          </p>
          <div className="demo-hint" onClick={submit}>→ {fr ? 'Continuer en mode démo' : 'Continue in demo mode'}</div>
        </div>
      </div>
    </div>
  )
}
