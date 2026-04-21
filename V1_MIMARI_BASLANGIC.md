# Lezzetly — v1 Başlangıç Mimarisi ve İlk Adım

Bu belge, öğrenme odaklı ve sürdürülebilir bir temel için v1 kapsamını, domain taslağını, klasör yapılarını, ilk geliştirme akışını, API başlangıcını ve teknik kararları özetler.

---

## 1. Projenin ilk sürüm (v1) kapsamı

### v1 içinde olacaklar

- Restoran listesi ve seçimi (başlangıçta bellek içi veya basit veri kaynağı; kalıcılık sonraki iterasyon).
- Rezervasyon oluşturma çekirdeği: tarih, başlangıç–bitiş saati, süre ve süreye bağlı fiyat hesabı.
- OpenAPI/Swagger ile sözleşmenin görünür olması.
- Next.js App Router, TanStack Query ile sunucu verisi ve referans listeleri için önbellek stratejisi başlangıcı.
- Feature flag okuma (yapılandırma veya basit API); yönetim arayüzü minimal veya sonraki sprint.
- Merkezi hata yanıtı ve doğrulama iskeleti (backend).
- CORS ve yerel geliştirme akışının çalışır olması.

### v1 dışında bırakılanlar (bilinçli sınır)

- Gerçek ödeme sağlayıcı entegrasyonu ve PCI kapsamı.
- Tam kimlik doğrulama (JWT/OAuth) ve rol bazlı admin paneli işlevleri (v1’de iskelet veya stub yeterli).
- Gelişmiş çakışma/kapasite motoru, bildirimler, çoklu dil, raporlama.
- ORM ile kalıcı domain; hedef mimari JDBC + repository (JPA bağımlılığı aşamalı kaldırılacak şekilde planlanır).

---

## 2. Domain model taslağı

### User

| Alan | Açıklama |
|------|----------|
| **Amaç** | Sisteme giriş yapan ve rezervasyon yapan kişi; ileride profil ve roller. |
| **Temel alanlar** | `id`, `email`, `passwordHash` (ileride), `displayName`, `createdAt`, `status`. |
| **İlişkiler** | Bir kullanıcının birden çok `Reservation` kaydı olabilir; `Payment` ile ilişki ileride. |

### Restaurant

| Alan | Açıklama |
|------|----------|
| **Amaç** | Rezervasyon yapılabilen işletme. |
| **Temel alanlar** | `id`, `name`, `description`, `timezone`, `active`, `pricePerHour` (veya `PricingRule` referansı). |
| **İlişkiler** | Birden çok `Reservation`; fiyat kuralları için `PricingRule` (isteğe bağlı override). |

### Reservation

| Alan | Açıklama |
|------|----------|
| **Amaç** | Belirli restoran ve zaman aralığı için rezervasyon kaydı. |
| **Temel alanlar** | `id`, `restaurantId`, `userId` (ileride), `date`, `startTime`, `endTime`, `durationMinutes`, `totalPrice`, `status`. |
| **İlişkiler** | `Restaurant`, `User`, ileride `Payment`. |

### PricingRule

| Alan | Açıklama |
|------|----------|
| **Amaç** | Süre ve birim fiyat mantığını yapılandırılabilir kılmak (restoran bazlı veya global). |
| **Temel alanlar** | `id`, `scope` (GLOBAL / RESTAURANT), `restaurantId` (opsiyonel), `pricePerHour`, `minimumMinutes`, `maximumMinutes`. |
| **İlişkiler** | İsteğe bağlı `Restaurant`; `Reservation` hesaplamasında kullanılır. |

### Payment

| Alan | Açıklama |
|------|----------|
| **Amaç** | Rezervasyon için ödeme kaydı; v1 sonrası gerçek tahsilat. |
| **Temel alanlar** | `id`, `reservationId`, `amount`, `currency`, `status`, `providerReference`. |
| **İlişkiler** | `Reservation` ile bire bir veya bir çoğa (iade senaryoları ileride). |

### FeatureFlag

| Alan | Açıklama |
|------|----------|
| **Amaç** | Özellikleri ortam veya anlık kararla açıp kapatmak. |
| **Temel alanlar** | `key`, `enabled`, `description`, `updatedAt`. |
| **İlişkiler** | Doğrudan entity ilişkisi yok; uygulama ve API katmanında davranışı yönlendirir. |

---

## 3. Backend klasör yapısı (öneri)

Paket kökü: `com.lezzetly.backend`

```
com.lezzetly.backend
├── BackendApplication.java
├── config              # Security, CORS, OpenAPI, ileride manuel bean tanımları
├── controller          # REST uçları (ince katman)
├── service             # Uygulama servis arayüzleri ve uygulamaları
├── repository          # Veri erişim arayüzleri
│   └── memory          # Geçici in-memory uygulamalar (ileride jdbc vb.)
├── domain              # Zengin model veya kayıt tipleri (JPA entity zorunluluğu yok)
├── dto                 # İstek/yanıt DTO’ları
└── exception           # Özel istisnalar ve @ControllerAdvice
```

- **Controller:** HTTP ve DTO eşlemesi; iş kuralı yok veya minimal.
- **Service:** Süre, fiyat, durum geçişleri burada toplanır.
- **Repository:** ORM yok; arayüz + ileride `JdbcTemplate` veya saf JDBC ile somut sınıflar.
- **DTO / domain ayrımı:** API stabilitesi için DTO; domain iç işler için.

