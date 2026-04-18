import { useState } from 'react'
import { copyToClipboard } from '../lib/share'

type Props = { link: string; onClose: () => void; lang: 'fr' | 'en' }

export default function ShareModal({ link, onClose, lang }: Props) {
  const [copied, setCopied] = useState(false)
  const fr = lang === 'fr'

  const handleCopy = async () => {
    const ok = await copyToClipboard(link)
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2500) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-icon">🔗</div>
        <h3>{fr ? 'Partager votre document' : 'Share your document'}</h3>
        <p>{fr ? 'Ce lien donne accès à votre document en lecture seule, sans connexion requise.' : 'This link provides read-only access, no login required.'}</p>

        <div className="share-link-box">
          <input readOnly value={link} onFocus={e => e.target.select()} />
          <button className={`btn-copy ${copied ? 'copied' : ''}`} onClick={handleCopy}>
            {copied ? (fr ? '✓ Copié !' : '✓ Copied!') : (fr ? 'Copier' : 'Copy')}
          </button>
        </div>

        <div className="share-options">
          <a className="share-opt" href={`https://wa.me/?text=${encodeURIComponent((fr ? 'Voici mon document : ' : 'Here is my document: ') + link)}`} target="_blank" rel="noreferrer">
            <span>📱</span> WhatsApp
          </a>
          <a className="share-opt" href={`mailto:?subject=${encodeURIComponent(fr ? 'Mon document Sirène' : 'My Sirène document')}&body=${encodeURIComponent(link)}`}>
            <span>✉️</span> Email
          </a>
          <a className="share-opt" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`} target="_blank" rel="noreferrer">
            <span>💼</span> LinkedIn
          </a>
        </div>

        <div className="share-note">
          <span>ℹ️</span>
          {fr ? 'Le lien contient toutes les données du document, aucun serveur requis.' : 'Link contains all document data, no server required.'}
        </div>
      </div>
    </div>
  )
}
