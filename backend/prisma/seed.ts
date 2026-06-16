import { PrismaClient } from '@prisma/client';
import { seedFactoryData, DEFAULT_PASSWORD } from '../src/maintenance/factory-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Han Bridge CRM...');
  await seedFactoryData(prisma);
  console.log('✅ Seed complete.');
  console.log(`   Logins: *@hanbridge.kz · password for everyone: ${DEFAULT_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
