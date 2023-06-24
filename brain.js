const fs = require("fs");
const discord = require("discord.js");
const { Manager } = require("erela.js");
const Deezer = require("erela.js-deezer");
const Spotify = require("erela.js-spotify");
const AppleMusic = require("erela.js-apple");
const Facebook = require("erela.js-facebook");

const client = new discord.Client({
  allowedMentions: {
    parse: ["users", "roles"],
    repliedUser: true,
  },
  autoReconnect: true,
  disabledEvents: ["TYPING_START"],
  partials: [
    discord.Partials.User,
    discord.Partials.Channel,
    discord.Partials.Message,
    discord.Partials.Reaction,
    discord.Partials.GuildMember,
    discord.Partials.GuildScheduledEvent,
  ],
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildInvites,
    discord.GatewayIntentBits.GuildMembers,
    discord.GatewayIntentBits.GuildWebhooks,
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.DirectMessages,
    discord.GatewayIntentBits.MessageContent,
    discord.GatewayIntentBits.GuildVoiceStates,
    discord.GatewayIntentBits.GuildIntegrations,
    discord.GatewayIntentBits.GuildMessageTyping,
    discord.GatewayIntentBits.DirectMessageTyping,
    discord.GatewayIntentBits.GuildScheduledEvents,
    discord.GatewayIntentBits.GuildMessageReactions,
    discord.GatewayIntentBits.DirectMessageReactions,
    discord.GatewayIntentBits.GuildEmojisAndStickers,
  ],
  restTimeOffset: 0,
});

const clientID = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
if (clientID && clientSecret) {
  client.player = new Manager({
    plugins: [
      new AppleMusic(),
      new Deezer(),
      new Facebook(),
      new Spotify({
        clientID,
        clientSecret,
      }),
    ],
    nodes: [
      {
        host: process.env.LAVALINK_HOST || "lava.link",
        port: parseInt(process.env.LAVALINK_PORT) || 80,
        password: process.env.LAVALINK_PASSWORD || "Magneum",
        secure: Boolean(process.env.LAVALINK_SECURE) || false,
      },
      {
        port: 80,
        password: "techpoint",
        host: "lavalink.techpoint.world",
      },
    ],
    send(id, payload) {
      const guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    },
  });
} else {
  client.player = new Manager({
    plugins: [new AppleMusic(), new Deezer(), new Facebook()],
    nodes: [
      {
        host: process.env.LAVALINK_HOST || "lava.link",
        port: parseInt(process.env.LAVALINK_PORT) || 80,
        password: process.env.LAVALINK_PASSWORD || "Magneum",
        secure: Boolean(process.env.LAVALINK_SECURE) || false,
      },
    ],
    send(id, payload) {
      const guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    },
  });
}
const events = fs
  .readdirSync(`./events/music`)
  .filter((files) => files.endsWith(".js"));

for (const file of events) {
  const event = require(`./events/music/${file}`);
  client.player
    .on(file.split(".")[0], event.bind(null, client))
    .setMaxListeners(0);
}

require("./database/connect")();

client.config = require("./config/bot");
client.changelogs = require("./config/changelogs");
client.emotes = require("./database/json/emojis.json");
client.webhooks = require("./database/json/webhooks.json");
client.webhooks["HookLogger"].id = process.env.WEBHOOK_ID;
client.webhooks["HookLogger"].token = process.env.WEBHOOK_TOKEN;

client.queue = new Map();
client.playerManager = new Map();
client.triviaManager = new Map();
client.commands = new discord.Collection();

const HookLogger = new discord.WebhookClient({
  id: client.webhooks.HookLogger.id,
  token: client.webhooks.HookLogger.token,
});

fs.readdirSync("./handlers").forEach((dir) => {
  fs.readdirSync(`./handlers/${dir}`).forEach((handler) => {
    require(`./handlers/${dir}/${handler}`)(client);
  });
});

client.login(process.env.DISCORD_TOKEN);

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
  if (error)
    if (error.length > 950)
      error = error.slice(0, 950) + "... view console for details";
  if (error.stack)
    if (error.stack.length > 950)
      error.stack = error.stack.slice(0, 950) + "... view console for details";
  if (!error.stack) return;
  HookLogger.send({
    username: "Bot Logs",
    embeds: [
      new discord.EmbedBuilder()
        .setTitle(`🚨・Unhandled promise rejection`)
        .addFields([
          {
            name: "Error",
            value: error ? discord.codeBlock(error) : "No error",
          },
          {
            name: "Stack error",
            value: error.stack
              ? discord.codeBlock(error.stack)
              : "No stack error",
          },
        ])
        .setColor("#5865F2"),
    ],
  }).catch(() => {
    console.log("Error sending unhandledRejection to webhook");
    console.log(error);
  });
});

process.on("warning", (warn) => {
  console.warn("Warning:", warn);
  HookLogger.send({
    username: "Bot Logs",
    embeds: [
      new discord.EmbedBuilder()
        .setTitle(`🚨・New warning found`)
        .addFields([
          {
            name: `Warn`,
            value: `\`\`\`${warn}\`\`\``,
          },
        ])
        .setColor("#5865F2"),
    ],
  }).catch(() => {
    console.log("Error sending warning to webhook");
    console.log(warn);
  });
});

client.on(discord.ShardEvents.Error, (error) => {
  console.log(error);
  if (error)
    if (error.length > 950)
      error = error.slice(0, 950) + "... view console for details";
  if (error.stack)
    if (error.stack.length > 950)
      error.stack = error.stack.slice(0, 950) + "... view console for details";
  if (!error.stack) return;
  HookLogger.send({
    username: "Bot Logs",
    embeds: [
      new discord.EmbedBuilder()
        .setTitle(`🚨・A websocket connection encountered an error`)
        .addFields([
          {
            name: `Error`,
            value: `\`\`\`${error}\`\`\``,
          },
          {
            name: `Stack error`,
            value: `\`\`\`${error.stack}\`\`\``,
          },
        ])
        .setColor("#5865F2"),
    ],
  });
});
