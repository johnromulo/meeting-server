import CreateNotificationService from '../services/CreateNotificationService';

class SendNotification {
  get key() {
    return 'SendNotification';
  }

  async handle({ data }) {
    const { user_id, date_start, date_end } = data;

    await CreateNotificationService.run({
      user_id,
      date_start,
      date_end,
    });

    return null;
  }
}

export default new SendNotification();
