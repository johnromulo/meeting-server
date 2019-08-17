import Invitation from '../models/Invitation';

class CreateInvitationService {
  async run(data) {
    const inviations = await Invitation.bulkCreate(data);
    return inviations;
  }
}

export default new CreateInvitationService();
