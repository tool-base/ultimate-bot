require('./settings')
const makeWASocket = require("@whiskeysockets/baileys").default
const { default: CypherConnect, getAggregateVotesInPollMessage, delay, PHONENUMBER_MCC, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto, Browsers, normalizeMessageContent } = require("@whiskeysockets/baileys")
const { color } = require('./lib/color')
const fs = require("fs");
const pino = require("pino");
const lolcatjs = require('lolcatjs')
const axios = require('axios')
const path = require('path')
const NodeCache = require("node-cache");
const msgRetryCounterCache = new NodeCache();
const fetch = require("node-fetch")
const FileType = require('file-type')
const _ = require('lodash')
const chalk = require('chalk')
const os = require('os');
const express = require('express')
const RateLimit = require('express-rate-limit')
const app = express();
const moment = require("moment-timezone")
const { performance } = require("perf_hooks");
const { File } = require('megajs');
const { Boom } = require("@hapi/boom");
const PhoneNumber = require("awesome-phonenumber");
const { formatSize, runtime, sleep, serialize, smsg, getBuffer } = require("./lib/myfunc")
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { toAudio, toPTT, toVideo } = require('./lib/converter')

const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) }); 

const low = require('./lib/lowdb');
const yargs = require('yargs/yargs');
const { Low, JSONFile } = low;
const port = process.env.PORT || 3002;
const versions = require("./package.json").version
const PluginManager = require('./lib/PluginManager');
const modeStatus = 
  global.mode === 'public' ? "Public" : 
  global.mode === 'private' ? "Private" : 
  global.mode === 'group' ? "Group Only" : 
  global.mode === 'pm' ? "PM Only" : "Unknown"; 

// Initialize PluginManager with the Plugins directory
const pluginManager = new PluginManager(path.resolve(__dirname, './src/Plugins'));


global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(new JSONFile(`src/database.json`))

global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read()
  global.db.READ = false
  global.db.data = {
    chats: {},
    settings: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)
}
loadDatabase()

if (global.db) setInterval(async () => {
   if (global.db.data) await global.db.write()
}, 30 * 1000)

let phoneNumber = "254754783972"
// Removed const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")
// Removed const usePairingCode = true
// Removed const question function and readline import

const storeFile = "./src/store.json";

// Function to load stored messages from file
function loadStoredMessages() {
    if (fs.existsSync(storeFile)) {
        return JSON.parse(fs.readFileSync(storeFile));
    }
    return {}; // Return empty object if file doesn't exist
}

// Function to save messages to file
function saveStoredMessages(data) {
    fs.writeFileSync(storeFile, JSON.stringify(data, null, 2));
}

// Load stored messages on startup
global.messageBackup = loadStoredMessages();

async function loadAllPlugins() {
  try {
    await pluginManager.unloadAllPlugins();
    console.log('[CYPHER-X] Preparing....');
    await pluginManager.loadPlugins();
    // New, safer code:
    console.log('[CYPHER-X] Plugins loaded successfully.');
    console.log('[CYPHER-X] Plugins saved successfully.');
  } catch (error) {
    console.log(`[CYPHER-X] Error loading plugins: ${error.message}`);
  }
}
const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

async function downloadSessionData() {
  try {
    // Ensure session directory exists
    await fs.promises.mkdir(sessionDir, { recursive: true });
    
    if (!fs.existsSync(credsPath) && global.SESSION_ID) {
      const sessdata = global.SESSION_ID.split("XPLOADER-BOT:~")[1];
      const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
      
      filer.download(async (err, data) => {
        if (err) throw err;
        await fs.promises.writeFile(credsPath, data);
        console.log(color(`[CYPHER-X] Session saved successfully`, 'green'));
        await startCypher();
      });
    }
  } catch (error) {
    console.error('Error downloading session data:', error);
  }
}


