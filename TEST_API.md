# Guide de Test API - Fundee Backend

Ce guide contient des commandes curl pour tester tous les endpoints de l'API.

## 🚀 Prérequis

1. Démarrer le serveur :
```bash
cd backend
pnpm dev
```

2. Initialiser la base de données (si pas encore fait) :
```bash
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

---

## 1️⃣ Authentification Utilisateur

### Inscription d'un nouvel utilisateur
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "password123",
    "firstName": "Marie",
    "lastName": "Martin",
    "phone": "+33612345678"
  }'
```

### Connexion utilisateur (compte de test)
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "password123"
  }'
```

**⚠️ Important : Copiez le `accessToken` de la réponse pour les requêtes suivantes !**

### Rafraîchir le token
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "VOTRE_REFRESH_TOKEN"
  }'
```

---

## 2️⃣ Produits & Catégories (Public)

### Lister toutes les catégories
```bash
curl http://localhost:3000/api/v1/categories
```

### Lister tous les produits
```bash
curl http://localhost:3000/api/v1/products
```

### Lister les produits avec filtres
```bash
# Par catégorie
curl "http://localhost:3000/api/v1/products?categoryId=CATEGORY_ID"

# Par prix
curl "http://localhost:3000/api/v1/products?minPrice=10&maxPrice=100"

# Recherche
curl "http://localhost:3000/api/v1/products?search=smartphone"

# Tri par prix croissant
curl "http://localhost:3000/api/v1/products?sortBy=price_asc"

# Tri par prix décroissant
curl "http://localhost:3000/api/v1/products?sortBy=price_desc"

# Tri par popularité
curl "http://localhost:3000/api/v1/products?sortBy=popular"

# Pagination
curl "http://localhost:3000/api/v1/products?page=1&limit=10"

# Combinaison de filtres
curl "http://localhost:3000/api/v1/products?search=phone&sortBy=price_asc&minPrice=50&maxPrice=1000&page=1&limit=20"
```

### Détails d'un produit
```bash
curl http://localhost:3000/api/v1/products/PRODUCT_ID
```

---

## 3️⃣ Profil Utilisateur (Protégé)

**⚠️ Remplacez `YOUR_ACCESS_TOKEN` par le token obtenu lors de la connexion**

### Obtenir le profil
```bash
curl http://localhost:3000/api/v1/user/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Modifier le profil
```bash
curl -X PUT http://localhost:3000/api/v1/user/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "phone": "+33698765432",
    "notificationsEnabled": true
  }'
```

---

## 4️⃣ Panier (Protégé)

### Voir le panier
```bash
curl http://localhost:3000/api/v1/cart \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Ajouter un produit au panier
```bash
curl -X POST http://localhost:3000/api/v1/cart/items \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PRODUCT_ID",
    "quantity": 2
  }'
```

### Modifier la quantité d'un article
```bash
curl -X PUT http://localhost:3000/api/v1/cart/items/CART_ITEM_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 5
  }'
```

### Retirer un article du panier
```bash
curl -X DELETE http://localhost:3000/api/v1/cart/items/CART_ITEM_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Vider le panier
```bash
curl -X DELETE http://localhost:3000/api/v1/cart \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 5️⃣ Favoris (Protégé)

### Voir les favoris
```bash
curl http://localhost:3000/api/v1/favorites \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Ajouter aux favoris
```bash
curl -X POST http://localhost:3000/api/v1/favorites \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PRODUCT_ID"
  }'
```

### Retirer des favoris
```bash
curl -X DELETE http://localhost:3000/api/v1/favorites/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 6️⃣ Commandes (Protégé)

### Créer une commande
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": "123 Rue de Paris, 75001 Paris",
    "shippingPhone": "+33612345678",
    "notes": "Livraison entre 14h et 18h"
  }'
```

### Voir l'historique des commandes
```bash
curl http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Détails d'une commande
```bash
curl http://localhost:3000/api/v1/orders/ORDER_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 7️⃣ Avis (Protégé)

### Soumettre un avis
```bash
curl -X POST http://localhost:3000/api/v1/reviews \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PRODUCT_ID",
    "rating": 5,
    "comment": "Excellent produit, très satisfait !"
  }'
