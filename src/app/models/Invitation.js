import Sequelize, { Model } from 'sequelize';

class Invitation extends Model {
  static init(sequelize) {
    super.init(
      {
        is_owner: Sequelize.BOOLEAN,
        is_confirm: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'participants',
    });

    this.belongsTo(models.Meeting, {
      foreignKey: 'meeting_id',
      as: 'meetings',
    });
  }
}

export default Invitation;
