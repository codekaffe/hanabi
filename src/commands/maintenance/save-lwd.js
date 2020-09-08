const { Command } = require('@ponatech/bot');
const Booru = require('booru');
const Prompter = require('chop-prompter');
const got = require('got');
const fs = require('fs/promises');

module.exports = new Command({
  name: 'save-lewd',
  description: 'Save a lewd to kaffe\'s computer',
  cooldown: 5,
  category: 'maintenance',
  requiredArgs: ['url'],
  usage: '{url}',
  async run(bot, message, meta) {
    async function saveImage(url) {
      let res;
      try {
        res = await got(url, { responseType: 'buffer' });
      } catch {
        meta.respond("That's not a valid image...");
        return;
      }
      if (!res.headers['content-type']?.startsWith('image')) {
        meta.respond("Looks like that's not an image...");
        return;
      }
    
      await fs.mkdir('./downloaded-images').catch(() => {});
      fs.writeFile(`./downloaded-images/${Date.now()}.png`, res.body);
    }

    try {
      await saveImage(meta.args[0]);
    } catch (err) {
      meta.respond('Oh no... something went wrong. >n<');
      bot.logger.error(err);
    }
  },
});
