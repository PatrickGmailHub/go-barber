import * as Yup from 'yup';
import {
  startOfHour, isBefore, format, parseISO, subHours,
} from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Agendamento from '../models/Agendamento';
import Notification from '../schemas/Notifications';

class AgendamentoController {
  async index(req, res) {
    // Paginação:
    const { page = 1 } = req.query;

    const agendamentos = await Agendamento.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 5,
      offset: (page - 1) * 5,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'], // precisa do path pra acessar url completa
            }],
        },
      ],
    });

    return res.json(agendamentos);
  }

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
    const hourStart = startOfHour(parseISO(date));

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

    /**
     * Cria a notificação no banco NoSQL - mongoDB
     * prestador de serviço
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', ás' H:mm'h'",
      { locale: pt },
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return res.json(agendamento);
  }

  async delete(req, res) {
    const agendamento = await Agendamento.findByPk(req.params.id);

    if (agendamento.user_id !== req.userId) {
      return res.status(401).json({ error: 'Você não tem permissão de cancelar este agendamento!' });
    }

    const dateWithSub = subHours(agendamento.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({ error: 'Cancelamento negado, resta menos de 2h do horário agendado!' });
    }

    agendamento.canceled_at = new Date();

    await agendamento.save();

    return res.json(agendamento);
  }
}

export default new AgendamentoController();
