# Accès Réseau au Backend

Le backend est accessible sur le réseau local à l'adresse : **`192.168.100.9:3000`**

## 🌐 Configuration

L'API est configurée pour être accessible depuis :
- **Localhost** : `http://localhost:3000`
- **Réseau local** : `http://192.168.100.9:3000`

## 📱 Connexion depuis l'application mobile

Pour connecter votre application Flutter au backend, utilisez l'URL :

```dart
const String API_BASE_URL = 'http://192.168.100.9:3000';
```

## 🧪 Test depuis un autre appareil

### Depuis un smartphone sur le même réseau WiFi

```bash
# Test de connexion
curl http://192.168.100.9:3000/api/v1/categories

# Login utilisateur
curl -X POST http://192.168.100.9:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}'
```

### Depuis un navigateur

Ouvrez simplement : `http://192.168.100.9:3000/api/v1/products`

## 🔧 Démarrage du serveur

Pour que le serveur soit accessible sur le réseau, démarrez-le avec :

```bash
cd backend
pnpm dev
```

Next.js écoute automatiquement sur toutes les interfaces réseau (0.0.0.0).

## 🔒 Sécurité

⚠️ **Important** : Cette configuration est pour le développement uniquement.

Pour la production :
1. Utilisez HTTPS
2. Configurez un pare-feu
3. Utilisez des variables d'environnement sécurisées
4. Activez CORS uniquement pour les domaines autorisés

## 🛠️ Configuration CORS (si nécessaire)

Si vous rencontrez des erreurs CORS depuis l'application mobile, ajoutez dans `next.config.ts` :

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};
```

## 📍 Endpoints disponibles

Tous les endpoints de l'API sont accessibles via `http://192.168.100.9:3000/api/v1/...`

Consultez [TEST_API.md](./TEST_API.md) pour la liste complète des endpoints.

## 🔍 Vérification

Pour vérifier que le serveur est accessible :

```bash
# Depuis la machine serveur
curl http://192.168.100.9:3000/api/v1/categories

# Depuis un autre appareil sur le réseau
curl http://192.168.100.9:3000/api/v1/categories
```

## 📱 Configuration Flutter

Dans votre application Flutter, créez un fichier de configuration :

```dart
// lib/config/api_config.dart
class ApiConfig {
  static const String baseUrl = 'http://192.168.100.9:3000';
  static const String apiVersion = 'v1';
  
  static String get apiBaseUrl => '$baseUrl/api/$apiVersion';
  
  // Endpoints
  static String get authLogin => '$apiBaseUrl/auth/login';
  static String get authRegister => '$apiBaseUrl/auth/register';
  static String get products => '$apiBaseUrl/products';
  static String get categories => '$apiBaseUrl/categories';
  // ... autres endpoints
}
```

## 🚨 Dépannage

### Le serveur n'est pas accessible depuis un autre appareil

1. Vérifiez que le serveur est démarré : `pnpm dev`
2. Vérifiez le pare-feu : `sudo ufw allow 3000`
3. Vérifiez que les appareils sont sur le même réseau WiFi
4. Testez avec `ping 192.168.100.9`

### Erreur de connexion depuis Flutter

1. Vérifiez que l'URL est correcte dans votre code
2. Sur Android, ajoutez dans `AndroidManifest.xml` :
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   <application android:usesCleartextTraffic="true">
   ```
3. Sur iOS, configurez `Info.plist` pour autoriser HTTP

---

**URL du backend** : `http://192.168.100.9:3000`
