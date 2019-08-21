import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Notification from '../schemas/Notifications';

class CreateNotificationService {
  async run({ user_id, date_start, date_end }) {
    console.log('log', user_id, date_start, date_end);
    const start = new Date(date_start);
    const end = new Date(date_end);

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

    const element = await Notification.create({
      content: `Nova reunião agendada ${formattedDateStart} até ${formattedDateEnd}`,
      user: user_id,
    });

    console.log('element', element);
  }
}

export default new CreateNotificationService();
