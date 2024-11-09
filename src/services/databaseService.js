import { promises as fs } from 'fs';
import sequelize from '../config/db.js';
import User from '../models/user.js';
import Event from '../models/event.js';
import Category from '../models/category.js';
import Subcategory from '../models/subcategory.js';
import Interest from '../models/interest.js'; 
import Participant from '../models/participant.js';
import Message from '../models/message.js';
import Point from '../models/point.js';
import bcrypt from 'bcrypt';

async function insertUsers(users) {
  try {
      await sequelize.transaction(async (t) => {
          for (const user of users) {
              await User.create({
                  id: user["Kullanıcı ID"], 
                  username: user["Kullanıcı Adı"],
                  password: user["Şifre"],
                  email: user["E-posta"],
                  location_latitude: user.Konum?.latitude || null,
                  location_longitude: user.Konum?.longitude || null,
                  first_name: user["Ad"],
                  last_name: user["Soyad"],
                  birth_date: user["Doğum Tarihi"],
                  gender: user["Cinsiyet"],
                  phone_number: user["Telefon Numarası"],
                  profile_picture_url: user["Profil Fotoğrafı"],
                  role: user["Rol"]
              }, { transaction: t });
          }
      });

      console.log('Tüm kullanıcılar başarıyla eklendi.');
  } catch (error) {
      console.error('Kullanıcı ekleme işlemi başarısız:', error);
  }
}

async function insertEvents(events) {
  try {
    await sequelize.transaction(async (t) => {
      for (const event of events) {
        if (event["Alt Kategori ID"] == null) {
          console.error(`Etkinlik "${event["Etkinlik Adı"]}" için Alt Kategori ID'si eksik!`);
          continue; 
        }

        await Event.create({
          id: event["Etkinlik ID"],
          subcategory_id: event["Alt Kategori ID"],
          name: event["Etkinlik Adı"],
          description: event["Açıklama"],
          date: event["Tarih"],
          time: event["Saat"],
          duration: event["Etkinlik Süresi"], 
          latitude: event.Konum?.latitude || null,
          longitude: event.Konum?.longitude || null,
          user_id: event["Kullanıcı ID"]
        }, { transaction: t });
      }
    });

    console.log('Tüm etkinlikler başarıyla eklendi.');
  } catch (error) {
    console.error('Etkinlik ekleme işlemi başarısız:', error);
  }
}


async function insertParticipants(participants) {
  for (let participant of participants) {
    const { "Kullanıcı ID": user_id, "Etkinlik ID": event_id } = participant;

    if (!user_id || !event_id) {
      console.log(`Hatalı veri: user_id: ${user_id}, event_id: ${event_id}`);
      continue; 
    }

    try {
      const participantExists = await Participant.findOne({
        where: {
          user_id: user_id,
          event_id: event_id
        }
      });

      if (!participantExists) {
        await Participant.create({ user_id, event_id });
      } else {
        console.log(`Katılımcı ${user_id} ve Etkinlik ${event_id} zaten mevcut.`);
      }
    } catch (error) {
      console.error('Katılımcı eklenemedi:', error);
    }
  }
}

async function insertMessages(messages) {
  for (let message of messages) {
    const { 
      "Mesaj ID": id, 
      "Kullanıcı ID": user_id, 
      "Etkinlik ID": event_id, 
      "Mesaj Metni": message_text, 
      "Gönderim Zamanı": sent_time 
    } = message;

    console.log(`Eklenecek Mesaj: ${JSON.stringify(message)}`);

    if (!message_text || !sent_time) {
      console.log(`Hatalı mesaj verisi: message_text: ${message_text}, sent_time: ${sent_time}`);
      continue;
    }

    try {
      await Message.create({
        id,
        user_id,
        event_id,
        message_text,
        sent_time
      });
    } catch (error) {
      console.error('Mesaj ekleme işlemi başarısız:', error);
    }
  }
}

async function insertCategories(categories) {
  try {
    await sequelize.transaction(async (t) => {
      for (const category of categories) {
        await Category.create({
          id: category["Kategori ID"],
          name: category["Kategori Adı"]
        }, { transaction: t });
      }
    });
    console.log('Tüm kategoriler başarıyla eklendi.');
  } catch (error) {
    console.error('Kategori ekleme işlemi başarısız:', error);
  }
}

