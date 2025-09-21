# BuddyAI - Kişisel Asistan Sistemi

BuddyAI, kullanıcıların günlük rutinlerini takip etmelerine ve kişisel gelişimlerine yardımcı olan bir kişisel asistan sistemidir. iPhone Safari ile ana ekrana eklenerek mobil uygulama deneyimi sunar.

## 🚀 Özellikler

### 📱 PWA (Progressive Web App)
- iPhone Safari ile ana ekrana ekleme
- Offline çalışma desteği
- Native uygulama deneyimi

### 📋 Rutin Yönetimi
- **9 Varsayılan Rutin**: Yemek, Spor, Namaz, Ezber, Zincir, Sureler, Evcil Hayvan, Diş Fırçalama, Ev Temizliği
- **Özel Rutin Oluşturma**: Kullanıcı tanımlı rutinler
- **Esnek Sıklık**: Günlük, haftalık, özel günler, zaman aralıkları
- **Hatırlatıcılar**: Zamanlanmış bildirimler

### 📅 Takvim Sistemi
- Günlük görev yönetimi
- Haftalık planlama
- Öncelik sıralaması
- İlerleme takibi

### 📊 İlerleme Takibi
- Günlük, haftalık, aylık raporlar
- Zincir sistemi
- Başarı rozetleri
- Motivasyon mesajları

### 🔔 Bildirim Sistemi
- Push notifications
- Rutin hatırlatıcıları
- Başarı bildirimleri
- Motivasyon mesajları

### ⚙️ Ayarlar
- Tema seçimi (Açık/Koyu/Otomatik)
- Bildirim ayarları
- Veri dışa/içe aktarma
- Veri temizleme

## 🛠️ Teknolojiler

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **PWA**: Service Worker, Web App Manifest
- **Storage**: LocalStorage, IndexedDB
- **Notifications**: Web Notifications API
- **Design**: Modern, responsive, mobile-first

## 📁 Proje Yapısı

```
BuddyAI/
├── index.html          # Ana HTML dosyası
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker
├── css/
│   └── styles.css     # Ana CSS dosyası
├── js/
│   ├── app.js         # Ana uygulama
│   ├── routines.js    # Rutin yönetimi
│   ├── calendar.js    # Takvim sistemi
│   ├── progress.js    # İlerleme takibi
│   ├── notifications.js # Bildirim sistemi
│   └── storage.js     # Veri yönetimi
└── icons/             # PWA iconları
```

## 🚀 Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/dgdfurkan/BuddyAI.git
cd BuddyAI
```

2. Bir web sunucusunda çalıştırın:
```bash
# Python ile
python3 -m http.server 8000

# Node.js ile
npx serve .

# PHP ile
php -S localhost:8000
```

3. Tarayıcıda `http://localhost:8000` adresini açın

4. iPhone Safari'de "Ana Ekrana Ekle" ile PWA olarak yükleyin

## 📱 Kullanım

### Ana Sayfa
- Günlük rutin özeti
- Hızlı erişim butonları
- Motivasyon mesajları

### Rutinler
- Varsayılan rutinleri görüntüleme
- Yeni rutin oluşturma
- Rutin tamamlama ve zincir takibi

### Takvim
- Günlük görev ekleme
- Tarih seçimi ve görev yönetimi
- Öncelik belirleme

### İlerleme
- Günlük/haftalık/aylık raporlar
- Başarı istatistikleri
- Motivasyon takibi

## 🎯 Varsayılan Rutinler

1. **🍽️ Yemek Rutini** - Günlük öğün planlaması ve kalori takibi
2. **💪 Spor Rutini** - Egzersiz planlaması ve kalori yakım takibi
3. **🕌 Namaz Rutini** - Namaz vakitleri ve dua takibi
4. **📖 Ezber Rutini** - Sure ezberleme ve tekrar sistemi
5. **🔗 Zincir Rutini** - Kötü alışkanlık kırma ve motivasyon
6. **📜 Sureler Rutini** - Kur'an okuma takibi ve sure listesi
7. **🐕 Evcil Hayvan Besleme** - Besleme zamanları ve sağlık takibi
8. **🦷 Diş Fırçalama** - Günlük fırçalama takibi ve hatırlatıcılar
9. **🧹 Ev Temizliği** - Temizlik planlaması ve haftalık görevler

## 🔧 Geliştirme

### Yeni Rutin Ekleme
```javascript
// routines.js içinde getDefaultRoutines() metoduna ekleyin
{
    id: 'yeni-rutin',
    name: 'Yeni Rutin',
    description: 'Açıklama',
    icon: '🎯',
    frequency: 'daily',
    time: '09:00',
    completed: false,
    streak: 0,
    category: 'custom'
}
```

### Bildirim Ekleme
```javascript
// notifications.js içinde
window.notificationsManager.sendCustomNotification(
    'Başlık',
    'Mesaj içeriği',
    { icon: '/icons/icon-192x192.png' }
);
```

## 📊 Veri Yapısı

### Rutin Objesi
```javascript
{
    id: 'unique-id',
    name: 'Rutin Adı',
    description: 'Açıklama',
    icon: '🎯',
    frequency: 'daily|weekly|custom',
    time: 'HH:MM',
    completed: boolean,
    streak: number,
    category: 'health|spiritual|personal|care|home|custom',
    notifications: boolean,
    weeklyDays: [1,2,3], // Pazartesi=1, Pazar=0
    customInterval: number // gün cinsinden
}
```

### Görev Objesi
```javascript
{
    id: 'unique-id',
    title: 'Görev Başlığı',
    description: 'Açıklama',
    date: 'YYYY-MM-DD',
    time: 'HH:MM',
    priority: 'low|medium|high',
    completed: boolean,
    createdAt: 'ISO string'
}
```

## 🎯 Gelecek Özellikler

- [ ] Veri senkronizasyonu
- [ ] Sosyal özellikler
- [ ] AI destekli öneriler
- [ ] Daha fazla rutin türü
- [ ] Gelişmiş analitik
- [ ] Tema özelleştirme

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Proje hakkında sorularınız için issue açabilirsiniz.

---

**BuddyAI** - Kişisel gelişiminizin yoldaşı 🤖✨