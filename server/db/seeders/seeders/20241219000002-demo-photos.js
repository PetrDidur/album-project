'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Получаем все существующие альбомы
    const albums = await queryInterface.sequelize.query(
      'SELECT id FROM "Albums";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Если альбомов нет, создаем сначала один
    if (albums.length === 0) {
      // Сначала получаем или создаем пользователя
      let users = await queryInterface.sequelize.query(
        'SELECT id FROM "Users";',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (users.length === 0) {
        await queryInterface.bulkInsert('Users', [{
          username: 'demo_user',
          email: 'demo@example.com',
          password: '$2b$10$fakehashedpassword',
          createdAt: new Date(),
          updatedAt: new Date()
        }], {});

        users = await queryInterface.sequelize.query(
          'SELECT id FROM "Users";',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
      }

      // Создаем тестовый альбом
      await queryInterface.bulkInsert('Albums', [{
        title: 'Тестовый альбом',
        desc: 'Описание тестового альбома',
        isPrivate: false,
        userId: users[0].id,
        img: 'default.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});

      // Получаем ID созданного альбома
      albums = await queryInterface.sequelize.query(
        'SELECT id FROM "Albums";',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
    }

    // Теперь создаем тестовые фотографии
    const photos = [];
    const photoComments = [
      'Красивый закат над морем',
      'Горный пейзаж ранним утром',
      'Лесная тропинка осенью',
      'Город ночью с огнями',
      'Пляж с белым песком',
      'Архитектура старого города',
      'Цветущий сад весной',
      'Зимний лес после снегопада',
      'Река в горах',
      'Небоскребы мегаполиса'
    ];

    // Создаем по 3-5 фото для каждого альбома
    albums.forEach(album => {
      const photoCount = 3 + Math.floor(Math.random() * 3); // 3-5 фото на альбом
      
      for (let i = 0; i < photoCount; i++) {
        const photoIndex = Math.floor(Math.random() * photoComments.length);
        photos.push({
          albumId: album.id,
          imgUrl: `/photos/sample${Math.floor(Math.random() * 10) + 1}.jpg`,
          comment: photoComments[photoIndex],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });

    // Добавляем фото в базу
    await queryInterface.bulkInsert('Photos', photos, {});
  },

  async down(queryInterface, Sequelize) {
    // Удаляем все фото при откате
    await queryInterface.bulkDelete('Photos', null, {});
  }
};