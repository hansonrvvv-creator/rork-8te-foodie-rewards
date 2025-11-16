import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Search, MapPin } from 'lucide-react-native';
import { Stack, router } from 'expo-router';

import Colors from '@/constants/colors';
import { RESTAURANTS, Restaurant } from '@/mocks/restaurants';
import { useState } from 'react';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRestaurants = RESTAURANTS.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
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
      <View style={styles.container}>
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
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Search Results' : 'Near You'}
          </Text>
          {filteredRestaurants.map(renderRestaurant)}
        </ScrollView>
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
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 16,
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
});
