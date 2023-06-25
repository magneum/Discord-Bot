const chalk = require("chalk");
require("dotenv").config("./.env");
const discord = require("discord.js");
const webhook = require("./database/json/weblogs.json");

webhook["weblog"].id = process.env.WEBHOOK_ID;
webhook["weblog"].token = process.env.WEBHOOK_TOKEN;

const weblog = new discord.WebhookClient({
token: webhook.weblog.token,
id: webhook.weblog.id,
});

const manager = new discord.ShardingManager("./brain.js", {
token: process.env.DISCORD_TOKEN,
totalShards: "auto",
respawn: true,
});

if (process.env.TOPGG_TOKEN) {
const { AutoPoster } = require("topgg-autoposter");
AutoPoster(process.env.TOPGG_TOKEN, manager);
}

console.log(
chalk.bold.blue.bold("System") +
chalk.bold.white(">>") +
chalk.bold.green("Starting up") +
chalk.bold.white("...")
);
console.log("\u001b[0m");
console.log(chalk.bold.red("© Magneum | 2021 - " + new Date().getFullYear()));
console.log(chalk.bold.red("All rights reserved"));
console.log("\u001b[0m");
console.log("\u001b[0m");
console.log(
chalk.bold.blue.bold("System") +
chalk.bold.white(">>") +
chalk.bold.red(
"Version " + require(`${process.cwd()}/package.json`).version
) +
chalk.bold.green("loaded")
);
console.log("\u001b[0m");

manager.on("shardCreate", async (shard) => {
await weblog.send({
username: "Bot Logs",
embeds: [
new discord.EmbedBuilder()
.setTitle("🆙・Launching shard")
.setDescription("A shard has just been launched")
.setFields([
{
name: "🆔┆ID",
value: `${shard.id + 1}/${manager.totalShards}`,
inline: true,
},
{
name: "📃┆State",
value: "Starting up...",
inline: true,
},
])
.setColor("#5865F2"),
],
});

console.log(
chalk.bold.blue.bold("System") +
chalk.bold.white(">>") +
chalk.bold.green("Starting") +
chalk.bold.red("Shard #" + (shard.id + 1)) +
chalk.bold.white("...")
);
console.log("\u001b[0m");

shard.on("death", async (process) => {
await weblog.send({
username: "Bot Logs",
embeds: [
new discord.EmbedBuilder()
.setTitle(
"🚨・Closing shard " +
(shard.id + 1) +
"/" +
manager.totalShards +
" unexpectedly"
)
.setFields([
{
name: "🆔┆ID",
value: `${shard.id + 1}/${manager.totalShards}`,
},
])
.setColor("#5865F2"),
],
});

if (process.exitCode === null) {
await weblog.send({
username: "Bot Logs",
embeds: [
new discord.EmbedBuilder()
.setTitle(
"🚨・Shard " +
(shard.id + 1) +
"/" +
manager.totalShards +
" exited with NULL error code!"
)
.setFields([
{
name: "PID",
value: "`" + process.pid + "`",
},
{
name: "Exit code",
value: "`" + process.exitCode + "`",
},
])
.setColor("#5865F2"),
],
});
}
});

shard.on("shardDisconnect", async (event) => {
await weblog.send({
username: "Bot Logs",
embeds: [
new discord.EmbedBuilder()
.setTitle(
"🚨・Shard " +
(shard.id + 1) +
"/" +
manager.totalShards +
" disconnected"
)
.setDescription("Dumping socket close event...")
.setColor("#5865F2"),
],
});
});

shard.on("shardReconnecting", async () => {
await weblog.send({
username: "Bot Logs",
embeds: [
new discord.EmbedBuilder()
.setTitle(
"🚨・Reconnecting shard " +
(shard.id + 1) +
"/" +
manager.totalShards
)
.setColor("#5865F2"),
],
});
});
});

(async () => {
try {
await manager.spawn();
} catch (error) {
console.error("Failed to spawn shards:", error);
}
})();

process.on("unhandledRejection", async (error) => {
console.error("Unhandled promise rejection:", error);
if (error && error.length > 950)
error = error.slice(0, 950) + "... view console for details";
if (error.stack && error.stack.length > 950)
error.stack = error.stack.slice(0, 950) + "... view console for details";
if (!error.stack) return;
try {
await weblog.send({
username: "Bot Logs",
embeds: [
new discord.EmbedBuilder()
.setTitle("🚨・Unhandled promise rejection")
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
]),
],
});
} catch (sendError) {
console.log("Error sending unhandled promise rejection to webhook");
console.log(error);
}
});

process.on("warning", async (warn) => {
console.warn("Warning:", warn);
try {
await weblog.send({
username: "Bot Logs",
embeds: [
new discord.EmbedBuilder().setTitle("🚨・New warning found").addFields([
{
name: "Warn",
value: "```" + warn + "```",
},
]),
],
});
} catch (sendError) {
console.log("Error sending warning to webhook");
console.log(warn);
}
})();
