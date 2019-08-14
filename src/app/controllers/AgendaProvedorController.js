import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Agendamento from '../models/Agendamento';
import User from '../models/User';

class AgendaProvedorController {
  async index(req, res) {
    const isProvedor = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!isProvedor) {
      return res.status(400).json({ error: 'Usuário não é um provedor' });
    }

    const { date } = req.query;

    const agendamentos = await Agendamento.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [
            startOfDay(date),
            endOfDay(date),
          ],
        },
      },
      order: ['date'],
    });

    return res.json(agendamentos);
  }
}

export default new AgendaProvedorController();
