import { GOOGLE_PLACES_API, GOOGLE_PLACES_API_KEY } from '@/constants/config';
import { Restaurant } from '@/mocks/restaurants';

interface PlaceResult {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  photos?: {
    photo_reference: string;
    height: number;
    width: number;
  }[];
  price_level?: number;
  types?: string[];
}

interface NearbySearchResponse {
  results: PlaceResult[];
  status: string;
  error_message?: string;
}

function getPriceRange(priceLevel?: number): string {
  if (!priceLevel) return '$';
  switch (priceLevel) {
    case 1:
      return '$';
    case 2:
      return '$$';
    case 3:
      return '$$$';
    case 4:
      return '$$$$';
    default:
      return '$';
  }
}

function getCuisineType(types?: string[]): string {
  if (!types) return 'Restaurant';
  
  const cuisineMap: { [key: string]: string } = {
    'italian_restaurant': 'Italian',
    'japanese_restaurant': 'Japanese',
    'chinese_restaurant': 'Chinese',
    'mexican_restaurant': 'Mexican',
    'thai_restaurant': 'Thai',
    'indian_restaurant': 'Indian',
    'french_restaurant': 'French',
    'korean_restaurant': 'Korean',
    'vietnamese_restaurant': 'Vietnamese',
    'mediterranean_restaurant': 'Mediterranean',
    'greek_restaurant': 'Greek',
    'american_restaurant': 'American',
    'seafood_restaurant': 'Seafood',
    'steakhouse': 'Steakhouse',
    'sushi_restaurant': 'Sushi',
    'pizza_restaurant': 'Pizza',
    'fast_food_restaurant': 'Fast Food',
    'cafe': 'Cafe',
    'bakery': 'Bakery',
    'bar': 'Bar',
  };

  for (const type of types) {
    if (cuisineMap[type]) {
      return cuisineMap[type];
    }
  }

  return 'Restaurant';
}

function getPhotoUrl(photoReference?: string): string {
  if (!photoReference || !GOOGLE_PLACES_API_KEY) {
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80';
  }
  
  return `${GOOGLE_PLACES_API.PHOTO}?maxwidth=800&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  if (distance < 0.1) {
    return `${Math.round(distance * 5280)} ft`;
  }
  return `${distance.toFixed(1)} mi`;
}

function convertToRestaurant(
  place: PlaceResult,
  userLat: number,
  userLng: number
): Restaurant {
  return {
    id: place.place_id,
    name: place.name,
    cuisine: getCuisineType(place.types),
    location: place.vicinity,
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
    rating: place.rating ? Math.min(place.rating * 1.6, 8) : 6.5,
    reviewCount: place.user_ratings_total || 0,
    image: getPhotoUrl(place.photos?.[0]?.photo_reference),
    priceRange: getPriceRange(place.price_level),
    distance: calculateDistance(
      userLat,
      userLng,
      place.geometry.location.lat,
      place.geometry.location.lng
    ),
    isPartner: false,
  };
}

export async function searchNearbyRestaurants(
  latitude: number,
  longitude: number,
  radius: number = 5000
): Promise<Restaurant[]> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('Google Places API key not found. Using mock data.');
    return [];
  }

  try {
    const url = `${GOOGLE_PLACES_API.NEARBY_SEARCH}?location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${GOOGLE_PLACES_API_KEY}`;
    
    console.log('Fetching nearby restaurants from Google Places API');
    const response = await fetch(url);
    const data: NearbySearchResponse = await response.json();

    if (data.status !== 'OK') {
      console.error('Google Places API error:', data.status, data.error_message);
      return [];
    }

    const restaurants = data.results
      .slice(0, 20)
      .map(place => convertToRestaurant(place, latitude, longitude));

    console.log(`Found ${restaurants.length} nearby restaurants`);
    return restaurants;
  } catch (error) {
    console.error('Error fetching nearby restaurants:', error);
    return [];
  }
}
