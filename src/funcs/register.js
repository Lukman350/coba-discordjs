const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
const validation = require('../utils/validation');
const ErrorEmbed = require('../utils/errorEmbed');
const User = require('../database/schema/user');
const { EmbedBuilder } = require('discord.js');
const bcryptjs = require('bcryptjs');

const Register = async (interaction) => {
  const modal = new ModalBuilder().setCustomId('register').setTitle('Register');

  const usernameInput = new TextInputBuilder()
    .setCustomId('usernameInput')
    .setPlaceholder('Your username')
    .setMinLength(3)
    .setMaxLength(20)
    .setStyle(TextInputStyle.Short)
    .setLabel('Username');

  const emailInput = new TextInputBuilder()
    .setCustomId('emailInput')
    .setPlaceholder('Your email')
    .setMinLength(3)
    .setMaxLength(20)
    .setStyle(TextInputStyle.Short)
    .setLabel('Email');

  const nimInput = new TextInputBuilder()
    .setCustomId('nimInput')
    .setPlaceholder('Your NIM')
    .setMinLength(3)
    .setMaxLength(20)
    .setStyle(TextInputStyle.Short)
    .setLabel('NIM');

  const jurusanInput = new TextInputBuilder()
    .setCustomId('jurusanInput')
    .setPlaceholder('Your Jurusan')
    .setMinLength(3)
    .setMaxLength(20)
    .setStyle(TextInputStyle.Short)
    .setLabel('Jurusan');

  const actionRowUsername = new ActionRowBuilder().addComponents(usernameInput);
  const actionRowEmail = new ActionRowBuilder().addComponents(emailInput);
  const actionRowNim = new ActionRowBuilder().addComponents(nimInput);
  const actionRowJurusan = new ActionRowBuilder().addComponents(jurusanInput);

  modal.addComponents(
    actionRowUsername,
    actionRowEmail,
    actionRowNim,
    actionRowJurusan
  );

  await interaction.showModal(modal);

  const filter = (i) => i.user.id === interaction.user.id;

  interaction
    .awaitModalSubmit({ time: 0, filter })
    .then(async (modalInteraction) => {
      try {
        const { fields: formFields } = modalInteraction;

        const username = formFields.getTextInputValue('usernameInput');
        const email = formFields.getTextInputValue('emailInput');
        const nim = formFields.getTextInputValue('nimInput');
        const jurusan = formFields.getTextInputValue('jurusanInput');

        if (!validation.isEmail(email)) {
          modalInteraction.reply({
            embeds: [
              ErrorEmbed('The email you provided is not a valid email.'),
            ],
            ephemeral: true,
          });
          return;
        }

        const password = await bcryptjs.hash(`${username}123`, 10);

        const user = new User({
          name: username,
          email,
          nim,
          jurusan,
          password,
          discordId: interaction.user.id,
        });

        await user.save();

        const messageEmbed = new EmbedBuilder()
          .setTitle('Success!')
          .setDescription('You have been registered!')
          .setThumbnail(interaction.user.avatarURL())
          .addFields(
            { name: 'Username', value: username, inline: true },
            { name: 'Email', value: email, inline: true },
            { name: 'NIM', value: nim, inline: true },
            { name: 'Jurusan', value: jurusan, inline: true },
            { name: 'Password', value: `${username}123`, inline: true }
          )
          .setColor('#0099ff');

        modalInteraction.reply({
          embeds: [messageEmbed],
          ephemeral: true,
        });
      } catch (error) {
        console.error(error);

        if (error.code === 11000) {
          const fieldError = error.message.match(/index: (.*)_1/)[1];
          const message =
            fieldError === 'discordId'
              ? 'You have already been registered before.'
              : `The ${fieldError} you provided is already registered.`;
          modalInteraction.reply({
            embeds: [
              ErrorEmbed(message || 'There was an error while registering.'),
            ],
            ephemeral: true,
          });
          return;
        }

        modalInteraction.reply({
          embeds: [
            ErrorEmbed(
              error.message || 'There was an error while registering.'
            ),
          ],
          ephemeral: true,
        });
      }
    })
    .catch((error) => {
      console.error(error);

      interaction.reply({
        embeds: [
          ErrorEmbed(error.message || 'There was an error while registering.'),
        ],
        ephemeral: true,
      });
    });
};

module.exports = Register;
