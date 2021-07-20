const mongoose = require('mongoose');
const logger = require('./logger');

const terminate = (type, bot) => {
  const exit = (code = 0) => {
    process.exit(code);
  };

  switch (type) {
    case 'exception':
      return (err) => {
        logger.error('An uncaught exception ocurred. Terminating...');
        logger.error(err);
        bot.alerts
          .sendError({
            title: 'Fatal error! Hanabi is restarting...',
            message:
              '```' +
              JSON.stringify({ err, env: process.env.NODE_ENV }, null, 2) +
              '```',
            thumbnail:
              'https://img.freepik.com/free-vector/warning-sign-black-background_97458-374.jpg?size=626&ext=jpg',
          })
          .then(() => {
            bot?.destroy();
            mongoose.disconnect();
            exit(1);
          })
          .catch(() => {
            exit(1);
          });
      };
    case 'rejection':
      return (reason, promise) => {
        logger.error('A promise rejected without a catch.');
        logger.error(reason);
        logger.error(promise);
        bot.alerts
          .sendError({
            title: 'Fatal error! Hanabi is restarting...',
            message:
              '```' +
              JSON.stringify(
                { reason, promise, env: process.env.NODE_ENV },
                null,
                2,
              ) +
              '```',
            thumbnail:
              'https://img.freepik.com/free-vector/warning-sign-black-background_97458-374.jpg?size=626&ext=jpg',
          })
          .then(() => {
            bot?.destroy();
            mongoose.disconnect();
            exit(1);
          })
          .catch(() => {
            exit(1);
          });
      };
    case 'db_failure':
      return (err) => {
        logger.error('Failed to connect to database. Terminating...');
        logger.error(err);
        bot.alerts
          .sendError({
            title: 'Could not connect to database...',
            message:
              '```' +
              JSON.stringify({ err, env: process.env.NODE_ENV }, null, 2) +
              '```',
            thumbnail:
              'https://img.freepik.com/free-vector/warning-sign-black-background_97458-374.jpg?size=626&ext=jpg',
          })
          .catch(() => {});
        exit(1);
      };
    default:
      return () => {
        logger.info('Received signal to terminate. Exiting...');
        exit(0);
      };
  }
};

module.exports = terminate;
