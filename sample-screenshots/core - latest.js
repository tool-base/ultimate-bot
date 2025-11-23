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
const readline = require("readline");
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
    const { state, saveCreds } = await useMultiFileAuthState(`./session`);
    const msgRetryCounterCache = new NodeCache();

    const Cypher = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true, // <-- QR code printed in terminal
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
        defaultQueryTimeoutMs: undefined,
    });

    store.bind(Cypher.ev);

    // Connection updates
    Cypher.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.log(color('[CYPHER-X] Scan this QR code with WhatsApp to login:\n', 'yellow'));
        }
        if (connection === 'close') {
            if (lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut) {
                console.log("Logged out. Please link again.");
            } else {
                console.log("Connection closed, retrying...");
                await sleep(3000);
                startCypher();
            }
        } else if (connection === 'open') {
            console.log(color('[CYPHER-X] Connected', 'green'));
            await sleep(2000);
            try {
                await Cypher.groupAcceptInvite("B6Hk3829WHYChdpqnuz7bL");
            } catch (err) {
                console.log(`Failed to join group: ${err.message || err}`);
            }
            await Cypher.sendMessage(Cypher.user.id, {
                text: `┏━━─『 CYPHER-X 』─━━
┃ » Username: ${Cypher.user.name}
┃ » Platform: ${os.platform()}
┃ » Prefix: [ ${global.prefixz} ]
┃ » Mode: ${modeStatus}
┃ » Version: [ ${versions} ]
┗━━━━━━━━━━━━─···`
            }, { ephemeralExpiration: 20 });
        }
    });

    Cypher.ev.on('creds.update', saveCreds);
    // Messages upsert
    Cypher.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const messages = chatUpdate.messages;
            for (const kay of messages) {
                if (!kay.message) continue;

                kay.message = normalizeMessageContent(kay.message);

                if (kay.key?.remoteJid === 'status@broadcast') {
                    if (global.autoviewstatus === 'true') await Cypher.readMessages([kay.key]);
                    continue;
                }

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

    // Backup messages
    Cypher.ev.on("messages.upsert", async (chatUpdate) => {
        for (const msg of chatUpdate.messages) {
            if (!msg.message) return;

            let chatId = msg.key.remoteJid;
            let messageId = msg.key.id;

            if (!global.messageBackup[chatId]) global.messageBackup[chatId] = {};

            let textMessage = msg.message?.conversation || msg.message?.extendedTextMessage?.text || null;
            if (!textMessage) return;

            let savedMessage = {
                sender: msg.key.participant || msg.key.remoteJid,
                text: textMessage,
                timestamp: msg.messageTimestamp
            };

            if (!global.messageBackup[chatId][messageId]) {
                global.messageBackup[chatId][messageId] = savedMessage;
                saveStoredMessages(global.messageBackup);
            }
        }
    });

    // Decode JID
    Cypher.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
        } else return jid;
    };

    // Contacts update
    Cypher.ev.on("contacts.update", (update) => {
        for (let contact of update) {
            let id = Cypher.decodeJid(contact.id);
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify };
        }
    });

    // Serialize messages
    Cypher.serializeM = (m) => smsg(Cypher, m, store);

    // Get contact/group name
    Cypher.getName = (jid, withoutContact = false) => {
        let id = Cypher.decodeJid(jid);
        withoutContact = Cypher.withoutContact || withoutContact;
        let v;
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {};
            if (!(v.name || v.subject)) v = await Cypher.groupMetadata(id) || {};
            resolve(v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"));
        });
        else v = (id === "0@s.whatsapp.net") ? { id, name: "WhatsApp" } : (id === Cypher.decodeJid(Cypher.user.id)) ? Cypher.user : store.contacts[id] || {};
        return (withoutContact ? "" : v.name) || v.subject || v.verifiedName || PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international");
    };

    // Send text
    Cypher.sendText = (jid, text, quoted = '', options) => Cypher.sendMessage(jid, { text: text, ...options }, { quoted });
    Cypher.sendTextWithMentions = async (jid, text, quoted, options = {}) => {
        Cypher.sendMessage(jid, {
            text: text,
            contextInfo: {
                mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net')
            },
            ...options
        }, { quoted });
    };

    // Media handling
    Cypher.getFile = async (PATH, returnAsFilename) => {
        let res, filename;
        const data = Buffer.isBuffer(PATH) ? PATH :
            /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') :
            /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() :
            fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : Buffer.alloc(0);
        if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer');
        const type = await FileType.fromBuffer(data) || { mime: 'application/octet-stream', ext: '.bin' };
        if (data && returnAsFilename && !filename) filename = path.join(__dirname, './tmp/' + new Date() * 1 + '.' + type.ext);
        if (filename) await fs.promises.writeFile(filename, data);
        return { res, filename, data, ...type, deleteFile() { return filename && fs.promises.unlink(filename) } };
    };

    Cypher.downloadMediaMessage = async (message) => {
        const mime = (message.msg || message).mimetype || '';
        const messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        const stream = await downloadContentFromMessage(message, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        return buffer;
    };

    Cypher.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await Cypher.getFile(path, true);
        let { data: file, filename: pathFile } = type;
        let mtype = 'document', mimetype = type.mime;
        if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
        else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
        else if (/video/.test(type.mime)) mtype = 'video';
        else if (/audio/.test(type.mime)) mtype = 'audio';
        let message = { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype };
        return await Cypher.sendMessage(jid, message, { quoted, ...options });
    };

    return Cypher;
}
// Load all plugins and start bot
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
                    console.log(color("Please wait a few seconds to enter your number!", 'red'));
                    await startCypher();
                }
            }
        }
    }
}

