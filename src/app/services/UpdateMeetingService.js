import { Op } from 'sequelize';
import { startOfHour, parseISO, isBefore } from 'date-fns';

import Meeting from '../models/Meeting';
import User from '../models/User';
import File from '../models/File';

import ErroHandle from '../../lib/Errorhandle';

class UpdateMeetingService {
  async run({ meeting_id, title, date_start, date_end }) {
    const meeting = await Meeting.findByPk(meeting_id);

    if (!meeting) {
      throw new ErroHandle({
        message: 'Meeting does not exists',
        status: 400,
      });
    }

    if (date_start !== meeting.date_start || date_end !== meeting.date_end) {
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
          id: {
            [Op.notIn]: [meeting.id],
          },
          date_start: {
            [Op.between]: [date_start, date_end],
          },
        },
      });

      if (exist.length > 0) {
        throw new ErroHandle({
          message: 'There is already a meeting for the scheduled time',
          status: 400,
        });
      }
    }

    const meetingUpdated = await meeting.update({
      title,
      date_start,
      date_end,
    });

    const inviatations = await meeting.getInvitations({
      attributes: ['id', 'is_owner', 'is_confirm'],
      include: [
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return { meeting: { ...meetingUpdated.toJSON(), inviatations } };
  }
}

export default new UpdateMeetingService();
