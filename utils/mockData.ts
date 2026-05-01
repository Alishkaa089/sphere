export interface Property {
  id: string;
  title: string;
  category: string;
  status: string;
  city: string;
  loc?: string; 
  country: string;
  price: number;
  priceRaw?: number; 
  beds: number;
  baths: number;
  area: number;
  rating: number;
  img: string;
}

export interface Vehicle {
  id: string;
  title: string;
  category: string;
  status: string;
  city: string;
  loc?: string; 
  country: string;
  price: number;
  priceRaw?: number; 
  battery?: number;
  range?: number;
  power?: string;
  rating: number;
  img: string;
}

export interface Order {
  id: string;
  productId: string;
  title: string;
  img: string;
  type: string;
  start: string | null;
  end: string | null;
  totalDays: number;
  price: number;
  totalPrice?: number; 
  priceRaw?: number; 
  date: string;
}

export const generateProperties = (): Property[] => [
  {
    id: "prop-1",
    title: "Modern Glass Villa",
    category: "Villa",
    status: "Satış",
    city: "Baku",
    loc: "Baku",
    country: "Azerbaijan",
    price: 2500000,
    priceRaw: 2500000,
    beds: 5,
    baths: 4,
    area: 450,
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop"
  },
  {
    id: "prop-2",
    title: "Luxury Penthouse",
    category: "Apartment",
    status: "İcarə",
    city: "Dubai",
    loc: "Dubai",
    country: "UAE",
    price: 15000,
    priceRaw: 15000,
    beds: 3,
    baths: 3,
    area: 280,
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "prop-3",
    title: "Oceanfront Mansion",
    category: "Mansion",
    status: "Satış",
    city: "Miami",
    loc: "Miami",
    country: "USA",
    price: 8900000,
    priceRaw: 8900000,
    beds: 8,
    baths: 10,
    area: 1200,
    rating: 5.0,
    img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop"
  }
];

export const generateVehicles = (): Vehicle[] => [
  {
    id: "veh-1",
    title: "Tesla Model S Plaid",
    category: "Electric",
    status: "Satış",
    city: "Los Angeles",
    loc: "Los Angeles",
    country: "USA",
    price: 130000,
    priceRaw: 130000,
    battery: 100,
    range: 637,
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "veh-2",
    title: "Porsche 911 Turbo S",
    category: "Sport",
    status: "İcarə",
    city: "Stuttgart",
    loc: "Stuttgart",
    country: "Germany",
    price: 1200,
    priceRaw: 1200,
    power: "640 HP",
    rating: 5.0,
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "veh-3",
    title: "Range Rover Autobiography",
    category: "SUV",
    status: "Satış",
    city: "London",
    loc: "London",
    country: "UK",
    price: 170000,
    priceRaw: 170000,
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
  }
];
