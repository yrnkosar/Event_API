# Kurulum

Projeyi klonlayın:

```
git clone https://github.com/kullaniciadi/event-planning-backend.git
cd event-planning-backend
```

Gerekli bağımlılıkları yükleyin:
```
npm install
```
.env dosyası oluşturun ve aşağıdaki bilgileri girin:
```
DB_HOST=your-database-host
DB_PORT=3306
DB_NAME=your-database-name
DB_USER=your-database-user
DB_PASSWORD=your-database-password
```
Veritabanını oluşturun ve Sequelize ile migrate edin:
```
npx sequelize-cli db:migrate
```
Sunucuyu çalıştırın:
```
npm start
```
API Bitiş Noktaları (Endpoints)

### Kullanıcı Yönetimi
| Yöntem   | Endpoint                | Açıklama                              |
|----------|-------------------------|---------------------------------------|
| **POST** | `/register`             | Kullanıcı kaydı                       |
| **POST** | `/login`                | Kullanıcı girişi                      |
| **GET**  | `/profile`              | Kullanıcı profil bilgileri            |
| **PUT**  | `/update-profile`       | Kullanıcı profil güncelleme           |


### Etkinlik Yönetimi

| Yöntem  | Endpoint                        | Açıklama                             |
|---------|--------------------------------|---------------------------------|
| **POST** | `/create-event`             | Yeni etkinlik oluşturma                |
| **GET** | `/events`          | Tüm etkinlikleri listeleme              |
| **GET**  | `/event/:id`               | Belirli bir etkinliği görüntüleme                 |
| **PUT** | `/update-event/:id`      | Etkinlik güncelleme                    |
| **DELETE**  | `/delete-event/:id`       | Etkinlik silme  |


### Diğer

| Yöntem  | Endpoint                        | Açıklama                             |
|---------|--------------------------------|---------------------------------|
| **POST** | `/send-message`             | Etkinlik içi mesaj gönderme                |
| **POST** | `/calculate-route/:eventId`          | Kullanıcının etkinlik yerine ulaşması için rota hesaplama               |
| **GET**  | `/recommendations`               | Kullanicıya özel etkinlik önerileri                  |


