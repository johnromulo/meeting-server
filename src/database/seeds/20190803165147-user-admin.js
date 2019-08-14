const bcrypt = require('bcryptjs');

module.exports = {
  up: async queryInterface => {
    const pass = await bcrypt.hash('admin1234', 8);

    const users = [
      {
        name: 'Admin',
        email: 'admin@teste.com',
        is_admin: true,
        password_hash: pass,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    return queryInterface.bulkInsert('users', users);
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
