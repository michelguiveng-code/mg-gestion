# 🚀 Mettre MG Gestion en ligne sur Render (Gratuit)

## ⚡ Résumé rapide (10 minutes)

```bash
# 1. Sur votre ordinateur
git init
git add .
git commit -m "Initial commit"

# 2. Sur GitHub: créer un repo et push
git remote add origin https://github.com/YOUR_USERNAME/mg-gestion.git
git branch -M main
git push -u origin main

# 3. Sur Render
# - Aller à https://dashboard.render.com
# - Cliquer "New" → "Web Service"
# - Connecter GitHub et déployer
# - ✅ App live sur https://mg-gestion.onrender.com
```

---

## 📖 Guide détaillé complet

### ÉTAPE 1: Préparation du code

#### 1.1 Vérifier les fichiers essentiels

```bash
cd c:\Users\User\Downloads\mg-gestion
ls -la  # Vérifier que ces fichiers existent:
# ✅ package.json
# ✅ server.ts
# ✅ prisma/schema.prisma
# ✅ render.yaml
# ✅ .gitignore
```

#### 1.2 Tester le build

```bash
npm run build
# ✅ Doit terminer sans erreurs
# ✅ Crée dist/index.html et dist/server.cjs
```

#### 1.3 Vérifier la base de données

```bash
npx prisma generate
npx prisma db push  # (optionnel, juste pour vérifier)
```

---

### ÉTAPE 2: Créer un compte GitHub (si nécessaire)

1. Allez sur https://github.com/signup
2. Créez un compte gratuit
3. Notez votre `username`

---

### ÉTAPE 3: Pousser le code sur GitHub

#### 3.1 Initialiser Git (si pas déjà fait)

```bash
cd c:\Users\User\Downloads\mg-gestion

# Initialiser Git
git init

# Configurer votre identité
git config user.name "Votre Nom"
git config user.email "votre@email.com"

# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "Initial commit - MG Gestion Platform"
```

#### 3.2 Créer un repo sur GitHub

1. Allez sur https://github.com/new
2. Remplissez:
   - **Repository name**: `mg-gestion`
   - **Description**: `Marketplace haïtien avec paiements MonCash/NatCash`
   - **Public** (recommandé pour Render gratuit)
3. Ne créez PAS de README (vous en avez un)
4. Cliquez "Create repository"

#### 3.3 Pousser votre code

```bash
# Ajouter le repo distant
git remote add origin https://github.com/YOUR_USERNAME/mg-gestion.git

# Renommer la branche (si nécessaire)
git branch -M main

# Pousser le code
git push -u origin main

# Vérifier: https://github.com/YOUR_USERNAME/mg-gestion
# Vous devez voir tous vos fichiers
```

---

### ÉTAPE 4: Créer un compte Render

1. Allez sur https://render.com
2. Cliquez "Get Started" ou "Sign Up"
3. Choisissez "Sign up with GitHub"
4. Autorisez Render à accéder à vos repos
5. ✅ Compte créé!

---

### ÉTAPE 5: Déployer sur Render

#### 5.1 Créer un nouveau Web Service

1. Aller sur https://dashboard.render.com
2. Cliquez le bouton **"New +"** (en haut à gauche)
3. Sélectionnez **"Web Service"**

#### 5.2 Connecter votre repo GitHub

1. Vous voyez "Connect repository"
2. Cherchez votre repo: `mg-gestion`
3. Cliquez "Connect"

#### 5.3 Configurer le déploiement

Remplissez les champs:

| Champ | Valeur |
|-------|--------|
| **Name** | `mg-gestion` |
| **Environment** | `Node` |
| **Region** | `Ohio` (ou autre) |
| **Branch** | `main` |
| **Build Command** | `npm install && npm run build && npx prisma migrate deploy` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

#### 5.4 Ajouter les variables d'environnement

1. Scrollez vers le bas → **"Environment"**
2. Cliquez **"Add Environment Variable"**
3. Ajoutez chaque ligne:

```
NODE_ENV = production
DATABASE_URL = file:./dev.db
PORT = 10000
```

**Notes:**
- `DATABASE_URL` avec `file:./dev.db` = SQLite (gratuit, données perdues au redéploiement)
- Pour persister: upgrade vers PostgreSQL ($7/mois)

#### 5.5 Déployer!

1. Bas de page → Cliquez **"Create Web Service"**
2. Render commence à déployer 🚀
3. Attendez ~3-5 minutes
4. Vous voyez un URL comme: `https://mg-gestion.onrender.com`

---

### ÉTAPE 6: Vérifier que ça fonctionne

Une fois déployé:

```bash
# Test 1: Health check
curl https://mg-gestion.onrender.com/api/health

# Expected response:
{
  "status": "ok",
  "service": "MG Gestion Core API",
  "usersCount": 2,
  "productsCount": 5,
  ...
}

# Test 2: Ouvrir dans le navigateur
https://mg-gestion.onrender.com
```

