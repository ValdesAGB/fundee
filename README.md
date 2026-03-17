# Backend API - Fundee

API backend pour l'application mobile de commerce promotionnel.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 20+
- PostgreSQL
- pnpm

### Installation

1. Installer les dépendances :
```bash
pnpm install
```

2. Configurer les variables d'environnement :
```bash
cp .env.example .env
# Modifier .env avec vos paramètres PostgreSQL
```

3. Initialiser la base de données :
```bash
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

4. Lancer le serveur de développement :
```bash
pnpm dev
```

L'API sera accessible sur `http://localhost:3000`

## 📚 Documentation API

### Authentification

#### Utilisateurs
- `POST /api/v1/auth/register` - Inscription utilisateur
- `POST /api/v1/auth/login` - Connexion utilisateur
- `POST /api/v1/auth/refresh` - Rafraîchir le token

#### Entreprises
- `POST /api/v1/business/auth/register` - Inscription entreprise
- `POST /api/v1/business/auth/login` - Connexion entreprise

### API Publique (Mobile)

#### Produits
- `GET /api/v1/products` - Liste des produits (avec filtres)
- `GET /api/v1/products/:id` - Détails d'un produit

#### Catégories
- `GET /api/v1/categories` - Liste des catégories

#### Profil Utilisateur (Authentifié)
- `GET /api/v1/user/profile` - Obtenir le profil
- `PUT /api/v1/user/profile` - Modifier le profil

#### Panier (Authentifié)
- `GET /api/v1/cart` - Obtenir le panier
- `POST /api/v1/cart/items` - Ajouter au panier
- `PUT /api/v1/cart/items/:id` - Modifier quantité
- `DELETE /api/v1/cart/items/:id` - Retirer du panier
- `DELETE /api/v1/cart` - Vider le panier

#### Favoris (Authentifié)
- `GET /api/v1/favorites` - Liste des favoris
- `POST /api/v1/favorites` - Ajouter aux favoris
- `DELETE /api/v1/favorites/:productId` - Retirer des favoris

#### Commandes (Authentifié)
- `GET /api/v1/orders` - Historique des commandes
- `POST /api/v1/orders` - Créer une commande
- `GET /api/v1/orders/:id` - Détails d'une commande

#### Avis (Authentifié)
- `POST /api/v1/reviews` - Soumettre un avis
- `PUT /api/v1/reviews/:id` - Modifier un avis
- `DELETE /api/v1/reviews/:id` - Supprimer un avis

#### Notifications (Authentifié)
- `GET /api/v1/notifications` - Liste des notifications
- `PUT /api/v1/notifications/:id/read` - Marquer comme lu

### API Privée (Dashboard Entreprise)

#### Dashboard
- `GET /api/v1/business/dashboard` - Vue d'ensemble

#### Produits
- `GET /api/v1/business/products` - Liste des produits
- `POST /api/v1/business/products` - Créer un produit
- `GET /api/v1/business/products/:id` - Détails produit
- `PUT /api/v1/business/products/:id` - Modifier produit
- `DELETE /api/v1/business/products/:id` - Supprimer produit

#### Promotions
- `GET /api/v1/business/promotions` - Liste des promotions
- `POST /api/v1/business/promotions` - Créer une promotion
- `PUT /api/v1/business/promotions/:id` - Modifier promotion
- `DELETE /api/v1/business/promotions/:id` - Supprimer promotion

#### Analytics
- `GET /api/v1/business/analytics/sales` - Statistiques de ventes
- `GET /api/v1/business/analytics/products` - Performance produits

#### Notifications
- `POST /api/v1/business/notifications` - Envoyer notification
- `GET /api/v1/business/notifications` - Historique

## 🔐 Authentification

Toutes les routes protégées nécessitent un header Authorization :
```
Authorization: Bearer <access_token>
```

## 🧪 Comptes de test

Après avoir exécuté `pnpm prisma:seed` :

- **Utilisateur** : `user@test.com` / `password123`
- **Entreprise 1** : `business1@test.com` / `password123`
- **Entreprise 2** : `business2@test.com` / `password123`

## 🛠️ Scripts disponibles

- `pnpm dev` - Lancer le serveur de développement
- `pnpm build` - Build de production
- `pnpm start` - Lancer le serveur de production
- `pnpm prisma:generate` - Générer le client Prisma
- `pnpm prisma:migrate` - Exécuter les migrations
- `pnpm prisma:seed` - Peupler la base de données
- `pnpm prisma:studio` - Ouvrir Prisma Studio

## 📁 Structure

```
backend/
├── app/
│   └── api/v1/          # Routes API
├── lib/                 # Utilitaires
│   ├── db.ts           # Client Prisma
│   ├── auth.ts         # Authentification
│   ├── middleware.ts   # Middlewares
│   ├── validation.ts   # Schémas Zod
│   └── errors.ts       # Gestion erreurs
├── prisma/
│   ├── schema.prisma   # Schéma DB
│   └── seed.ts         # Données de test
└── public/uploads/     # Stockage local images
```

## 🔧 Technologies

- **Next.js 16** - Framework React avec App Router
- **Prisma** - ORM pour PostgreSQL
- **JWT** - Authentification
- **Zod** - Validation des données
- **bcryptjs** - Hashage des mots de passe
