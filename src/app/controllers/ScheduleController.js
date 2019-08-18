import { startOfDay, endOfDay, format, isAfter, isBefore } from 'date-fns';
import { Op } from 'sequelize';

import Meeting from '../models/Meeting';

class ScheduleController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date);

    const meetings = await Meeting.findAll({
      where: {
        canceled_at: null,
        date_start: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    const schedules = [];
    let schedule_start = new Date('2019-08-18 08:00').getTime();
    const schedule_end = new Date('2019-08-18 22:00').getTime();
    const schedule_interval = 30 * 60 * 1000;

    while (schedule_start <= schedule_end) {
      schedules.push(new Date(schedule_start).toISOString());
      schedule_start = new Date(schedule_start).getTime() + schedule_interval;
    }

    const schedules_available = schedules.map(schedule => {
      const value = new Date(schedule);

      return {
        time: format(value, 'HH:mm'),
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !meetings.find(
            m => isAfter(value, m.date_start) && isBefore(value, m.date_end)
          ),
      };
    });

    return res.json({ schedules_available });
  }
}

export default new ScheduleController();