✅ **Si vous voyez l'app → Félicitations! C'est en ligne!** 🎉

---

### ÉTAPE 7: Configurer un domaine personnalisé (optionnel)

Si vous avez un domaine (ex: `megestion.com`):

1. Dans Render Dashboard → Votre service
2. Aller à **"Settings"** → **"Custom Domain"**
3. Entrer votre domaine
4. Aller chez votre registrar (GoDaddy, Namecheap, etc.)
5. Ajouter les DNS records indiqués par Render
6. Attendre 24h pour la propagation
7. ✅ `https://megestion.com` pointe vers votre app!

---

### ÉTAPE 8: Ajouter le domaine Google Chrome (optionnel)

**Option A: Domaine personnalisé**
```
https://megestion.com
```

**Option B: Domaine Render (gratuit)**
```
https://mg-gestion.onrender.com
```

Aucune action requise - les deux fonctionnent automatiquement! 🌐

---

## 📋 Troubleshooting

### ❌ "Build failed"

**Cause**: Erreur de compilation

**Solution**:
```bash
# Tester localement
npm install
npm run build

# Vérifier les erreurs TypeScript
npm run lint

# Commit et push après correction
git add .
git commit -m "Fix build errors"
git push origin main
# Render redéploiera automatiquement
```

### ❌ "Database error"

**Cause**: Migration Prisma échouée

**Solution**:
```bash
# Localement:
npx prisma migrate reset  # ⚠️ Supprime toutes les données!

# Puis push et redéployer
git add prisma/
git commit -m "Reset migrations"
git push origin main
```

### ❌ "503 Service Unavailable"

**Cause**: Service en démarrage ou crash

**Solution**:
1. Attendre 1-2 minutes
2. Rafraîchir la page
3. Vérifier les logs dans Render Dashboard

### ❌ "Can't access the app"

**Cause**: URL incorrecte

**Solution**:
- Vérifier l'URL dans Render Dashboard
- Attendre 5 min après le déploiement
- Vérifier que le plan n'est pas FREE (qui peut avoir du downtime)

---

## 🔄 Mise à jour du code (après déploiement)

Pour mettre à jour l'app en ligne:

```bash
# 1. Faire des changements localement
# 2. Tester: npm run dev
# 3. Commit et push

git add .
git commit -m "Ajouter nouvelle feature"
git push origin main

# 4. Render redéploie automatiquement! ✅
# (Attendez 2-5 min)
```

---

## 💡 Tips et bonnes pratiques

### Logs en temps réel
```
Dashboard Render → Votre service → "Logs"
```

### Redémarrer l'app
```
"Settings" → "Manual Deploy" → "Deploy latest commit"
```

### Ajouter un nom personnalisé
```
"Settings" → "Name" → Changer et sauvegarder
```

### Monitorer les performances
```
"Metrics" tab dans Render Dashboard
```

---

## 📱 Accéder depuis Android/iOS

Une fois déployé, l'app est accessible depuis n'importe quel appareil:

**Android:**
1. Ouvrir Chrome
2. Aller à `https://mg-gestion.onrender.com`
3. Option: Installer en tant qu'app (menu → "Install app")

**iPhone:**
1. Ouvrir Safari
2. Aller à `https://mg-gestion.onrender.com`
3. Partager → "Add to Home Screen"

---

## 🎯 Checklist avant production

- [ ] Code testé localement
- [ ] `.env.example` complété
- [ ] `render.yaml` configuré
- [ ] Variables d'environnement ajoutées dans Render
- [ ] Build fonctionne (`npm run build`)
- [ ] Database schema à jour (`npx prisma generate`)
- [ ] Code pushé sur GitHub
- [ ] Service déployé et accessible
- [ ] API `/api/health` répond
- [ ] App visible dans navigateur

---

## 🆘 Besoin d'aide?

### Documentation
- [Render Docs](https://render.com/docs)
- [Prisma + Render Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-render)
- [Express.js Docs](https://expressjs.com)

### GitHub Issues
Créer une issue dans votre repo avec les détails du problème

### Communautés
- Stack Overflow: tag `render` ou `prisma`
- GitHub Discussions

---

## 🎉 Succès!

Votre app est maintenant en ligne et accessible mondialement! 🌍

**URL**: `https://mg-gestion.onrender.com`

Partagez-la avec vos amis et commencez à vendre! 🛍️

Pour des questions, consultez:
- [API_PAYMENTS.md](./API_PAYMENTS.md) - Intégrer les paiements
- [README.md](./README.md) - Architecture et features
- [DEPLOY_RENDER.md](./DEPLOY_RENDER.md) - Infos avancées
