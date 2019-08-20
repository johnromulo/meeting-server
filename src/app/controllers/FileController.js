import sharp from 'sharp';
import mime from 'mime-types';
import { resolve } from 'path';
import sizeOf from 'image-size';
import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path, mimetype } = req.file;
    const tmp = resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', path);
    const { width, height } = sizeOf(tmp);

    const aspect_ratio = width / height;

    const file = await File.create({
      name,
      path,
      width,
      height,
      aspect_ratio,
      mimetype,
    });

    return res.json({ file });
  }

  async index(req, res) {
    const { width, height } = req.query;
    const { path } = req.params;

    const tmp = resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', path);
    const mimetype = mime.lookup(tmp);
    const file = await sharp(tmp)
      .rotate()
      .resize(Math.ceil(width), Math.ceil(height))
      .toBuffer();

    res.writeHead(200, {
      'Content-Type': mimetype,
      'Content-Length': file.length,
    });

    return res.end(file);
  }
}

export default new FileController();
