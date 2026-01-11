#!/bin/bash

APP_DIR="/home/ubuntu/apps/flex_tournaments"
PUBLIC_DIR="$APP_DIR/public"
LOCK_FILE="$PUBLIC_DIR/MAINTENANCE_LOCK"
PM2_APP="next"  # ← Remplacez par le nom de votre app PM2

echo "🔄 Début du déploiement..."

# 1. Créer lock (affiche maintenance)
mkdir -p "$PUBLIC_DIR"
touch "$LOCK_FILE"
echo "🔒 Mode maintenance activé"

# 2. Arrêter avec PM2
echo "⏹️  Arrêt de l'app PM2..."
pm2 stop tournaments 2>/dev/null || true
sleep 2

# 3. Pull et build
cd "$APP_DIR"
echo "📥 Git pull..."
git pull origin main

echo "🧹 Nettoyage..."
rm -rf .next node_modules

echo "📦 Installation des dépendances..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation"
    rm "$LOCK_FILE"
    pm2 restart tournaments
    exit 1
fi

echo "🔨 Build en cours... (peut prendre quelques minutes)"
NODE_OPTIONS="--max-old-space-size=4096" npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    rm "$LOCK_FILE"
    pm2 restart tournaments
    exit 1
fi

echo "✅ Build terminé avec succès"

# 4. Vérifier que le .next est créé
if [ ! -d "$APP_DIR/.next" ]; then
    echo "❌ Le dossier .next n'existe pas après le build"
    rm "$LOCK_FILE"
    pm2 restart tournaments
    exit 1
fi

# 5. Supprimer lock et redémarrer
rm "$LOCK_FILE"
echo "🔓 Mode maintenance désactivé"

# 6. Redémarrer avec PM2
echo "🚀 Redémarrage de l'app..."
pm2 restart tournaments
sleep 3

echo "✅ Déploiement complété avec succès!"
pm2 logs tournaments --lines 20
