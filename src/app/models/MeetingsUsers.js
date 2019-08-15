import Sequelize, { Model } from 'sequelize';

class MeetingsUser extends Model {
  static init(sequelize) {
    super.init(
      {
        is_owner: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default MeetingsUser;