async function insertSubcategories(subcategories) {
  try {
    await sequelize.transaction(async (t) => {
      for (const subcategory of subcategories) {
        console.log('Eklenecek alt kategori:', subcategory); 
        await Subcategory.create({
          id: subcategory["Alt Kategori ID"],
          category_id: subcategory["Kategori ID"],
          name: subcategory["Alt Kategori Adı"]
        }, { transaction: t });
      }
    });

    console.log('Tüm alt kategoriler başarıyla eklendi.');
  } catch (error) {
    console.error('Alt kategori ekleme işlemi başarısız:', error);
  }
}

async function insertInterests(interests) {
  try {
    await sequelize.transaction(async (t) => {
      for (const interest of interests) {
        await Interest.create({
          user_id: interest["Kullanıcı ID"],
          subcategory_id: interest["Alt Kategori ID"]
        }, { transaction: t });
      }
    });
    console.log('Tüm ilgi alanları başarıyla eklendi.');
  } catch (error) {
    console.error('İlgi alanı ekleme işlemi başarısız:', error);
  }
}

async function insertPoints(points) {
  try {
    await sequelize.transaction(async (t) => {
      for (const point of points) {
        await Point.create({
          user_id: point["Kullanıcı ID"],
          event_id: point["Etkinlik ID"],
          points: point["Puanlar"],
          earned_date: point["Kazanılan Tarih"]
        }, { transaction: t });
      }
    });
    console.log('Tüm puanlar başarıyla eklendi.');
  } catch (error) {
    console.error('Puan ekleme işlemi başarısız:', error);
  }
}

async function hashUserPasswords() {
  try {
    // Tüm kullanıcıları al
    const users = await User.findAll();

    // Kullanıcılar üzerinde döngü yap
    for (let user of users) {
      // Eğer şifre zaten hash'lenmişse, tekrar işlem yapmaya gerek yok
      if (!user.password.startsWith('$2b$')) {  // Bcrypt hash'leri '$2b$' ile başlar
        // Şifreyi hash'le
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Hash'lenmiş şifreyi veritabanına kaydet
        user.password = hashedPassword;
        await user.save();
        console.log(`Şifre güncellendi: ${user.username}`);
      }
    }

    console.log('Tüm kullanıcı şifreleri başarıyla güncellendi.');
  } catch (error) {
    console.error('Şifre güncelleme sırasında bir hata oluştu:', error);
  }
}

async function insertDataFromJson(filePath) {
  try {
      const data = await fs.readFile(filePath, 'utf-8');
      const dataset = JSON.parse(data);
 
      if (dataset.Kategoriler) {
          await insertCategories(dataset.Kategoriler);
      } else {
          console.log("Kategoriler verisi eksik.");
      }
    
      if (dataset.AltKategoriler) {
          await insertSubcategories(dataset.AltKategoriler);
      } else {
          console.log("Alt Kategoriler verisi eksik.");
      }

      if (dataset.Kullanıcılar) {
          await insertUsers(dataset.Kullanıcılar);
      } else {
          console.log("Kullanıcılar verisi eksik.");
      }
  
      if (dataset.İlgiAlanları) {
          await insertInterests(dataset.İlgiAlanları);
      } else {
          console.log("İlgi Alanları verisi eksik.");
      }
        
      if (dataset.Etkinlikler) {
          await insertEvents(dataset.Etkinlikler);
      } else {
          console.log("Etkinlikler verisi eksik.");
      }
    
      if (dataset.Katılımcılar) {
          await insertParticipants(dataset.Katılımcılar);
      } else {
          console.log("Katılımcılar verisi eksik.");
      }
    
      if (dataset.Mesajlar) {
          await insertMessages(dataset.Mesajlar);
      } else {
          console.log("Mesajlar verisi eksik.");
      }
    
      if (dataset.Puanlar) {
          await insertPoints(dataset.Puanlar);
      } else {
          console.log("Puanlar verisi eksik.");
      }

      await hashUserPasswords();

      console.log('Tüm veriler başarıyla eklendi.');
  } catch (error) {
      console.error('Veri ekleme işlemi sırasında hata oluştu:', error);
  }
}

export {
  insertDataFromJson
};
