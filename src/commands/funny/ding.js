const { Command } = require('@ponatech/bot');

module.exports = new Command({
  name: 'ding',
  description: 'Ring da door bell.',
  delete: false,
  category: 'funny',
  async run(_, __, meta) {
    const msg = await meta.respond('Dong!');
    msg.react('🚪').catch(() => {});
  },
});
