import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, Image, ActivityIndicator } from 'react-native';
import { Plus, QrCode, X, ImagePlus, Star } from 'lucide-react-native';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import { Post } from '@/mocks/posts';

export default function FeedScreen() {
  const { user, isLoaded, addReview, addPoints } = useUser();
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const [newPost, setNewPost] = useState({
    image: '',
    restaurantName: '',
    restaurantLocation: '',
    rating: 0,
    review: '',
  });



  useEffect(() => {
    if (isLoaded && !hasShownWelcome && (!user.name || !user.email)) {
      setHasShownWelcome(true);
      Alert.alert(
        'Welcome to 8te! 🍽️',
        'Complete your profile to start earning rewards and connecting with other foodies.',
        [
          {
            text: 'Later',
            style: 'cancel',
          },
          {
            text: 'Complete Profile',
            onPress: () => router.push('/edit-profile'),
          },
        ]
      );
    }
  }, [isLoaded, user.name, user.email, hasShownWelcome]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setNewPost({ ...newPost, image: result.assets[0].uri });
    }
  };

  const handleUploadPost = async () => {
    if (!newPost.image || !newPost.restaurantName || !newPost.review || newPost.rating === 0) {
      Alert.alert('Missing Information', 'Please fill in all fields and select a rating.');
      return;
    }

    setUploading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    const post: Post = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name || 'Anonymous',
      userAvatar: user.avatar,
      userTier: user.tier,
      restaurantId: Date.now().toString(),
      restaurantName: newPost.restaurantName,
      restaurantLocation: newPost.restaurantLocation || 'Unknown Location',
      image: newPost.image,
      rating: newPost.rating,
      review: newPost.review,
      pointsEarned: 10,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
      visibility: 'public',
    };

    setPosts([post, ...posts]);
    await addReview();
    await addPoints(10);
    
    setNewPost({
      image: '',
      restaurantName: '',
      restaurantLocation: '',
      rating: 0,
      review: '',
    });
    
    setUploading(false);
    setShowUploadModal(false);
    
    Alert.alert('Success! 🎉', 'Your post has been uploaded and you earned 10 points!');
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setNewPost({ ...newPost, rating: star })}
            style={styles.starButton}
          >
            <Star
              size={32}
              color={star <= rating ? Colors.light.primary : '#D1D5DB'}
              fill={star <= rating ? Colors.light.primary : 'transparent'}
            />
          </TouchableOpacity>
        ))}
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
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setShowUploadModal(true)}
              style={styles.uploadButton}
            >
              <Plus size={24} color={Colors.light.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {posts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyTitle}>No Posts Yet</Text>
            <Text style={styles.emptyDescription}>
              Start your foodie journey by checking in at restaurants and sharing your reviews!
            </Text>
            
            <View style={styles.actionCards}>
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => setShowUploadModal(true)}
              >
                <View style={styles.iconCircle}>
                  <Plus size={32} color={Colors.light.primary} />
                </View>
                <Text style={styles.actionCardTitle}>Upload Post</Text>
                <Text style={styles.actionCardDescription}>
                  Share your restaurant experience
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => router.push('/scan')}
              >
                <View style={styles.iconCircle}>
                  <QrCode size={32} color={Colors.light.primary} />
                </View>
                <Text style={styles.actionCardTitle}>Scan QR Code</Text>
                <Text style={styles.actionCardDescription}>
                  Check in at a restaurant by scanning their QR code
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.postsContainer}>
            {posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Image source={{ uri: post.userAvatar }} style={styles.postAvatar} />
                  <View style={styles.postHeaderText}>
                    <Text style={styles.postUserName}>{post.userName}</Text>
                    <TouchableOpacity onPress={() => router.push(`/restaurant/${post.restaurantId}`)}>
                      <Text style={styles.postRestaurantName}>{post.restaurantName}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.postRatingBadge}>
                    <Star size={14} color={Colors.light.primary} fill={Colors.light.primary} />
                    <Text style={styles.postRatingText}>{post.rating}</Text>
                  </View>
                </View>
                
                <Image source={{ uri: post.image }} style={styles.postImage} />
                
                <View style={styles.postContent}>
                  <Text style={styles.postReview}>{post.review}</Text>
                  <View style={styles.postFooter}>
                    <Text style={styles.postTimestamp}>{post.timestamp}</Text>
                    <Text style={styles.postPoints}>+{post.pointsEarned} pts</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showUploadModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload Post</Text>
            <TouchableOpacity onPress={() => setShowUploadModal(false)}>
              <X size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              {newPost.image ? (
                <Image source={{ uri: newPost.image }} style={styles.previewImage} />
              ) : (
                <View style={styles.imagePickerPlaceholder}>
                  <ImagePlus size={48} color={Colors.light.textSecondary} />
                  <Text style={styles.imagePickerText}>Tap to select photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Restaurant Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter restaurant name"
                value={newPost.restaurantName}
                onChangeText={(text) => setNewPost({ ...newPost, restaurantName: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="City or neighborhood"
                value={newPost.restaurantLocation}
                onChangeText={(text) => setNewPost({ ...newPost, restaurantLocation: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Rating (out of 8) *</Text>
              {renderStars(newPost.rating)}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Review *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Share your experience..."
                value={newPost.review}
                onChangeText={(text) => setNewPost({ ...newPost, review: text })}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.uploadSubmitButton, uploading && styles.uploadSubmitButtonDisabled]}
              onPress={handleUploadPost}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.uploadSubmitButtonText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  actionCards: {
    width: '100%',
    gap: 16,
  },
  actionCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF4ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  actionCardDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  uploadButton: {
    marginRight: 16,
  },
  postsContainer: {
    padding: 16,
    gap: 16,
  },
  postCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  postAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  postHeaderText: {
    flex: 1,
  },
  postUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  postRestaurantName: {
    fontSize: 14,
    color: Colors.light.primary,
    textDecorationLine: 'underline' as const,
  },
  postRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF4ED',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  postRatingText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  postContent: {
    padding: 16,
  },
  postReview: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postTimestamp: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  postPoints: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  imagePickerButton: {
    width: '100%',
    height: 250,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imagePickerPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 16,
  },
  imagePickerText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.light.text,
  },
  textArea: {
    minHeight: 120,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  uploadSubmitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  uploadSubmitButtonDisabled: {
    opacity: 0.6,
  },
  uploadSubmitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
