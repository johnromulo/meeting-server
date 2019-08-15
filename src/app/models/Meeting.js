import Sequelize, { Model } from 'sequelize';
import { isBefore, subMinutes } from 'date-fns';

class Meeting extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        date_start: Sequelize.DATE,
        date_end: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date_start, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subMinutes(this.date_start, 30));
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.User, {
      through: models.MeetingsUser,
      foreignKey: 'meeting_id',
      as: 'participants',
    });
  }
}

export default Meeting;
