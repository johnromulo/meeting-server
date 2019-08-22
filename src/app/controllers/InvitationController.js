import Meeting from '../models/Meeting';
import Invitation from '../models/Invitation';

import CreateInvitationService from '../services/CreateInvitationService';

import SendNotification from '../jobs/SendNotification';
import Queue from '../../lib/Queue';

import ErroHandle from '../../lib/Errorhandle';

class InvitationController {
  async store(req, res) {
    const { meeting_id, participants } = req.body;
    const user_id = req.userId;

    const meeting = await Meeting.findByPk(meeting_id);

    if (!meeting) {
      throw new ErroHandle({
        message: 'Meeting does not exists',
        status: 400,
      });
    }

    const check_owner = await Invitation.findOne({
      where: {
        meeting_id,
        user_id,
        is_owner: true,
      },
    });

    if (!check_owner) {
      throw new ErroHandle({
        message: 'User logged does not permission this action',
        status: 403,
      });
    }

    const data = participants.map(inviation => ({
      ...inviation,
      meeting_id,
    }));

    const invtations = await CreateInvitationService.run(data);

    invtations.map(async element => {
      await Queue.add(SendNotification.key, {
        user_id: element.user_id,
        date_start: meeting.date_start,
        date_end: meeting.date_end,
      });
    });

    return res.json({ invtations });
  }

  async update(req, res) {
    const { is_confirm } = req.body;
    const { id } = req.params;
    const user_id = req.userId;

    const invitation = await Invitation.findOne({
      where: {
        id,
        user_id,
      },
    });

    if (!invitation) {
      throw new ErroHandle({
        message: 'User logged does not permission this action',
        status: 403,
      });
    }

    invitation.update({ is_confirm });

    res.json({ invitation });
  }

  async delete(req, res) {
    const { id, meeting_id } = req.params;
    const user_id = req.userId;

    const check_owner = await Invitation.findOne({
      where: {
        meeting_id,
        user_id,
        is_owner: true,
      },
    });

    if (!check_owner) {
      throw new ErroHandle({
        message: 'User logged does not permission this action',
        status: 403,
      });
    }

    const inviation = await Invitation.findByPk(id);
    await inviation.destroy();

    res.json({ deleted: true });
  }
}

export default new InvitationController();
