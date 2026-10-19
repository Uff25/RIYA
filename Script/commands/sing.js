const axios = require("axios");

const mahmud = async () => {
    const base = await axios.get(
        "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
    );
    return base.data.mahmud;
};

module.exports = {
    config: {
        name: "sing",
        version: "1.7",
        author: "ARIYAN SABBIR",
        countDown: 10,
        role: 0,
        description: {
            bn: "যেকোনো গান সার্চ করে অডিও ফাইল ডাউনলোড করুন",
            en: "Search and download any song as an audio file",
            vi: "Tìm kiếm và tải xuống bất kỳ bài hát nào dưới dạng tệp âm thanh"
        },
        category: "music",
        guide: {
            bn: "   {pn} <গানের নাম>: গান ডাউনলোড করতে নাম লিখুন",
            en: "   {pn} <song name>: Enter song name to download",
            vi: "   {pn} <tên bài hát>: Nhập tên bài hát để tải xuống"
        }
    },

    langs: {
        bn: {
            noInput: "╭───────⦿🎵⦿───────╮\n   ✦ বেবি, গানের নাম তো দাও! 🥺\n   ✦ উদাহরণ: {pn} shape of you\n╰───────⦿🎵⦿───────╯",
            success: "╭───────⦿🎧⦿───────╮\n   ✦ 𝐀𝐑𝐈𝐘𝐀𝐍 𝐂𝐇𝐀𝐓 𝐁𝐎𝐓\n   ✦ এই নাও তোমার গান 🎶\n   ✦ 𝐒𝐨𝐧𝐠: %1\n╰───────⦿🎧⦿───────╯\n\n♡ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐀𝐑𝐈𝐘𝐀𝐍 𝐒𝐀𝐁𝐁𝐈𝐑",
            error: "╭───────⦿❌⦿───────╮\n   ✦ গান ডাউনলোড করা যায়নি!\n   ✦ সমস্যা: %1\n╰───────⦿❌⦿───────╯"
        },
        en: {
            noInput: "╭───────⦿🎵⦿───────╮\n   ✦ Baby, please provide a song name!\n   ✦ Example: {pn} shape of you\n╰───────⦿🎵⦿───────╯",
            success: "╭───────⦿🎧⦿───────╮\n   ✦ 𝐀𝐑𝐈𝐘𝐀𝐍 𝐂𝐇𝐀𝐓 𝐁𝐎𝐓\n   ✦ Here's your requested song! 🎶\n   ✦ 𝐒𝐨𝐧𝐠: %1\n╰───────⦿🎧⦿───────╯\n\n♡ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐀𝐑𝐈𝐘𝐀𝐍 𝐒𝐀𝐁𝐁𝐈𝐑",
            error: "╭───────⦿❌⦿───────╮\n   ✦ Song download failed!\n   ✦ Error: %1\n╰───────⦿❌⦿───────╯"
        },
        vi: {
            noInput: "╭───────⦿🎵⦿───────╮\n   ✦ Vui lòng nhập tên bài hát!\n   ✦ Ví dụ: {pn} shape of you\n╰───────⦿🎵⦿───────╯",
            success: "╭───────⦿🎧⦿───────╮\n   ✦ 𝐀𝐑𝐈𝐘𝐀𝐍 𝐂𝐇𝐀𝐓 𝐁𝐎𝐓\n   ✦ Bài hát của bạn đây! 🎶\n   ✦ 𝐁𝐚̀𝐢 𝐡𝐚́𝐭: %1\n╰───────⦿🎧⦿───────╯\n\n♡ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐀𝐑𝐈𝐘𝐀𝐍 𝐒𝐀𝐁𝐁𝐈𝐑",
            error: "╭───────⦿❌⦿───────╮\n   ✦ Không thể tải bài hát!\n   ✦ Lỗi: %1\n╰───────⦿❌⦿───────╯"
        }
    },

    onStart: async function ({ api, event, args, message, getLang }) {
        const authorName = "ARIYAN SABBIR";

        if (this.config.author !== authorName) {
            return api.sendMessage(
                "❌ You are not authorized to change the author name.",
                event.threadID,
                event.messageID
            );
        }

        const query = args.join(" ");
        if (!query) return message.reply(getLang("noInput"));

        try {
            api.setMessageReaction(
                "⌛",
                event.messageID,
                () => {},
                true
            );

            const baseUrl = await mahmud();
            const apiUrl = `${baseUrl}/api/song/mahmud?query=${encodeURIComponent(query)}`;

            const response = await axios({
                method: "GET",
                url: apiUrl,
                responseType: "stream",
                timeout: 60000
            });

            return message.reply(
                {
                    body: getLang("success", query),
                    attachment: response.data
                },
                () => {
                    api.setMessageReaction(
                        "🎧",
                        event.messageID,
                        () => {},
                        true
                    );
                }
            );
        } catch (err) {
            console.error("Sing Error:", err);

            api.setMessageReaction(
                "❌",
                event.messageID,
                () => {},
                true
            );

            return message.reply(
                getLang("error", err.message)
            );
        }
    }
};
