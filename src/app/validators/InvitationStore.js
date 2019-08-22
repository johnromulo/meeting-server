import { object, boolean, number } from 'yup';

export default async (req, res, next) => {
  try {
    const schema = object().shape({
      meeting_id: number().required(),
      is_owner: boolean().required(),
      user_id: number().required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner });
  }
};
