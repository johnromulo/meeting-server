import winston, { format } from 'winston';
import util from 'util';

export default () => {
  const customSimpleFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });
  const logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          customSimpleFormat
        ),
      }),
    ],
  });
  if (process.env.NODE_ENV === 'production') {
    logger.add(
      new winston.transports.File({
        filename: './logs/combined.log',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      })
    );
    logger.add(
      new winston.transports.File({
        filename: './logs/error.log',
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      })
    );
    // logger.exceptionHandlers(
    //   new winston.transports.File({ filename: './logs/error.log' })
    // );
  }
  // Overwrite some of the build-in console functions
  console.log = (text, ...rest) => {
    const textFormat = util.format(text, ...rest);
    logger.info(textFormat);
  };
  console.info = (text, ...rest) => {
    const textFormat = util.format(text, ...rest);
    logger.info(textFormat);
  };
  console.error = (text, ...rest) => {
    const textFormat = util.format(text, ...rest);
    logger.error(textFormat);
  };
  console.warn = (text, ...rest) => {
    const textFormat = util.format(text, ...rest);
    logger.warn(textFormat);
  };
  console.debug = (text, ...rest) => {
    const textFormat = util.format(text, ...rest);
    logger.debug(textFormat);
  };
};
