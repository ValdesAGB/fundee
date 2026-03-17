import { z } from 'zod';

// ============================================
// Authentication Schemas
// ============================================

export const registerUserSchema = z.object({
    email: z.string().email('Adresse email invalide'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Adresse email invalide'),
    password: z.string().min(1, 'Le mot de passe est requis'),
});

export const registerBusinessSchema = z.object({
    email: z.string().email('Adresse email invalide'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    name: z.string().min(1, 'Le nom de l\'entreprise est requis'),
    description: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
});

// ============================================
// User Schemas
// ============================================

export const updateUserProfileSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    image: z.string().url('URL d\'image invalide').optional(),
    notificationsEnabled: z.boolean().optional(),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères'),
});

// ============================================
// Product Schemas
// ============================================

export const createProductSchema = z.object({
    name: z.string().min(1, 'Le nom du produit est requis'),
    description: z.string().optional(),
    price: z.number().positive('Le prix doit être positif'),
    compareAtPrice: z.number().positive().optional(),
    stock: z.number().int().nonnegative('Le stock doit être non-négatif').default(0),
    categoryId: z.string().min(1, 'La catégorie est requise'),
    images: z.array(z.string()).optional(),
});

export const updateProductSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
compareAtPrice: z.number().positive().optional().nullable(), // ← ajoute .nullable()    stock: z.number().int().nonnegative().optional(),
    categoryId: z.string().optional(),
    images: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
});

export const productFilterSchema = z.object({
    categoryId: z.string().optional(),
    minPrice: z.number().nonnegative().optional(),
    maxPrice: z.number().nonnegative().optional(),
    search: z.string().optional(),
    sortBy: z.enum(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'popular', 'newest']).optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
});

// ============================================
// Category Schemas
// ============================================

export const createCategorySchema = z.object({
    name: z.string().min(1, 'Le nom de la catégorie est requis'),
    description: z.string().optional(),
    icon: z.string().optional(),
});

// ============================================
// Cart Schemas
// ============================================

export const addToCartSchema = z.object({
    productId: z.string().min(1, 'L\'ID du produit est requis'),
    quantity: z.number().int().positive('La quantité doit être positive').default(1),
});

export const updateCartItemSchema = z.object({
    quantity: z.number().int().positive('La quantité doit être positive'),
});

// ============================================
// Order Schemas
// ============================================

export const createOrderSchema = z.object({
    shippingAddress: z.string().min(1, 'L\'adresse de livraison est requise'),
    shippingPhone: z.string().min(1, 'Le numéro de téléphone est requis'),
    notes: z.string().optional(),
});

// ============================================
// Review Schemas
// ============================================

export const createReviewSchema = z.object({
    productId: z.string().min(1, 'L\'ID du produit est requis'),
    rating: z.number().int().min(1).max(5, 'La note doit être comprise entre 1 et 5'),
    comment: z.string().optional(),
});

export const updateReviewSchema = z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().optional(),
});

// ============================================
// Promotion Schemas
// ============================================

export const createPromotionSchema = z.object({
    title: z.string().min(1, 'Le titre est requis'),
    description: z.string().optional(),
    discountPercent: z.number().gt(0, 'Le pourcentage de réduction doit être supérieur à 0').max(100).optional(),
    discountAmount: z.number().positive('Le montant de la réduction doit être positif').optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    productIds: z.array(z.string()).min(1, 'Au moins un produit est requis'),
}).refine(
    (data) => data.discountPercent !== undefined || data.discountAmount !== undefined,
    { message: 'Soit le pourcentage de réduction soit le montant de la réduction doit être fourni' }
);

export const updatePromotionSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    discountPercent: z.number().gt(0).max(100).optional(),
    discountAmount: z.number().positive().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    productIds: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
});

// ============================================
// Notification Schemas
// ============================================

export const createNotificationSchema = z.object({
    title: z.string().min(1, 'Le titre est requis'),
    message: z.string().min(1, 'Le message est requis'),
    type: z.enum(['PROMOTION', 'ORDER_UPDATE', 'GENERAL']).default('GENERAL'),
    link: z.string().optional(),
    userIds: z.array(z.string()).optional(), // If empty, send to all users
});

// ============================================
// Helper function to validate request body
// ============================================

export async function validateBody<T>(
    request: Request,
    schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
    try {
        const body = await request.json();
        const data = schema.parse(body);
        return { success: true, data };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const messages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
            return { success: false, error: messages.join(', ') };
        }
        return { success: false, error: 'Requête invalide' };
    }
}
