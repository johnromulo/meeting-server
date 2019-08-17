import { object, boolean } from 'yup';

export default async (req, res, next) => {
  try {
    const schema = object().shape({
      is_confirm: boolean().required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner });
  }
};
