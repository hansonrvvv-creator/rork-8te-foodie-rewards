import { Alert, Image, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Heart, MessageCircle, MapPin, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';

import Colors from '@/constants/colors';
import { POSTS, Post } from '@/mocks/posts';
import { TIERS } from '@/mocks/tiers';

export default function FeedScreen() {
  const handleShareToFacebook = async (post: Post) => {
    const message = `Check out my review of ${post.restaurantName}! I gave it ${post.rating}/8 stars. "${post.review}"`;
    const url = `https://8te.app/restaurant/${post.restaurantId}`;

    if (Platform.OS === 'web') {
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
      window.open(facebookShareUrl, '_blank');
    } else {
      try {
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
        const canOpen = await Linking.canOpenURL(facebookShareUrl);
        
        if (canOpen) {
          await Linking.openURL(facebookShareUrl);
        } else {
          Alert.alert('Error', 'Unable to open Facebook. Please make sure Facebook is installed.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to share to Facebook');
        console.error('Facebook share error:', error);
      }
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 8; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i < rating ? '⭐' : '☆'}
        </Text>
      );
    }
    return stars;
  };

  const renderPost = (post: Post) => {
    const tier = TIERS[post.userTier];

    return (
      <View key={post.id} style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            {post.userAvatar && post.userAvatar.length > 0 && (
              <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
            )}
            <View style={styles.userDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{post.userName}</Text>
                <LinearGradient
                  colors={tier.gradient as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tierBadge}
                >
                  <Text style={styles.tierText}>{tier.name}</Text>
                </LinearGradient>
              </View>
              <TouchableOpacity
                onPress={() => router.push(`/restaurant/${post.restaurantId}`)}
              >
                <Text style={styles.restaurantName}>{post.restaurantName}</Text>
              </TouchableOpacity>
              <View style={styles.locationRow}>
                <MapPin size={12} color={Colors.light.textSecondary} />
                <Text style={styles.location}>{post.restaurantLocation}</Text>
                <Text style={styles.timestamp}>• {post.timestamp}</Text>
              </View>
            </View>
          </View>
        </View>

        {post.image && post.image.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push(`/restaurant/${post.restaurantId}`)}
          >
            <Image source={{ uri: post.image }} style={styles.postImage} />
          </TouchableOpacity>
        )}

        <View style={styles.postContent}>
          <View style={styles.ratingRow}>{renderStars(post.rating)}</View>

          <Text style={styles.reviewText}>{post.review}</Text>

          <View style={styles.postFooter}>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Heart
                  size={24}
                  color={post.isLiked ? Colors.light.primary : Colors.light.text}
                  fill={post.isLiked ? Colors.light.primary : 'transparent'}
                />
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={24} color={Colors.light.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleShareToFacebook(post)}
              >
                <Share2 size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsText}>+{post.pointsEarned} pts</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '8te',
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24,
            color: Colors.light.primary,
          },
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {POSTS.map(renderPost)}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    paddingBottom: 20,
  },
  postCard: {
    backgroundColor: Colors.light.card,
    marginBottom: 16,
    borderBottomWidth: 8,
    borderBottomColor: Colors.light.backgroundSecondary,
  },
  postHeader: {
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  restaurantName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  postImage: {
    width: '100%',
    height: 400,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  postContent: {
    padding: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 2,
  },
  star: {
    fontSize: 16,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.light.text,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  pointsBadge: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
