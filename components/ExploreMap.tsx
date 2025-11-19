import { useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';
import { Restaurant } from '@/mocks/restaurants';

interface ExploreMapProps {
  restaurants: Restaurant[];
  userLocation: { latitude: number; longitude: number } | null;
  onRestaurantPress: (id: string) => void;
}

function WebMapFallback() {
  console.log('Rendering ExploreMap web fallback');
  
  return (
    <View style={styles.webMapContainer} testID="explore-map-web-fallback">
      <Text style={styles.webMapText}>Map view is optimized for the mobile app.</Text>
      <Text style={styles.webMapSubtext}>Use the mobile app to explore restaurants on a map.</Text>
    </View>
  );
}

function NativeMap({ restaurants, userLocation, onRestaurantPress }: ExploreMapProps) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const MapView = require('react-native-maps').default;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } = require('react-native-maps');

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

export default function ExploreMap(props: ExploreMapProps) {
  if (Platform.OS === 'web') {
    return <WebMapFallback />;
  }

  return <NativeMap {...props} />;
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
  webMapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 24,
  },
  webMapText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  webMapSubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
