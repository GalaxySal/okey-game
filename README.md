# 🎮 Okey Oyunu - Türkçe Klasik Okey

> 🇹🇷 **Türkçe Klasik Okey Oyunu** - Geleneksel okey kuralları ile modern teknoloji birleşiyor!

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
- **🌍 Çoklu Dil Desteği** - İngilizce ve diğer diller (yakında)

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

Web uygulaması henüz geliştirme aşamasındadır. GitHub Pages üzerinden yayınlandığında buradan erişebilirsiniz.

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

> **Not:** Build süreleri yüksek performanslı geliştirme makinesinde ölçülmüştür. Sonuçlar donanıma göre değişiklik gösterebilir.

### 🚀 Teknoloji Stack Performansı

- **Vite 7.1.9** - Ultra hızlı build sistemi
- **ESBuild** - JavaScript bundling için optimize motor
- **React 19.2.0** - En yeni React özellikler ve optimizasyonlar
- **TypeScript 5.9.3** - Gelişmiş tip kontrolü ve performans
- **Tauri 2.x** - Rust backend ile native performans

## 📈 Sürüm Geçmişi

### v0.2.1 (En Güncel) - 2025

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

### Gelecek Sürümler

#### v0.3.0 (Yakında)

- 🟡 Çoklu dil sistemi (İngilizce)
- 🟡 Web platformuna desktop özellikleri aktarımı
- 🟡 PWA (Progressive Web App) özellikleri

#### v1.0.0 (Planlanan)

- 🔴 Çoklu oyuncu sistemi (Socket.io)
- 🔴 Gelişmiş AI algoritmaları
- 🔴 Mobil uygulama (Flutter/React Native)
- 🔴 Cross-platform senkronizasyon

---

*Bu proje aktif olarak geliştirilmekte ve düzenli güncellemeler almaktadır.*

## 🙏 Teşekkürler

- **Türkçe Okey Kültürü** - Geleneksel oyunu yaşatan herkese
- **React & Tauri Ekibi** - Harika teknolojiler için
- **Topluluk** - Destek ve geri bildirimler için

## 📞 İletişim Bilgileri

- **GitHub Issues** - Hata bildirimleri ve özellik istekleri için
- **Pull Requests** - Kod katkıları için
- **Email** - [galaxy.sal@example.com](mailto:galaxy.sal@example.com) (proje sahibi ile iletişim için)

---

**⭐ Eğer projeyi beğendiyseniz yıldız verin!**
