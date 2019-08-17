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

    const tmp = resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', path);

    const size = sizeOf(tmp);

    await sharp(tmp)
      .rotate()
      .resize(Math.ceil(size.width * 0.1), Math.ceil(size.height * 0.1))
      .toFile(
        resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', `@small-${path}`)
      );

    return res.json({ file, size });
  }
}

export default new FileController();
