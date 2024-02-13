const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
  EmbedBuilder,
} = require('discord.js');
const UserRoles = require('../../utils/roles');
const Register = require('../../funcs/register');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('initbutton')
    .setDescription('Main command'),
  async execute(interaction) {
    const buttonRegister = new ButtonBuilder()
      .setCustomId('register')
      .setLabel('Register')
      .setStyle(ButtonStyle.Primary);

    const buttonTakeRole = new ButtonBuilder()
      .setCustomId('takerole')
      .setLabel('Take role')
      .setStyle(ButtonStyle.Secondary);

    const embed = new EmbedBuilder()
      .setTitle('Welcome to the server!')
      .setDescription('Click the button to register or take a role.')
      .setColor('#0099ff');

    const buttons = new ActionRowBuilder().addComponents(
      buttonRegister,
      buttonTakeRole
    );

    await interaction.reply({
      embeds: [embed],
      components: [buttons],
    });

    const buttonCollector = interaction.channel.createMessageComponentCollector(
      {
        ComponentType: ComponentType.Button,
        time: 0,
      }
    );

    buttonCollector.on('collect', async (buttonInteraction) => {
      if (buttonInteraction.customId === 'register') {
        // register the user
        await Register(buttonInteraction);
      } else if (buttonInteraction.customId === 'takerole') {
        // give the user a role
        await buttonInteraction.reply({
          content: 'You have taken a role!',
          ephemeral: true,
        });

        const role = interaction.guild.roles.cache.find(
          (role) => role.id === UserRoles.USER
        );

        if (!role) {
          await buttonInteraction.followUp({
            content: 'The role was not found.',
            ephemeral: true,
          });
          return;
        }

        interaction.member.roles.add(role);
      }
    });

    buttonCollector.on('end', async (collected, reason) => {
      if (reason === 'time') {
        await interaction.followUp({
          content: 'The button interaction has ended.',
        });
      }
    });
  },
};
