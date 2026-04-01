import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import "dotenv/config";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
})
const prisma = new PrismaClient({ adapter })

async function count() {
  const props = await prisma.property.count();
  const vhs = await prisma.vehicle.count();
  console.log(`PROPERTIES_COUNT: ${props}`);
  console.log(`VEHICLES_COUNT: ${vhs}`);
}

count()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
