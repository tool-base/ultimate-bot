require('./settings')
const makeWASocket = require("@whiskeysockets/baileys").default
const { default: CypherConnect, getAggregateVotesInPollMessage, delay, PHONENUMBER_MCC, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto, Browsers, normalizeMessageContent } = require("@whiskeysockets/baileys")
const { color } = require('./lib/color')
const fs = require("fs")
const pino = require("pino")
const chalk = require('chalk')
const os = require('os')
const path = require('path')
const readline = require("readline")
const express = require('express')
const RateLimit = require('express-rate-limit')
const app = express()
const moment = require("moment-timezone")
const { performance } = require("perf_hooks")
const { formatSize, runtime, sleep, serialize, smsg, getBuffer } = require("./lib/myfunc")
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { toAudio, toPTT, toVideo } = require('./lib/converter')
const PluginManager = require('./lib/PluginManager')

const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) })

// Database
const low = require('./lib/lowdb')
const { Low, JSONFile } = low
global.db = new Low(new JSONFile(`src/database.json`))
global.DATABASE = global.db

// Load database
async function loadDatabase() {
    await global.db.read()
    global.db.data = global.db.data || { chats: {}, settings: {} }
    global.db.chain = require('lodash').chain(global.db.data)
}
loadDatabase()

// Plugins
const pluginManager = new PluginManager(path.resolve(__dirname, './src/Plugins'))
async function loadAllPlugins() {
    try {
        await pluginManager.unloadAllPlugins()
        console.log('[CYPHER-X] Preparing...')
        await pluginManager.loadPlugins()
        console.log('[CYPHER-X] Plugins loaded successfully.')
    } catch (error) {
        console.log(`[CYPHER-X] Error loading plugins: ${error.message}`)
    }
}

// Session folder
const sessionDir = path.join(__dirname, 'session')

// Message backup
const storeFile = "./src/store.json"
function loadStoredMessages() {
    if (fs.existsSync(storeFile)) return JSON.parse(fs.readFileSync(storeFile))
    return {}
}
function saveStoredMessages(data) {
    fs.writeFileSync(storeFile, JSON.stringify(data, null, 2))
}
global.messageBackup = loadStoredMessages()

// Start bot
async function startCypher() {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir)

    const Cypher = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true, // QR login enabled
        browser: Browsers.ubuntu('Edge'),
        auth: state,
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        msgRetryCounterCache: new (require("node-cache"))(),
    })

    // Fix decodeJid for myfunc
    Cypher.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return (decode.user && decode.server && decode.user + '@' + decode.server) || jid
        } else return jid
    }

    store.bind(Cypher.ev)

    // Credentials update
    Cypher.ev.on('creds.update', saveCreds)

    // Connection updates
    Cypher.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update
        if (qr) console.log(chalk.greenBright(`[CYPHER-X] Scan this QR Code:`))
        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode
            if (reason === DisconnectReason.loggedOut) {
                console.log("Logged out. Please delete session folder and scan QR again.")
            } else {
                console.log(`Disconnected. Reconnecting... [Reason: ${reason}]`)
                await startCypher()
            }
        }
        if (connection === 'open') {
            console.log(chalk.green(`[CYPHER-X] Connected!`))
            console.log(`[CYPHER-X] Username: ${Cypher.user.name}`)
            console.log(`[CYPHER-X] Platform: ${os.platform()}`)
        }
    })

    // Messages handler
    Cypher.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            for (const kay of chatUpdate.messages) {
                if (!kay.message) continue
                const m = smsg(Cypher, kay, store)
                require('./system')(Cypher, m, chatUpdate, store)
            }
        } catch (err) {
            console.error('Error handling messages:', err)
        }
    })

    // Backup text messages
    Cypher.ev.on('messages.upsert', async (chatUpdate) => {
        for (const msg of chatUpdate.messages) {
            if (!msg.message) continue
            const chatId = msg.key.remoteJid
            const messageId = msg.key.id
            global.messageBackup[chatId] ??= {}
            let text = msg.message.conversation || msg.message.extendedTextMessage?.text || null
            if (!text) continue
            global.messageBackup[chatId][messageId] = {
                sender: msg.key.participant || msg.key.remoteJid,
                text,
                timestamp: msg.messageTimestamp
            }
            saveStoredMessages(global.messageBackup)
        }
    })

    // Cleanup old messages every hour
    setInterval(() => {
        const now = Math.floor(Date.now() / 1000)
        let data = loadStoredMessages()
        const maxAge = 24 * 60 * 60
        for (let chatId in data) {
            for (let messageId in data[chatId]) {
                if (now - data[chatId][messageId].timestamp > maxAge) delete data[chatId][messageId]
            }
        }
        saveStoredMessages(data)
    }, 60 * 60 * 1000)

    return Cypher
}

// Initialize
async function init() {
    await loadAllPlugins()
    await startCypher()
}
init()

// Web server
const port = 3005  // Add this line to define your port
app.get("/", RateLimit({ windowMs: 15*60*1000, max: 100 }), (req, res) => {
    res.sendFile(path.join(__dirname, 'Media', 'Xploader.html'))
})
app.get("/uptime", (req, res) => {
    res.json({ uptime: runtime(process.uptime()) })
})
app.listen(port, () => {
    console.log(`[CYPHER-X] Running on port: ${port}`)
})

