# 🎮 Okey Oyunu - Türkçe Klasik Okey

> 🇹🇷 **Türkçe Klasik Okey Oyunu** - Geleneksel okey kuralları ile
> modern teknoloji birleşiyor!

## 🌟 Özellikler

### 🎯 Oyun Özellikleri

- **🎲 Klasik Okey Kuralları** - 106 taş ile tam kurallara uygun oynanış
- **🤖 Akıllı AI Rakipler** - Stratejik karar verme algoritması
- **🔊 Gerçekçi Ses Efektleri** - Web Audio API ile ses deneyimi
- **🏆 Skor Sistemi** - Detaylı oyun istatistikleri
- **🎨 Modern UI/UX** - Responsive tasarım ve animasyonlar

### 💻 Teknik Özellikler

- **⚡ Yüksek Performans** - Optimize kod yapısı
- **🔒 Tip Güvenliği** - TypeScript ile güçlü tip kontrolü
- **📱 Cross-Platform** - Web ve Desktop desteği
- **🔄 Otomatik Güncelleme** - Desktop için otomatik güncelleme sistemi
- **🌍 Çoklu Dil Desteği** - Türkçe ve İngilizce tam çeviri

## 🚀 Platformlar

### Desktop Uygulaması (Tauri)

#### Sistem Gereksinimleri

- **Windows 10/11** (64-bit)
- **WebView2 Runtime** (Windows 10 ile otomatik yüklenir)

#### Kurulum Adımları

1. GitHub Releases'ten en son `.exe` dosyasını indirin
2. Yükleyiciyi çalıştırın ve kurulum sihirbazını takip edin
3. Uygulama otomatik olarak açılacak

#### Oynanış

1. **Yeni Oyun** butonuna tıklayın
2. **Taş Çek** butonuna basın
3. Elinizdeki taşları seçin
4. **At** butonuna basarak taşı atın
5. AI oyuncuları sırayla oynar

### Web Uygulaması

#### Tarayıcı Gereksinimleri

- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)
- JavaScript etkin olmalı

#### Erişim

Web uygulaması artık kullanıma hazır! Şu şekilde erişebilirsiniz:

```bash
# Yerel geliştirme için
npm run dev

# Build için
npm run build
npm run preview
```

#### Yeni Özellikler

- **📱 PWA Desteği** - Offline oynanabilirlik
- **🌐 Multiplayer** - Gerçek zamanlı çoklu oyuncu
- **⚙️ Ayarlar Paneli** - Cross-platform senkronizasyon

## 🎮 Oyun Kuralları

### Okey Kuralları

- **4 Oyuncu** - 1 insan, 3 AI rakip
- **106 Taş** - Klasik okey taş seti
- **Gösterici ve Okey** - Rastgele belirlenen özel taşlar
- **El Bitişi** - Tüm taşları uygun şekilde gruplamak

### Oyun Akışı

1. **Dağıtım** - Her oyuncuya 14 taş verilir
2. **Yer Taşları** - 8 taş ortaya açılır
3. **Çekme Havuzu** - Kalan taşlar çekme havuzu olur
4. **Sırayla Oynama** - Her oyuncu sırayla taş çeker/atar
5. **Bitiş** - Çekme havuzu bittiğinde oyun otomatik biter

## 🛠️ Geliştirme Rehberi

### Gereksinimler

- **Node.js 18+**
- **npm** veya **yarn**
- **Git**

### Kurulum Komutları

```bash
# Ana proje klonlama
git clone https://github.com/GalaxySal/okey-game.git
cd okey-game

# Desktop uygulaması
cd okey-desktop
npm install
npm run tauri:dev

# Web uygulaması
cd ../okey-game
npm install
npm run dev
```

### Build Komutları

```bash
# Desktop build
npm run tauri:build

# Web build
npm run build
```

## 📁 Proje Yapısı

```plaintext
okey-game/
├── LICENSE                    # MIT Lisansı
├── README.md                  # Bu dosya
├── .gitignore                 # Git ignore kuralları
├── okey-desktop/              # Tauri Desktop Uygulaması
│   ├── src/                   # Kaynak kodlar
│   ├── src-tauri/             # Tauri Rust backend
│   └── package.json           # Desktop bağımlılıkları
└── okey-game/                 # React Web Uygulaması
    ├── src/                   # Web kaynak kodları
    ├── public/                # Statik dosyalar
    └── package.json           # Web bağımlılıkları
```

## 🤝 Katkıda Bulunma Rehberi

Katkılarınızı bekliyoruz! Lütfen şu adımları takip edin:

1. **Fork** yapın
2. **Feature branch** oluşturun (`git checkout -b feature/amazing-feature`)
3. **Değişikliklerinizi** commit edin (`git commit -m 'Add amazing feature'`)
4. **Branch'i push** edin (`git push origin feature/amazing-feature`)
5. **Pull Request** açın

