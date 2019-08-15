import { Op } from 'sequelize';
import { startOfHour, parseISO, isBefore } from 'date-fns';

import Meeting from '../models/Meeting';
import User from '../models/User';
import File from '../models/File';

import ErroHandle from '../../lib/Errorhandle';

class CreateMeetingService {
  async run({ title, date_start, date_end, user_owner }) {
    const hourStart = startOfHour(parseISO(date_start));

    if (isBefore(hourStart, new Date())) {
      throw new ErroHandle({
        message: 'Past dates are not permitted',
        status: 400,
      });
    }

    if (isBefore(new Date(date_end), new Date(date_start))) {
      throw new ErroHandle({
        message: 'start date cannot be greater than end date',
        status: 400,
      });
    }

    const exist = await Meeting.findAll({
      where: {
        date_start: {
          [Op.in]: [date_start, date_end],
        },
      },
    });

    if (exist.length > 0) {
      throw new ErroHandle({
        message: 'There is already a meeting for the scheduled time',
        status: 400,
      });
    }

    const meeting = await Meeting.create({
      title,
      date_start,
      date_end,
    });

    const owner = await User.findByPk(user_owner);
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

    return { meeting: { ...meeting.toJSON(), participants } };
  }
}

export default new CreateMeetingService();
