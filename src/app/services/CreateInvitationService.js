import Invitation from '../models/Invitation';

class CreateInvitationService {
  async run(data) {
    const { meeting_id, user_id, is_owner, is_confirm } = data;
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
