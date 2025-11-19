import { StyleSheet, Text, View, TouchableOpacity, Platform, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Stack, router } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState, useEffect } from 'react';

import Colors from '@/constants/colors';
import { useCheckIns } from '@/contexts/CheckInContext';
import { RESTAURANTS } from '@/mocks/restaurants';

const PROXIMITY_THRESHOLD_METERS = 200;

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [scanned, setScanned] = useState<boolean>(false);
  const [verifyingLocation, setVerifyingLocation] = useState<boolean>(false);
  const { addCheckIn } = useCheckIns();

  useEffect(() => {
    const checkAndRequestLocation = async () => {
      if (locationPermission?.status === 'undetermined') {
        Alert.alert(
          '📍 Location Access Required',
          'We need your location to verify you\'re at the restaurant when checking in. This helps prevent fraud and ensures you earn legitimate rewards.',
          [
            {
              text: 'Not Now',
              style: 'cancel',
            },
            {
              text: 'Allow',
              onPress: requestLocationPermission,
            },
          ]
        );
      }
    };
    
    void checkAndRequestLocation();
  }, [locationPermission, requestLocationPermission]);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to scan QR codes at restaurants
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const handleBarCodeScanned = async ({ data }: { type: string; data: string }) => {
    if (scanned || verifyingLocation) return;
    
    setScanned(true);
    setVerifyingLocation(true);
    console.log('QR Code scanned:', data);

    try {
      const restaurantId = data;
      const restaurant = RESTAURANTS.find((r) => r.id === restaurantId);

      if (!restaurant) {
        Alert.alert('Invalid QR Code', 'This QR code is not valid for any restaurant.');
        setScanned(false);
        setVerifyingLocation(false);
        return;
      }

      if (!locationPermission?.granted) {
        Alert.alert(
          '📍 Location Required',
          'We need your location to verify you\'re actually at the restaurant. This ensures fair rewards for everyone.\n\nPlease enable location access in your device settings.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: requestLocationPermission,
            },
          ]
        );
        setScanned(false);
        setVerifyingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const restaurantLat = restaurant.latitude;
      const restaurantLon = restaurant.longitude;

      const distance = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        restaurantLat,
        restaurantLon
      );

      console.log('Distance to restaurant:', distance, 'meters');

      if (Platform.OS === 'web' || distance <= PROXIMITY_THRESHOLD_METERS) {
        await addCheckIn({
          restaurantId,
          timestamp: Date.now(),
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        });

        setTimeout(() => {
          router.push({
            pathname: '/checkin-success',
            params: { restaurantId },
          });
        }, 500);
      } else {
        Alert.alert(
          'Too Far Away',
          `You must be within ${PROXIMITY_THRESHOLD_METERS}m of the restaurant to check in. You are ${Math.round(distance)}m away.`
        );
        setScanned(false);
        setVerifyingLocation(false);
      }
    } catch (error) {
      console.error('Check-in error:', error);
      Alert.alert('Check-in Failed', 'Failed to verify location. Please try again.');
      setScanned(false);
      setVerifyingLocation(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {Platform.OS !== 'web' ? (
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.topOverlay}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => router.back()}
              >
                <X size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.middleOverlay}>
              <View style={styles.scanArea} />
              <Text style={styles.instructionText}>
                Scan the QR code at the restaurant
              </Text>
            </View>

            <View style={styles.bottomOverlay} />
          </View>
        </CameraView>
      ) : (
        <View style={styles.webFallback}>
          <Text style={styles.webFallbackTitle}>QR Scanner</Text>
          <Text style={styles.webFallbackText}>
            Camera scanning is not available on web. Please use the mobile app.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={() => router.back()}
          >
            <Text style={styles.permissionButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.text,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  backButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: 'flex-start',
    padding: 8,
  },
  middleOverlay: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 40,
  },
  scanArea: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 24,
    backgroundColor: 'transparent',
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 24,
    textAlign: 'center',
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  webFallbackTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
  },
  webFallbackText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
});
