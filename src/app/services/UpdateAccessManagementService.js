import { Op } from 'sequelize';
import User from '../models/User';
import Permission from '../models/Permission';
import Role from '../models/Role';

import ErroHandle from '../../lib/Errorhandle';

class UpdateAccessManagementService {
  async run({ user_id, roles, permissions }) {
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new ErroHandle({ message: 'User does not exists', status: 400 });
    }

    if (permissions && permissions.length <= 0) {
      await user.setPermissions([]);
    } else if (permissions) {
      const permissionsData = await Permission.findAll({
        where: {
          key: {
            [Op.in]: permissions,
          },
        },
      });
      await user.setPermissions(permissionsData);
      const [{ id, key, description }] = await user.getPermissions();
      permissions = [{ id, key, description }];
    }

    if (roles && roles.length <= 0) {
      await user.setRoles([]);
    } else if (roles) {
      const rolesData = await Role.findAll({
        where: {
          key: {
            [Op.in]: roles,
          },
        },
        attributes: ['id', 'key', 'description'],
      });
      await user.setRoles(rolesData);
      roles = await user.getRoles().map(async role => {
        const { id, key, description } = role;
        const [
          { id: pid, key: pkey, description: pdescription },
        ] = await role.getPermissions();
        return {
          id,
          key,
          description,
          permissions: [{ id: pid, key: pkey, description: pdescription }],
        };
      });
    }

    return { roles, permissions };
  }
}

export default new UpdateAccessManagementService();
