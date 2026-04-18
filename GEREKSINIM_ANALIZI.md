# Lezzetly — Gereksinim Analizi

**Belge türü:** Yazılım gereksinim analizi (fonksiyonel ve fonksiyonel olmayan)  
**Kapsam:** Restoran seçimi, rezervasyon, fiyatlandırma, ödeme, yönetim ve profesyonel geliştirme süreçleri  

---

## 1. Genel Sistem Gereksinimleri

1. Sistem, Lezzetly uygulamasının restoran keşfi, rezervasyon ve ilgili işlemleri tek bir tutarlı ürün deneyimi altında sunabilmelidir.  
2. Sistem, standartlaştırılmış log seviyeleri ve izlenebilir hata/olay kayıtları ile çalışabilmelidir.  

---

## 2. Kullanıcı Gereksinimleri

3. Kullanıcı, sisteme kayıt olabilmeli ve kimlik bilgileri ile oturum açabilmelidir.  
4. Kullanıcı, oturumunu güvenli şekilde sonlandırabilmelidir.  
5. Kullanıcı, profilinde temel iletişim bilgilerini görüntüleyebilmeli ve güncelleyebilmelidir.  
6. Kullanıcı, restoran listesini ve restoran detayında işletmeye ait tanımlı temel bilgileri görüntüleyebilmelidir.  
7. Kullanıcı, geçmiş ve gelecek rezervasyonlarını listeleyebilmeli ve iptal kuralları çerçevesinde uygun rezervasyonunu iptal edebilmelidir.  

---

## 3. Restoran ve Rezervasyon Gereksinimleri

8. Sistem, her restoran için benzersiz kimlik ve temel meta verileri saklayabilmelidir.  
9. Admin, restoran kayıtlarını oluşturabilmeli, güncelleyebilmeli ve pasifleştirerek veya görünürlüğü yöneterek yeni rezervasyonlarda seçilemez hale getirebilmelidir.  
10. Kullanıcı, rezervasyon akışında hangi restorandan rezervasyon yapmak istediğini açıkça seçebilmelidir.  
11. Kullanıcı, rezervasyon oluştururken tarih ile birlikte başlangıç ve bitiş saatlerini içeren bir saat aralığı seçebilmelidir.  
12. Sistem, seçilen saat aralığının restoran çalışma saatleri ve tanımlı minimum/maksimum süre kurallarına uygunluğunu doğrulayabilmelidir.  
13. Sistem, aynı restoran ve zaman dilimi için tanımlı kapasite ve çakışma kurallarına göre çakışan rezervasyonları engelleyebilmelidir.  
14. Sistem, rezervasyon taleplerini yaşam döngüsü (ör. onay bekliyor, onaylandı, iptal) ile yönetebilmelidir.  
15. Sistem, rezervasyon süresini (seçilen saat aralığının uzunluğu) tutarlı biçimde hesaplayabilmelidir.  
16. Sistem, rezervasyon oluşturma, onay ve iptal gibi önemli olaylar için denetlenebilir temel kayıt tutabilmelidir.  

---

## 4. Ödeme ve Fiyatlandırma Gereksinimleri

17. Sistem, rezervasyon için süre ve tanımlı birim fiyatlara dayalı toplam fiyatı hesaplayabilmelidir.  
18. Sistem, rezervasyon süresi arttıkça toplam fiyatın artmasını sağlayan fiyatlandırma kuralını uygulayabilmelidir.  
19. Kullanıcı, ödeme öncesi toplam tutarı ve mümkün olduğunda süreye bağlı kırılımı görüntüleyebilmelidir.  
20. Sistem, ödeme işlemini güvenli ödeme sağlayıcı akışı ile tamamlanacak şekilde tasarlanabilmeli; başarısız ödemede durumu tutarlı güncelleyebilmeli, başarılı ödemede rezervasyonu nihai onay durumuna taşıyabilmelidir.  

---

## 5. Admin Paneli Gereksinimleri