```

### Modifier un avis
```bash
curl -X PUT http://localhost:3000/api/v1/reviews/REVIEW_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4,
    "comment": "Bon produit mais un peu cher"
  }'
```

### Supprimer un avis
```bash
curl -X DELETE http://localhost:3000/api/v1/reviews/REVIEW_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 8️⃣ Notifications (Protégé)

### Voir les notifications
```bash
curl http://localhost:3000/api/v1/notifications \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Voir uniquement les non lues
```bash
curl "http://localhost:3000/api/v1/notifications?unreadOnly=true" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Marquer comme lu
```bash
curl -X PUT http://localhost:3000/api/v1/notifications/NOTIFICATION_ID/read \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 9️⃣ Authentification Entreprise

### Inscription entreprise
```bash
curl -X POST http://localhost:3000/api/v1/business/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newbusiness@test.com",
    "password": "password123",
    "name": "Ma Super Entreprise",
    "description": "Description de mon entreprise",
    "phone": "+33612345678",
    "address": "123 Avenue du Commerce, Paris"
  }'
```

### Connexion entreprise (compte de test)
```bash
curl -X POST http://localhost:3000/api/v1/business/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "business1@test.com",
    "password": "password123"
  }'
```

**⚠️ Important : Copiez le `accessToken` pour les requêtes business suivantes !**

---

## 🔟 Dashboard Entreprise (Protégé - Role BUSINESS)

**⚠️ Remplacez `BUSINESS_ACCESS_TOKEN` par le token obtenu lors de la connexion entreprise**

### Vue d'ensemble du dashboard
```bash
curl http://localhost:3000/api/v1/business/dashboard \
  -H "Authorization: Bearer BUSINESS_ACCESS_TOKEN"
```

---

## 1️⃣1️⃣ Gestion des Produits (Business)

### Lister mes produits
```bash
curl http://localhost:3000/api/v1/business/products \
  -H "Authorization: Bearer BUSINESS_ACCESS_TOKEN"
```

### Créer un produit
```bash
curl -X POST http://localhost:3000/api/v1/business/products \
  -H "Authorization: Bearer BUSINESS_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nouveau Produit",
    "description": "Description du produit",
    "price": 99.99,
    "compareAtPrice": 149.99,
    "stock": 50,
    "categoryId": "CATEGORY_ID",
    "images": ["/uploads/product1.jpg"]
  }'
```

### Détails d'un produit
```bash
curl http://localhost:3000/api/v1/business/products/PRODUCT_ID \
  -H "Authorization: Bearer BUSINESS_ACCESS_TOKEN"
```

### Modifier un produit
```bash
curl -X PUT http://localhost:3000/api/v1/business/products/PRODUCT_ID \
  -H "Authorization: Bearer BUSINESS_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Produit Modifié",
    "price": 89.99,
    "stock": 100,
    "isActive": true
  }'
```

### Supprimer un produit
```bash
curl -X DELETE http://localhost:3000/api/v1/business/products/PRODUCT_ID \
  -H "Authorization: Bearer BUSINESS_ACCESS_TOKEN"
```

---

## 1️⃣2️⃣ Gestion des Promotions (Business)

### Lister mes promotions
```bash
curl http://localhost:3000/api/v1/business/promotions \
  -H "Authorization: Bearer BUSINESS_ACCESS_TOKEN"
```

### Créer une promotion
```bash
curl -X POST http://localhost:3000/api/v1/business/promotions \
  -H "Authorization: Bearer BUSINESS_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Promo Flash -30%",
    "description": "Réduction exceptionnelle",
    "discountPercent": 30,
    "startDate": "2026-01-12T00:00:00Z",
    "endDate": "2026-02-12T23:59:59Z",
    "productIds": ["PRODUCT_ID_1", "PRODUCT_ID_2"]
  }'
```

### Modifier une promotion
```bash
curl -X PUT http://localhost:3000/api/v1/business/promotions/PROMOTION_ID \
  -H "Authorization: Bearer BUSINESS_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Promo Modifiée",
    "discountPercent": 40,
    "isActive": true
  }'
