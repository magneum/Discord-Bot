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

async function setupPlayer() {
  let playerOptions = {
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
  };

  if (clientID && clientSecret) {
    playerOptions.plugins.push(
      new Spotify({
        clientID,
        clientSecret,
      })
    );

    playerOptions.nodes.push({
      port: 80,
      password: "techpoint",
      host: "lavalink.techpoint.world",
    });
  }

  client.player = new Manager(playerOptions);
}

async function loadMusicEvents() {
  const events = fs
    .readdirSync(`./events/music`)
    .filter((files) => files.endsWith(".js"));

  for (const file of events) {
    const event = require(`./events/music/${file}`);
    client.player
      .on(file.split(".")[0], event.bind(null, client))
      .setMaxListeners(0);
  }
}

async function connectToDatabase() {
  require("./database/connect")();
}

async function setupWebhooks() {
  client.webhooks["weblog"].id = process.env.WEBHOOK_ID;
  client.webhooks["weblog"].token = process.env.WEBHOOK_TOKEN;
}

async function loadCommandHandlers() {
  fs.readdirSync("./handlers").forEach((dir) => {
    fs.readdirSync(`./handlers/${dir}`).forEach((handler) => {
      require(`./handlers/${dir}/${handler}`)(client);
    });
  });
}

async function loginToDiscord() {
  client.login(process.env.DISCORD_TOKEN);
}

async function setupUnhandledRejectionHandler() {
  process.on("unhandledRejection", (error) => {
    console.error("Unhandled promise rejection:", error);
    if (error && error.length > 950)
      error = error.slice(0, 950) + "... view console for details";
    if (error.stack && error.stack.length > 950)
      error.stack = error.stack.slice(0, 950) + "... view console for details";
    if (!error.stack) return;
    weblog.send({
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
}

async function setupWarningHandler() {
  process.on("warning", (warn) => {
    console.warn("Warning:", warn);
    weblog.send({
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
}

async function setupErrorHandler() {
  client.on(discord.ShardEvents.Error, (error) => {
    console.log(error);
    if (error && error.length > 950)
      error = error.slice(0, 950) + "... view console for details";
    if (error.stack && error.stack.length > 950)
      error.stack = error.stack.slice(0, 950) + "... view console for details";
    if (!error.stack) return;
    weblog.send({
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
}

async function setupClient() {
  client.config = require("./config/bot");
  client.changelogs = require("./config/changelogs");
  client.emotes = require("./database/json/emojis.json");
  client.webhooks = require("./database/json/webhooks.json");
  client.queue = new Map();
  client.playerManager = new Map();
  client.triviaManager = new Map();
  client.commands = new discord.Collection();
  client.webhooks["weblog"] = new discord.WebhookClient({
    id: client.webhooks.weblog.id,
    token: client.webhooks.weblog.token,
  });
}

async function init() {
  try {
    await setupPlayer();
    await loadMusicEvents();
    await connectToDatabase();
    await setupWebhooks();
    await loadCommandHandlers();
    await loginToDiscord();
    await setupUnhandledRejectionHandler();
    await setupWarningHandler();
    await setupErrorHandler();
    await setupClient();
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

init();
