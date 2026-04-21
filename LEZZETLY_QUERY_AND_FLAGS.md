# Lezzetly — TanStack Query, enum ve feature flag kullanım rehberi

Bu doküman, projede **API yollarının tek merkezden** yönetilmesi, **TanStack Query anahtarlarının** bu yollarla hizalanması, **domain enum** kullanımı ve **backend feature flag** yapısının nasıl kullanılacağını özetler.

---

## 1. API yolları (`queryEndpoints`)

Tüm REST path stringleri [`frontend/src/lib/query-endpoints.ts`](frontend/src/lib/query-endpoints.ts) içinde `queryEndpoints` nesnesinde toplanır.

Örnek:

```ts
import { queryEndpoints } from "@/lib/query-endpoints";

// Giriş
await apiJson(queryEndpoints.auth.customerLogin, { method: "POST", ... });

// İşletme profili
await apiJson(queryEndpoints.restaurants.ownerProfile);

// Geçmiş rezervasyonlar
const url = `${queryEndpoints.reservations.mePast}?restaurantId=${id}&limit=5`;
```

**Kural:** Servis dosyalarında (`services/*.ts`) ham `"/api/..."` stringi yazmayın; `queryEndpoints` kullanın.

---

## 2. TanStack Query anahtarları (`queryKeys`)

Query key’ler [`frontend/src/lib/query-keys.ts`](frontend/src/lib/query-keys.ts) dosyasında tanımlıdır ve mümkün olduğunca **`queryEndpoints` ile aynı segmenti** içerir (invalidasyon ve arama tutarlı olsun diye).

Örnek kullanım:

```ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchOwnerRestaurantProfile } from "@/services/restaurants";

useQuery({
  queryKey: queryKeys.owner.restaurantProfile(),
  queryFn: fetchOwnerRestaurantProfile,
});
```

`queryKeys.reservations.availability(restaurantId, date)` gibi fonksiyonlar, hem endpoint bilgisini hem de değişken parametreleri anahtara gömer.

---

## 3. Domain yolları ve API eşlemesi (`types/enums.ts`)

Rol ve rezervasyon durumu için merkezi **yol enum’ları** ve API wire değerleriyle köprüleyen haritalar [`frontend/src/types/enums.ts`](frontend/src/types/enums.ts) içindedir:

- `UserRolePath` — `/customer`, `/owner`, `/admin` (API `user.role` ↔ `parseUserRolePath` / `userRolePathByApi`)
- `ReservationStatusPath` — `/pending`, `/confirmed`, `/cancelled` (API `status` ↔ `parseReservationStatusPath`)
- `AppRoute` — Next.js UI yolları (`/profile`, `/owner/profile`, …)

Örnek (navbar):

```ts
import { UserRolePath } from "@/types/enums";

const isOwner = currentUserQuery.data?.role === UserRolePath.OWNER;
```

`useCurrentUser` hook’u API’den gelen `role` stringini `parseUserRolePath` ile `UserRolePath` olarak cache’e yazar.

---

## 4. Backend feature flag yapısı

### Konfigürasyon

[`backend/src/main/resources/application.properties`](backend/src/main/resources/application.properties):

- `app.feature-flags.auto-verify-email` — kayıtta kullanıcı `active` alanını kontrol eder.
- `app.feature-flags.mock-notification-enabled` — geliştirme amaçlı log (örnek ikinci flag).

Ortam değişkenleri: `APP_FEATURE_FLAGS_AUTO_VERIFY_EMAIL`, `APP_FEATURE_FLAGS_MOCK_NOTIFICATION_ENABLED`.

### Merkezi servis

[`backend/src/main/java/com/lezzetly/backend/service/FeatureFlagService.java`](backend/src/main/java/com/lezzetly/backend/service/FeatureFlagService.java) arayüzü ve [`DefaultFeatureFlagService`](backend/src/main/java/com/lezzetly/backend/service/DefaultFeatureFlagService.java) implementasyonu.

[`ApplicationBeans`](backend/src/main/java/com/lezzetly/backend/config/ApplicationBeans.java) içinde property’lerden bean üretilir.

### Register akışında `autoVerifyEmail`

[`DefaultAuthService`](backend/src/main/java/com/lezzetly/backend/service/DefaultAuthService.java) içinde yeni kullanıcı:

```java
new User(
    null,
    firstName,
    lastName,
    email,
    null,
    passwordEncoder.encode(password),
    role,
    featureFlagService.isAutoVerifyEmailEnabled(), // active
    null,
    null
);
```

`true` iken hesap doğrudan aktif; `false` iken pasif başlar (doğrulama akışına hazırlık).

### Mock bildirim örneği

Aynı serviste `mockNotificationEnabled` açıksa kayıt sonrası logger ile bilgi satırı üretilir (gerçek SMS/e-posta yok).

---

## 5. Özet tablo

| Konu | Dosya |
|------|--------|
| API path sabitleri | `frontend/src/lib/query-endpoints.ts` |
| Query key fabrikaları | `frontend/src/lib/query-keys.ts` |
| Domain enum | `frontend/src/types/enums.ts` |
| Multipart (görsel) | `frontend/src/lib/api-client.ts` → `apiFormData` |
| Feature flag config | `backend/src/main/resources/application.properties` |
| Flag çözümleme | `backend/.../DefaultFeatureFlagService.java` |
| Email auto-verify | `backend/.../DefaultAuthService.java` (register) |

---

## 6. İşletme görselleri (binary)

- Migration: [`backend/sql/postgresql/V3__restaurant_binary_images_and_user_phone.sql`](backend/sql/postgresql/V3__restaurant_binary_images_and_user_phone.sql)
- Public GET: `GET /api/restaurants/{id}/images/{main|detail1|detail2}`
- Owner multipart: `POST /api/restaurants/owner/profile/images` (alan adları: `mainImage`, `detailImage1`, `detailImage2`)

Frontend’de örnek: [`frontend/src/app/owner/profile/page.tsx`](frontend/src/app/owner/profile/page.tsx) (PrimeReact `FileUpload` + `Tooltip`).
