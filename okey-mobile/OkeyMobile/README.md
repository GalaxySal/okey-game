# 📱 Okey Oyunu - Mobil Uygulama

> 🇹🇷 **Türkçe Klasik Okey Oyunu** - iOS ve Android için native mobil uygulama

## 🌟 Özellikler

### 🎯 Oyun Özellikleri

- **🎲 Klasik Okey Kuralları** - 106 taş ile tam kurallara uygun oynanış
- **🤖 Gelişmiş AI Rakipler** - Stratejik karar verme algoritması
- **🔊 Gerçekçi Ses Efektleri** - Dokunmatik kontrollerle ses deneyimi
- **🏆 Skor Sistemi** - Detaylı oyun istatistikleri
- **📱 Dokunmatik Kontroller** - Mobil optimize arayüz
- **🌍 Çoklu Dil Desteği** - Türkçe ve İngilizce tam çeviri
- **🌐 Cross-Platform Sync** - Web/Desktop/Mobil veri senkronizasyonu

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- **Node.js 20+**
- **React Native CLI**
- **Android Studio** (Android geliştirme için)
- **Xcode** (iOS geliştirme için)

### Kurulum

```bash
# Proje klasöründe
cd okey-mobile/OkeyMobile

# Bağımlılıkları yükle
npm install

# iOS için (macOS gerekli)
npm run ios

# Android için
npm run android
```

### Build Komutları

```bash
# Android APK üret
npm run build:android

# iOS IPA üret
npm run build:ios

# Development server başlat
npm start
```

## 🎮 Nasıl Oynanır?

### Oyun Kuralları

- **4 Oyuncu** - 1 insan, 3 AI rakip
- **106 Taş** - Klasik okey taş seti
- **Gösterici ve Okey** - Rastgele belirlenen özel taşlar
- **El Bitişi** - Tüm taşları uygun şekilde gruplamak

### Oyun Akışı

1. **Dağıtım** - Her oyuncuya 14 taş verilir
2. **Yer Taşları** - 8 taş ortaya açılır
3. **Çekme Havuzu** - Kalan taşlar çekme havuzu olur
4. **Dokunmatik Oynama** - Taşlara dokunarak seç ve oyna
5. **Bitiş** - Çekme havuzu bittiğinde oyun otomatik biter

## 📁 Proje Yapısı

```plaintext
okey-mobile/OkeyMobile/
├── src/
│   ├── components/        # React Native bileşenleri
│   ├── screens/          # Uygulama ekranları
│   ├── services/         # API ve servis katmanı
│   ├── utils/           # Yardımcı fonksiyonlar
│   ├── locales/         # Çeviri dosyaları
│   ├── hooks/           # Özel React hook'ları
│   └── types/           # TypeScript tip tanımları
├── android/             # Android native kodlar
├── ios/                # iOS native kodlar
├── App.tsx             # Ana uygulama dosyası
└── package.json        # Mobil bağımlılıkları
```

## 🛠️ Geliştirme

### Kullanılan Teknolojiler

- **React Native 0.82.0** - Cross-platform mobil geliştirme
- **TypeScript 5.9.3** - Tip güvenliği
- **React Navigation 7** - Sayfa navigasyonu
- **React Native Sound** - Ses efektleri
- **i18next** - Çoklu dil desteği
- **Socket.io Client** - Çoklu oyuncu sistemi

## 📱 Platform Özellikleri

### iOS Özellikleri

- **Native iOS UI** - Sistem tasarım dili
- **Touch ID/Face ID** - Biyometrik kimlik doğrulama
- **Push Notifications** - Anlık bildirimler
- **App Store** - Apple ekosistemi entegrasyonu

### Android Özellikleri

- **Material Design** - Google tasarım dili
- **Adaptive Icons** - Uyarlanabilir uygulama ikonları
- **Background Services** - Arka plan işlemleri
- **Google Play** - Android ekosistemi

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 🔗 İlgili Bağlantılar

- **Ana Proje**: [Okey Oyunu Ana README](../README.md)
- **Web Uygulaması**: [Web README](../okey-game/README.md)
- **Desktop Uygulaması**: [Desktop README](../okey-desktop/README.md)

---

**Bu proje React Native ile geliştirilmiş cross-platform mobil uygulamadır.**