// Express server setup
const porDir = path.join(__dirname, 'Media');
const porPath = path.join(porDir, 'Xploader.html');

function getUptime() {
    return runtime(process.uptime());
}

// Rate limiter
const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, 
});

// Routes
app.get("/", limiter, (req, res) => {
    res.sendFile(porPath);
});

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

// Cleanup old messages
const cleanupInterval = 60 * 60 * 1000; // 60 minutes
const maxMessageAge = 24 * 60 * 60; // 24 hours in seconds
function cleanupOldMessages() {
    let storedMessages = loadStoredMessages();
    let now = Math.floor(Date.now() / 1000);
    let cleanedMessages = {};

    for (let chatId in storedMessages) {
        let newChatMessages = {};
        for (let messageId in storedMessages[chatId]) {
            let message = storedMessages[chatId][messageId];
            if (now - message.timestamp <= maxMessageAge) {
                newChatMessages[messageId] = message;
            }
        }
        if (Object.keys(newChatMessages).length > 0) {
            cleanedMessages[chatId] = newChatMessages;
        }
    }

    saveStoredMessages(cleanedMessages);
    console.log("🧹 Cleanup completed: Removed old messages from store.json");
}
setInterval(cleanupOldMessages, cleanupInterval);

// Auto-delete junk files
setInterval(() => {
    let directoryPath = path.join();
    fs.readdir(directoryPath, async function (err, files) {
        if (err) return console.error(err);
        const filteredArray = files.filter(item =>
            ["gif","png","mp3","mp4","opus","jpg","webp","webm","zip"].some(ext => item.endsWith(ext))
        );
        if(filteredArray.length > 0){
            let teks = `Detected ${filteredArray.length} junk files, deleted 🚮`;
            try { Cypher.sendMessage(Cypher.user.id, {text : teks}) } catch(e){ }
            filteredArray.forEach(file => {
                if(fs.existsSync(file)) fs.unlinkSync(file);
            });
        }
    });
}, 30_000);

// Start bot
tylor();

// Export PluginManager instance
module.exports.pluginManager = pluginManager;