async function startCypher() {
const {  state, saveCreds } =await useMultiFileAuthState(`./session`)
    const msgRetryCounterCache = new NodeCache(); 
    const Cypher = makeWASocket({
        logger: pino({ level: 'silent' }),
        // Set to true to print the QR code in the terminal
        printQRInTerminal: true, 
       version: [2, 3000, 1017531287],
      browser: Browsers.ubuntu('Edge'),
     auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      markOnlineOnConnect: true, 
      generateHighQualityLinkPreview: true,
      getMessage: async (key) => {
      
         let jid = jidNormalizedUser(key.remoteJid)
         let msg = await store.loadMessage(jid, key.id)

         return msg?.message || ""
      },
      msgRetryCounterCache,
      defaultQueryTimeoutMs: undefined, // for this issues https://github.com/WhiskeySockets/Baileys/issues/276
   })
   
   store.bind(Cypher.ev)
   
// REMOVED THE FOLLOWING BLOCK to switch from Pairing Code to QR Code
/*
if(usePairingCode && !Cypher.authState.creds.registered) {
    if (useMobile) throw new Error('Cannot use pairing code with mobile API');

        let phoneNumber;
       phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Number to be connected to Cypher Bot?\nExample 254796180105:- `)))
        phoneNumber = phoneNumber.trim();

        setTimeout(async () => {
            const code = await Cypher.requestPairingCode(phoneNumber);
      console.log(chalk.black(chalk.bgWhite(`[CYPHER-X]:- ${code}`)));
        }, 3000);
    }
*/


Cypher.ev.on('connection.update', async (update) => {
	const {
		connection,
		lastDisconnect,
        qr // Added the qr property to the update object
	} = update
const start = performance.now();
const cpus = os.cpus();
// ... (rest of the system info variables remain the same)
const uptimeSeconds = os.uptime();
const uptimeDays = Math.floor(uptimeSeconds / 86400);
const uptimeHours = Math.floor((uptimeSeconds % 86400) / 3600);
const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);
const uptimeSecs = Math.floor(uptimeSeconds % 60);
const totalMem = os.totalmem();
const freeMem = os.freemem();
const usedMem = totalMem - freeMem;
const muptime = runtime(process.uptime()).trim()
const formattedUsedMem = formatSize(usedMem);
const formattedTotalMem = formatSize(totalMem);
const loadAverage = os.loadavg().map(avg => avg.toFixed(2)).join(", ");
const speed = (performance.now() - start).toFixed(3);         
try{

if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
if (lastDisconnect.error.output.statusCode === DisconnectReason.loggedOut)
console.log("Logged out. Please link again.");
if (lastDisconnect.error.output.statusCode === DisconnectReason.badSession)
console.log("Bad session. Log out and link again.");
startCypher();
}

		if (update.connection == "connecting") {
			console.log(color(`[CYPHER-X] Connecting...`, 'red'))
		}
        // Handle QR Code being printed (only if creds are not registered)
        if (qr) {
            console.log(color(`[CYPHER-X] Scan the QR Code that just appeared in the terminal!`, 'yellow'));
        }
		if (update.connection == "open") {
            console.log(color(`[CYPHER-X] Connected`, 'green'))

await sleep(2000);
/*
try {
    await Cypher.groupAcceptInvite("B6Hk3829WHYChdpqnuz7bL");
} catch (err) {
    console.log(`Failed to join the group: ${err.message || err}`);
    if (err.status === 409 || err.status === 403 || err.status === 410) {
        console.log("Bot cannot join the group. Continuing...");
    } else {
        console.log("Unexpected error. Restarting bot...");
        startCypher();
    }
}
*/
await Cypher.sendMessage(Cypher.user.id, { text: `┏━━─『 CYPHER-X 』─━━
┃ » Username: ${Cypher.user.name}
┃ » Platform: ${os.platform()}
┃ » Prefix: [ ${global.prefixz} ]
┃ » Mode: ${modeStatus}
┃ » Version: [ ${versions} ]
┗━━━━━━━━━━━━─···` }, { ephemeralExpiration: 20 });
            }
	
} catch (err) {
	  console.log('Error in Connection.update '+err)
	  startCypher();
	}
})
Cypher.ev.on('creds.update', saveCreds);

Cypher.ev.on('messages.upsert', async (chatUpdate) => {
  try {
    const messages = chatUpdate.messages;
    
    for (const kay of messages) {
      // Process only if there's a message
      if (!kay.message) continue;
      
      // Handle ephemeral messages
     kay.message = normalizeMessageContent(kay.message);

      // Skip status updates
      if (kay.key && kay.key.remoteJid === 'status@broadcast') {
        // Auto-status view
        if (global.autoviewstatus === 'true') {
          await Cypher.readMessages([kay.key]);
        }
        
        // Auto-status react
        if (global.autoreactstatus === 'true' && global.autoviewstatus === 'true') {
          const reactionEmoji = global.statusemoji || '💚';
          const participant = kay.key.participant || kay.participant;
          const botJid = await Cypher.decodeJid(Cypher.user.id);
          const messageId = kay.key.id;
          
          if (participant && messageId && kay.key.id && kay.key.remoteJid) {
            await Cypher.sendMessage(
              'status@broadcast',
              {
                react: {
                  key: {
                    id: kay.key.id, 
                    remoteJid: kay.key.remoteJid, 
                    participant: participant,
                  },
                  text: reactionEmoji,
                },
              },
              { statusJidList: [participant, botJid] }
            );
          }
        }
        
        continue; // Move to the next message
      }

if (
  kay.key.id.startsWith('BAE5') || // Old Baileys messages
  kay.key.id.startsWith('3EBO') && kay.key.id.length === 22 || // New Baileys (Bot/Web)
  (!kay.key.id.startsWith('3EBO') && kay.key.id.length === 22) || // Custom Baileys (22)
  (kay.key.id.length !== 32 && kay.key.id.length !== 20) // Custom Baileys (varied lengths)
) continue;

const processedMessages = new Set();
const messageId = kay.key.id;
if (processedMessages.has(messageId)) continue;
processedMessages.add(messageId);
      
      const m = smsg(Cypher, kay, store);
      require('./system')(Cypher, m, chatUpdate, store);
    }
  } catch (err) {
    console.error('Error handling messages.upsert:', err);
  }
});

