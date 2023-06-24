const { Sequelize } = require("sequelize");
const chalk = require("chalk");
const fs = require("fs");
if (fs.existsSync(".env")) {
  require("dotenv").config({ path: ".env" });
} else {
  require("dotenv");
}

const convertToLogLevel = (value) => {
  let log = false;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") {
      log = (message) =>
        console.log(
          chalk.bgGreen.black.bold(" Auth-db Logs:") +
            " " +
            chalk.reset(message)
        );
    }
  }
  return log;
};

process.env.DATABASE_URL =
  process.env.DATABASE_URL === undefined
    ? "./pgs.db"
    : process.env.DATABASE_URL;
process.env.DEBUG =
  process.env.DEBUG === undefined ? "false" : process.env.DEBUG;

const pgs = {
  DATABASE_URL:
    process.env.DATABASE_URL === undefined
      ? "./pgs.db"
      : process.env.DATABASE_URL,
  DEBUG: process.env.DEBUG === undefined ? false : process.env.DEBUG,
  DATABASE:
    process.env.DATABASE_URL === "./pgs.db"
      ? new Sequelize({
          dialect: "sqlite",
          storage: process.env.DATABASE_URL,
          logging:
            process.env.VERBOSE_MODE === "debug"
              ? convertToLogLevel("true")
              : convertToLogLevel("false"),
        })
      : new Sequelize(process.env.DATABASE_URL, {
          dialect: "postgres",
          protocol: "postgres",
          logging:
            process.env.VERBOSE_MODE === "debug"
              ? convertToLogLevel("true")
              : convertToLogLevel("false"),
          dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
        }),
};

module.exports = pgs;
