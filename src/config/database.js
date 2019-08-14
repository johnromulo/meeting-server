require('../bootstrap');

module.exports = {
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: false,
  storage: './__tests__/database.sqlite',
  ssl: process.env.DB_SSL === 'true' ? true : null,
  dialectOptions:
    process.env.DB_SSL === 'true'
      ? {
          ssl: {
            require: process.env.DB_SSL === 'true' ? true : null,
          },
        }
      : null,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
