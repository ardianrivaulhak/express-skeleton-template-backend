import MobileVersion from '../models/MobileVersion.js';

class VersionController {
  async check(req, res) {
    const { name = null, version = null } = req.params;
    const currentVersion = await MobileVersion.findOne({ where: { name, active: true } });

    if (!currentVersion) {
      return res.status(503).json({ message: 'Aplikasi dalam perawatan!' });
    }

    if (currentVersion.get('version') !== version && currentVersion.get('status') == 'release') {
      return res.status(403).json({ message: 'Silahkan perbaharui aplikasi untuk melanjutkan!', data: currentVersion });
    }

    if (currentVersion.get('version') !== version && currentVersion.get('status') == 'review') {
      return res.status(200).json({ message: 'Aplikasi baru sedang dalam proses', data: currentVersion });
    }

    return res.json({
      message: 'success',
      data: currentVersion,
    });
  }
}

export default new VersionController();