```

### Supprimer une promotion
```bash
curl -X DELETE http://localhost:3000/api/v1/business/promotions/PROMOTION_ID \
  -H "Authorization: Bearer BUSINESS_ACCESS_TOKEN"
```

---

## 1️⃣3️⃣ Analytics (Business)

### Statistiques de ventes
```bash
# Derniers 30 jours (par défaut)
curl http://localhost:3000/api/v1/business/analytics/sales \
  -H "Authorization: Bearer BUSINESS_ACCESS_TOKEN"

# Derniers 7 jours
curl "http://localhost:3000/api/v1/business/analytics/sales?period=7" \
  -H "Authorization: Bearer BUSINESS_ACCESS_TOKEN"

# Derniers 90 jours
curl "http://localhost:3000/api/v1/business/analytics/sales?period=90" \
  -H "Authorization: Bearer BUSINESS_ACCESS_TOKEN"
```

### Performance des produits
```bash
curl http://localhost:3000/api/v1/business/analytics/products \
  -H "Authorization: Bearer BUSINESS_ACCESS_TOKEN"
```

---

## 1️⃣4️⃣ Notifications Business

### Envoyer une notification à tous les utilisateurs
```bash
curl -X POST http://localhost:3000/api/v1/business/notifications \
  -H "Authorization: Bearer BUSINESS_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nouvelle Promotion !",
    "message": "Profitez de -30% sur tous nos produits",
    "type": "PROMOTION",
    "link": "/promotions/123"
  }'
```

### Envoyer une notification ciblée
```bash
curl -X POST http://localhost:3000/api/v1/business/notifications \
  -H "Authorization: Bearer BUSINESS_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Commande expédiée",
    "message": "Votre commande a été expédiée",
    "type": "ORDER_UPDATE",
    "userIds": ["USER_ID_1", "USER_ID_2"]
  }'
```

### Voir l'historique des notifications
```bash
curl http://localhost:3000/api/v1/business/notifications \
  -H "Authorization: Bearer BUSINESS_ACCESS_TOKEN"
```

---

## 🧪 Scénario de Test Complet

Voici un scénario complet pour tester le flux utilisateur :

```bash
# 1. Connexion utilisateur
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}' \
  | jq -r '.data.accessToken')

echo "Token: $TOKEN"

# 2. Voir les produits
curl -s http://localhost:3000/api/v1/products | jq

# 3. Récupérer l'ID du premier produit
PRODUCT_ID=$(curl -s http://localhost:3000/api/v1/products | jq -r '.data.products[0].id')
echo "Product ID: $PRODUCT_ID"

# 4. Ajouter au panier
curl -s -X POST http://localhost:3000/api/v1/cart/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"productId\":\"$PRODUCT_ID\",\"quantity\":2}" | jq

# 5. Voir le panier
curl -s http://localhost:3000/api/v1/cart \
  -H "Authorization: Bearer $TOKEN" | jq

# 6. Créer une commande
curl -s -X POST http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": "123 Rue Test, Paris",
    "shippingPhone": "+33612345678"
  }' | jq

# 7. Voir les commandes
curl -s http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 📝 Notes

- Toutes les réponses sont au format JSON
- Les routes protégées nécessitent le header `Authorization: Bearer <token>`
- Les tokens expirent après 15 minutes (access) et 7 jours (refresh)
- Utilisez `jq` pour formater les réponses JSON (optionnel mais recommandé)
- Remplacez les IDs (PRODUCT_ID, ORDER_ID, etc.) par les vrais IDs de votre base de données

---

## 🐛 Dépannage

### Erreur 401 Unauthorized
- Vérifiez que le token est valide et non expiré
- Assurez-vous d'inclure le header Authorization

### Erreur 404 Not Found
- Vérifiez que l'ID existe dans la base de données
- Vérifiez l'URL de l'endpoint

### Erreur 400 Bad Request
- Vérifiez le format JSON de votre requête
- Vérifiez que tous les champs requis sont présents

### Le serveur ne répond pas
- Vérifiez que le serveur est démarré (`pnpm dev`)
- Vérifiez que PostgreSQL est en cours d'exécution
- Vérifiez les logs du serveur
