const { Command, Permission } = require('sensum');
const got = require('got');
const { logger } = require('../../modules');

module.exports = new Command({
  name: 'set-avatar',
  description: "Changes Hanabi-sama's avatar.",
  help: 'Url must be a valid image.',
  aliases: ['set-pfp'],
  permission: Permission.BOT_ADMIN,
  category: 'maintenance',
  requiredArgs: ['image url'],
  usage: '{image url}',
  args: {
    imageUrl: 'url',
  },
  hidden: true,
  async run(bot, message, meta) {
    const {imageUrl} = meta.args;
    let res;
    try {
      res = await got(imageUrl, { responseType: 'buffer' });
    } catch {
      this.send("That's not a valid image...");
      return;
    }
    if (!res.headers['content-type']?.startsWith('image')) {
      this.send("Looks like that's not an image...");
      return;
    }
    logger.log('Settings avatar to:', res.body);
    await bot.user.setAvatar(res.body);
    this.send('Am I cute? owo~');
    this.send(bot.user.avatarURL());
  },
});
// potato 🍟potato
// potato🍠potato
