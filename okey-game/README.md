# 🌐 Okey Oyunu - Web Uygulaması

> 🇹🇷 **Türkçe Klasik Okey Oyunu Web Sürümü** - Tarayıcıda okey oynayın!

## 🌟 Özellikler

### 🎯 Oyun Özellikleri

- **🎲 Klasik Okey Kuralları** - 106 taş ile tam kurallara uygun oynanış
- **🤖 Gelişmiş AI Rakipler** - Stratejik karar verme algoritması
- **🔊 Gerçekçi Ses Efektleri** - Web Audio API ile ses deneyimi
- **🏆 Skor Sistemi** - Detaylı oyun istatistikleri
- **🌍 Çoklu Dil Desteği** - Türkçe ve İngilizce tam çeviri
- **📱 PWA Özellikleri** - Offline oynanabilirlik
- **🌐 Multiplayer Sistemi** - Socket.io ile gerçek zamanlı çoklu oyuncu
- **⚙️ Ayarlar Paneli** - Cross-platform senkronizasyon

### 💻 Teknik Özellikler

- **🎵 Web Audio API** - Gerçekçi ses efektleri
- **📱 PWA Teknolojisi** - Offline oynanabilirlik ve mobil deneyim
- **🌐 Socket.io Client** - Gerçek zamanlı çoklu oyuncu sistemi
- **🔒 i18next** - Çoklu dil desteği ve çeviri yönetimi
- **📱 Mobil Uyumlu** - Dokunmatik kontroller
- **🔒 Tip Güvenliği** - TypeScript ile güçlü tip kontrolü
- **🎨 Modern UI** - Tailwind CSS ile şık arayüz
- **📦 Optimize Bundle** - Küçük dosya boyutu

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- **Node.js 18+**
- **npm** veya **yarn**
- **Modern web tarayıcısı**

### Kurulum

```bash
# Ana proje klasöründe
cd okey-game

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Build üret
npm run build
```

### Kullanım

1. **Geliştirme Sunucusu**: `npm run dev` komutu ile localhost'ta açılır
2. **Build**: `npm run build` komutu ile `dist/` klasörüne build üretir
3. **Preview**: `npm run preview` komutu ile build'i test edebilirsiniz

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
4. **Sırayla Oynama** - Her oyuncu sırayla taş çeker/atar
5. **Bitiş** - Çekme havuzu bittiğinde oyun otomatik biter

## 📁 Proje Yapısı

```plaintext
okey-game/
├── src/                       # Kaynak kodlar
│   ├── components/            # React bileşenleri
│   ├── hooks/                 # Özel React hook'ları
│   ├── utils/                 # Yardımcı fonksiyonlar
│   ├── types/                 # TypeScript tip tanımları
│   ├── assets/                # Statik varlıklar
│   └── styles/                # CSS stilleri
├── public/                    # Public dosyalar
├── index.html                 # Ana HTML dosyası
├── package.json               # Proje bağımlılıkları
├── vite.config.ts             # Vite yapılandırması
├── tsconfig.json              # TypeScript yapılandırması
└── tailwind.config.js         # Tailwind CSS yapılandırması
```

## 🛠️ Geliştirme

### Kullanılan Teknolojiler

- **React 19.2.0** - Modern React özellikleri
- **TypeScript 5.9.3** - Tip güvenliği
- **Vite 7.1.9** - Hızlı build sistemi
- **Tailwind CSS 4.1.14** - Utility-first CSS framework
- **ESLint 8.46.0** - Kod kalitesi kontrolü

### Geliştirme Komutları

```bash
# Geliştirme sunucusu
npm run dev

# Build üret
npm run build

# Preview build
npm run preview

# Lint kontrolü
npm run lint

# Type check
npm run type-check
```

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Katkı Kuralları

- TypeScript ve ESLint kurallarına uyun
- Responsive tasarım prensiplerini takip edin
- Türkçe yorum yazın
- Test yazın

## 📊 Performans

### Build Metrikleri

- **Build Süresi**: ~1.11s
- **Bundle Boyutu**: 204.80 kB
- **Gzip Boyutu**: 63.93 kB
- **Modül Sayısı**: 31 modül

## 🔗 İlgili Bağlantılar

- **Ana Proje**: [Okey Oyunu Ana README](../README.md)
- **Desktop Uygulaması**: [Desktop README](../okey-desktop/README.md)
- **Lisans**: [MIT License](../LICENSE)

## 📞 Destek

Herhangi bir sorun yaşarsanız:

1. GitHub Issues sayfasını kullanın
2. Sorun açıklamasını detaylı yazın
3. Hata mesajlarını ekleyin
4. Ekran görüntüleri ekleyin

---

**⭐ Eğer projeyi beğendiyseniz yıldız verin!**
