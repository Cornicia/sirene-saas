# Sirène — CV · Portfolio · Présentations

SaaS de création de documents professionnels pour l'Afrique francophone et au-delà.

## Stack
- **React 19** + TypeScript
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **Vercel** (déploiement)

## Modules
- 📄 **CV** — Formulaire structuré + templates + export PDF
- 🗂 **Portfolio** — Layouts grid/one-page + lien public
- 📊 **Présentations** — Éditeur de slides + export PDF

## Démarrage local

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Déploiement

Le projet est déployé automatiquement sur Vercel à chaque push sur `main`.

## Roadmap
- [ ] Authentification Supabase
- [ ] Export PDF (jsPDF)
- [ ] Intégration IA (Claude API)
- [ ] Paiements (Notch Pay + Stripe)
- [ ] Lien public de partage
