import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';

export const QRScannerScreen: React.FC<{
  onCodeScanned: (code: string) => void;
  onClose: () => void;
}> = ({ onCodeScanned, onClose }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([
    BarcodeFormat.QR_CODE,
  ], {
    checkInverted: true,
  });

  // Kamera izni kontrolü
  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  // Barkod algılandığında
  React.useEffect(() => {
    if (barcodes.length > 0) {
      const barcode = barcodes[0];
      if (barcode.rawValue) {
        onCodeScanned(barcode.rawValue);
      }
    }
  }, [barcodes, onCodeScanned]);

  if (!device) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Kamera bulunamadı</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Kapat</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Kamera izni kontrol ediliyor...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Kamera izni reddedildi</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Kapat</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />

      {/* QR Kod tarama alanı */}
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer} />
        <View style={styles.middleRow}>
          <View style={styles.unfocusedContainer} />
          <View style={styles.focusedContainer}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
          <View style={styles.unfocusedContainer} />
        </View>
        <View style={styles.unfocusedContainer} />
      </View>

      {/* Talimatlar */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          QR kodu tarama alanına getirin
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export class QRCodeService {
  // QR kod oluşturma
  static generateFriendCode(userId: string): string {
    // Basit arkadaş kodu oluşturma (gerçek uygulamada daha karmaşık olabilir)
    return `OKEY_FRIEND_${userId}_${Date.now()}`;
  }

  // QR kod okuma
  static parseFriendCode(qrCode: string): { userId: string; timestamp: number } | null {
    try {
      const parts = qrCode.split('_');
      if (parts.length === 4 && parts[0] === 'OKEY' && parts[1] === 'FRIEND') {
        return {
          userId: parts[2],
          timestamp: parseInt(parts[3])
        };
      }
      return null;
    } catch (error) {
      console.error('QR kod parse hatası:', error);
      return null;
    }
  }

  // Arkadaşlık isteği oluşturma
  static async sendFriendRequest(qrCode: string): Promise<boolean> {
    try {
      const parsed = this.parseFriendCode(qrCode);
      if (!parsed) {
        throw new Error('Geçersiz QR kod');
      }

      // API çağrısı (gerçek uygulamada backend'e bağlanacak)
      const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUserId: parsed.userId,
          qrCode: qrCode
        }),
      });

      if (!response.ok) throw new Error('Arkadaşlık isteği gönderilemedi');
      return true;
    } catch (error) {
      console.error('Arkadaşlık isteği hatası:', error);
      return false;
    }
  }
}

export default QRCodeService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  middleRow: {
    flexDirection: 'row',
  },
  focusedContainer: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#22c55e',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#22c55e',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#22c55e',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#22c55e',
  },
  instructions: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
