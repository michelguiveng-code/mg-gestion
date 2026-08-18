# Déploiement sur Render (Gratuit)

## Prérequis
- Compte GitHub avec ce repo pushé
- Compte Render.com (gratuit)

## Étapes de déploiement

### 1. Pousser le code sur GitHub
```bash
git init
git add .
git commit -m "Initial commit - MG Gestion"
git remote add origin https://github.com/YOUR_USERNAME/mg-gestion.git
git push -u origin main
```

### 2. Créer un service Render
1. Allez sur https://dashboard.render.com
2. Cliquez "New" → "Web Service"
3. Connectez votre repo GitHub
4. Configurez :
   - **Name**: mg-gestion
   - **Environment**: Node
   - **Region**: Ohio (gratuit)
   - **Plan**: Free
   - **Build Command**: `npm install && npm run build && npx prisma migrate deploy`
   - **Start Command**: `npm start`

### 3. Variables d'environnement
Allez dans "Environment" et ajoutez :
```
NODE_ENV=production
DATABASE_URL=file:./dev.db
PORT=10000
```

### 4. Optionnel - Ajouter domaine personnalisé
- Dans Render, allez à "Settings" → "Custom Domain"
- Pointez votre domaine vers Render

## Notes importantes

⚠️ **Base de données SQLite gratuite**:
- La base de données SQLite est locale au conteneur
- Elle réinitialise chaque redéploiement
- Pour la persistance, upgrader vers PostgreSQL ($7/mois)

✅ **Limits du plan gratuit**:
- 750 heures/mois (suffisant pour usage continu)
- Auto-sleep après 15 min d'inactivité
- 512MB RAM, 0.5 CPU

## Accès après déploiement
Votre app sera disponible à : `https://mg-gestion.onrender.com`

## Commandes utiles
```bash
# Voir les logs
render logs

# Redéployer
git push origin main  # Déclenche auto-redéploiement

# Accéder à la base de données en production
render exec -- sqlite3 dev.db
```

## Migration vers PostgreSQL (payant)
Si vous voulez persister les données :
1. Dans Render, créer un nouveau PostgreSQL service ($7/mois)
2. Mettre à jour `DATABASE_URL` avec la chaîne PostgreSQL
3. Changer le provider dans `prisma/schema.prisma` :
```prisma
datasource db {
  provider = "postgresql"
  url = env("DATABASE_URL")
}
```
4. Pousser et redéployer

## Support
- Docs Render: https://render.com/docs
- Prisma + Render: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-render
