import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import "dotenv/config";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
})
const prisma = new PrismaClient({ adapter })

const UNIQUE_COUNTRIES = ["BƏƏ", "Türkiyə", "Qətər", "Azərbaycan"];
const COUNTRY_CITIES: Record<string, string[]> = {
  "BƏƏ": ["Dubay", "Abu Dabi"],
  "Türkiyə": ["İstanbul", "Bodrum"],
  "Qətər": ["Doha"],
  "Azərbaycan": ["Bakı", "Qəbələ"]
};
const CATEGORIES_PROP = ["Premium Villalar", "Penthaus", "Ağıllı Evlər", "Dəniz Mənzərəli"];
const PROPERTY_IMAGES = [
  "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800"
];
const CATEGORIES_TRANS = ["Elektrik (EV)", "Premium Sedan", "Sport Maşınlar", "SUV"];
const TRANSPORT_IMAGES = [
  "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=800"
];

const seededRandom = (seed: string, i: number) => {
  let h = 0;
  for (let j = 0; j < seed.length; j++) h = Math.imul(31, h) + seed.charCodeAt(j) | 0;
  return Math.abs(Math.sin(h + i)) * 10000;
};

async function main() {
  console.log('Seeding properties...')
  for (const cat of CATEGORIES_PROP) {
    for (const status of ["Satış", "Kirayə"]) {
      for (let i = 1; i <= 5; i++) {
        const countryIdx = Math.floor(seededRandom(cat + status, i) % UNIQUE_COUNTRIES.length);
        const countryName = UNIQUE_COUNTRIES[countryIdx];
        const cityList = COUNTRY_CITIES[countryName];
        const cityIdx = Math.floor(seededRandom(cat + status, i * 3) % cityList.length);
        const cityName = cityList[cityIdx];
        const imgIdx = Math.floor(seededRandom(cat + status, i * 2) % PROPERTY_IMAGES.length);
        const priceMultiplier = cat === "Premium Villalar" || cat === "Penthaus" ? 3 : 1;
        const basePrice = (status === "Satış" ? 500000 : 2000) * priceMultiplier;
        const finalPriceRaw = Math.floor(basePrice + Math.floor(seededRandom(cat, i) % 100) * (status === "Satış" ? 50000 : 200));

        await prisma.property.create({
          data: {
            title: `${cityName} Eksklüziv ${cat} ${i}`,
            category: cat,
            status: status,
            city: cityName,
            country: countryName,
            price: finalPriceRaw,
            beds: (i % 4) + 2,
            baths: (i % 3) + 2,
            area: 150 + i * 40,
            rating: 4.5 + (i % 5) * 0.1,
            img: PROPERTY_IMAGES[imgIdx]
          } as any
        })
      }
    }
  }

  console.log('Seeding vehicles...')
  for (const cat of CATEGORIES_TRANS) {
    for (const status of ["Satış", "Kirayə"]) {
      for (let i = 1; i <= 5; i++) {
        const countryIdx = Math.floor(seededRandom(cat + status, i) % UNIQUE_COUNTRIES.length);
        const countryName = UNIQUE_COUNTRIES[countryIdx];
        const cityList = COUNTRY_CITIES[countryName];
        const cityIdx = Math.floor(seededRandom(cat + status, i * 3) % cityList.length);
        const cityName = cityList[cityIdx];
        const imgIdx = Math.floor(seededRandom(cat + status, i * 2) % TRANSPORT_IMAGES.length);
        const priceMultiplier = cat === "Sport Maşınlar" ? 3 : 1;
        const basePrice = (status === "Satış" ? 90000 : 400) * priceMultiplier;
        const finalPriceRaw = Math.floor(basePrice + Math.floor(seededRandom(cat, i) % 100) * (status === "Satış" ? 10000 : 50));

        await prisma.vehicle.create({
          data: {
            title: `${cityName} Eksklüziv ${cat} v${i}`,
            category: cat,
            status: status,
            country: countryName,
            city: cityName,
            price: finalPriceRaw,
            battery: 80 + (i % 20),
            range: 200 + i * 20,
            power: `${300 + i * 40} HP`,
            img: TRANSPORT_IMAGES[imgIdx],
            rating: 4.5 + (i % 5) * 0.1
          } as any
        })
      }
    }
  }

  console.log('Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
