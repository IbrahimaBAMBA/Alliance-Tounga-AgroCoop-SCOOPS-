# Alliance Tounga AgroCoop - Site Web

Site vitrine institutionnel mobile-first pour la coopérative agricole ivoirienne. Ce projet utilise un script de compilation Node.js ultra-léger pour gérer les templates et optimiser les images.

## Structure

/
├── src/                # Code source du site
│   ├── components/     # Fragments réutilisables (nav.html, footer.html)
│   ├── assets/         # Images originales (Jpg, Png)
│   ├── css/            # Styles Vanilla CSS
│   ├── js/             # Scripts Vanilla JS
│   └── *.html          # Pages HTML avec tags d'injection
├── dist/               # Dossier généré, prêt pour la production (NE PAS MODIFIER MANUELLEMENT)
├── build.js            # Script de compilation Node.js
└── package.json        # Dépendances (sharp)

## Développement & Build

1. Installez Node.js sur votre machine.
2. Installez les dépendances locales :
   ```bash
   npm install
   ```
3. Pour compiler le site (injection du HTML et conversion des assets en WebP) :
   ```bash
   npm run build
   # (Ou utilisez `node build.js`)
   ```
4. Le dossier `dist/` est mis à jour ! Utilisez un serveur local (`npx serve dist`) pour tester.

## Performance

- **Images** : Automatiquement converties en WebP via `sharp`.
- **Budget** : < 50KB CSS, < 10KB JS.
- **Chargement** : Extrêmement rapide sur 3G rural (Côte d'Ivoire).

## Déploiement

### Option 1 : Netlify (Recommandé)
1. Poussez le code sur GitHub.
2. Connectez le dépôt à Netlify.
3. Spécifiez la commande de build : `npm install && npm run build` (déjà configuré si vous pointez "Build command").
4. Dossier de publication (Publish directory) : `dist`

### Option 2 : Déploiement Manuel
1. Exécutez `npm run build` sur votre machine.
2. Uploadez UNIQUEMENT le contenu du dossier `dist/` sur votre hébergeur (FTP / cPanel).
