export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  image: string;
  priceRange: string;
  distance: string;
  isPartner: boolean;
}

export const RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Osteria Mozza',
    cuisine: 'Italian',
    location: 'Hollywood',
    latitude: 34.0928,
    longitude: -118.3287,
    rating: 7.8,
    reviewCount: 342,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    priceRange: '$$$',
    distance: '0.8 mi',
    isPartner: true,
  },
  {
    id: '2',
    name: 'Sushi Gen',
    cuisine: 'Japanese',
    location: 'Little Tokyo',
    latitude: 34.0522,
    longitude: -118.2437,
    rating: 7.5,
    reviewCount: 567,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80',
    priceRange: '$$',
    distance: '1.2 mi',
    isPartner: true,
  },
  {
    id: '3',
    name: 'Guelaguetza',
    cuisine: 'Mexican',
    location: 'Koreatown',
    latitude: 34.0581,
    longitude: -118.3015,
    rating: 7.2,
    reviewCount: 423,
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80',
    priceRange: '$$',
    distance: '2.1 mi',
    isPartner: false,
  },
  {
    id: '4',
    name: 'Republique',
    cuisine: 'French',
    location: 'Mid-City',
    latitude: 34.0736,
    longitude: -118.3414,
    rating: 8.0,
    reviewCount: 891,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    priceRange: '$$$',
    distance: '1.5 mi',
    isPartner: true,
  },
  {
    id: '5',
    name: 'Howlin Rays',
    cuisine: 'American',
    location: 'Chinatown',
    latitude: 34.0631,
    longitude: -118.2374,
    rating: 7.6,
    reviewCount: 1234,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80',
    priceRange: '$',
    distance: '3.2 mi',
    isPartner: false,
  },
  {
    id: '6',
    name: 'Providence',
    cuisine: 'Seafood',
    location: 'Hollywood',
    latitude: 34.0969,
    longitude: -118.3267,
    rating: 7.9,
    reviewCount: 456,
    image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&q=80',
    priceRange: '$$$$',
    distance: '0.9 mi',
    isPartner: true,
  },
  {
    id: '7',
    name: 'Bestia',
    cuisine: 'Italian',
    location: 'Arts District',
    latitude: 34.0401,
    longitude: -118.2353,
    rating: 7.7,
    reviewCount: 678,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
    priceRange: '$$$',
    distance: '4.1 mi',
    isPartner: true,
  },
  {
    id: '8',
    name: 'Night + Market',
    cuisine: 'Thai',
    location: 'West Hollywood',
    latitude: 34.0900,
    longitude: -118.3617,
    rating: 7.4,
    reviewCount: 534,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80',
    priceRange: '$$',
    distance: '1.8 mi',
    isPartner: false,
  },
];
