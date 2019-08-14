import * as Yup from 'yup';
import { startOfHour, isBefore } from 'date-fns';
import User from '../models/User';
import Agendamento from '../models/Agendamento';

class AgendamentoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou!' });
    }

    const { provider_id, date } = req.body;

    /**
     * Checa se é um provedor de serviço
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({ error: 'Você não pode agendar com este usuário!' });
    }

    /**
     * Checa se data e hora é válida p/ agendamento
     */
    const hourStart = startOfHour(date);

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Data não permitida' });
    }

    /**
     * Checa horário está disponível
     */
    const indisponivel = await Agendamento.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (indisponivel) {
      return res.status(400).json({ error: 'Agendamento para esta data não está disponível' });
    }

    const agendamento = await Agendamento.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    return res.json(agendamento);
  }
}

export default new AgendamentoController();
