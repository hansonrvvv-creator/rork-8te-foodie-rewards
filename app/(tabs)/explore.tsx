import { ActivityIndicator, Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Search, MapPin, Navigation, Map as MapIcon, List as ListIcon } from 'lucide-react-native';
import { Stack, router } from 'expo-router';
import * as Location from 'expo-location';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import ExploreMap from '@/components/ExploreMap';
import { RESTAURANTS, Restaurant } from '@/mocks/restaurants';
import { searchNearbyRestaurants } from '@/services/googlePlaces';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>(RESTAURANTS);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const insets = useSafeAreaInsets();

  const containerStyle = useMemo(() => [styles.container, { paddingTop: insets.top }], [insets.top]);

  const fetchNearbyRestaurants = useCallback(async () => {
    setIsLoadingLocation(true);
    try {
      console.log('Getting current location...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const { latitude, longitude } = location.coords;
      console.log('User location:', latitude, longitude);
      setUserLocation({ latitude, longitude });
      
      const nearbyRestaurants = await searchNearbyRestaurants(latitude, longitude);
      
      if (nearbyRestaurants.length > 0) {
        setRestaurants(nearbyRestaurants);
      } else {
        console.log('No nearby restaurants found, using mock data');
      }
    } catch (error) {
      console.error('Error fetching nearby restaurants:', error);
      Alert.alert(
        'Location Error',
        'Could not get your location. Using default restaurants.'
      );
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  const checkLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        await fetchNearbyRestaurants();
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
    }
  }, [fetchNearbyRestaurants]);

  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        await fetchNearbyRestaurants();
      } else {
        Alert.alert(
          'Location Permission',
          'Please enable location services to find restaurants near you.'
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert('Error', 'Failed to request location permission');
    }
  }, [fetchNearbyRestaurants]);

  useEffect(() => {
    void checkLocationPermission();
  }, [checkLocationPermission]);

  const filteredRestaurants = useMemo(
    () =>
      restaurants.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [restaurants, searchQuery]
  );


  const renderRestaurant = (restaurant: Restaurant) => {
    const filledStars = Math.floor(restaurant.rating);
    const hasHalfStar = restaurant.rating % 1 >= 0.5;

    return (
      <TouchableOpacity
        key={restaurant.id}
        style={styles.restaurantCard}
        onPress={() => router.push(`/restaurant/${restaurant.id}`)}
      >
        <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
        {restaurant.isPartner && (
          <View style={styles.partnerBadge}>
            <Text style={styles.partnerText}>Partner</Text>
          </View>
        )}
        
        <View style={styles.restaurantInfo}>
          <View style={styles.restaurantHeader}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.priceRange}>{restaurant.priceRange}</Text>
          </View>
          
          <View style={styles.cuisineRow}>
            <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
            <Text style={styles.dot}>•</Text>
            <View style={styles.locationRow}>
              <MapPin size={12} color={Colors.light.textSecondary} />
              <Text style={styles.distance}>{restaurant.distance}</Text>
            </View>
          </View>
          
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[...Array(8)].map((_, i) => (
                <Text key={i} style={styles.starIcon}>
                  {i < filledStars ? '⭐' : i === filledStars && hasHalfStar ? '⭐' : '☆'}
                </Text>
              ))}
            </View>
            <Text style={styles.ratingText}>
              {restaurant.rating.toFixed(1)} ({restaurant.reviewCount})
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Explore',
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
        }}
      />
      <View style={containerStyle}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.light.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search restaurants or cuisine..."
              placeholderTextColor={Colors.light.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {!hasLocationPermission ? (
              <TouchableOpacity
                onPress={requestLocationPermission}
                style={styles.locationButton}
              >
                <Navigation size={20} color={Colors.light.primary} />
              </TouchableOpacity>
            ) : isLoadingLocation ? (
              <ActivityIndicator size="small" color={Colors.light.primary} />
            ) : (
              <TouchableOpacity
                onPress={fetchNearbyRestaurants}
                style={styles.locationButton}
              >
                <Navigation size={20} color={Colors.light.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {viewMode === 'list' ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
          >
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.sectionTitle}>
                  {searchQuery ? 'Search Results' : hasLocationPermission ? 'Near You' : 'Restaurants'}
                </Text>
                {hasLocationPermission && userLocation && (
                  <Text style={styles.locationText}>
                    📍 Using your location
                  </Text>
                )}
              </View>
              
              <View style={styles.viewToggle}>
                <TouchableOpacity 
                  style={[styles.toggleButton, styles.toggleButtonActive]}
                  onPress={() => setViewMode('list')}
                >
                  <ListIcon size={20} color={'#FFF'} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.toggleButton]}
                  onPress={() => setViewMode('map')}
                >
                  <MapIcon size={20} color={Colors.light.text} />
                </TouchableOpacity>
              </View>
            </View>
            {!hasLocationPermission && (
              <TouchableOpacity
                style={styles.permissionBanner}
                onPress={requestLocationPermission}
              >
                <Navigation size={20} color={Colors.light.primary} />
                <Text style={styles.permissionText}>
                  Enable location to find restaurants near you
                </Text>
              </TouchableOpacity>
            )}
            {filteredRestaurants.map(renderRestaurant)}
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>
             <View style={styles.mapHeaderOverlay}>
                <View style={styles.viewToggle}>
                  <TouchableOpacity 
                    style={[styles.toggleButton]}
                    onPress={() => setViewMode('list')}
                  >
                    <ListIcon size={20} color={Colors.light.text} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.toggleButton, styles.toggleButtonActive]}
                    onPress={() => setViewMode('map')}
                  >
                    <MapIcon size={20} color={'#FFF'} />
                  </TouchableOpacity>
                </View>
             </View>
             <ExploreMap
               restaurants={filteredRestaurants}
               userLocation={userLocation}
               onRestaurantPress={(id: string) => router.push(`/restaurant/${id}`)}
             />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    outlineStyle: Platform.OS === 'web' ? 'none' : undefined,
  } as const,
  locationButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
  },
  locationText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  permissionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  restaurantCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  partnerBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  partnerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  restaurantInfo: {
    padding: 12,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    flex: 1,
  },
  priceRange: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  cuisineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  cuisine: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  dot: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  starIcon: {
    fontSize: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapHeaderOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 100,
  },
  webMapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 20,
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
