import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';
import { Restaurant } from '@/mocks/restaurants';

interface ExploreMapProps {
  restaurants: Restaurant[];
  userLocation: { latitude: number; longitude: number } | null;
  onRestaurantPress: (id: string) => void;
}

export default function ExploreMap(_: ExploreMapProps) {
  console.log('Rendering ExploreMap web fallback');

  return (
    <View style={styles.webMapContainer} testID="explore-map-web-fallback">
      <Text style={styles.webMapText}>Map view is optimized for the mobile app.</Text>
      <Text style={styles.webMapSubtext}>Use the mobile app to explore restaurants on a map.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
