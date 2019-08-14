import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import User from '../models/User';
import File from '../models/File';
import Access from '../schemas/Access';

import ErroHandle from '../../lib/Errorhandle';

class AuthenticatorController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!user) {
      throw new ErroHandle({ message: 'User not found', status: 401 });
    }

    if (!(await user.checkPassword(password))) {
      throw new ErroHandle({ message: 'Password does not match', status: 401 });
    }

    const { id, name, is_admin, avatar } = user;

    const token = await jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Buscando data de expriração do token do usuário.
     */
    const { payload } = await jwt.decode(token, {
      complete: true,
    });

    const { expire_in, created_at, phone_register_code } = await Access.create({
      token,
      user: id,
      expire_in: new Date(payload.exp * 1000),
    });

    return res.json({
      user: {
        id,
        name,
        email,
        is_admin,
        avatar,
      },
      access: { token, expire_in, created_at, phone_register_code },
    });
  }
}

export default new AuthenticatorController();
