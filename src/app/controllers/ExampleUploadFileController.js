import CDN from '../../lib/CDN';

class UploadFileController {
  async store(req, res) {
    const { path, filename } = req.file;

    const file = await CDN.upload({
      path,
      filename,
      tag: 'avatar',
    });

    res.json(file);
  }
}

export default new UploadFileController();
