import { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';

import Colors from '@/constants/colors';
import { Restaurant } from '@/mocks/restaurants';

interface ExploreMapProps {
  restaurants: Restaurant[];
  userLocation: { latitude: number; longitude: number } | null;
  onRestaurantPress: (id: string) => void;
}

export default function ExploreMap({ restaurants, userLocation, onRestaurantPress }: ExploreMapProps) {
  console.log('Rendering ExploreMap with restaurants count:', restaurants.length);

  const initialRegion = useMemo(() => {
    if (userLocation) {
      return {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }

    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  }, [userLocation]);

  return (
    <View style={styles.mapContainer} testID="explore-map-container">
      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{
              latitude: restaurant.latitude,
              longitude: restaurant.longitude,
            }}
            title={restaurant.name}
            description={restaurant.cuisine}
            onCalloutPress={() => onRestaurantPress(restaurant.id)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
