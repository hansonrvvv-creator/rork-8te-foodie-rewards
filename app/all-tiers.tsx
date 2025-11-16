import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';

import Colors from '@/constants/colors';
import { TIERS, TierLevel } from '@/mocks/tiers';

export default function AllTiersScreen() {
  const tierLevels: TierLevel[] = ['foodie', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'elite', 'legend'];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'All Tiers',
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Tier System</Text>
        <Text style={styles.subtitle}>
          Earn points with every visit and unlock exclusive benefits
        </Text>

        {tierLevels.map(tierLevel => {
          const tier = TIERS[tierLevel];
          
          return (
            <View key={tier.id} style={styles.tierCard}>
              <LinearGradient
                colors={tier.gradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tierHeader}
              >
                <Text style={styles.tierEmoji}>{tier.icon}</Text>
                <Text style={styles.tierName}>{tier.name}</Text>
                <Text style={styles.tierPoints}>{tier.minPoints}+ points</Text>
              </LinearGradient>

              <View style={styles.tierBody}>
                <Text style={styles.benefitsTitle}>Benefits:</Text>
                {tier.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitRow}>
                    <Text style={styles.benefitBullet}>•</Text>
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
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
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  tierCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.card,
  },
  tierHeader: {
    padding: 20,
    alignItems: 'center',
  },
  tierEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  tierName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tierPoints: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  tierBody: {
    padding: 16,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  benefitBullet: {
    fontSize: 16,
    color: Colors.light.primary,
    marginRight: 8,
    fontWeight: '700',
  },
  benefitText: {
    fontSize: 15,
    color: Colors.light.text,
    flex: 1,
    lineHeight: 22,
  },
});
