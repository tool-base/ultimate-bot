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

// --------------------
// In-memory store
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) }); 

const low = require('./lib/lowdb');
const yargs = require('yargs/yargs');
const { Low, JSONFile } = low;
const port = process.env.PORT || 3005;
const versions = require("./package.json").version
const PluginManager = require('./lib/PluginManager');
const modeStatus = 
  global.mode === 'public' ? "Public" : 
  global.mode === 'private' ? "Private" : 
  global.mode === 'group' ? "Group Only" : 
  global.mode === 'pm' ? "PM Only" : "Unknown"; 

// Initialize PluginManager
const pluginManager = new PluginManager(path.resolve(__dirname, './src/Plugins'));

// --------------------
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

// --------------------
let phoneNumber = "263781564004"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")
const usePairingCode = true
const question = (text) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(text, resolve))
};

const storeFile = "./src/store.json";

// Load/Save messages
function loadStoredMessages() {
    if (fs.existsSync(storeFile)) {
        return JSON.parse(fs.readFileSync(storeFile));
    }
    return {};
}
function saveStoredMessages(data) {
    fs.writeFileSync(storeFile, JSON.stringify(data, null, 2));
}
global.messageBackup = loadStoredMessages();

// --------------------
// Plugin Loader
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

// --------------------
// Session setup
const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

async function startCypher() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const Cypher = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false, // we'll handle manually
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

  // --------------------
  // Pairing
  if (usePairingCode && !Cypher.authState.creds.registered) {
    if (useMobile) throw new Error('Cannot use pairing code with mobile API');

    let phoneNumberInput = await question(chalk.bgBlack(chalk.greenBright(`Number to be connected to Cypher Bot?\nExample 263781564004:- `)));
    phoneNumberInput = phoneNumberInput.trim();

    setTimeout(async () => {
        try {
          const code = await Cypher.requestPairingCode(phoneNumberInput);
          console.log(chalk.black(chalk.bgWhite(`[CYPHER-X]:- ${code}`)));
        } catch (err) {
          console.log('[CYPHER-X] Failed to request pairing code:', err.message);
        }
    }, 2000);
  }

  // --------------------
  // Connection Updates
  Cypher.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "connecting") console.log(color(`[CYPHER-X] Connecting...`, 'red'));
    if (connection === "open") console.log(color(`[CYPHER-X] ✅ Connected as ${Cypher.user.id}`, 'green'));

    if (connection === "close" && lastDisconnect) {
      const reason = lastDisconnect.error?.output?.statusCode;
      console.log(color(`[CYPHER-X] Connection closed: ${reason || 'unknown'}`, 'red'));

      if (reason === DisconnectReason.loggedOut || reason === 428 || reason === 401) {
        console.log(color('[CYPHER-X] Session expired or not paired. Requesting new code...', 'yellow'));
        try {
          const code = await Cypher.requestPairingCode(phoneNumber);
          console.log(chalk.black(chalk.bgWhite(`[CYPHER-X]:- ${code}`)));
        } catch (err) {
          console.log('[CYPHER-X] Could not request new pairing code:', err.message);
        }
      } else {
        console.log(color('[CYPHER-X] Reconnecting...', 'yellow'));
        startCypher();
      }
    }
  });

  Cypher.ev.on('creds.update', saveCreds);

  // --------------------
  // Messages
  Cypher.ev.on('messages.upsert', async (chatUpdate) => {
    for (const kay of chatUpdate.messages) {
      if (!kay.message) continue;
      kay.message = normalizeMessageContent(kay.message);
      const m = smsg(Cypher, kay, store);
      require('./system')(Cypher, m, chatUpdate, store);
    }
  });

  // --------------------
  return Cypher;
}

// --------------------
// Startup
async function tylor() {
  await loadAllPlugins();
  if (fs.existsSync(credsPath)) {
      await startCypher();
  } else {
      console.log(color("No saved session. Starting fresh pairing...", 'red'));
      await startCypher();
  }
}

tylor();

// --------------------
// Express server
const porDir = path.join(__dirname, 'Media');
const porPath = path.join(porDir, 'Xploader.html');

function getUptime() { return runtime(process.uptime()); }

const limiter = RateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.get("/", limiter, (req, res) => res.sendFile(porPath));
app.get("/uptime", (req, res) => res.json({ uptime: getUptime() }));

app.listen(port, (err) => {
    if (err) console.error(color(`Failed to start server on port: ${port}`, 'red'));
    else console.log(color(`[CYPHER-X] Running on port: ${port}`, 'white'));
});

module.exports.pluginManager = pluginManager;
