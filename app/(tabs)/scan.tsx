import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Stack, router } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';

import Colors from '@/constants/colors';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<boolean>(false);

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

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    console.log('QR Code scanned:', data);
    
    setTimeout(() => {
      router.push('/checkin-success');
    }, 500);
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
