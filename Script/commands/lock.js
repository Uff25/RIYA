const lockedThreads = {};
const pageID = "100028959431665"; // তোমার পেজ আইডি

module.exports.config = {
  name: "lock",
  version: "3.0.0",
  hasPermssion: 1,
  credits: "MOHAMMAD AKASH",
  description: "Lock / Unlock group so only admins can chat",
  commandCategory: "box chat",
  usages: "lock on/off",
  cooldowns: 3
};

// ===============================
//       onLoad (optional)
// ===============================
module.exports.onLoad = () => {
  // এখানে কিছু লাগলে দিতে পারো
};

// ===============================
//         COMMAND RUN
// ===============================
module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const senderID = event.senderID;

  const info = await api.getThreadInfo(threadID);
  const adminIDs = info.adminIDs.map(u => u.id);

  // Only admin can use
  if (!adminIDs.includes(senderID)) {
    return api.sendMessage("❌ শুধু এডমিন এই কমান্ড ব্যবহার করতে পারবে!", threadID, event.messageID);
  }

  const action = args[0]?.toLowerCase();

  // 🔒 LOCK
  if (action === "on" || action === "lock") {
    if (lockedThreads[threadID]) {
      return api.sendMessage("✅ গ্রুপ আগেই লক করা আছে!", threadID, event.messageID);
    }

    try { 
      await api.addUserToGroup(pageID, threadID); 
    } catch (e) {}

    lockedThreads[threadID] = true;

    return api.sendMessage("🔒 গ্রুপ লক করা হলো! এখন কেউ মেসেজ দিতে পারবে না।", threadID, event.messageID);
  }

  // 🔓 UNLOCK
  if (action === "off" || action === "unlock") {
    if (!lockedThreads[threadID]) {
      return api.sendMessage("✅ গ্রুপ আগেই আনলক আছে!", threadID, event.messageID);
    }

    delete lockedThreads[threadID];

    try {
      await api.removeUserFromGroup(pageID, threadID);
    } catch (err) {}

    return api.sendMessage("🔓 গ্রুপ আনলক করা হলো! এখন সবাই মেসেজ দিতে পারবে।", threadID, event.messageID);
  }

  // Invalid usage
  return api.sendMessage("❌ ব্যবহার: lock on / lock off", threadID, event.messageID);
};

// ===============================
//          AUTO EVENT
// ===============================
module.exports.handleEvent = async function ({ api, event }) {
  const threadID = event.threadID;

  if (!lockedThreads[threadID]) return;

  const info = await api.getThreadInfo(threadID);
  const adminIDs = info.adminIDs.map(u => u.id);

  // Admin can chat
  if (adminIDs.includes(event.senderID)) return;

  // Non-admin → delete their message
  try {
    await api.unsendMessage(event.messageID);
  } catch (err) {
    console.log("Lock Error:", err);
  }
};