Cypher.ev.on("messages.upsert", async (chatUpdate) => {
    for (const msg of chatUpdate.messages) {
        if (!msg.message) return;

        let chatId = msg.key.remoteJid;
        let messageId = msg.key.id;

        if (!global.messageBackup[chatId]) {
            global.messageBackup[chatId] = {};
        }

        // Extract only text content (no media)
        let textMessage = msg.message?.conversation ||
                          msg.message?.extendedTextMessage?.text ||
                          null;

        if (!textMessage) return; // Skip if not a text message

        let savedMessage = {
            sender: msg.key.participant || msg.key.remoteJid,
            text: textMessage,
            timestamp: msg.messageTimestamp
        };

        // Only save if it doesn't already exist
        if (!global.messageBackup[chatId][messageId]) {
            global.messageBackup[chatId][messageId] = savedMessage;
            saveStoredMessages(global.messageBackup);
        }
    }
});

setInterval(() => {
  try {
    const sessionPath = path.join(__dirname, 'session');
    fs.readdir(sessionPath, (err, files) => {
      if (err) {
        console.error("Unable to scan directory:", err);
        return;
      }

      const now = Date.now();
      const filteredArray = files.filter((item) => {
        const filePath = path.join(sessionPath, item);
        const stats = fs.statSync(filePath);

        // Delete files older than 2 days
        return (
          (item.startsWith("pre-key") ||
           item.startsWith("sender-key") ||
           item.startsWith("session-") ||
           item.startsWith("app-state")) &&
          item !== 'creds.json' &&
          now - stats.mtimeMs > 2 * 24 * 60 * 60 * 1000 // 2 days
        );
      });

      if (filteredArray.length > 0) {
        console.log(`Found ${filteredArray.length} old session files.`);
        console.log(`Clearing ${filteredArray.length} old session files...`);

        filteredArray.forEach((file) => {
          const filePath = path.join(sessionPath, file);
          fs.unlinkSync(filePath);
        });
      } else {
        console.log("No old session files found.");
      }
    });
  } catch (error) {
    console.error('Error clearing old session files:', error);
  }
}, 7200000); // Check every 2 hours

const cleanupInterval = 60 * 60 * 1000; // Run cleanup every 60 minutes
const maxMessageAge = 24 * 60 * 60; // 24 hours in seconds

function cleanupOldMessages() {
    let storedMessages = loadStoredMessages();
    let now = Math.floor(Date.now() / 1000); // Current time in seconds

    let cleanedMessages = {};

    // Loop through all chats
    for (let chatId in storedMessages) {
        let newChatMessages = {};

        for (let messageId in storedMessages[chatId]) {
            let message = storedMessages[chatId][messageId];

            if (now - message.timestamp <= maxMessageAge) {
                newChatMessages[messageId] = message; // Keep messages less than 24 hours old
            }
        }

        if (Object.keys(newChatMessages).length > 0) {
            cleanedMessages[chatId] = newChatMessages; // Keep only chats that still have messages
        }
    }

    saveStoredMessages(cleanedMessages); // Overwrite `store.json` with cleaned data
    console.log("🧹 Cleanup completed: Removed old messages from store.json");
}

// Run cleanup every 10 minutes
setInterval(cleanupOldMessages, cleanupInterval);

//auto delete rubbish
setInterval(() => {
let directoryPath = path.join();
fs.readdir(directoryPath, async function (err, files) {
var filteredArray = await files.filter(item =>
item.endsWith("gif") ||
item.endsWith("png") || 
item.endsWith("mp3") ||
item.endsWith("mp4") || 
item.endsWith("opus") || 
item.endsWith("jpg") ||
item.endsWith("webp") ||
item.endsWith("webm") ||
item.endsWith("zip") 
)
if(filteredArray.length > 0){
let teks =`Detected ${filteredArray.length} junk files,\nJunk files have been deleted🚮`
Cypher.sendMessage(Cypher.user.id, {text : teks })
setInterval(() => {
if(filteredArray.length == 0) return console.log("Junk files cleared")
filteredArray.forEach(function (file) {
let sampah = fs.existsSync(file)
if(sampah) fs.unlinkSync(file)
})
}, 15_000)
}
});
}, 30_000)

