const { ContextMenuCommandBuilder } = require("discord.js");
const discord = require("discord.js");
const Schema = require("../../database/models/warnings");
const Case = require("../../database/models/warnCase");

module.exports = {
  data: new ContextMenuCommandBuilder().setName("Warn").setType(2),
  run: async (client, interaction, args) => {
    const perms = await client.checkPerms(
      {
        flags: [discord.PermissionsBitField.Flags.ManageMessages],
        perms: [discord.PermissionsBitField.Flags.ManageMessages],
      },
      interaction
    );
    switch (perms) {
      case false:
        client.errNormal(
          {
            error: `You don't have the required permissions to use this command!`,
            type: "ephemeral",
          },
          interaction
        );
        return;
    }

    // Create modal to give a reason
    const modal = new discord.ModalBuilder()
      .setTitle("Warn")
      .setCustomId("warn")
      .addComponents(
        new discord.ActionRowBuilder().addComponents(
          new discord.TextInputBuilder()
            .setCustomId("reason")
            .setPlaceholder("Reason")
            .setLabel("Reason")
            .setMinLength(1)
            .setStyle(discord.TextInputStyle.Short)
            .setMaxLength(100)
        )
      );
    await interaction.showModal(modal);

    const submitted = await interaction
      .awaitModalSubmit({
        time: 60000,
        filter: (i) => i.user.id === interaction.user.id,
      })
      .catch(() => {});

    if (!submitted) {
      return;
    }

    const member = interaction.guild.members.cache.get(interaction.targetId);
    var caseNumber;
    await Case.findOne({ Guild: interaction.guild.id }).then(async (data) => {
      switch (!!data) {
        case false:
          new Case({
            Guild: interaction.guild.id,
            Case: 1,
          }).save();
          caseNumber = 1;
          break;
        default:
          data.Case += 1;
          data.save();
          caseNumber = data.Case;
          break;
      }
    });

    Schema.findOne(
      { Guild: interaction.guild.id, User: member.id },
      async (err, data) => {
        if (data) {
          data.Warnings.push({
            Moderator: interaction.user.id,
            Reason: submitted.fields.getTextInputValue("reason"),
            Date: Date.now(),
            Case: caseNumber,
          });
          data.save();
        } else {
          new Schema({
            Guild: interaction.guild.id,
            User: member.id,
            Warnings: [
              {
                Moderator: interaction.user.id,
                Reason: submitted.fields.getTextInputValue("reason"),
                Date: Date.now(),
                Case: caseNumber,
              },
            ],
          }).save();
        }
      }
    );

    client
      .embed(
        {
          title: `🔨・Warn`,
          desc: `You've been warned in **${interaction.guild.name}**`,
          fields: [
            {
              name: "👤┆Moderator",
              value: interaction.user.tag,
              inline: true,
            },
            {
              name: "📄┆Reason",
              value: submitted.fields.getTextInputValue("reason"),
              inline: true,
            },
          ],
        },
        member
      )
      .catch(() => {});

    client.emit(
      "warnAdd",
      member,
      interaction.user,
      submitted.fields.getTextInputValue("reason")
    );
    client.succNormal(
      {
        text: `User has received a warning!`,
        fields: [
          {
            name: "👤┆User",
            value: `${member}`,
            inline: true,
          },
          {
            name: "👤┆Moderator",
            value: `${interaction.user}`,
            inline: true,
          },
          {
            name: "📄┆Reason",
            value: submitted.fields.getTextInputValue("reason"),
            inline: false,
          },
        ],
        type: "ephemeral",
      },
      submitted
    );
  },
};
