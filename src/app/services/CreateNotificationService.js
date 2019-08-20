import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Notification from '../schemas/Notifications';

class CreateNotificationService {
  async run({ user_id, date_start, date_end }) {
    const start = parseISO(date_start);
    const end = parseISO(date_end);

    const formattedDateStart = format(
      start,
      "'dia' dd 'de' MMMM', às' HH:mm'h'",
      {
        locale: pt,
      }
    );

    const formattedDateEnd = format(end, "'dia' dd 'de' MMMM', às' HH:mm'h'", {
      locale: pt,
    });

    await Notification.create({
      content: `Nova reunião agendada ${formattedDateStart} até ${formattedDateEnd}`,
      user: user_id,
    });
  }
}

export default new CreateNotificationService();
