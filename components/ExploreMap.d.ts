declare module '@/components/ExploreMap' {
  import type { ComponentType } from 'react';
  import type { Restaurant } from '@/mocks/restaurants';

  export interface ExploreMapProps {
    restaurants: Restaurant[];
    userLocation: { latitude: number; longitude: number } | null;
    onRestaurantPress: (id: string) => void;
  }

  const ExploreMap: ComponentType<ExploreMapProps>;
  export default ExploreMap;
}