21. Admin, kimlik doğrulaması ile yönetim arayüzüne erişebilmelidir.  
22. Admin, kullanıcıları listeleyebilmeli ve iş kuralları çerçevesinde hesabı askıya alabilmeli veya erişimi kısıtlayabilmelidir.  
23. Admin, rezervasyonları filtreleyerek listeleyebilmeli, ayrıntılarını görüntüleyebilmeli ve politikalara uygun şekilde durumunu güncelleyebilmelidir.  
24. Admin, fiyatlandırma parametrelerini yetkisi dahilinde yönetebilmelidir.  
25. Admin, özellik bayraklarının durumunu görüntüleyebilmeli ve yetkisi dahilinde açıp kapatabilmelidir.  

---

## 6. Teknik ve Mimari Gereksinimler

26. Backend, Spring ile katmanlı (sunum, uygulama, alan, veri erişimi) yapıda organize edilebilmeli ve iş kurallarını servis katmanında toplayabilmelidir.  
27. Backend, veri erişiminde ORM kullanmadan depo (repository) katmanı ve her sorgu ihtiyacı için anlamlı metotlar ile çalışabilmelidir.  
28. Backend, API uçlarını Swagger (OpenAPI) ile belgelenebilir şekilde sunabilmeli; geliştirici Swagger üzerinden uç noktaları deneyebilmelidir.  
29. Frontend, Next.js ile özellik bazlı modüler dizin yapısında geliştirilebilmelidir.  
30. Frontend, sunucu durumu ve API verisi için TanStack Query kullanabilmelidir.  
31. Frontend, referans ve enum tablolarından gelen listeleri TanStack Query ile önbelleğe alınmış ve tutarlı şekilde tüketebilmelidir.  
32. Sistem, istemci ve sunucu tarafında tanımlı bir önbellek mekanizması ile sık tekrarlanan okumaları azaltabilmelidir.  
33. Sistem, özelliklerin koşullu açılıp kapanması için feature flag yapısını destekleyebilmelidir.  
34. Zustand, yalnızca isteğe bağlı istemci durumu (ör. çok adımlı form geçici durumu) için değerlendirilebilmeli; sunucu kaynaklı gerçeklerin kaynağı TanStack Query olmalıdır.  
35. Frontend, tekrarlanan mantığı custom hook’lar ile soyutlayabilmeli ve arayüzü yeniden kullanılabilir bileşenlere ayırabilmelidir.  
36. Sistem, HTTP durum kodları, anlamlı hata gövdeleri ve merkezi hata yakalama ile tutarlı API davranışı sunabilmelidir.  

---

## 7. Güvenlik Gereksinimleri

37. Sistem, kimlik doğrulama ve yetkilendirmeyi son kullanıcı ve admin rolleri için ayrıştırabilmelidir.  
38. Sistem, hassas yapılandırma değerlerinin kaynak kodda düz metin olarak tutulmamasını destekleyebilmelidir.  
39. Sistem, girdi doğrulamasını hem istemci deneyimi hem de sunucu tarafında zorunlu kılacak şekilde uygulayabilmelidir.  
40. Sistem, yönetim ve ödeme ile ilgili işlemleri yetkisiz erişime karşı temel kontrollerle koruyabilmelidir.  

---

## 8. Performans Gereksinimleri

41. Sistem, listeleme uçlarında sayfalama veya eşdeğer sınırlama ile yanıt boyutunu kontrol edebilmelidir.  
42. Sistem, sorgu ve bellek kullanımını OOM riski oluşturmayacak şekilde sınırlayabilmelidir.  
43. Sistem, istemci önbelleği ve sunucu tarafı stratejileri ile gereksiz ağ ve veritabanı yükünü azaltabilmelidir.  

---

## 9. Test ve Dokümantasyon Gereksinimleri

44. Backend, birim testleri ile kritik iş kurallarını (çakışma, süre–fiyat) doğrulamayı destekleyebilmelidir.  
45. Backend, API uçları için entegrasyon testleri ile temel akışları doğrulamayı destekleyebilmelidir.  
46. Proje, yerel çalıştırma ve Swagger sözleşmesinin güncel tutulması dahil kısa geliştirici dokümantasyonu ile desteklenebilmelidir.  

---

**Özet:** Bu belgede **46** adet numaralı gereksinim tanımlanmıştır.
