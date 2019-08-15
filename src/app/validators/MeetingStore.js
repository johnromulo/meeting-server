import { object, date } from 'yup';

export default async (req, res, next) => {
  try {
    const schema = object().shape({
      date: date().required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner });
  }
};
