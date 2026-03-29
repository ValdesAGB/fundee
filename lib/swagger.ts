// ─── Minimal OpenAPI 3.0 types (no external dependency) ───────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SchemaObject = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResponseObject = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PathsObject = Record<string, any>;

// ─── Reusable schemas ──────────────────────────────────────────────────────────
const schemas: Record<string, SchemaObject> = {
    // ── Auth ──────────────────────────────────────────────────────────────────
    SignInRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', minLength: 8, example: 'Secret1234' },
        },
    },
    SignUpRequest: {
        type: 'object',
        required: ['email', 'password', 'name'],
        properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', minLength: 8, example: 'Secret1234' },
            name: { type: 'string', example: 'Jean Dupont' },
            firstName: { type: 'string', example: 'Jean' },
            lastName: { type: 'string', example: 'Dupont' },
            phone: { type: 'string', example: '+33612345678' },
        },
    },
    AuthResponse: {
        type: 'object',
        properties: {
            token: { type: 'string', description: 'Bearer token (7 jours)' },
            user: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    name: { type: 'string' },
                    image: { type: 'string', nullable: true },
                    role: { type: 'string', enum: ['USER', 'ADMIN'] },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },
        },
    },

    // ── Business Auth ─────────────────────────────────────────────────────────
    BusinessLoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', format: 'email', example: 'shop@example.com' },
            password: { type: 'string', example: 'Secret1234' },
        },
    },
    BusinessRegisterRequest: {
        type: 'object',
        required: ['email', 'password', 'name'],
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            name: { type: 'string', example: 'Ma Boutique' },
            description: { type: 'string' },
            phone: { type: 'string' },
            address: { type: 'string' },
        },
    },
    BusinessAuthResponse: {
        type: 'object',
        properties: {
            token: { type: 'string', description: 'JWT Business (pas d\'expiration fixe)' },
            business: { $ref: '#/components/schemas/Business' },
        },
    },
    ForgetPasswordRequest: {
        type: 'object',
        required: ['email'],
        properties: {
            email: { type: 'string', format: 'email', example: 'shop@example.com' },
        },
    },
    ResetPasswordRequest: {
        type: 'object',
        required: ['token', 'password'],
        properties: {
            token: { type: 'string', minLength: 1 },
            password: { type: 'string', minLength: 8 },
        },
    },
    Business: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            logo: { type: 'string', nullable: true },
            phone: { type: 'string', nullable: true },
            address: { type: 'string', nullable: true },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
        },
    },

    // ── Products ──────────────────────────────────────────────────────────────
    Product: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string', nullable: true },
            price: { type: 'number', format: 'float' },
            compareAtPrice: { type: 'number', nullable: true },
            stock: { type: 'integer' },
            images: { type: 'array', items: { type: 'string' } },
            isActive: { type: 'boolean' },
            categoryId: { type: 'string' },
            category: { $ref: '#/components/schemas/Category' },
            avgRating: { type: 'number', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
        },
    },
    CreateProductRequest: {
        type: 'object',
        required: ['name', 'price', 'categoryId'],
        properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number', minimum: 0.01 },
            compareAtPrice: { type: 'number', minimum: 0.01 },
            stock: { type: 'integer', minimum: 0, default: 0 },
            categoryId: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
        },
    },
    UpdateProductRequest: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number', minimum: 0.01 },
            compareAtPrice: { type: 'number' },
            stock: { type: 'integer', minimum: 0 },
            categoryId: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            isActive: { type: 'boolean' },
        },
    },

    // ── Categories ────────────────────────────────────────────────────────────
    Category: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            icon: { type: 'string', nullable: true },
        },
    },
    CreateCategoryRequest: {
        type: 'object',
        required: ['name'],
        properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            icon: { type: 'string' },
        },
    },

    // ── Cart ──────────────────────────────────────────────────────────────────
    CartItem: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            quantity: { type: 'integer' },
            productId: { type: 'string' },
            product: { $ref: '#/components/schemas/Product' },
        },
    },
    AddToCartRequest: {
        type: 'object',
        required: ['productId'],
        properties: {
            productId: { type: 'string' },
            quantity: { type: 'integer', minimum: 1, default: 1 },
        },
    },
    UpdateCartItemRequest: {
        type: 'object',
        required: ['quantity'],
        properties: {
            quantity: { type: 'integer', minimum: 1 },
        },
    },

    // ── Orders ────────────────────────────────────────────────────────────────
    Order: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            orderNumber: { type: 'string' },
            status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] },
            subtotal: { type: 'number' },
            tax: { type: 'number' },
            total: { type: 'number' },
            shippingAddress: { type: 'string' },
            shippingPhone: { type: 'string' },
            notes: { type: 'string', nullable: true },
            items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
            createdAt: { type: 'string', format: 'date-time' },
        },
    },
    OrderItem: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            quantity: { type: 'integer' },
            price: { type: 'number', description: 'Prix au moment de la commande' },
            productId: { type: 'string' },
            product: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, images: { type: 'array', items: { type: 'string' } } } },
        },
    },
    CreateOrderRequest: {
        type: 'object',
        required: ['shippingAddress', 'shippingPhone'],
        properties: {
            shippingAddress: { type: 'string' },
            shippingPhone: { type: 'string' },
            notes: { type: 'string' },
        },
    },

    // ── Reviews ───────────────────────────────────────────────────────────────
    Review: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            comment: { type: 'string', nullable: true },
            productId: { type: 'string' },
            user: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    image: { type: 'string', nullable: true },
                },
            },
            createdAt: { type: 'string', format: 'date-time' },
        },
    },
    CreateReviewRequest: {
        type: 'object',
        required: ['productId', 'rating'],
        properties: {
            productId: { type: 'string' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            comment: { type: 'string' },
        },
    },

    // ── Notifications ─────────────────────────────────────────────────────────
    Notification: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            message: { type: 'string' },
            type: { type: 'string', enum: ['PROMOTION', 'ORDER_UPDATE', 'GENERAL'] },
            isRead: { type: 'boolean' },
            link: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
        },
    },
    CreateNotificationRequest: {
        type: 'object',
        required: ['title', 'message'],
        properties: {
            title: { type: 'string' },
            message: { type: 'string' },
            type: { type: 'string', enum: ['PROMOTION', 'ORDER_UPDATE', 'GENERAL'], default: 'GENERAL' },
            link: { type: 'string' },
            userIds: { type: 'array', items: { type: 'string' }, description: 'Si vide, envoi à tous les utilisateurs' },
        },
    },

    // ── Promotions ────────────────────────────────────────────────────────────
    Promotion: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            discountPercent: { type: 'number', nullable: true },
            discountAmount: { type: 'number', nullable: true },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            isActive: { type: 'boolean' },
            products: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
        },
    },
    CreatePromotionRequest: {
        type: 'object',
        required: ['title', 'startDate', 'endDate', 'productIds'],
        properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            discountPercent: { type: 'number', exclusiveMinimum: 0, maximum: 100, description: 'Doit être > 0' },
            discountAmount: { type: 'number', minimum: 0.01 },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            productIds: { type: 'array', items: { type: 'string' }, minItems: 1 },
        },
    },

    // ── User Profile ──────────────────────────────────────────────────────────
    UserProfile: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            firstName: { type: 'string', nullable: true },
            lastName: { type: 'string', nullable: true },
            phone: { type: 'string', nullable: true },
            image: { type: 'string', nullable: true },
            role: { type: 'string', enum: ['USER', 'ADMIN'] },
            notificationsEnabled: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
        },
    },
    UpdateProfileRequest: {
        type: 'object',
        properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
            image: { type: 'string', format: 'uri' },
            notificationsEnabled: { type: 'boolean' },
        },
    },

    // ── Analytics ─────────────────────────────────────────────────────────────
    SalesAnalytics: {
        type: 'object',
        properties: {
            period: { type: 'integer', description: 'Nombre de jours analysés' },
            totalRevenue: { type: 'number' },
            totalOrders: { type: 'integer' },
            avgOrderValue: { type: 'number' },
            ordersByStatus: {
                type: 'object',
                additionalProperties: { type: 'integer' },
                example: { PENDING: 3, DELIVERED: 12, CANCELLED: 1 },
            },
            dailyRevenue: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        date: { type: 'string', format: 'date' },
                        revenue: { type: 'number' },
                        orders: { type: 'integer' },
                    },
                },
            },
        },
    },

    // ── Generic responses ─────────────────────────────────────────────────────
    SuccessResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
        },
    },
    ErrorResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
            message: { type: 'string' },
        },
    },
    PaginatedProducts: {
        type: 'object',
        properties: {
            products: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
            total: { type: 'integer' },
            page: { type: 'integer' },
            totalPages: { type: 'integer' },
        },
    },
};

