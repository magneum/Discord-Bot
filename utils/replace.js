const fs = require("fs");
const path = require("path");
const readline = require("readline");

const ignoredContentExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".svg",
  ".mp4",
  ".avi",
  ".mov",
  ".webm",
  ".db",
];
const ignoredFolders = [".git", "node_modules"];
const ignoredRenameExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".svg",
  ".mp4",
  ".avi",
  ".mov",
  ".webm",
  ".db",
];

const additionalEmojis = {
  heart: "❤️",
  smiley: "😊",
  rocket: "🚀",
  party: "🎉",
  fire: "🔥",
  thumbsUp: "👍",
  okHand: "👌",
};

function renameFilesAndFolders(dirPath, oldWord, newWord) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    switch (true) {
      case stats.isDirectory() && !ignoredFolders.includes(file): {
        renameFilesAndFolders(filePath, oldWord, newWord);
        break;
      }
      case !stats.isDirectory(): {
        const fileExtension = path.extname(file).toLowerCase();
        switch (true) {
          case ignoredContentExtensions.includes(fileExtension): {
            const newFilePath = path.join(
              dirPath,
              replaceAll(file, oldWord, newWord)
            );
            fs.renameSync(filePath, newFilePath);
            break;
          }
          case !ignoredRenameExtensions.includes(fileExtension): {
            const fileContent = fs.readFileSync(filePath, "utf8");
            const newContent = replaceAll(fileContent, oldWord, newWord);
            fs.writeFileSync(filePath, newContent, "utf8");

            const newFilePathRenamed = path.join(
              dirPath,
              replaceAll(file, oldWord, newWord)
            );
            fs.renameSync(filePath, newFilePathRenamed);
            break;
          }
        }
        break;
      }
    }
  });
}

function replaceAll(str, search, replacement) {
  return str.split(search).join(replacement);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  resetColor: "\x1b[39m",
};

console.log(
  `${colors.cyan}==== File and Folder Renamer ${additionalEmojis.rocket} ====`
);

function startRenaming() {
  rl.question(
    `Enter the old word ${additionalEmojis.party} (or 'exit' to quit): `,
    (oldWord) => {
      if (oldWord.toLowerCase() === "exit") {
        console.log(`${colors.red}Exiting...${colors.resetColor}`);
        rl.close();
        return;
      }

      rl.question(
        `Enter the new word ${additionalEmojis.fire} : `,
        (newWord) => {
          renameFilesAndFolders(".", oldWord, newWord);
          console.log(`${colors.green}Renaming completed!${colors.resetColor}`);
          startRenaming();
        }
      );
    }
  );
}

startRenaming();
