import { db, getDb } from "../lib/db";
import { auth, hashPassword } from "../lib/auth";

async function main() {
  console.log("🌱 Starting database seed...");
  const authCtx = await auth.$context;

  // Create categories
  const categoriesData = [
    {
      name: "Électronique",
      slug: "electronics",
      description: "Appareils électroniques et gadgets",
      icon: "📱",
    },
    {
      name: "Alimentation",
      slug: "food",
      description: "Produits alimentaires et boissons",
      icon: "🍔",
    },
    {
      name: "Mode",
      slug: "fashion",
      description: "Vêtements et accessoires",
      icon: "👕",
    },
    {
      name: "Maison",
      slug: "home",
      description: "Articles pour la maison",
      icon: "🏠",
    },
  ];

  const categories = [];
  for (const data of categoriesData) {
    let cat = await db.collection("category").findOne({ slug: data.slug });
    if (!cat) {
      const result = await db.collection("category").insertOne(data);
      cat = { ...data, _id: result.insertedId };
    }
    categories.push(cat);
  }
  console.log("✅ Categories created");

  let testUser = await db
    .collection("user")
    .findOne({ email: "user@test.com" });
  if (!testUser) {
    const result = await db.collection("user").insertOne({
      email: "user@test.com",
      name: "Jean Dupont",
      emailVerified: true,
      firstName: "Jean",
      lastName: "Dupont",
      phone: "+33612345678",
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    testUser = { _id: result.insertedId, email: "user@test.com" };
  }

  await db.collection("account").updateOne(
    { userId: testUser._id, providerId: "credential" },
    {
      $set: {
        userId: testUser._id,
        accountId: testUser._id.toString(),
        providerId: "credential",
        password: await authCtx.password.hash("password123"),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    },
    { upsert: true }
  );
  console.log("✅ Test user created");

  // Create test businesses (Stores)
  const businessesData = [
    {
      email: "casino@valentin.com",
      password: await hashPassword("password123"),
      name: "Supermarché Casino",
      description: "Votre supermarché de proximité à Akpakpa",
      phone: "+229 21 00 00 01",
      address: "Akpakpa SURU-LERE, Rue du CEG",
      logo: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=320",
      rating: 4.5,
      isActive: true,
    },
    {
      email: "michel@valentin.com",
      password: await hashPassword("password123"),
      name: "Marché Saint Michel",
      description: "Le coeur du commerce à Cotonou",
      phone: "+229 21 00 00 02",
      address: "Saint Michel, Cotonou",
      logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=320",
      rating: 4.2,
      isActive: true,
    },
    {
      email: "erevan@valentin.com",
      password: await hashPassword("password123"),
      name: "Erevan Supermarché",
      description: "Le plus grand choix de produits importés",
      phone: "+229 21 00 00 03",
      address: "Zone Aéroport, Cotonou",
      logo: "https://images.unsplash.com/photo-1604719312563-8912e9223c6a?auto=format&fit=crop&q=80&w=320",
      rating: 4.8,
      isActive: true,
    },
    {
      email: "superu@valentin.com",
      password: await hashPassword("password123"),
      name: "Super U Cotonou",
      description: "Qualité et fraîcheur garanties",
      phone: "+229 21 00 00 04",
      address: "Haie Vive, Cotonou",
      logo: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=320",
      rating: 4.5,
      isActive: true,
    },
    {
      email: "etoile@valentin.com",
      password: await hashPassword("password123"),
      name: "Boulangerie de l'Étoile",
      description: "Pains chauds et croustillants tous les matins",
      phone: "+229 21 00 00 05",
      address: "Gbégamey, Cotonou",
      logo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=320",
      rating: 4.6,
      isActive: true,
    },
    {
      email: "saveurs@valentin.com",
      password: await hashPassword("password123"),
      name: "Restaurant Saveurs Locales",
      description: "Le meilleur de la cuisine locale béninoise",
      phone: "+229 21 00 00 06",
      address: "Fidjrossè, Cotonou",
      logo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=320",
      rating: 4.4,
      isActive: true,
    },
  ];

  const businesses = [];
  for (const data of businessesData) {
    let bus = await db.collection("business").findOne({ email: data.email });
    if (!bus) {
      const result = await db.collection("business").insertOne(data);
      bus = { ...data, _id: result.insertedId };
    }
    businesses.push(bus);
  }
  console.log("✅ Businesses (Stores) created");

  // Create sample products
  const productsData = [
    {
      name: "Smartphone XPro",
      slug: "smartphone-xpro-seed",
      description: "Smartphone haut de gamme avec écran OLED",
      price: 120000,
      compareAtPrice: 150000,
      stock: 50,
      images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=320"],
      businessId: businesses[0]._id.toString(),
      categoryId: categories[0]._id.toString(),
      isActive: true,
      isAntiGaspillage: false,
    },
    {
      name: "Écouteurs Sans Fil",
      slug: "ecouteurs-sans-fil-seed",
      description: "Écouteurs Bluetooth avec réduction de bruit",
      price: 25000,
      compareAtPrice: null,
      stock: 100,
      images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=320"],
      businessId: businesses[0]._id.toString(),
      categoryId: categories[0]._id.toString(),
      isActive: true,
      isAntiGaspillage: true,
    },
    {
      name: "Pack Fruits Bio",
      slug: "pack-fruits-bio-seed",
      description: "Assortiment de fruits biologiques de saison",
      price: 2500,
      compareAtPrice: 3500,
      stock: 30,
      images: ["https://images.unsplash.com/photo-1610832958506-ee5633619144?auto=format&fit=crop&q=80&w=320"],
      businessId: businesses[1]._id.toString(),
      categoryId: categories[1]._id.toString(),
      isActive: true,
      isAntiGaspillage: true,
    },
    {
      name: "Pain Artisanal",
      slug: "pain-artisanal-seed",
      description: "Pain frais fait maison",
      price: 600,
      stock: 20,
      images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=320"],
      businessId: businesses[4]._id.toString(), // Boulangerie de l'Étoile
      categoryId: categories[1]._id.toString(),
      isActive: true,
      isAntiGaspillage: true,
    },
    {
      name: "Légumes Imparfaits",
      slug: "legumes-imparfaits-seed",
      description: "Légumes frais de saison avec petits défauts visuels, sauvés du gaspillage",
      price: 1200,
      compareAtPrice: 2000,
      stock: 15,
      images: ["https://images.unsplash.com/photo-1566385101042-1a010c129fae?auto=format&fit=crop&q=80&w=320"],
      businessId: businesses[1]._id.toString(),
      categoryId: categories[1]._id.toString(),
      isActive: true,
      isAntiGaspillage: true,
    },
    {
      name: "Audemars Piguet",
      slug: "audemars-piguet-seed",
      description: "Montre de luxe",
      price: 15000000,
      compareAtPrice: 18000000,
      stock: 5,
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=320"],
      businessId: businesses[2]._id.toString(),
      categoryId: categories[2]._id.toString(),
      isActive: true,
      isAntiGaspillage: false,
    },
    {
      name: "Jordan 23 Retro",
      slug: "jordan-23-retro-seed",
      description: "Chaussures de basket emblématiques",
      price: 85000,
      stock: 20,
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=320"],
      businessId: businesses[2]._id.toString(),
      categoryId: categories[2]._id.toString(),
      isActive: true,
      isAntiGaspillage: true,
    },
    {
      name: "Riz Jolof",
      slug: "riz-jolof-seed",
      description: "Plat de riz sénégalais parfumé aux épices",
      price: 1500,
      compareAtPrice: 2000,
      stock: 30,
      images: ["https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=320"],
      businessId: businesses[5]._id.toString(), // Restaurant Saveurs Locales
      categoryId: categories[1]._id.toString(),
      isActive: true,
      isAntiGaspillage: false,
    },
  ];

  const products = [];
  for (const prodData of productsData) {
    let prod = await db.collection("product").findOne({ slug: prodData.slug });
    if (!prod) {
      const result = await db.collection("product").insertOne(prodData);
      prod = { ...prodData, _id: result.insertedId };
    } else {
      await db.collection("product").updateOne(
        { _id: prod._id },
        { $set: prodData }
      );
      prod = { ...prod, ...prodData };
    }
    products.push(prod);
  }
  console.log("✅ Sample products created");

  // Create a promotion
  const existingPromo = await db.collection("promotion").findOne({
    businessId: businesses[0]._id.toString(),
    title: "Promo Électronique -25%",
  });
  if (!existingPromo) {
    await db.collection("promotion").insertOne({
      title: "Promo Électronique -25%",
      description: "Réduction de 25% sur tous les produits électroniques",
      discountPercent: 25,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      businessId: businesses[0]._id.toString(),
      isActive: true,
      productIds: [products[0]._id.toString(), products[1]._id.toString()],
    });
  }
  console.log("✅ Promotion created");

  // Create sample reviews
  const reviewData = [
    {
      userId: testUser._id.toString(),
      productId: products[0]._id.toString(),
      rating: 5,
      comment: "Excellent smartphone, très satisfait de mon achat!",
    },
    {
      userId: testUser._id.toString(),
      productId: products[1]._id.toString(),
      rating: 4,
      comment: "Bonne qualité sonore, confortable à porter.",
    },
  ];

  for (const rd of reviewData) {
    let review = await db
      .collection("review")
      .findOne({ userId: rd.userId, productId: rd.productId });
    if (!review) {
      await db.collection("review").insertOne(rd);
    }
  }
  console.log("✅ Sample reviews created");

  console.log("🎉 Database seeding completed!");
  if (process.env.NODE_ENV !== "production") {
    console.log("\n📝 Test credentials (dev only):");
    console.log("  User:       user@test.com / password123");
    console.log("  Businesses seeded: " + businesses.length);
  }
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0); // ← remplace client.close()
  });
