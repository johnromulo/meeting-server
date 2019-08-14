import User from '../models/User';
import File from '../models/File';

import ErroHandle from '../../lib/Errorhandle';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      throw new ErroHandle({ message: 'User already exists', status: 400 });
    }

    const { id, name, email, is_admin } = await User.create(req.body);

    return res.json({ user: { id, name, email, is_admin } });
  }

  async update(req, res) {
    const { name, email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        throw new ErroHandle({ message: 'User already exists', status: 400 });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      throw new ErroHandle({ message: 'Password does not match', status: 400 });
    }

    const { id, is_admin } = await user.update(req.body);

    return res.json({ user: { id, name, email, is_admin } });
  }
}

export default new UserController();
