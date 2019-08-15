import Sequelize, { Model } from 'sequelize';
import { isBefore, subMinutes } from 'date-fns';

class Meeting extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subMinutes(this.date, 30));
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