---

## 4. Frontend klasör yapısı (öneri — App Router)

```
frontend/src
├── app                      # Rotalar, layout, providers sarmalayıcı
├── components               # Ortak UI (buttons, layout parçaları)
├── features
│   └── reservation          # Rezervasyon akışı: sayfa parçaları, feature bileşenleri
├── hooks                    # Custom hook’lar (useRestaurants, useCreateReservation)
├── lib                      # query-client, feature-flags, env yardımcıları
├── services                 # fetch/HTTP çağrıları (TanStack Query bunları kullanır)
└── store                    # Zustand yalnız gerekirse (ör. çok adımlı form taslak durumu)
```

- **TanStack Query:** `lib/query-client.ts` + `app/providers.tsx` içinde `QueryClientProvider`.
- **Feature-based:** `features/reservation` altında akışa özel bileşenler ve hook’lar.
- **Zustand:** Başlangıçta klasör boş veya tek bir `reservation-draft-store` ileride; sunucu verisi Query’de kalır.

---

## 5. İlk geliştirilecek akış

**Akış:** Kullanıcı restoran seçer → tarih → başlangıç ve bitiş saati → sistem süreyi hesaplar → süreye göre fiyatı hesaplar → rezervasyon oluşturulur.

**Neden ilk adım:** Ürün değerini ve uçtan uca entegrasyonu (API sözleşmesi, doğrulama, hesaplama, UI veri akışı) tek seferde öğrenmeyi sağlar; sonraki auth, ödeme ve admin bu çekirdeğe eklenir.

**Backend parçaları**

- `RestaurantRepository` + listeleme servisi.
- `ReservationService`: süre hesabı, fiyat kuralı uygulaması, durum ataması, kayıt (v1 başında bellek).
- `ReservationRepository` arayüzü (kalıcılık için hazır).
- DTO doğrulama ve merkezi hata yanıtları.

**Frontend parçaları**

- `useRestaurants` (query): restoran listesi, makul `staleTime` ile önbellek.
- Rezervasyon formu: tarih + iki saat alanı; gönderim mutation ile POST.
- Özet gösterimi: dönen `durationMinutes` ve `totalPrice` (sunucu kaynağı doğruluk için).

---

## 6. API tasarım başlangıcı (taslak)

| Alan | Method | Örnek route | Amaç |
|------|--------|-------------|------|
| auth | POST | `/api/auth/register` | Kullanıcı kaydı (v1 stub veya sonraki iterasyon). |
| auth | POST | `/api/auth/login` | Oturum / token (v1 stub veya sonraki iterasyon). |
| restaurants | GET | `/api/restaurants` | Aktif restoran listesi. |
| restaurants | GET | `/api/restaurants/{id}` | Restoran detayı. |
| reservations | POST | `/api/reservations` | Rezervasyon oluşturma (süre ve fiyat sunucuda hesaplanır). |
| reservations | GET | `/api/reservations` | Kullanıcı rezervasyonları (auth sonrası; v1’de genel liste veya stub). |
| admin/restaurants | POST | `/api/admin/restaurants` | Restoran oluşturma (yetki ileride). |
| admin/restaurants | PATCH | `/api/admin/restaurants/{id}` | Güncelleme / pasifleştirme. |
| admin/reservations | GET | `/api/admin/reservations` | Filtreli liste. |
| admin/reservations | PATCH | `/api/admin/reservations/{id}/status` | Durum güncelleme. |
| feature-flags | GET | `/api/feature-flags` | İstemcinin okuyacağı bayraklar. |

---

## 7. Teknik kararlar (kısa)

| Konu | Karar |
|------|--------|
| **Swagger ilk aşamada** | Sözleşmeyi erken sabitler; frontend ve testler aynı doğruda ilerler; entegrasyon maliyetini düşürür. |
| **TanStack Query** | Tüm sunucu kaynaklı okuma/yazma (restoran listesi, rezervasyon oluşturma mutation, referans/enum uçları); yeniden deneme ve önbellek tek yerde. |
| **Zustand** | Yalnızca sunucuya gitmeyen UI/form taslak durumu veya sihirbaz adımı gerektiğinde; global “sunucu cache” için kullanılmaz. |
| **Önbellek** | Restoran ve feature-flag listeleri: uzun `staleTime`, gerektiğinde `queryKey` ile invalidation; rezervasyon detayı kısa ömürlü veya fetch sonrası invalidation. |
| **Feature flag** | İlk günden `key → boolean` sözleşmesi ve tek okuma uç noktası; UI’da dallanma küçük yardımcı fonksiyonlarla; admin yazımı v1 sonuna veya v2’ye bırakılabilir. |

---

**Uygulama notu:** Bu belgeyle uyumlu olarak repoda şu iskelet uygulanmıştır: backend’de `config` (güvenlik, CORS, `ApplicationBeans`), `controller`, `service`, `repository` + `repository/memory`, `domain`, `dto`, `exception`; Swagger bağımlılığı ve örnek uçlar (`/api/restaurants`, `POST /api/reservations`, `/api/feature-flags`); frontend’de `AppProviders` (TanStack Query), `services`, `hooks`, `features/reservation`, `/rezervasyon` sayfası ve `store` için boş yer tutucu. Admin ve auth uçları şimdilik yalnızca bu belgedeki API taslağında tanımlıdır.