// ─── Security schemes ─────────────────────────────────────────────────────────
const securitySchemes: Record<string, SchemaObject> = {
    BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token better-auth (utilisateurs). Obtenez-le via `POST /api/auth/sign-in/email`.',
    },
    BusinessBearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Business. Obtenez-le via `POST /api/v1/business/auth/login`.',
    },
};

// ─── Helper: standard responses ───────────────────────────────────────────────
const std = {
    /** 200 with a data payload */
    ok: (description: string, schema?: SchemaObject): ResponseObject => ({
        description,
        content: {
            'application/json': {
                schema: {
                    allOf: [
                        { $ref: '#/components/schemas/SuccessResponse' },
                        schema ? { properties: { data: schema } } : {},
                    ],
                },
            },
        },
    }),
    /** 201 created */
    created: (description: string, schema?: SchemaObject): ResponseObject => ({
        description,
        content: {
            'application/json': {
                schema: {
                    allOf: [
                        { $ref: '#/components/schemas/SuccessResponse' },
                        schema ? { properties: { data: schema } } : {},
                    ],
                },
            },
        },
    }),
    r400: (): ResponseObject => ({
        description: 'Requête invalide',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
    }),
    r401: (): ResponseObject => ({
        description: 'Non authentifié',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
    }),
    r403: (): ResponseObject => ({
        description: 'Accès interdit',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
    }),
    r404: (): ResponseObject => ({
        description: 'Ressource introuvable',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
    }),
};

