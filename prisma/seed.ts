import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Démarrage du seeder...');

    // Hash the password
    const hashedPassword = await bcrypt.hash('flex123', 10);

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'quentin.leclercbte@gmail.com' },
    });

    if (existingAdmin) {
      console.log('✓ Admin déjà existant:', existingAdmin.email);
      return;
    }

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'quentin.leclercbte@gmail.com',
        name: 'Admin',
        password: hashedPassword,
        role: 'SUPERADMIN',
      },
    });

    console.log('✓ SuperAdmin créé avec succès:');
    console.log(`  Email: ${admin.email}`);
    console.log(`  Nom: ${admin.name}`);
    console.log(`  Rôle: ${admin.role}`);
    console.log(`  ID: ${admin.id}`);
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
