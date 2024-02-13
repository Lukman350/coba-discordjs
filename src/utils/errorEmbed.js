const { EmbedBuilder } = require('discord.js');

const ErrorEmbed = (message) => {
  const embed = new EmbedBuilder()
    .setTitle('Oops!, an error occurred.')
    .setDescription(message)
    .setThumbnail(
      'https://cdn.discordapp.com/emojis/833773015388127252.png?v=1'
    )
    .setColor('#ff0000')
    .setTimestamp(new Date());

  return embed;
};

module.exports = ErrorEmbed;