// Setting
Cypher.decodeJid = (jid) => {
if (!jid) return jid;
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {};
return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
} else return jid;
};

Cypher.ev.on("contacts.update", (update) => {
for (let contact of update) {
let id = Cypher.decodeJid(contact.id);
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify };
}
});

//Welcome/Goodbye Event
Cypher.ev.on('group-participants.update', async ({ id, participants, action }) => {
  if (global.welcome === 'true') {
    try {
      const groupData = await Cypher.groupMetadata(id);
      const groupMembers = groupData.participants.length;
      const groupName = groupData.subject;

      for (const participant of participants) {
        const userPic = await getUserPicture(participant);
        const groupPic = await getGroupPicture(id);

        if (action === 'add') {
          sendWelcomeMessage(id, participant, groupName, groupMembers, userPic);
        } else if (action === 'remove') {
          sendGoodbyeMessage(id, participant, groupName, groupMembers, userPic);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
});

//Helper Functions
async function getUserPicture(userId) {
  try {
    return await Cypher.profilePictureUrl(userId, 'image');
  } catch {
    return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60';
  }
}

async function getGroupPicture(groupId) {
  try {
    return await Cypher.profilePictureUrl(groupId, 'image');
  } catch {
    return 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60';
  }
}

async function sendWelcomeMessage(groupId, participant, groupName, memberCount, profilePic) {
const welcomeMessage = `✨ *Welcome to ${groupName}!* ✨ @${participant.split('@')[0]}

You're our ${memberCount}th member!

Join time: ${moment.tz(`${timezones}`).format('HH:mm:ss')},  ${moment.tz(`${timezones}`).format('DD/MM/YYYY')}

Stay awesome!😊

> ${global.wm}`;
 Cypher.sendMessage(groupId, {
    text: welcomeMessage,
    contextInfo: {
      mentionedJid: [participant],
      externalAdReply: {
        title: global.botname,
        body: ownername,
        previewType: 'PHOTO',
        thumbnailUrl: '',
        thumbnail: await getBuffer(profilePic),
        sourceUrl: plink
      }
    }
  });
}

async function sendGoodbyeMessage(groupId, participant, groupName, memberCount, profilePic) {
const goodbyeMessage = `✨ *Goodbye @${participant.split('@')[0]}!* ✨

You'll be missed in ${groupName}!🥲

We're now ${memberCount} members.

Left at: ${moment.tz(timezones).format('HH:mm:ss')},  ${moment.tz(timezones).format('DD/MM/YYYY')}

> ${global.wm}`;

  Cypher.sendMessage(groupId, {
    text: goodbyeMessage,
    contextInfo: {
      mentionedJid: [participant],
      externalAdReply: {
        title: global.botname,
        body: ownername,
        previewType: 'PHOTO',
        thumbnailUrl: '',
        thumbnail: await getBuffer(profilePic),
        sourceUrl: plink
      }
    }
  });
}
//------------------------------------------------------
//anticall
Cypher.ev.on('call', async (celled) => {
let botNumber = await Cypher.decodeJid(Cypher.user.id)
let koloi = global.anticall === 'true'
if (!koloi) return
console.log(celled)
for (let kopel of celled) {
if (kopel.isGroup == false) {
if (kopel.status == "offer") {
let nomer = await Cypher.sendTextWithMentions(kopel.from, `My owner cannot receive ${kopel.isVideo ? `video` : `audio`} calls at the moment.\n\nSorry @${kopel.from.split('@')[0]} Cypher Bot is now blocking you for causing disturbance.\n\nIf you called by mistake please look for means to contact my owner to be unblocked!`)
await sleep(8000)
await Cypher.updateBlockStatus(kopel.from, "block")
}
}
}
})

Cypher.serializeM = (m) => smsg(Cypher, m, store)

Cypher.getName = (jid, withoutContact = false) => {
id = Cypher.decodeJid(jid);
withoutContact = Cypher.withoutContact || withoutContact;
let v;
if (id.endsWith("@g.us"))
return new Promise(async (resolve) => {
v = store.contacts[id] || {};
if (!(v.name || v.subject)) v = Cypher.groupMetadata(id) || {};
resolve(v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"));
});
else
v =
id === "0@s.whatsapp.net"
? {
id,
name: "WhatsApp",
}
: id === Cypher.decodeJid(Cypher.user.id)
? Cypher.user
: store.contacts[id] || {};
return (withoutContact ? "" : v.name) || v.subject || v.verifiedName || PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international");
};

Cypher.getFile = async (PATH, returnAsFilename) => {
let res, filename
const data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
const type = await FileType.fromBuffer(data) || {
mime: 'application/octet-stream',
ext: '.bin'
}
if (data && returnAsFilename && !filename)(filename = path.join(__dirname, './tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
return {
res,
filename,
...type,
data,
deleteFile() {
return filename && fs.promises.unlink(filename)
}
}
}

Cypher.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
return buffer} 

Cypher.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
let type = await Cypher.getFile(path, true)
let { res, data: file, filename: pathFile } = type
if (res && res.status !== 200 || file.length <= 65536) {
try { throw { json: JSON.parse(file.toString()) } }
catch (e) { if (e.json) throw e.json }
}
let opt = { filename }
if (quoted) opt.quoted = quoted
if (!type) options.asDocument = true
let mtype = '', mimetype = type.mime, convert
if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
else if (/video/.test(type.mime)) mtype = 'video'
else if (/audio/.test(type.mime)) (
convert = await (ptt ? toPTT : toAudio)(file, type.ext),
file = convert.data,
pathFile = convert.filename,
mtype = 'audio',
mimetype = 'audio/ogg; codecs=opus'
)
else mtype = 'document'
if (options.asDocument) mtype = 'document'

let message = {
...options,
caption,
ptt,
[mtype]: { url: pathFile },
mimetype
}
let m
try {
m = await Cypher.sendMessage(jid, message, { ...opt, ...options })
} catch (e) {
console.error(e)
m = null
} finally {
if (!m) m = await Cypher.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })
return m
}
}

Cypher.copyNForward = async (jid, message, forceForward = false, options = {}) => {
let vtype
if (options.readViewOnce) {
message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
vtype = Object.keys(message.message.viewOnceMessage.message)[0]
delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
delete message.message.viewOnceMessage.message[vtype].viewOnce
message.message = {
...message.message.viewOnceMessage.message
}
}
let mtype = Object.keys(message.message)[0]
let content = await generateForwardMessageContent(message, forceForward)
let ctype = Object.keys(content)[0]
let context = {}
if (mtype != "conversation") context = message.message[mtype].contextInfo
content[ctype].contextInfo = {
...context,
...content[ctype].contextInfo
}
const waMessage = await generateWAMessageFromContent(jid, content, options ? {
...content[ctype],
...options,
...(options.contextInfo ? {
contextInfo: {
...content[ctype].contextInfo,
...options.contextInfo
}
} : {})
} : {})
await Cypher.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
return waMessage
}

Cypher.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)
}
await Cypher.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

Cypher.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await(const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
    let savePath = path.join(__dirname, 'tmp', trueFileName); // Save to 'tmp' folder
    await fs.writeFileSync(savePath, buffer);
    return savePath;
};
Cypher.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}
await Cypher.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}
Cypher.sendText = (jid, text, quoted = '', options) => Cypher.sendMessage(jid, { text: text, ...options }, { quoted })

