module.exports.config = {
 name: "fork",
 version: "2.0.4",
 hasPermssion: 0,
 credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
 description: "Stable fork system",
 commandCategory: "other",
 usages: "fork",
 cooldowns: 3,
};

const fs = require("fs-extra");
const axios = require("axios");

module.exports.run = async function({ api, event }) {

 const repo = "https://github.com/ItsAriyan-X/ARIYAN_CHAT_BOT/fork";
 const repoLink = `https://github.com/${repo}`;

 const msg = `
━━━━━━━━━━━━━━━━━━━━━━
乛 𝐀𝐑𝐈𝐘𝐀𝐍 ཐི༏ཋྀ 𝐒𝐀𝐁𝐁𝐈𝐑ꜛཐི༏ཋྀ࿐
𝗕𝗢𝗦𝗦 𝗔𝗥 𝗙𝗢𝗥𝗞 𝗟𝗶𝗡𝗞
━━━━━━━━━━━━━━━━━━━━━━

📌 Repo: ${repoLink}

━━━━━━━━━━━━━━━━━━━━━━
𝐀𝐑𝐈𝐘𝐀𝐍 𝗖𝗛𝗔𝗧 𝗕𝗢𝗧
━━━━━━━━━━━━━━━━━━━━━━
`;

 const imageUrl = "https://i.imgur.com/W4lBm3J.jpeg";
 const path = __dirname + "/cache/fork.jpg";

 try {
 const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
 fs.writeFileSync(path, Buffer.from(img.data));

 return api.sendMessage({
 body: msg,
 attachment: fs.createReadStream(path)
 }, event.threadID, () => fs.unlinkSync(path), event.messageID);

 } catch (e) {
 return api.sendMessage(msg, event.threadID, event.messageID);
 }
};
