import { db, client } from '../lib/db';
import { hashPassword } from '../lib/auth';

async function main() {
    console.log('🌱 Starting database seed...');

    // Create categories
    const categoriesData = [
        { name: 'Électronique', slug: 'electronics', description: 'Appareils électroniques et gadgets', icon: '📱' },
        { name: 'Alimentation', slug: 'food', description: 'Produits alimentaires et boissons', icon: '🍔' },
        { name: 'Mode', slug: 'fashion', description: 'Vêtements et accessoires', icon: '👕' },
        { name: 'Maison', slug: 'home', description: 'Articles pour la maison', icon: '🏠' },
    ];

    const categories = [];
    for (const data of categoriesData) {
        let cat = await db.collection('category').findOne({ slug: data.slug });
        if (!cat) {
            const result = await db.collection('category').insertOne(data);
            cat = { ...data, _id: result.insertedId };
        }
        categories.push(cat);
    }
    console.log('✅ Categories created');

    // Create test user — password stored in Account (better-auth credential provider)
    let testUser = await db.collection('user').findOne({ email: 'user@test.com' });
    if (!testUser) {
        const result = await db.collection('user').insertOne({
            email: 'user@test.com',
            name: 'Jean Dupont',
            emailVerified: true,
            firstName: 'Jean',
            lastName: 'Dupont',
            phone: '+33612345678',
            role: 'USER',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        testUser = { _id: result.insertedId, email: 'user@test.com' };

        await db.collection('account').insertOne({
            userId: testUser._id.toString(),
            accountId: 'credential',
            providerId: 'credential',
            password: await hashPassword('password123'),
        });
    }
    console.log('✅ Test user created');

    // Create test businesses (Stores)
    const businessesData = [
        {
            email: 'casino@valentin.com',
            password: await hashPassword('password123'),
            name: 'Supermarché Casino',
            description: 'Votre supermarché de proximité à Akpakpa',
            phone: '+229 21 00 00 01',
            address: 'Akpakpa SURU-LERE, Rue du CEG',
            logo: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=320',
            rating: 4.5,
            isActive: true,
        },
        {
            email: 'michel@valentin.com',
            password: await hashPassword('password123'),
            name: 'Marché Saint Michel',
            description: 'Le coeur du commerce à Cotonou',
            phone: '+229 21 00 00 02',
            address: 'Saint Michel, Cotonou',
            logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=320',
            rating: 4.2,
            isActive: true,
        },
        {
            email: 'erevan@valentin.com',
            password: await hashPassword('password123'),
            name: 'Erevan Supermarché',
            description: 'Le plus grand choix de produits importés',
            phone: '+229 21 00 00 03',
            address: 'Zone Aéroport, Cotonou',
            logo: 'https://images.unsplash.com/photo-1604719312563-8912e9223c6a?auto=format&fit=crop&q=80&w=320',
            rating: 4.8,
            isActive: true,
        },
        {
            email: 'superu@valentin.com',
            password: await hashPassword('password123'),
            name: 'Super U Cotonou',
            description: 'Qualité et fraîcheur garanties',
            phone: '+229 21 00 00 04',
            address: 'Haie Vive, Cotonou',
            logo: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=320',
            rating: 4.5,
            isActive: true,
        },
    ];

    const businesses = [];
    for (const data of businessesData) {
        let bus = await db.collection('business').findOne({ email: data.email });
        if (!bus) {
            const result = await db.collection('business').insertOne(data);
            bus = { ...data, _id: result.insertedId };
        }
        businesses.push(bus);
    }
    console.log('✅ Businesses (Stores) created');

    // Create sample products
    const productsData = [
        {
            name: 'Smartphone XPro', slug: 'smartphone-xpro-seed', description: 'Smartphone haut de gamme avec écran OLED',
            price: 599.99, compareAtPrice: 799.99, stock: 50, images: ['/uploads/phone1.jpg'],
            businessId: businesses[0]._id.toString(), categoryId: categories[0]._id.toString(), isActive: true,
        },
        {
            name: 'Écouteurs Sans Fil', slug: 'ecouteurs-sans-fil-seed', description: 'Écouteurs Bluetooth avec réduction de bruit',
            price: 89.99, compareAtPrice: 129.99, stock: 100, images: ['/uploads/earbuds1.jpg'],
            businessId: businesses[0]._id.toString(), categoryId: categories[0]._id.toString(), isActive: true,
        },
        {
            name: 'Pack Fruits Bio', slug: 'pack-fruits-bio-seed', description: 'Assortiment de fruits biologiques de saison',
            price: 15.99, compareAtPrice: 19.99, stock: 30, images: ['/uploads/fruits1.jpg'],
            businessId: businesses[1]._id.toString(), categoryId: categories[1]._id.toString(), isActive: true,
        },
        {
            name: 'Pain Artisanal', slug: 'pain-artisanal-seed', description: 'Pain frais fait maison',
            price: 3.50, stock: 20, images: ['/uploads/bread1.jpg'],
            businessId: businesses[1]._id.toString(), categoryId: categories[1]._id.toString(), isActive: true,
        }
    ];

    const products = [];
    for (const prodData of productsData) {
        let prod = await db.collection('product').findOne({ slug: prodData.slug });
        if (!prod) {
            const result = await db.collection('product').insertOne(prodData);
            prod = { ...prodData, _id: result.insertedId };
        }
        products.push(prod);
    }
    console.log('✅ Sample products created');

    // Create a promotion
    const existingPromo = await db.collection('promotion').findOne({ businessId: businesses[0]._id.toString(), title: 'Promo Électronique -25%' });
    if (!existingPromo) {
        await db.collection('promotion').insertOne({
            title: 'Promo Électronique -25%',
            description: 'Réduction de 25% sur tous les produits électroniques',
            discountPercent: 25,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            businessId: businesses[0]._id.toString(),
            isActive: true,
            productIds: [products[0]._id.toString(), products[1]._id.toString()],
        });
    }
    console.log('✅ Promotion created');

    // Create sample reviews
    const reviewData = [
        { userId: testUser._id.toString(), productId: products[0]._id.toString(), rating: 5, comment: 'Excellent smartphone, très satisfait de mon achat!' },
        { userId: testUser._id.toString(), productId: products[1]._id.toString(), rating: 4, comment: 'Bonne qualité sonore, confortable à porter.' }
    ];

    for (const rd of reviewData) {
        let review = await db.collection('review').findOne({ userId: rd.userId, productId: rd.productId });
        if (!review) {
            await db.collection('review').insertOne(rd);
        }
    }
    console.log('✅ Sample reviews created');
    
    console.log('🎉 Database seeding completed!');
    if (process.env.NODE_ENV !== 'production') {
        console.log('\n📝 Test credentials (dev only):');
        console.log('  User:       user@test.com / password123');
        console.log('  Businesses seeded: ' + businesses.length);
    }
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await client.close();
    });