### Katkı Standartları

- TypeScript ve ESLint kurallarına uyun
- Test yazın
- Dokümantasyon güncelleyin
- Türkçe yorum yazın

## 📊 Performans ve Sürüm Bilgileri

### ⚡ Build Performansı

| Platform | Build Süresi | Bundle Boyutu | Modül Sayısı | Gzip Boyutu |
|----------|-------------|---------------|-------------|-------------|
| **Desktop** | ~1.48s | 228.20 kB | 42 modül | 69.74 kB |
| **Web** | ~1.11s | 204.80 kB | 31 modül | 63.93 kB |

> **Not:** Build süreleri yüksek performanslı geliştirme makinesinde
> ölçülmüştür. Sonuçlar donanıma göre değişiklik gösterebilir.

### 🚀 Teknoloji Stack Performansı

- **Vite 7.1.9** - Ultra hızlı build sistemi
- **ESBuild** - JavaScript bundling için optimize motor
- **React 19.2.0** - En yeni React özellikler ve optimizasyonlar
- **TypeScript 5.9.3** - Gelişmiş tip kontrolü ve performans
- **Tauri 2.x** - Rust backend ile native performans

## 📈 Sürüm Geçmişi

### v1.0.0 (En Güncel) - 2025-10-14

#### Tüm Platformlar

- ✅ **Native Mobil Uygulama** - React Native ile iOS/Android tam destek
- ✅ **Gelişmiş Grafik Sistemi** - 3D taşlar ve animasyonlar
- ✅ **Sosyal Özellikler** - Profil sistemi ve arkadaş listesi
- ✅ **Turnuva Modu** - Çoklu oyun turnuvaları sistemi
- ✅ **Cross-Platform Sync** - Tüm cihazlar arası veri senkronizasyonu
- ✅ **Çoklu Dil Sistemi** - Türkçe ve İngilizce tam çeviri
- ✅ **PWA Özellikleri** - Offline oynanabilirlik ve mobil deneyim
- ✅ **Multiplayer Sistemi** - Socket.io ile gerçek zamanlı çoklu oyuncu
- ✅ **Gelişmiş AI Algoritmaları** - Stratejik karar verme sistemi

### v0.3.0 - 2025-10-11

#### Tüm Platformlar

- ✅ **Çoklu Dil Sistemi** - Türkçe ve İngilizce tam çeviri
- ✅ **Desktop → Web Aktarımı** - Ses efektleri ve gelişmiş UI
- ✅ **PWA Özellikleri** - Offline oynanabilirlik ve mobil deneyim
- ✅ **Multiplayer Sistemi** - Socket.io ile gerçek zamanlı çoklu oyuncu
- ✅ **Gelişmiş AI Algoritmaları** - Stratejik karar verme sistemi
- ✅ **Cross-Platform Senkronizasyon** - Tüm cihazlar arası veri eşlemesi

### v0.2.1 - 2025-10-09

#### Desktop Sürümü

- ✅ Web Audio API ses efektleri
- ✅ Otomatik oyun bitişi algılama
- ✅ Game Over Dialog kullanıcı arayüzü
- ✅ GitHub Releases otomatik güncelleme sistemi
- ✅ Gelişmiş skor ve istatistik sistemi
- ✅ TypeScript 5.9.3 ve React 19.2.0 güncellemeleri

### v0.1.0 - 2025

#### Web Sürümü

- ✅ Temel okey oyun mekanikleri
- ✅ AI rakip sistemi
- ✅ Responsive tasarım
- ✅ TypeScript desteği

### Gelecek Sürüm Planları

#### v1.1.0 (Planlanan)

- 🔴 **Gelişmiş Multiplayer** - Özel odalar ve sesli sohbet
- 🔴 **VR Desteği** - Sanal gerçeklik okey deneyimi
- 🔴 **Blockchain Entegrasyonu** - NFT koleksiyonları
- 🔴 **AI Koçu** - Kişiselleştirilmiş oyun önerileri

---

*Bu proje aktif olarak geliştirilmekte ve düzenli güncellemeler almaktadır.*

## 🙏 Teşekkürler

- **Türkçe Okey Kültürü** - Geleneksel oyunu yaşatan herkese
- **React & Tauri Ekibi** - Harika teknolojiler için
- **Topluluk** - Destek ve geri bildirimler için

## 📞 İletişim Bilgileri

- **GitHub Issues** - Hata bildirimleri ve özellik istekleri için
- **Pull Requests** - Kod katkıları için
- **Email** - [galaxy.sal@example.com](mailto:galaxy.sal@example.com)
  (proje sahibi ile iletişim için)

---

**⭐ Eğer projeyi beğendiyseniz yıldız verin!**
