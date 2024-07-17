import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
