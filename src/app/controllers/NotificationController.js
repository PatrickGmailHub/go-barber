import Notification from '../schemas/Notifications';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const isProvedor = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!isProvedor) {
      res.status(401).json({ error: 'Você não é um provedor de serviços!' });
    }

    const notification = await Notification.find({
      user: req.userId,
    })
      // .sort('createdAt')
      .sort({ createdAt: 'desc' })
      .limit(5);

    return res.json(notification);
  }

  async update(req, res) {
    // const notification = await Notification.findById(req.params.id);

    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );

    return res.json(notification);
  }
}

export default new NotificationController();
