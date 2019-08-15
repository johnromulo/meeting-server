// import { col } from 'sequelize';

import Meeting from '../models/Meeting';
import User from '../models/User';
import File from '../models/File';

import CreateMeetingService from '../services/CreateMeetingService';
import UpdateMeetingService from '../services/UpdateMeetingService';

class MeetingController {
  async store(req, res) {
    const { title, date_start, date_end } = req.body;
    const user_logged_id = req.userId;

    const { meeting } = await CreateMeetingService.run({
      title,
      date_start,
      date_end,
      user_owner: user_logged_id,
    });
    return res.json({ meeting });
  }

  async update(req, res) {
    const { title, date_start, date_end } = req.body;
    const { id } = req.params;

    const { meeting } = await UpdateMeetingService.run({
      meeting_id: id,
      title,
      date_start,
      date_end,
    });

    return res.json({ meeting });
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const { id = null } = req.params;

    const meetings = await Meeting.findAll({
      where: id && { id },
      order: ['date_start'],
      // raw: true,
      include: [
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'name'],
          // raw: true,
          through: {
            // raw: true,
            as: 'owner',
            attributes: ['is_owner'],
          },
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });

    // meetings = meetings.map(meeting => ({ ...meeting, ok: true }));
    // console.log(meetings);
    return res.json({ meetings });
  }

  async delete(req, res) {
    const { id } = req.params;

    const comp = await Meeting.findByPk(id);
    await comp.destroy();

    return res.json({ deleted: true });
  }
}

export default new MeetingController();
