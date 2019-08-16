import Invitation from '../models/Invitation';

class CreateInvitationService {
  async run({ meeting_id, user_id, is_owner = false, is_confirm }) {
    const inviation = await Invitation.create({
      meeting_id,
      user_id,
      is_owner,
      is_confirm,
    });

    return inviation;
  }
}

export default new CreateInvitationService();
