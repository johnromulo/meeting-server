import { object, date, string } from 'yup';

export default async (req, res, next) => {
  try {
    const schema = object().shape({
      title: string().required(),
      date_start: date().required(),
      date_end: date().required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner });
  }
};
