import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        mimetype: Sequelize.STRING,
        width: Sequelize.STRING,
        height: Sequelize.STRING,
        aspect_ratio: Sequelize.STRING,
        urls: {
          type: Sequelize.VIRTUAL,
          get() {
            return {
              full: `${process.env.APP_URL}\
              /api/v${process.env.API_VERSION}\
              /files/${this.path}?width=${Math.ceil(this.width)}\
               &height=${Math.ceil(this.height)}`.replace(/\s/g, ''),
              medium: `${process.env.APP_URL}\
              /api/v${process.env.API_VERSION}\
              /files/${this.path}?width=${Math.ceil(this.width * 0.5)}\
               &height=${Math.ceil(this.height * 0.5)}`.replace(/\s/g, ''),
              small: `${process.env.APP_URL}\
              /api/v${process.env.API_VERSION}\
              /files/${this.path}?width=${Math.ceil(this.width * 0.25)}\
               &height=${Math.ceil(this.height * 0.25)}`.replace(/\s/g, ''),
            };
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
