import { v2 as cloudnary } from 'cloudinary';
import cloudnaryConfig from '../config/cloudinary';

class CDN {
  async upload({ path, filename, tag }) {
    await cloudnary.config(cloudnaryConfig);
    const {
      format,
      tags,
      secure_url,
      created_at,
      resource_type,
    } = await cloudnary.uploader.upload(
      path,
      { public_id: `${tag}/${filename}`, tags: tag } // directory and tags are optional
    );

    return {
      format,
      tags,
      secure_url,
      resource_type,
      created_at,
    };
  }
}

export default new CDN();
