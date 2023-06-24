const mango = require("mongoose");
const chalk = require("chalk");

async function connect() {
  mango.set("strictQuery", false);
  try {
    console.log(
      chalk.blue(chalk.bold("🌐 Database")),
      chalk.white(">>"),
      chalk.red("MongoDB"),
      chalk.green("is connecting...")
    );
    await mango.connect(process.env.MONGO_TOKEN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.log(
      chalk.red("❌ [ERROR]"),
      chalk.white(">>"),
      chalk.red("MongoDB"),
      chalk.white(">>"),
      chalk.red("Failed to connect to MongoDB!"),
      chalk.white(">>"),
      chalk.red("Error: " + err)
    );
    console.log(chalk.red("🚫 Exiting..."));
    process.exit(1);
  }

  mango.connection.once("open", () => {
    console.log(
      chalk.blue(chalk.bold("🌐 Database")),
      chalk.white(">>"),
      chalk.red("MongoDB"),
      chalk.green("is ready!")
    );
  });

  mango.connection.on("error", (err) => {
    console.log(
      chalk.red("❌ [ERROR]"),
      chalk.white(">>"),
      chalk.red("Database"),
      chalk.white(">>"),
      chalk.red("Failed to connect to MongoDB!"),
      chalk.white(">>"),
      chalk.red("Error: " + err)
    );
    console.log(chalk.red("🚫 Exiting..."));
    process.exit(1);
  });
  return;
}

module.exports = connect;
