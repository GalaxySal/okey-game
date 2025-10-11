# 🖥️ Okey Oyunu - Desktop Uygulaması

> 🇹🇷 **Türkçe Klasik Okey Oyunu Desktop Sürümü** - Yerel uygulamada okey oynayın!

## 🌟 Özellikler

### 🎯 Oyun Özellikleri

- **🎲 Klasik Okey Kuralları** - 106 taş ile tam kurallara uygun oynanış
- **🤖 Akıllı AI Rakipler** - Stratejik karar verme algoritması
- **🎵 Gerçekçi Ses Efektleri** - Web Audio API ile ses deneyimi
- **🏆 Skor Sistemi** - Detaylı oyun istatistikleri
- **🎨 Modern UI/UX** - Yerel uygulama görünümü
- **🌍 Çoklu Dil Desteği** - Türkçe ve İngilizce tam çeviri

### 💻 Teknik Özellikler

- **⚡ Yerel Performans** - Rust backend ile yüksek hız
- **🔒 Güvenlik** - Yerel dosya sistemi erişimi
- **📦 Tek Dosya Dağıtım** - Portable uygulama
- **🔄 Otomatik Güncelleme** - GitHub Releases üzerinden
- **🖱️ Yerel Kontroller** - Mouse ve klavye desteği
- **📱 Cross-Platform** - Windows desteği

## 🚀 Kurulum ve Çalıştırma

### Sistem Gereksinimleri

- **Windows 10/11** (64-bit)
- **WebView2 Runtime** (Windows 10 ile otomatik yüklenir)
- **En az 100MB boş disk alanı**

### Kurulum

```bash
# Ana proje klasöründe
cd okey-desktop

# Bağımlılıkları yükle
npm install

# Geliştirme modunda çalıştır
npm run tauri:dev

# Build üret (Release için)
npm run tauri:build
```

### Kullanım

1. **Geliştirme**: `npm run tauri:dev` ile geliştirme ortamında çalışır
2. **Build**: `npm run tauri:build` ile release build üretir
3. **Dağıtım**: `src-tauri/target/release/` klasöründen `.exe` dosyası

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
okey-desktop/
├── src/                       # React frontend
│   ├── components/            # React bileşenleri
│   ├── assets/                # Statik varlıklar
│   ├── types/                 # TypeScript tipleri
│   └── App.tsx                # Ana uygulama
├── src-tauri/                 # Rust backend
│   ├── src/                   # Rust kaynak kodları
│   ├── icons/                 # Uygulama ikonları
│   ├── Cargo.toml             # Rust bağımlılıkları
│   └── tauri.conf.json        # Tauri yapılandırması
├── public/                    # Public dosyalar
├── package.json               # Node bağımlılıkları
├── vite.config.ts             # Vite yapılandırması
├── tsconfig.json              # TypeScript yapılandırması
└── tailwind.config.js         # Tailwind CSS yapılandırması
```

## 🛠️ Geliştirme

### Kullanılan Teknolojiler

- **Tauri 2.x** - Desktop uygulama framework'ü
- **React 19.2.0** - Frontend framework
- **TypeScript 5.9.3** - Tip güvenliği
- **Rust 1.70+** - Backend performans
- **Vite 7.1.9** - Build sistemi
- **Tailwind CSS 4.1.14** - Styling

### Geliştirme Komutları

```bash
# Geliştirme ortamı
npm run tauri:dev

# Sadece frontend (web gibi)
npm run dev

# Build üret
npm run tauri:build

# Sadece Rust build
npm run tauri:build -- --no-bundle

# Test çalıştırma
npm run test
```

### Debug Modları

- **Console Logları**: Tarayıcı dev tools'da görülebilir
- **Rust Debug**: `src-tauri/src/main.rs` içinde log ekleyin
- **Hot Reload**: React değişiklikleri otomatik reload olur

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Katkı Kuralları

- TypeScript ve ESLint kurallarına uyun
- Rust kod standartlarına uyun
- Desktop uygulama UX prensiplerini takip edin
- Türkçe yorum yazın

## 📊 Performans

### Build Metrikleri

- **Build Süresi**: ~1.48s
- **Desktop Uygulama Boyutu**: 228.20 kB
- **Gzip Boyutu**: 69.74 kB
- **Modül Sayısı**: 42 modül

### Donanım Gereksinimleri

- **RAM**: Minimum 512MB
- **CPU**: 64-bit destekli işlemci
- **Disk**: 100MB boş alan
- **OS**: Windows 10/11

## 🔗 İlgili Bağlantılar

- **Ana Proje**: [Okey Oyunu Ana README](../README.md)
- **Web Uygulaması**: [Web README](../okey-game/README.md)
- **Lisans**: [MIT License](../LICENSE)
- **Tauri Dokümantasyonu**: [https://tauri.app/](https://tauri.app/)

## 📞 Destek

Herhangi bir sorun yaşarsanız:

1. GitHub Issues sayfasını kullanın
2. Sorun açıklamasını detaylı yazın
3. Hata mesajlarını ekleyin
4. Ekran görüntüleri ekleyin
5. Sistem bilgilerinizi belirtin

## 🚨 Sorun Giderme

### Yaygın Sorunlar

**Uygulama Açılmıyor:**

- WebView2 Runtime yüklü mü kontrol edin
- Windows güncellemelerini kontrol edin

**Performans Sorunu:**

- Diğer uygulamaları kapatın
- Sistem kaynaklarını kontrol edin

**Güncelleme Sorunu:**

- İnternet bağlantısını kontrol edin
- Güvenlik duvarı ayarlarını kontrol edin

---

**⭐ Eğer projeyi beğendiyseniz yıldız verin!**
