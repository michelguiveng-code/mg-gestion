import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Initializing database...');

    // Create seed users
    const buyer = await prisma.user.upsert({
      where: { email: 'buyer@example.com' },
      update: {},
      create: {
        name: 'Jean Acheteur',
        email: 'buyer@example.com',
        phone: '+509-1234-5678',
        role: 'BUYER',
      },
    });

    const seller = await prisma.user.upsert({
      where: { email: 'seller@example.com' },
      update: {},
      create: {
        name: 'Marie Vendeur',
        email: 'seller@example.com',
        phone: '+509-8765-4321',
        role: 'SELLER',
      },
    });

    // Create store for seller
    const store = await prisma.store.upsert({
      where: { id: 'store-1' },
      update: {},
      create: {
        id: 'store-1',
        name: 'Boutik Lokal',
        description: 'Best local products from Haiti',
        ownerId: seller.id,
      },
    });

    // Create products
    const product1 = await prisma.product.upsert({
      where: { id: 'prod-1' },
      update: {},
      create: {
        id: 'prod-1',
        title: 'Haitian Kolekt Coffee',
        description: 'Premium coffee from mountain regions',
        priceHtg: 450,
        stock: 100,
        images: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=500',
        storeId: store.id,
      },
    });

    const product2 = await prisma.product.upsert({
      where: { id: 'prod-2' },
      update: {},
      create: {
        id: 'prod-2',
        title: 'Traditional Ti Malice Art',
        description: 'Handmade Haitian crafts',
        priceHtg: 750,
        stock: 50,
        images: 'https://images.unsplash.com/photo-1578926314433-d66162b4b549?w=500',
        storeId: store.id,
      },
    });

    const product3 = await prisma.product.upsert({
      where: { id: 'prod-3' },
      update: {},
      create: {
        id: 'prod-3',
        title: 'Haitian Rice and Beans Mix',
        description: 'Traditional djon djon rice preparation',
        priceHtg: 550,
        stock: 75,
        images: 'https://images.unsplash.com/photo-1555939594-58d7cb561839?w=500',
        storeId: store.id,
      },
    });

    const product4 = await prisma.product.upsert({
      where: { id: 'prod-4' },
      update: {},
      create: {
        id: 'prod-4',
        title: 'Haitian Rum Selection',
        description: 'Premium rum from Caribbean distilleries',
        priceHtg: 1200,
        stock: 30,
        images: 'https://images.unsplash.com/photo-1569718150521-bc876beae68e?w=500',
        storeId: store.id,
      },
    });

    const product5 = await prisma.product.upsert({
      where: { id: 'prod-5' },
      update: {},
      create: {
        id: 'prod-5',
        title: 'Bamboo Handicrafts',
        description: 'Artisan bamboo baskets and containers',
        priceHtg: 350,
        stock: 100,
        images: 'https://images.unsplash.com/photo-1599599810694-b3b0c51a5c89?w=500',
        storeId: store.id,
      },
    });

    console.log('Database initialized successfully!');
    console.log({ buyer, seller, store, product1, product2, product3, product4, product5 });
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
