import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { MapPin, Star, Gift, Trophy, ChevronRight, TrendingUp, UserPlus } from 'lucide-react-native';

import { CURRENT_USER } from '@/mocks/user';
import { getTierByPoints, getNextTier } from '@/mocks/tiers';

const AVAILABLE_REWARDS = [
  { id: '1', title: 'Free Appetizer', restaurant: 'Any Partner Restaurant', expiresIn: '7 days' },
  { id: '2', title: 'Free Dessert', restaurant: 'Gold Tier Exclusive', expiresIn: '30 days' },
  { id: '3', title: '15% Off Entire Bill', restaurant: 'All Partner Restaurants', expiresIn: '14 days' },
];

const ACTIVE_OFFERS = [
  { id: '1', title: 'VIP Event: Wine Tasting', date: 'Dec 15, 2024', location: 'Downtown Bistro' },
  { id: '2', title: 'Chef\'s Table Experience', date: 'Dec 22, 2024', location: 'Premium Restaurant' },
];

export default function ProfileScreen() {
  const currentTier = getTierByPoints(CURRENT_USER.points);
  const nextTier = getNextTier(currentTier.id);
  const progress = nextTier
    ? ((CURRENT_USER.points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTintColor: '#FFD700',
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/bb5jtc911h41ouojuoxi1' }} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          <View style={styles.userInfo}>
            {CURRENT_USER.avatar && CURRENT_USER.avatar.length > 0 && (
              <Image source={{ uri: CURRENT_USER.avatar }} style={styles.avatar} />
            )}
            <Text style={styles.name}>{CURRENT_USER.name}</Text>
            <TouchableOpacity style={styles.addFriendsButton}>
              <UserPlus size={18} color="#FFFFFF" />
              <Text style={styles.addFriendsText}>Add Friends</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tierCardContainer}>
            <LinearGradient
              colors={currentTier.gradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.tierCard}
            >
              <View style={styles.tierHeader}>
                <Text style={styles.tierLabel}>CURRENT TIER</Text>
                <Trophy size={16} color="#FFFFFF" />
              </View>
              <View style={styles.tierContent}>
                <Text style={styles.tierEmoji}>{currentTier.icon}</Text>
                <View style={styles.tierInfo}>
                  <Text style={styles.tierName}>{currentTier.name}</Text>
                  <Text style={styles.tierPoints}>{CURRENT_USER.points} points</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {nextTier && (
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>
                  {nextTier.minPoints - CURRENT_USER.points} pts to {nextTier.name}
                </Text>
                <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
            </View>
          )}
        </View>

        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <MapPin size={20} color="#FFD700" />
            <Text style={styles.quickStatValue}>{CURRENT_USER.totalCheckins}</Text>
            <Text style={styles.quickStatLabel}>Check-ins</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Star size={20} color="#FFD700" />
            <Text style={styles.quickStatValue}>{CURRENT_USER.totalReviews}</Text>
            <Text style={styles.quickStatLabel}>Reviews</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <TrendingUp size={20} color="#FFD700" />
            <Text style={styles.quickStatValue}>{CURRENT_USER.points}</Text>
            <Text style={styles.quickStatLabel}>Points</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Gift size={24} color="#FFD700" />
            <Text style={styles.sectionTitle}>Available Rewards</Text>
          </View>
          {AVAILABLE_REWARDS.map((reward) => (
            <TouchableOpacity key={reward.id} style={styles.rewardCard}>
              <View style={styles.rewardIconContainer}>
                <Gift size={24} color="#FFD700" />
              </View>
              <View style={styles.rewardContent}>
                <Text style={styles.rewardTitle}>{reward.title}</Text>
                <Text style={styles.rewardRestaurant}>{reward.restaurant}</Text>
                <Text style={styles.rewardExpiry}>Expires in {reward.expiresIn}</Text>
              </View>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Star size={24} color="#FFD700" />
            <Text style={styles.sectionTitle}>Exclusive Offers</Text>
          </View>
          {ACTIVE_OFFERS.map((offer) => (
            <TouchableOpacity key={offer.id} style={styles.offerCard}>
              <LinearGradient
                colors={['#1a1a1a', '#000000']}
                style={styles.offerGradient}
              >
                <Text style={styles.offerTitle}>{offer.title}</Text>
                <View style={styles.offerDetails}>
                  <Text style={styles.offerDate}>{offer.date}</Text>
                  <Text style={styles.offerLocation}>{offer.location}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tier Benefits</Text>
          {currentTier.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/all-tiers')}
          >
            <Text style={styles.viewAllText}>View All Tiers</Text>
            <ChevronRight size={16} color="#FFD700" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    paddingBottom: 20,
  },
  profileHeader: {
    backgroundColor: '#000000',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  addFriendsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
  },
  addFriendsText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  tierCardContainer: {
    width: '100%',
  },
  tierCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tierLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  tierContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  tierInfo: {
    flex: 1,
  },
  tierEmoji: {
    fontSize: 48,
  },
  tierName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tierPoints: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  progressContainer: {
    width: '100%',
    marginTop: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.7,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFD700',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: '#2a2a2a',
    marginHorizontal: 8,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  rewardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rewardContent: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  rewardRestaurant: {
    fontSize: 13,
    color: '#999',
    marginBottom: 2,
  },
  rewardExpiry: {
    fontSize: 12,
    color: '#666',
  },
  offerCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  offerGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 12,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 8,
  },
  offerDetails: {
    gap: 4,
  },
  offerDate: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  offerLocation: {
    fontSize: 13,
    color: '#999',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
  },
  benefitText: {
    fontSize: 15,
    color: '#CCCCCC',
    flex: 1,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 12,
    gap: 6,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
  },
});
