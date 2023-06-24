module.exports = async (client, interaction, args) => {
  client.embed(
    {
      title: `📘・Owner information`,
      desc: `____________________________`,
      thumbnail: client.user.avatarURL({ dynamic: true, size: 1024 }),
      fields: [
        {
          name: "👑┆Owner name",
          value: `Magneum`,
          inline: true,
        },
        {
          name: "🏷┆discord tag",
          value: `</Magneum>#0001`,
          inline: true,
        },
        {
          name: "🏢┆Organization",
          value: `CoreWare`,
          inline: true,
        },
        {
          name: "🌐┆Website",
          value: `[https://corwindev.nl](https://corwindev.nl)`,
          inline: true,
        },
      ],
      type: "editreply",
    },
    interaction
  );
};
