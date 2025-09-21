# GitHub Pages Kurulum Talimatları

## 🚀 GitHub Pages Aktivasyonu

1. **GitHub Repository'ye Git**:
   - https://github.com/dgdfurkan/BuddyAI adresine gidin

2. **Settings Sekmesine Tıklayın**:
   - Repository'nin üst menüsünde "Settings" sekmesine tıklayın

3. **Pages Bölümünü Bulun**:
   - Sol menüde "Pages" seçeneğini bulun ve tıklayın

4. **Source Ayarlarını Yapın**:
   - "Source" bölümünde "Deploy from a branch" seçin
   - "Branch" dropdown'ından "gh-pages" seçin
   - "Folder" olarak "/ (root)" seçin
   - "Save" butonuna tıklayın

5. **Yayın Bekleyin**:
   - GitHub Pages'in aktif olması 1-2 dakika sürebilir
   - Yeşil tik işareti göründüğünde hazır demektir

## 🌐 Canlı URL

Projeniz şu adreste yayınlanacak:
**https://dgdfurkan.github.io/BuddyAI/**

## 📱 PWA Test

1. **Canlı URL'yi Açın**:
   - https://dgdfurkan.github.io/BuddyAI/ adresini tarayıcıda açın

2. **iPhone Safari Test**:
   - iPhone Safari'de URL'yi açın
   - Alt menüdeki "Paylaş" butonuna dokunun
   - "Ana Ekrana Ekle" seçeneğini seçin
   - Uygulama ana ekranınıza eklenecek

3. **PWA Özelliklerini Test Edin**:
   - Offline çalışma
   - Bildirimler
   - Native uygulama deneyimi

## 🔧 Güncelleme Süreci

Projeyi güncellemek için:

1. **Değişiklikleri Yapın**:
   ```bash
   # Değişikliklerinizi yapın
   git add .
   git commit -m "feat: yeni özellik eklendi"
   ```

2. **Main Branch'e Push**:
   ```bash
   git push origin main
   ```

3. **GitHub Pages'i Güncelle**:
   ```bash
   git checkout gh-pages
   git merge main
   git push origin gh-pages
   ```

## 📊 GitHub Pages Avantajları

- ✅ **Ücretsiz Hosting**: GitHub tarafından sağlanan ücretsiz hosting
- ✅ **HTTPS**: Otomatik SSL sertifikası
- ✅ **Custom Domain**: Kendi domain'inizi kullanabilirsiniz
- ✅ **CDN**: Hızlı yükleme için global CDN
- ✅ **Otomatik Deploy**: Her push'ta otomatik güncelleme

## 🎯 BuddyAI Özellikleri

- **PWA**: iPhone Safari ile ana ekrana ekleme
- **9 Varsayılan Rutin**: Sağlık, ruhani, kişisel gelişim
- **Takvim Sistemi**: Günlük görev yönetimi
- **İlerleme Takibi**: Detaylı raporlar
- **Bildirimler**: Push notifications
- **Offline Çalışma**: Service Worker ile
- **Mobil Optimizasyon**: iPhone Safari uyumluluğu

---

**BuddyAI** artık canlı! Kişisel gelişiminizin yoldaşı olarak hizmet verecek. 🤖✨
