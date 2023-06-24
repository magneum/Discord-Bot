const discord = require("discord.js");
const fs = require("fs");

const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const Facebook = require("erela.js-facebook");
const Deezer = require("erela.js-deezer");
const AppleMusic = require("erela.js-apple");

// discord client
const client = new discord.Client({
  allowedMentions: {
    parse: ["users", "roles"],
    repliedUser: true,
  },
  autoReconnect: true,
  disabledEvents: ["TYPING_START"],
  partials: [
    discord.Partials.Channel,
    discord.Partials.GuildMember,
    discord.Partials.Message,
    discord.Partials.Reaction,
    discord.Partials.User,
    discord.Partials.GuildScheduledEvent,
  ],
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMembers,
    discord.GatewayIntentBits.GuildBans,
    discord.GatewayIntentBits.GuildEmojisAndStickers,
    discord.GatewayIntentBits.GuildIntegrations,
    discord.GatewayIntentBits.GuildWebhooks,
    discord.GatewayIntentBits.GuildInvites,
    discord.GatewayIntentBits.GuildVoiceStates,
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.GuildMessageReactions,
    discord.GatewayIntentBits.GuildMessageTyping,
    discord.GatewayIntentBits.DirectMessages,
    discord.GatewayIntentBits.DirectMessageReactions,
    discord.GatewayIntentBits.DirectMessageTyping,
    discord.GatewayIntentBits.GuildScheduledEvents,
    discord.GatewayIntentBits.MessageContent,
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
        password: process.env.LAVALINK_PASSWORD || "MagneumDev",
        secure: Boolean(process.env.LAVALINK_SECURE) || false,
      },
      {
        host: "lavalink.techpoint.world",
        port: 80,
        password: "techpoint",
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
        password: process.env.LAVALINK_PASSWORD || "MagneumDev",
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

// Connect to database
require("./database/connect")();

// Client settings
client.config = require("./config/bot");
client.changelogs = require("./config/changelogs");
client.emotes = require("./database/json/emojis.json");
client.webhooks = require("./database/json/webhooks.json");
const webHooksArray = [
  "startLogs",
  "shardLogs",
  "errorLogs",
  "dmLogs",
  "voiceLogs",
  "serverLogs",
  "serverLogs2",
  "commandLogs",
  "consoleLogs",
  "warnLogs",
  "voiceErrorLogs",
  "creditLogs",
  "evalLogs",
  "interactionLogs",
];
// Check if .env webhook_id and webhook_token are set
if (process.env.WEBHOOK_ID && process.env.WEBHOOK_TOKEN) {
  for (const webhookName of webHooksArray) {
    client.webhooks[webhookName].id = process.env.WEBHOOK_ID;
    client.webhooks[webhookName].token = process.env.WEBHOOK_TOKEN;
  }
}

client.commands = new discord.Collection();
client.playerManager = new Map();
client.triviaManager = new Map();
client.queue = new Map();

// Webhooks
const consoleLogs = new discord.WebhookClient({
  id: client.webhooks.consoleLogs.id,
  token: client.webhooks.consoleLogs.token,
});

const warnLogs = new discord.WebhookClient({
  id: client.webhooks.warnLogs.id,
  token: client.webhooks.warnLogs.token,
});

// Load handlers
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
  const embed = new discord.EmbedBuilder()
    .setTitle(`🚨・Unhandled promise rejection`)
    .addFields([
      {
        name: "Error",
        value: error ? discord.codeBlock(error) : "No error",
      },
      {
        name: "Stack error",
        value: error.stack ? discord.codeBlock(error.stack) : "No stack error",
      },
    ])
    .setColor("#5865F2");
  consoleLogs
    .send({
      username: "Bot Logs",
      embeds: [embed],
    })
    .catch(() => {
      console.log("Error sending unhandledRejection to webhook");
      console.log(error);
    });
});

process.on("warning", (warn) => {
  console.warn("Warning:", warn);
  const embed = new discord.EmbedBuilder()
    .setTitle(`🚨・New warning found`)
    .addFields([
      {
        name: `Warn`,
        value: `\`\`\`${warn}\`\`\``,
      },
    ])
    .setColor("#5865F2");
  warnLogs
    .send({
      username: "Bot Logs",
      embeds: [embed],
    })
    .catch(() => {
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
  const embed = new discord.EmbedBuilder()
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
    .setColor("#5865F2");
  consoleLogs.send({
    username: "Bot Logs",
    embeds: [embed],
  });
});
