import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';

import Colors from '@/constants/colors';
import { RESTAURANTS } from '@/mocks/restaurants';
import { useUser } from '@/contexts/UserContext';

export default function CheckinSuccessScreen() {
  const { restaurantId } = useLocalSearchParams();
  const restaurant = RESTAURANTS.find((r) => r.id === restaurantId) || RESTAURANTS[0];
  const pointsEarned = 100;
  const { addPoints } = useUser();

  useEffect(() => {
    addPoints(pointsEarned, true);
  }, [addPoints, pointsEarned]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={['#FF6B35', '#FF8A5B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <CheckCircle size={80} color="#FFFFFF" strokeWidth={2.5} />
            
            <Text style={styles.title}>Check-in Successful!</Text>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            
            <View style={styles.pointsCard}>
              <Text style={styles.pointsLabel}>You earned</Text>
              <Text style={styles.pointsValue}>+{pointsEarned}</Text>
              <Text style={styles.pointsUnit}>points</Text>
            </View>

            <Text style={styles.message}>
              Don&apos;t forget to leave a review and share your experience!
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                router.dismissAll();
                router.push('/');
              }}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => {
                router.dismissAll();
                router.push(`/restaurant/${restaurant.id}`);
              }}
            >
              <Text style={styles.linkText}>Write a Review</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 32,
    textAlign: 'center',
  },
  pointsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 24,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pointsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  pointsValue: {
    fontSize: 64,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 72,
  },
  pointsUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  message: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    minWidth: 200,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.primary,
    textAlign: 'center',
  },
  linkButton: {
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
