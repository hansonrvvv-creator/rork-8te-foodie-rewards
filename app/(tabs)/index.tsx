import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Plus, QrCode } from 'lucide-react-native';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';

import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';

export default function FeedScreen() {
  const { user, isLoaded } = useUser();
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

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
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🍽️</Text>
          <Text style={styles.emptyTitle}>No Posts Yet</Text>
          <Text style={styles.emptyDescription}>
            Start your foodie journey by checking in at restaurants and sharing your reviews!
          </Text>
          
          <View style={styles.actionCards}>
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

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/explore')}
            >
              <View style={styles.iconCircle}>
                <Plus size={32} color={Colors.light.primary} />
              </View>
              <Text style={styles.actionCardTitle}>Explore</Text>
              <Text style={styles.actionCardDescription}>
                Find restaurants near you and start reviewing
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
});
