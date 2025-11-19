import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { MapPin, Star, DollarSign, Heart, Share2, Phone, Navigation, Lock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

import Colors from '@/constants/colors';
import { RESTAURANTS } from '@/mocks/restaurants';
import { getRestaurantReviews, Review, PostVisibility } from '@/mocks/posts';
import { TIERS } from '@/mocks/tiers';
import { useCheckIns } from '@/contexts/CheckInContext';
import ReviewModal from '@/components/ReviewModal';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const restaurant = RESTAURANTS.find(r => r.id === id);
  const reviews = getRestaurantReviews(id as string);
  const { hasActiveCheckIn } = useCheckIns();
  const [reviewModalVisible, setReviewModalVisible] = useState<boolean>(false);

  const canWriteReview = hasActiveCheckIn(id as string);

  const handleWriteReviewPress = () => {
    if (!canWriteReview) {
      Alert.alert(
        'Check-in Required',
        'You must scan the QR code at this restaurant before writing a review.',
        [{ text: 'OK' }]
      );
      return;
    }
    setReviewModalVisible(true);
  };

  const handleSubmitReview = async (rating: number, reviewText: string, visibility: PostVisibility) => {
    console.log('Submitting review:', { rating, reviewText, visibility, restaurantId: id });
    
    const visibilityText = visibility === 'private' 
      ? 'Only you can see this review.' 
      : visibility === 'friends' 
      ? 'Your friends can see this review.' 
      : 'Everyone can see this review.';
    
    Alert.alert(
      'Review Submitted', 
      `Thank you for your review! ${visibilityText}`
    );
  };

  if (!restaurant) {
    return (
      <>
        <Stack.Screen options={{ title: 'Restaurant Not Found' }} />
        <View style={styles.container}>
          <Text style={styles.errorText}>Restaurant not found</Text>
        </View>
      </>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 8; i++) {
      stars.push(
        <Text key={i} style={styles.starSmall}>
          {i < rating ? '⭐' : '☆'}
        </Text>
      );
    }
    return stars;
  };

  const renderReview = (review: Review) => {
    const tier = TIERS[review.userTier];

    return (
      <View key={review.id} style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          {review.userAvatar && review.userAvatar.length > 0 && (
            <Image source={{ uri: review.userAvatar }} style={styles.reviewAvatar} />
          )}
          <View style={styles.reviewUserInfo}>
            <View style={styles.reviewNameRow}>
              <Text style={styles.reviewUserName}>{review.userName}</Text>
              <LinearGradient
                colors={tier.gradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.reviewTierBadge}
              >
                <Text style={styles.reviewTierText}>{tier.name}</Text>
              </LinearGradient>
            </View>
            <View style={styles.reviewStarRow}>{renderStars(review.rating)}</View>
            <Text style={styles.reviewTimestamp}>{review.timestamp}</Text>
          </View>
        </View>
        
        {review.images.length > 0 && review.images[0] && review.images[0].length > 0 && (
          <Image source={{ uri: review.images[0] }} style={styles.reviewImage} />
        )}
        
        <Text style={styles.reviewText}>{review.review}</Text>
        
        <View style={styles.reviewFooter}>
          <TouchableOpacity style={styles.reviewAction}>
            <Heart
              size={20}
              color={review.isLiked ? Colors.light.primary : Colors.light.textSecondary}
              fill={review.isLiked ? Colors.light.primary : 'transparent'}
            />
            <Text style={styles.reviewActionText}>{review.likes}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: restaurant.name,
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
        }}
      />
      <ScrollView style={styles.container}>
        <Image source={{ uri: restaurant.image }} style={styles.heroImage} />
        
        {restaurant.isPartner && (
          <View style={styles.partnerBadge}>
            <Text style={styles.partnerText}>8te Partner Restaurant</Text>
          </View>
        )}

        <View style={styles.infoSection}>
          <View style={styles.headerRow}>
            <View style={styles.titleColumn}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
            </View>
            <View style={styles.ratingBox}>
              <Text style={styles.ratingNumber}>{restaurant.rating.toFixed(1)}</Text>
              <Text style={styles.ratingOutOf}>/ 8</Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <MapPin size={16} color={Colors.light.textSecondary} />
              <Text style={styles.detailText}>{restaurant.location}</Text>
            </View>
            <View style={styles.detailItem}>
              <DollarSign size={16} color={Colors.light.textSecondary} />
              <Text style={styles.detailText}>{restaurant.priceRange}</Text>
            </View>
            <View style={styles.detailItem}>
              <Navigation size={16} color={Colors.light.textSecondary} />
              <Text style={styles.detailText}>{restaurant.distance}</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                !canWriteReview && styles.primaryButtonDisabled,
              ]}
              onPress={handleWriteReviewPress}
            >
              {!canWriteReview && <Lock size={18} color="#FFFFFF" style={styles.lockIcon} />}
              <Star size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Write Review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Phone size={20} color={Colors.light.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Share2 size={20} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>
              Reviews ({restaurant.reviewCount})
            </Text>
            <View style={styles.ratingBreakdown}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.ratingText}>
                {restaurant.rating.toFixed(1)} average
              </Text>
            </View>
          </View>

          {reviews.length === 0 ? (
            <Text style={styles.noReviews}>No reviews yet. Be the first!</Text>
          ) : (
            reviews.map(renderReview)
          )}
        </View>
      </ScrollView>

      <ReviewModal
        visible={reviewModalVisible}
        restaurantName={restaurant.name}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={handleSubmitReview}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    padding: 20,
  },
  heroImage: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  partnerBadge: {
    position: 'absolute',
    top: 260,
    right: 16,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  partnerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoSection: {
    padding: 16,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 8,
    borderBottomColor: Colors.light.backgroundSecondary,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleColumn: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  ratingBox: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ratingOutOf: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  lockIcon: {
    marginRight: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  reviewsSection: {
    padding: 16,
  },
  reviewsHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  ratingBreakdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starIcon: {
    fontSize: 16,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  noReviews: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    paddingVertical: 40,
  },
  reviewCard: {
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  reviewUserName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
  },
  reviewTierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  reviewTierText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  reviewStarRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 2,
  },
  starSmall: {
    fontSize: 12,
  },
  reviewTimestamp: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  reviewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.light.text,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: 'row',
  },
  reviewAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reviewActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
});