Cypher.sendTextWithMentions = async (jid, text, quoted, options = {}) => Cypher.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

return Cypher;
}


async function tylor() {
    await loadAllPlugins();
    if (fs.existsSync(credsPath)) {
        await startCypher();
    } else {
        const sessionDownloaded = await downloadSessionData();
        if (sessionDownloaded) {
            await startCypher();
        } else {
            if (!fs.existsSync(credsPath)) {
                if (!global.SESSION_ID) {
                    console.log(color("Please scan the QR code to connect the bot!", 'red'));
             await startCypher();
                }
            }
        }
    }
}

const porDir = path.join(__dirname, 'Media');
const porPath = path.join(porDir, 'Xploader.html');

// get runtime
function getUptime() {
    return runtime(process.uptime());
}

// Set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});

// Apply rate limiter to the route
app.get("/", limiter, (req, res) => {
    res.sendFile(porPath);
});

// Endpoint to get bot's runtime
app.get("/uptime", (req, res) => {
    res.json({ uptime: getUptime() });
});

app.listen(port, (err) => {
    if (err) {
        console.error(color(`Failed to start server on port: ${port}`, 'red'));
    } else {
        console.log(color(`[CYPHER-X] Running on port: ${port}`, 'white'));
    }
});

tylor();

// Export PluginManager instance
module.exports.pluginManager = pluginManager