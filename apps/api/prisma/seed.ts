import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ===== Default users =====
  const password = await argon2.hash('admin123');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@pizi.in' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@pizi.in',
      phone: '9999999999',
      password,
      role: 'admin',
      isActive: true,
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: 'owner@pizi.in' },
    update: {},
    create: {
      name: 'Rajesh Sharma',
      email: 'owner@pizi.in',
      phone: '9876543210',
      password: await argon2.hash('owner123'),
      role: 'owner',
      isActive: true,
    },
  });

  // ===== Cities & Localities =====
  const delhi = await prisma.city.upsert({
    where: { slug: 'delhi' },
    update: {},
    create: { name: 'Delhi', state: 'Delhi', slug: 'delhi' },
  });

  const noida = await prisma.city.upsert({
    where: { slug: 'noida' },
    update: {},
    create: { name: 'Noida', state: 'Uttar Pradesh', slug: 'noida' },
  });

  const mukherjeeNagar = await prisma.locality.upsert({
    where: { slug: 'mukherjee-nagar' },
    update: {},
    create: {
      cityId: delhi.id,
      name: 'Mukherjee Nagar',
      slug: 'mukherjee-nagar',
      latitude: 28.7136,
      longitude: 77.2080,
    },
  });

  // ===== Sample Amenities =====
  const amenities = [
    { name: 'WiFi', icon: '📶', category: 'tech' },
    { name: 'AC', icon: '❄️', category: 'comfort' },
    { name: 'Geyser', icon: '♨️', category: 'comfort' },
    { name: 'Power Backup', icon: '🔌', category: 'utility' },
    { name: 'Parking', icon: '🅿️', category: 'facility' },
    { name: 'Laundry', icon: '🧺', category: 'service' },
    { name: 'Food Included', icon: '🍱', category: 'service' },
    { name: 'CCTV', icon: '📹', category: 'security' },
    { name: 'Attached Bathroom', icon: '🚿', category: 'comfort' },
    { name: 'Balcony', icon: '🌳', category: 'comfort' },
  ];

  for (const a of amenities) {
    await prisma.amenity.upsert({
      where: { name: a.name },
      update: {},
      create: a,
    });
  }

  // ===== Sample Property =====
  await prisma.property.upsert({
    where: { slug: 'admire-luxury-pg' },
    update: {},
    create: {
      ownerId: owner.id,
      name: 'Admire Luxury PG',
      slug: 'admire-luxury-pg',
      description: 'Premium PG for boys near Delhi University.',
      cityId: delhi.id,
      localityId: mukherjeeNagar.id,
      addressLine: 'B-12, Mukherjee Nagar',
      pincode: '110009',
      latitude: 28.7136,
      longitude: 77.2080,
      propertyType: 'pg',
      genderType: 'male',
      startingPrice: 8000,
      securityDeposit: 16000,
      totalRooms: 10,
      totalBeds: 30,
      vacantBeds: 5,
      isVerified: true,
      isFeatured: true,
      status: 'active',
    },
  });

  console.log('✓ Seed complete!');
  console.log('Admin login: admin@pizi.in / admin123');
  console.log('Owner login: owner@pizi.in / owner123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
