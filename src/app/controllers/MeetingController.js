import Meeting from '../models/Meeting';
import User from '../models/User';
import File from '../models/File';

import CreateMeetingService from '../services/CreateMeetingService';
import UpdateMeetingService from '../services/UpdateMeetingService';
import Invitation from '../models/Invitation';

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
      attributes: [
        'id',
        'past',
        'cancelable',
        'title',
        'date_start',
        'date_end',
        'canceled_at',
      ],
      include: [
        {
          model: Invitation,
          as: 'invitations',
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
                  attributes: ['id', 'path', 'urls'],
                },
              ],
            },
          ],
        },
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });

    const total_itens = await Meeting.count({
      where: id && { id },
      order: ['date_start'],
    });

    const total_pages = Math.ceil(total_itens / 20);
    return res.json({ meetings, total_pages, page });
  }

  async delete(req, res) {
    const { id } = req.params;

    const meeting = await Meeting.findByPk(id);
    await meeting.destroy();

    return res.json({ deleted: true });
  }
}

export default new MeetingController();
