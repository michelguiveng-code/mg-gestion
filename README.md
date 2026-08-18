<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# 🇭🇹 MG Gestion - Marketplace Haïtien

Application e-commerce complète pour Haiti avec support des paiements **MonCash** et **NatCash**.

## ✨ Fonctionnalités

- 🛍️ **Marketplace multi-vendeurs** - Acheteurs et vendeurs
- 💳 **Paiements sécurisés** - MonCash, NatCash, Stripe (prévu)
- 📱 **Mobile-first** - Responsive design
- 👥 **Multi-rôles** - Buyer, Seller, Admin
- 💬 **Chat en temps réel** - Messages entre acheteurs/vendeurs
- 📊 **Dashboard Admin** - Métriques et gestion
- 🌐 **Multilingue** - Français, Haïtien Créole, Anglais
- ✅ **Production-ready** - Déploiement sur Render

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation locale

```bash
# 1. Cloner et installer
npm install

# 2. Initialiser la base de données
npx prisma migrate dev
node scripts/init-db.js

# 3. Démarrer le serveur
npm run dev
```

L'app sera accessible à `http://localhost:3002`

## 📚 Documentation

- [API Paiements](./API_PAYMENTS.md) - Endpoints MonCash/NatCash
- [Guide Déploiement Render](./DEPLOY_RENDER.md) - Déployer gratuitement
- [Architecture](./ARCHITECTURE.md) - Vue d'ensemble technique

## 🌐 Déploiement

### Sur Render (Gratuit)

```bash
# 1. Pousser sur GitHub
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/mg-gestion.git
git push -u origin main

# 2. Aller sur https://dashboard.render.com
# 3. Créer un nouveau Web Service
# 4. Connecter le repo GitHub
# 5. Déployer!
```

Voir [DEPLOY_RENDER.md](./DEPLOY_RENDER.md) pour les détails complets.

### Variables d'environnement

```env
# Requis
DATABASE_URL="file:./dev.db"  # ou chaîne PostgreSQL
NODE_ENV="production"
PORT="10000"

# Optionnel - Paiements réels
MONCASH_API_KEY="..."
MONCASH_SECRET="..."
NATCASH_API_KEY="..."
NATCASH_SECRET="..."

# Optionnel - Gemini AI
GEMINI_API_KEY="..."
```

## 🏗️ Architecture

```
mg-gestion/
├── src/
│   ├── components/        # React components
│   ├── data/             # Mock data
│   ├── types/            # TypeScript types
│   ├── utils/            # Auth, i18n
│   └── App.tsx
├── server.ts             # Express backend
├── prisma/
│   └── schema.prisma     # Database schema
├── scripts/
│   └── init-db.js        # Database seeding
├── dist/                 # Production build
├── render.yaml           # Render deployment config
└── package.json
```

## 🗄️ Base de données

**Modèles Prisma:**
- User (Buyer, Seller, Admin)
- Store (Boutiques)
- Product (Produits)
- Order (Commandes)
- OrderItem (Items de commande)
- Message (Chat)
- PaymentTransaction (Paiements)

SQLite pour développement, PostgreSQL recommandé pour production.

## 📡 API Principal

```
GET  /api/health              # Vérifier le statut
GET  /api/products            # Lister les produits
GET  /api/stores              # Lister les boutiques
GET  /api/orders              # Lister les commandes
POST /api/auth/login          # Se connecter
POST /api/auth/register       # S'inscrire

# Paiements
POST /api/payments/initiate   # Initier paiement
POST /api/payments/confirm    # Confirmer paiement
GET  /api/payments/:id        # Vérifier statut
```

Voir [API_PAYMENTS.md](./API_PAYMENTS.md) pour la documentation complète.

## 🧪 Tests

```bash
# Tests unitaires (si disponibles)
npm test

# Linting
npm run lint

# Type checking
npm run lint
```

## 📊 Métrique de performance

- Build time: ~1min 30s
- Frontend bundle: ~175KB gzip
- Backend: ~25KB
- Database: SQLite (dev) / PostgreSQL (prod)

## 🔐 Sécurité

- ✅ Validation des inputs
- ✅ Authentification basique (JWT ready)
- ✅ CORS configuré
- ✅ Middleware de sécurité
- ⚠️ À compléter: encryption des mots de passe

## 🤝 Support Paiements

### Actuellement supportés
- ✅ MonCash (API prête)
- ✅ NatCash (API prête)

### À venir
- Stripe
- PayPal
- Digicel Money (HAI)

## 📱 Endpoints Paiements

Voir [API_PAYMENTS.md](./API_PAYMENTS.md) pour:
- Initier un paiement
- Confirmer un paiement
- Vérifier le statut
- Gérer les remboursements
- Exemples d'utilisation

## 🛠️ Développement

```bash
# Installer dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Compiler TypeScript
npm run lint

# Build production
npm run build

# Démarrer la version production
npm start

# Nettoyer les builds
npm run clean
```

## 📦 Technologies

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: Prisma ORM, SQLite (dev) / PostgreSQL (prod)
- **Build**: Vite, esbuild
- **Deployment**: Render

## 📄 Licence

MIT

## 👨‍💻 Auteur

Créé pour Haiti marketplace - MG Gestion

---

**Besoin d'aide?**
- 📖 Lire les docs: [DEPLOY_RENDER.md](./DEPLOY_RENDER.md) | [API_PAYMENTS.md](./API_PAYMENTS.md)
- 🐛 Signaler un bug: Créer une issue GitHub
- 💬 Question? Vérifier les discussions GitHub
