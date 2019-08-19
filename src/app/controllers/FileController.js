import sharp from 'sharp';
import { resolve } from 'path';
import sizeOf from 'image-size';
import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json({ file });
  }

  async index(req, res) {
    const tmp = resolve(
      __dirname,
      '..',
      '..',
      '..',
      'tmp',
      'uploads',
      'ee6828efabdb61ca372a709158cc34d9.png'
    );
    const size = sizeOf(tmp);
    const file = await sharp(tmp)
      .rotate()
      .resize(Math.ceil(size.width * 0.1), Math.ceil(size.height * 0.1))
      .png()
      .toBuffer();

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': file.length,
    });

    return res.end(file);
  }
}

export default new FileController();