// ─── Paths ────────────────────────────────────────────────────────────────────
const paths: PathsObject = {
    // ── better-auth ───────────────────────────────────────────────────────────
    '/api/auth/sign-up/email': {
        post: {
            tags: ['Auth – Utilisateurs'],
            summary: 'Inscription (better-auth)',
            requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SignUpRequest' } } } },
            responses: {
                201: std.created('Compte créé avec succès', { $ref: '#/components/schemas/AuthResponse' }),
                400: std.r400(),
            },
        },
    },
    '/api/auth/sign-in/email': {
        post: {
            tags: ['Auth – Utilisateurs'],
            summary: 'Connexion (better-auth)',
            requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SignInRequest' } } } },
            responses: {
                200: std.ok('Connecté avec succès', { $ref: '#/components/schemas/AuthResponse' }),
                401: std.r401(),
            },
        },
    },
    '/api/auth/sign-out': {
        post: {
            tags: ['Auth – Utilisateurs'],
            summary: 'Déconnexion (better-auth)',
            security: [{ BearerAuth: [] }],
            responses: {
                200: std.ok('Déconnexion réussie'),
                401: std.r401(),
            },
        },
    },
    '/api/auth/get-session': {
        get: {
            tags: ['Auth – Utilisateurs'],
            summary: 'Obtenir la session courante (better-auth)',
            security: [{ BearerAuth: [] }],
            responses: {
                200: std.ok('Session active', {
                    type: 'object',
                    properties: {
                        session: { type: 'object' },
                        user: { $ref: '#/components/schemas/UserProfile' },
                    },
                }),
                401: std.r401(),
            },
        },
    },

    // ── Business Auth ─────────────────────────────────────────────────────────
    '/api/v1/business/auth/register': {
        post: {
            tags: ['Auth – Business'],
            summary: 'Inscription Business',
            requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/BusinessRegisterRequest' } } } },
            responses: {
                201: std.created('Business créé', { $ref: '#/components/schemas/BusinessAuthResponse' }),
                400: std.r400(),
            },
        },
    },
    '/api/v1/business/auth/login': {
        post: {
            tags: ['Auth – Business'],
            summary: 'Connexion Business',
            requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/BusinessLoginRequest' } } } },
            responses: {
                200: std.ok('Connecté', { $ref: '#/components/schemas/BusinessAuthResponse' }),
                401: std.r401(),
            },
        },
    },
    '/api/v1/business/auth/logout': {
        post: {
            tags: ['Auth – Business'],
            summary: 'Déconnexion Business (révocation côté client)',
            security: [{ BusinessBearerAuth: [] }],
            responses: {
                200: std.ok('Déconnecté — supprimez le token côté client'),
                401: std.r401(),
            },
        },
    },
    '/api/v1/business/auth/forget-password': {
        post: {
            tags: ['Auth – Business'],
            summary: 'Demander une réinitialisation de mot de passe',
            requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ForgetPasswordRequest' } } } },
            responses: {
                200: std.ok('Lien envoyé (si le compte existe)'),
                400: std.r400(),
            },
        },
    },
    '/api/v1/business/auth/reset-password': {
        post: {
            tags: ['Auth – Business'],
            summary: 'Réinitialiser le mot de passe avec un jeton',
            requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ResetPasswordRequest' } } } },
            responses: {
                200: std.ok('Mot de passe mis à jour'),
                400: std.r400(),
            },
        },
    },
    '/api/v1/business/auth/verify-email': {
        get: {
            tags: ['Auth – Business'],
            summary: 'Vérifier l\'adresse e-mail (lien cliquable)',
            parameters: [{ name: 'token', in: 'query', required: true, schema: { type: 'string' } }],
            responses: {
                307: { description: 'Redirection vers le dashboard' },
            },
        },
    },

    // ── Business Profile ──────────────────────────────────────────────────────
    '/api/v1/business/profile/logo': {
        post: {
            tags: ['Business Profile'],
            summary: 'Mettre à jour le logo du commerce',
            description: 'Supporte le téléchargement de fichiers multipart/form-data (image uniquement, max 5Mo).',
            security: [{ BusinessBearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                file: { type: 'string', format: 'binary', description: 'Le fichier image (jpg, png, webp)' },
                            },
                        },
                    },
                },
            },
            responses: {
                200: std.ok('Logo mis à jour', { type: 'object', properties: { logo: { type: 'string' } } }),
                400: std.r400(),
                401: std.r401(),
            },
        },
        delete: {
            tags: ['Business Profile'],
            summary: 'Supprimer le logo du commerce',
            security: [{ BusinessBearerAuth: [] }],
            responses: {
                200: std.ok('Logo supprimé'),
                401: std.r401(),
            },
        },
    },

    // ── Products (public) ─────────────────────────────────────────────────────
    '/api/v1/products': {
        get: {
            tags: ['Produits (public)'],
            summary: 'Liste des produits avec filtres',
            parameters: [
                { name: 'categoryId', in: 'query', schema: { type: 'string' } },
                { name: 'minPrice', in: 'query', schema: { type: 'number' } },
                { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
                { name: 'search', in: 'query', schema: { type: 'string' } },
                { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['price_asc', 'price_desc', 'name_asc', 'name_desc', 'popular', 'newest'], default: 'newest' } },
                { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, maximum: 100 } },
            ],
            responses: { 200: std.ok('Liste paginée', { $ref: '#/components/schemas/PaginatedProducts' }) },
        },
    },
    '/api/v1/products/{id}': {
        get: {
            tags: ['Produits (public)'],
            summary: 'Détail d\'un produit avec avis',
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: {
                200: std.ok('Produit', { $ref: '#/components/schemas/Product' }),
                404: std.r404(),
            },
        },
    },

    // ── Categories ────────────────────────────────────────────────────────────
    '/api/v1/categories': {
        get: {
            tags: ['Catégories'],
            summary: 'Lister toutes les catégories',
            responses: { 200: std.ok('Catégories', { type: 'array', items: { $ref: '#/components/schemas/Category' } }) },
        },
        post: {
            tags: ['Catégories'],
            summary: 'Créer une catégorie (admin)',
            security: [{ BearerAuth: [] }],
            requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCategoryRequest' } } } },
            responses: {
                201: std.created('Catégorie créée', { $ref: '#/components/schemas/Category' }),
                401: std.r401(),
            },
        },
    },

    // ── Cart ──────────────────────────────────────────────────────────────────
    '/api/v1/cart': {
        get: {
            tags: ['Panier'],
            summary: 'Obtenir le panier de l\'utilisateur connecté',
            security: [{ BearerAuth: [] }],
            responses: {
                200: std.ok('Panier', { type: 'array', items: { $ref: '#/components/schemas/CartItem' } }),
                401: std.r401(),
            },
        },
        delete: {
            tags: ['Panier'],
            summary: 'Vider le panier',
            security: [{ BearerAuth: [] }],
            responses: { 200: std.ok('Panier vidé'), 401: std.r401() },
        },
    },
    '/api/v1/cart/items': {
        post: {
            tags: ['Panier'],
            summary: 'Ajouter un article au panier',
            security: [{ BearerAuth: [] }],
            requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AddToCartRequest' } } } },
            responses: {
                201: std.created('Article ajouté', { $ref: '#/components/schemas/CartItem' }),
                400: std.r400(),
                401: std.r401(),
            },
        },
    },
    '/api/v1/cart/items/{id}': {
        put: {
            tags: ['Panier'],
            summary: 'Mettre à jour la quantité d\'un article',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateCartItemRequest' } } } },
            responses: { 200: std.ok('Article mis à jour'), 401: std.r401(), 404: std.r404() },
        },
        delete: {
            tags: ['Panier'],
            summary: 'Supprimer un article du panier',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: std.ok('Article supprimé'), 401: std.r401(), 404: std.r404() },
        },
    },

    // ── Orders ────────────────────────────────────────────────────────────────
    '/api/v1/orders': {
        get: {
            tags: ['Commandes'],
            summary: 'Lister les commandes de l\'utilisateur connecté',
            security: [{ BearerAuth: [] }],
            responses: {
                200: std.ok('Commandes', { type: 'array', items: { $ref: '#/components/schemas/Order' } }),
                401: std.r401(),
            },
        },
        post: {
            tags: ['Commandes'],
            summary: 'Passer une commande (depuis le panier)',
            security: [{ BearerAuth: [] }],
            requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateOrderRequest' } } } },
            responses: {
                201: std.created('Commande créée', { $ref: '#/components/schemas/Order' }),
                400: std.r400(),
                401: std.r401(),
            },
        },
    },
    '/api/v1/orders/{id}': {
        get: {
            tags: ['Commandes'],
            summary: 'Détail d\'une commande',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: std.ok('Commande', { $ref: '#/components/schemas/Order' }), 401: std.r401(), 404: std.r404() },
        },
    },

    // ── Reviews ───────────────────────────────────────────────────────────────
    '/api/v1/reviews': {
        post: {
            tags: ['Avis'],
            summary: 'Créer un avis sur un produit',
            security: [{ BearerAuth: [] }],
            requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateReviewRequest' } } } },
            responses: {
                201: std.created('Avis créé', { $ref: '#/components/schemas/Review' }),
                400: std.r400(),
                401: std.r401(),
            },
        },
    },
    '/api/v1/reviews/{id}': {
        delete: {
            tags: ['Avis'],
            summary: 'Supprimer son avis',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: std.ok('Avis supprimé'), 401: std.r401(), 403: std.r403(), 404: std.r404() },
        },
    },

    // ── Favorites ─────────────────────────────────────────────────────────────
    '/api/v1/favorites': {
        get: {
            tags: ['Favoris'],
            summary: 'Lister les favoris',
            security: [{ BearerAuth: [] }],
            responses: { 200: std.ok('Favoris', { type: 'array', items: { $ref: '#/components/schemas/Product' } }), 401: std.r401() },
        },
    },
    '/api/v1/favorites/{productId}': {
        post: {
            tags: ['Favoris'],
            summary: 'Ajouter un produit aux favoris',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 201: std.created('Ajouté aux favoris'), 401: std.r401(), 404: std.r404() },
        },
        delete: {
            tags: ['Favoris'],
            summary: 'Retirer un produit des favoris',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: std.ok('Retiré des favoris'), 401: std.r401(), 404: std.r404() },
        },
    },

    // ── Notifications (utilisateur) ───────────────────────────────────────────
    '/api/v1/notifications': {
        get: {
            tags: ['Notifications'],
            summary: 'Lister mes notifications',
            security: [{ BearerAuth: [] }],
            responses: { 200: std.ok('Notifications', { type: 'array', items: { $ref: '#/components/schemas/Notification' } }), 401: std.r401() },
        },
    },
    '/api/v1/notifications/{id}/read': {
        post: {
            tags: ['Notifications'],
            summary: 'Marquer une notification comme lue',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: std.ok('Notification marquée lue'), 401: std.r401(), 404: std.r404() },
        },
    },

    // ── User Profile ──────────────────────────────────────────────────────────
    '/api/v1/user/profile': {
        get: {
            tags: ['Profil utilisateur'],
            summary: 'Obtenir mon profil',
            security: [{ BearerAuth: [] }],
            responses: { 200: std.ok('Profil', { $ref: '#/components/schemas/UserProfile' }), 401: std.r401() },
        },
        put: {
            tags: ['Profil utilisateur'],
            summary: 'Mettre à jour mon profil',
            security: [{ BearerAuth: [] }],
            requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProfileRequest' } } } },
            responses: { 200: std.ok('Profil mis à jour', { $ref: '#/components/schemas/UserProfile' }), 400: std.r400(), 401: std.r401() },
        },
    },

    // ── Business – Dashboard ──────────────────────────────────────────────────
    '/api/v1/business/dashboard': {
        get: {
            tags: ['Business – Dashboard'],
            summary: 'Tableau de bord (KPIs)',
            security: [{ BusinessBearerAuth: [] }],
            responses: {
                200: std.ok('KPIs', {
                    type: 'object',
                    properties: {
                        totalRevenue: { type: 'number' },
                        totalOrders: { type: 'integer' },
                        totalProducts: { type: 'integer' },
                        totalCustomers: { type: 'integer' },
                        recentOrders: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
                    },
                }),
                401: std.r401(),
            },
        },
    },

    // ── Business – Analytics ──────────────────────────────────────────────────
    '/api/v1/business/analytics/sales': {
        get: {
            tags: ['Business – Analytics'],
            summary: 'Analytiques des ventes',
            security: [{ BusinessBearerAuth: [] }],
            parameters: [{ name: 'period', in: 'query', description: 'Nombre de jours (1-365, défaut 30)', schema: { type: 'integer', default: 30, minimum: 1, maximum: 365 } }],
            responses: { 200: std.ok('Analytiques', { $ref: '#/components/schemas/SalesAnalytics' }), 401: std.r401() },
        },
    },
    '/api/v1/business/analytics/products': {
        get: {
            tags: ['Business – Analytics'],
            summary: 'Performance par produit',
            security: [{ BusinessBearerAuth: [] }],
            parameters: [{ name: 'period', in: 'query', schema: { type: 'integer', default: 30 } }],
            responses: {
                200: std.ok('Performance produits', {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            productId: { type: 'string' },
                            name: { type: 'string' },
                            totalSold: { type: 'integer' },
                            revenue: { type: 'number' },
                            avgRating: { type: 'number', nullable: true },
                            reviewCount: { type: 'integer' },
                        },
                    },
                }),
                401: std.r401(),
            },
        },
    },

    // ── Business – Products ───────────────────────────────────────────────────
    '/api/v1/business/products': {
        get: {
            tags: ['Business – Produits'],
            summary: 'Lister mes produits',
            security: [{ BusinessBearerAuth: [] }],
            responses: { 200: std.ok('Produits', { type: 'array', items: { $ref: '#/components/schemas/Product' } }), 401: std.r401() },
        },
        post: {
            tags: ['Business – Produits'],
            summary: 'Créer un produit',
            security: [{ BusinessBearerAuth: [] }],
            requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateProductRequest' } } } },
            responses: { 201: std.created('Produit créé', { $ref: '#/components/schemas/Product' }), 400: std.r400(), 401: std.r401() },
        },
    },
    '/api/v1/business/products/{id}': {
        put: {
            tags: ['Business – Produits'],
            summary: 'Modifier un produit',
            security: [{ BusinessBearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProductRequest' } } } },
            responses: { 200: std.ok('Produit mis à jour', { $ref: '#/components/schemas/Product' }), 400: std.r400(), 401: std.r401(), 404: std.r404() },
        },
        delete: {
            tags: ['Business – Produits'],
            summary: 'Supprimer un produit',
            security: [{ BusinessBearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: std.ok('Produit supprimé'), 401: std.r401(), 403: std.r403(), 404: std.r404() },
        },
    },

    // ── Business – Promotions ─────────────────────────────────────────────────
    '/api/v1/business/promotions': {
        get: {
            tags: ['Business – Promotions'],
            summary: 'Lister mes promotions',
            security: [{ BusinessBearerAuth: [] }],
            responses: { 200: std.ok('Promotions', { type: 'array', items: { $ref: '#/components/schemas/Promotion' } }), 401: std.r401() },
        },
        post: {
            tags: ['Business – Promotions'],
            summary: 'Créer une promotion',
            security: [{ BusinessBearerAuth: [] }],
            requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePromotionRequest' } } } },
            responses: { 201: std.created('Promotion créée', { $ref: '#/components/schemas/Promotion' }), 400: std.r400(), 401: std.r401() },
        },
    },
    '/api/v1/business/promotions/{id}': {
        put: {
            tags: ['Business – Promotions'],
            summary: 'Modifier une promotion',
            security: [{ BusinessBearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePromotionRequest' } } } },
            responses: { 200: std.ok('Promotion mise à jour'), 400: std.r400(), 401: std.r401(), 404: std.r404() },
        },
        delete: {
            tags: ['Business – Promotions'],
            summary: 'Supprimer une promotion',
            security: [{ BusinessBearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: std.ok('Promotion supprimée'), 401: std.r401(), 403: std.r403(), 404: std.r404() },
        },
    },

    // ── Business – Notifications ──────────────────────────────────────────────
    '/api/v1/business/notifications': {
        get: {
            tags: ['Business – Notifications'],
            summary: 'Lister les notifications envoyées par ce Business',
            security: [{ BusinessBearerAuth: [] }],
            responses: { 200: std.ok('Notifications', { type: 'array', items: { $ref: '#/components/schemas/Notification' } }), 401: std.r401() },
        },
        post: {
            tags: ['Business – Notifications'],
            summary: 'Envoyer une notification push',
            security: [{ BusinessBearerAuth: [] }],
            requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateNotificationRequest' } } } },
            responses: { 201: std.created('Notifications envoyées'), 400: std.r400(), 401: std.r401() },
        },
    },
};

// ─── Final spec ───────────────────────────────────────────────────────────────
export const swaggerSpec = {
    openapi: '3.0.3',
    info: {
        title: 'Fundee API',
        version: '1.0.0',
        description: `
## Authentification

Deux systèmes cohabitent :

| Entité | Système | Header |
|--------|---------|--------|
| **Utilisateurs** | better-auth (sessions + bearer) | \`Authorization: Bearer <token>\` |
| **Business** | JWT personnalisé | \`Authorization: Bearer <jwt>\` |

### Obtenir un token utilisateur
\`\`\`
POST /api/auth/sign-in/email
{ "email": "...", "password": "..." }
→ { "token": "...", "user": {...} }
\`\`\`

### Obtenir un token Business
\`\`\`
POST /api/v1/business/auth/login
{ "email": "...", "password": "..." }
→ { "token": "...", "business": {...} }
\`\`\`
        `.trim(),
        contact: {
            name: 'Fundee API',
        },
    },
    servers: [
        { url: 'http://localhost:3000', description: 'Développement' },
    ],
    tags: [
        { name: 'Auth – Utilisateurs', description: 'Inscription / connexion utilisateurs (better-auth)' },
        { name: 'Auth – Business', description: 'Inscription / connexion marchands (JWT)' },
        { name: 'Produits (public)', description: 'Consultation du catalogue — pas d\'authentification requise' },
        { name: 'Catégories', description: 'Gestion des catégories' },
        { name: 'Panier', description: 'Gestion du panier utilisateur' },
        { name: 'Commandes', description: 'Passage et suivi des commandes' },
        { name: 'Avis', description: 'Avis sur les produits' },
        { name: 'Favoris', description: 'Produits favoris' },
        { name: 'Notifications', description: 'Notifications utilisateur' },
        { name: 'Profil utilisateur', description: 'Gestion du profil' },
        { name: 'Business – Dashboard', description: 'KPIs du tableau de bord marchand' },
        { name: 'Business – Analytics', description: 'Analytiques détaillées ventes / produits' },
        { name: 'Business – Produits', description: 'CRUD produits du marchand' },
        { name: 'Business – Promotions', description: 'Gestion des promotions' },
        { name: 'Business – Notifications', description: 'Envoi de notifications push aux utilisateurs' },
    ],
    paths,
    components: {
        schemas,
        securitySchemes,
    },
};