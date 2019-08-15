import { startOfHour, parseISO, isBefore } from 'date-fns';

import Meeting from '../models/Meeting';
import User from '../models/User';
import File from '../models/File';

import ErroHandle from '../../lib/Errorhandle';

class MeetingController {
  async store(req, res) {
    const { date } = req.body;
    const user_logged_id = req.userId;

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      throw new ErroHandle({
        message: 'Past dates are not permitted',
        status: 400,
      });
    }

    const meeting = await Meeting.create({
      date,
    });

    const owner = await User.findByPk(user_logged_id);
    let participants = [];
    if (owner) {
      await meeting.addParticipants(owner, {
        through: {
          is_owner: true,
        },
      });

      const [
        {
          id,
          name,
          MeetingsUser: { is_owner },
          avatar,
        },
      ] = await meeting.getParticipants({
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id', 'path', 'url'],
          },
        ],
      });

      participants = [{ id, name, avatar, is_owner }];
    }

    return res.json({ meeting: { ...meeting.toJSON(), participants } });
  }

  async update(req, res) {
    return res.json({ ok: true });
  }

  async index(req, res) {
    return res.json({ ok: true });
  }

  async delete(req, res) {
    return res.json({ ok: true });
  }
}

export default new MeetingController();
