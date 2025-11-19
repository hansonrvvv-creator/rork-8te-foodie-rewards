export const GOOGLE_PLACES_API_KEY = typeof process !== 'undefined' && process.env ? process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '' : '';

export const GOOGLE_PLACES_API = {
  NEARBY_SEARCH: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
  PLACE_DETAILS: 'https://maps.googleapis.com/maps/api/place/details/json',
  PHOTO: 'https://maps.googleapis.com/maps/api/place/photo',
};
