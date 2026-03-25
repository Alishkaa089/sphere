import { UNIQUE_COUNTRIES, COUNTRY_CITIES } from "@/constants/countries";

const CATEGORIES_PROP = ["Bütün Mülklər", "Premium Villalar", "Penthaus", "Ağıllı Evlər", "Dəniz Mənzərəli"];
const PROPERTY_IMAGES = [
  "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/277667/pexels-photo-277667.jpeg?auto=compress&cs=tinysrgb&w=800"
];

const CATEGORIES_TRANS = ["Bütün Avtomobillər", "Elektrik (EV)", "Premium Sedan", "Sport Maşınlar", "SUV"];
const TRANSPORT_IMAGES = [
  "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?auto=compress&cs=tinysrgb&w=800"
];

export const seededRandom = (seed: string, i: number) => {
  let h = 0;
  for (let j = 0; j < seed.length; j++) h = Math.imul(31, h) + seed.charCodeAt(j) | 0;
  return Math.abs(Math.sin(h + i)) * 10000;
};

// Singleton patterns to ensure IDs match identically across Next.js SSR boundaries and Client loads
let _allProperties: any[] | null = null;
let _allVehicles: any[] | null = null;

export const generateProperties = () => {
  if (_allProperties) {
    if (typeof window !== "undefined") {
      const userProps = JSON.parse(localStorage.getItem("sphere_user_properties") || "[]");
      return [...userProps, ..._allProperties];
    }
    return _allProperties;
  }
  
  const props = [];
  const realCategories = CATEGORIES_PROP.slice(1);
  let idCounter = 1;
  const STATUSES = ["Satış", "Kirayə"];
  
  for (const cat of realCategories) {
    for (const status of STATUSES) {
      for (let i = 1; i <= 10; i++) {
        const countryIdx = Math.floor(seededRandom(cat + status, i) % UNIQUE_COUNTRIES.length);
        const countryName = UNIQUE_COUNTRIES[countryIdx];
        
        const cityList = COUNTRY_CITIES[countryName];
        const cityIdx = Math.floor(seededRandom(cat + status, i * 3) % cityList.length);
        const cityName = cityList[cityIdx];

        const imgIdx = Math.floor(seededRandom(cat + status, i * 2) % PROPERTY_IMAGES.length);
        
        const priceMultiplier = cat === "Premium Villalar" || cat === "Penthaus" ? 3 : 1;
        const basePrice = (status === "Satış" ? 500000 : 2000) * priceMultiplier;
        const finalPriceRaw = Math.floor(basePrice + Math.floor(seededRandom(cat, i) % 100) * (status === "Satış" ? 50000 : 200));

        props.push({
          id: `prop-${idCounter++}`,
          title: `${cityName} Eksklüziv ${cat} ${i}`,
          category: cat,
          status: status,
          loc: cityName,
          country: countryName,
          priceRaw: finalPriceRaw,
          price: finalPriceRaw.toLocaleString(),
          beds: (i % 4) + 2,
          baths: (i % 3) + 2,
          area: 150 + i * 40,
          rating: (4.5 + (i % 5) * 0.1).toFixed(1),
          img: PROPERTY_IMAGES[imgIdx]
        });
      }
    }
  }
  _allProperties = props.sort((a, b) => seededRandom(a.id, 0) - seededRandom(b.id, 0));
  
  if (typeof window !== "undefined") {
    const userProps = JSON.parse(localStorage.getItem("sphere_user_properties") || "[]");
    return [...userProps, ..._allProperties];
  }

  return _allProperties;
};

export const generateVehicles = () => {
  if (_allVehicles) {
    if (typeof window !== "undefined") {
      const userVhs = JSON.parse(localStorage.getItem("sphere_user_transports") || "[]");
      return [...userVhs, ..._allVehicles];
    }
    return _allVehicles;
  }

  const vhs = [];
  const realCategories = CATEGORIES_TRANS.slice(1);
  let idCounter = 1;
  const STATUSES = ["Satış", "Kirayə"];
  
  for (const cat of realCategories) {
    for (const status of STATUSES) {
      for (let i = 1; i <= 10; i++) {
        const countryIdx = Math.floor(seededRandom(cat + status, i) % UNIQUE_COUNTRIES.length);
        const countryName = UNIQUE_COUNTRIES[countryIdx];
        
        const cityList = COUNTRY_CITIES[countryName];
        const cityIdx = Math.floor(seededRandom(cat + status, i * 3) % cityList.length);
        const cityName = cityList[cityIdx];

        const imgIdx = Math.floor(seededRandom(cat + status, i * 2) % TRANSPORT_IMAGES.length);
        
        const priceMultiplier = cat === "Sport Maşınlar" ? 3 : 1;
        const basePrice = (status === "Satış" ? 90000 : 400) * priceMultiplier;
        const finalPriceRaw = Math.floor(basePrice + Math.floor(seededRandom(cat, i) % 100) * (status === "Satış" ? 10000 : 50));

        vhs.push({
          id: `car-${idCounter++}`,
          title: `${cityName} Eksklüziv ${cat} v${i}`,
          category: cat,
          status: status,
          country: countryName,
          loc: cityName,
          priceRaw: finalPriceRaw,
          price: finalPriceRaw.toLocaleString(),
          battery: 80 + (i % 20),
          range: 200 + i * 20,
          power: `${300 + i * 40} HP`,
          img: TRANSPORT_IMAGES[imgIdx]
        });
      }
    }
  }
  _allVehicles = vhs.sort((a, b) => seededRandom(a.id, 0) - seededRandom(b.id, 0));

  if (typeof window !== "undefined") {
    const userVhs = JSON.parse(localStorage.getItem("sphere_user_transports") || "[]");
    return [...userVhs, ..._allVehicles];
  }

  return _allVehicles;
};
