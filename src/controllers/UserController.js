import { Op } from 'sequelize';
import User from '../models/User.js';

class UserController {
  async inId(req, res) {
    const form = req.body;
    const users = await User.findAll({
      where: {
        id: {
          [Op.in]: form.users,
        },
      },
    });
    return res.json({
      message: 'success',
      data: users.map((item) => item.userResource()),
    });
  }
}

export default new UserController();
