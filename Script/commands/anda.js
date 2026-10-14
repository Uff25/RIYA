const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
name: "anda",
version: "2.2.2",
hasPermssion: 0,
credits: "ARIYAN SABBIR",
description: "Create a funny DIM meme",
commandCategory: "fun",
usages: "[reply / mention]",
cooldowns: 5,
dependencies: {
axios: "",
canvas: "",
"fs-extra": ""
}
};

async function fetchAvatar(uid) {
const url = "https://graph.facebook.com/" + uid + "/picture?width=720&height=720";

const response = await axios.get(url, {
responseType: "arraybuffer",
timeout: 15000,
headers: {
"User-Agent": "Mozilla/5.0"
}
});

return Buffer.from(response.data);
}

module.exports.run = async function ({ api, event }) {
const threadID = event.threadID;
const messageID = event.messageID;
const senderID = event.senderID;
const mentions = event.mentions || {};
const messageReply = event.messageReply;

let targetID = Object.keys(mentions)[0];

if (!targetID && messageReply) {
targetID = messageReply.senderID;
}

if (!targetID) {
return api.sendMessage(
"🥚 কাউকে Mention করো অথবা তার মেসেজে Reply দাও!",
threadID,
messageID
);
}

if (targetID === senderID) {
return api.sendMessage(
"😂 নিজেকে DIM বানানো নিষেধ!",
threadID,
messageID
);
}

let output = null;

try {
const cacheDir = path.join(__dirname, "cache", "dim");
await fs.ensureDir(cacheDir);

const bgPath = path.join(cacheDir, "bg.jpg");
const bgUrl = "https://i.postimg.cc/Wbt5GLY7/5674fba3a393f7578a73919569b5147f.jpg";

if (!(await fs.pathExists(bgPath))) {
  const bgResponse = await axios.get(bgUrl, {
    responseType: "arraybuffer",
    timeout: 20000
  });

  await fs.writeFile(bgPath, bgResponse.data);
}

await api.sendMessage(
  "⏳ DIM meme তৈরি হচ্ছে... 😂",
  threadID
);

const avatarBuffer = await fetchAvatar(targetID);
const bg = await loadImage(await fs.readFile(bgPath));
const avatar = await loadImage(avatarBuffer);

const canvas = createCanvas(bg.width, bg.height);
const ctx = canvas.getContext("2d");

ctx.drawImage(bg, 0, 0, bg.width, bg.height);

const size = 150;
const x = 100;
const y = 60;

ctx.save();
ctx.beginPath();
ctx.arc(
  x + size / 2,
  y + size / 2,
  size / 2,
  0,
  Math.PI * 2
);
ctx.clip();
ctx.drawImage(avatar, x, y, size, size);
ctx.restore();

ctx.beginPath();
ctx.arc(
  x + size / 2,
  y + size / 2,
  size / 2 + 2,
  0,
  Math.PI * 2
);
ctx.strokeStyle = "#ffffff";
ctx.lineWidth = 5;
ctx.stroke();

ctx.font = "bold 28px Arial";
ctx.textAlign = "center";
ctx.lineWidth = 4;
ctx.strokeStyle = "#000000";
ctx.fillStyle = "#ffffff";

const text = "PURE DIM 😂";
ctx.strokeText(text, bg.width / 2, bg.height - 40);
ctx.fillText(text, bg.width / 2, bg.height - 40);

output = path.join(
  cacheDir,
  "dim_" + targetID + "_" + Date.now() + ".png"
);

await fs.writeFile(output, canvas.toBuffer("image/png"));

let name = "Someone";

try {
  const info = await api.getUserInfo(targetID);
  name = info[targetID] && info[targetID].name
    ? info[targetID].name
    : name;
} catch (err) {
  console.log("Username fetch failed:", err.message);
}

return api.sendMessage(
  {
    body: "🥚🤣 " + name + " এখন একদম DIM LEVEL MAX!",
    mentions: [
      {
        tag: name,
        id: targetID
      }
    ],
    attachment: fs.createReadStream(output)
  },
  threadID,
  function (err) {
    if (err) {
      console.error("[DIM SEND ERROR]", err);
    }

    fs.unlink(output).catch(function () {});
  },
  messageID
);

} catch (error) {
console.error("[DIM ERROR]", error);

if (output) {
  await fs.unlink(output).catch(function () {});
}

return api.sendMessage(
  "❌ DIM meme তৈরি করা যায়নি। Avatar API, Background URL এবং Canvas পরীক্ষা করো।",
  threadID,
  messageID
);

}
};
