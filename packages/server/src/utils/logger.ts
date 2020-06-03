import { createLogger, format, transports } from 'winston';
const { colorize, timestamp, combine, json, padLevels, printf } = format;

const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  trace: 4,
  debug: 5
};

const colors = {
  fatal: 'magenta',
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  trace: 'gray',
  debug: 'green'
};

const logger = createLogger({
  levels,
  level: 'debug',
  format: combine(
    colorize({ colors }),
    timestamp(),
    json()
  ),
  transports: [
    new transports.File({ filename: 'combined.log' }),
    new transports.File({ filename: 'error.log', level: 'error' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      colorize({ colors }),
      timestamp({ format: 'HH:mm:ss' }),
      printf(({ level, message, timestamp }) => `${level} \u001b[90m${timestamp}\u001b[39m ${message}`),
      padLevels({ levels })
    )
  }));
}

export { logger };
