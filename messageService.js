/**
 * Message Service
 * Handles all message types: buttons, lists, templates, reactions, etc.
 * Compatible with Baileys v7 (uses standard sendMessage API)
 */

const chalk = require('chalk');

class MessageService {
  constructor(socket, generateWAMessageFromContent = null) {
    this.sock = socket;
    // v7 doesn't need this, but keep for backward compatibility
    this.generateWAMessageFromContent = generateWAMessageFromContent;
  }

  /**
   * Send Interactive Button Message (Baileys v7 compatible)
   * Sends buttons as formatted text menu since v7 doesn't support complex button UI
   * @param {string} chatId - Recipient chat ID
   * @param {string} bodyText - Body text
   * @param {array} buttons - Array of button objects {text, id}
   * @param {string} footerText - Footer text (optional)
   * @param {string} headerText - Header text (optional)
   */
  async sendButtonMessage(chatId, bodyText, buttons, footerText = '', headerText = '') {
    try {
      // Baileys v7: Format buttons as numbered text menu
      let menuText = (bodyText || '') + '\n\n';
      
      if (Array.isArray(buttons) && buttons.length > 0) {
        buttons.forEach((btn, idx) => {
          const number = idx + 1;
          const text = btn.text || btn.buttonText?.displayText || `Button ${number}`;
          menuText += `${number}. ${text}\n`;
        });
      }
      
      menuText += `\n${footerText || 'Smart Bot'}`;
      
      // Send as plain text (v7 native format)
      await this.sock.sendMessage(chatId, { text: menuText });
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error sending button message:'), error.message);
      // Fallback to plain text
      try {
        await this.sock.sendMessage(chatId, { text: bodyText || 'Menu' });
      } catch (fallbackError) {
        console.error(chalk.red('❌ Fallback failed:'), fallbackError.message);
      }
      return { success: false, error: error.message };
    }
  }

  /**
   * Send Interactive List Message
   * @param {string} chatId - Recipient chat ID
   * @param {string} buttonText - Button text to show
   * @param {string} bodyText - Body text
   * @param {string} footerText - Footer text
   * @param {array} sections - Array of section objects
   */
  async sendListMessage(chatId, buttonTextOrPayload, bodyText, footerText, sections) {
    try {
      // Handle both old and new call signatures for backward compatibility
      let payload;
      
      if (typeof buttonTextOrPayload === 'object') {
        // New signature: sendListMessage(chatId, { text, sections, footer, buttonText })
        payload = buttonTextOrPayload;
      } else {
        // Old signature: sendListMessage(chatId, buttonText, bodyText, footerText, sections)
        payload = {
          text: bodyText,
          footer: footerText || 'Smart Bot',
          sections: sections || [],
          buttonText: buttonTextOrPayload
        };
      }

      // Use sendInteractiveMessage for v7 compatibility
      return await this.sendInteractiveMessage(chatId, {
        listMessage: payload
      });
    } catch (error) {
      console.error(chalk.red('❌ Error sending list message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send Template Message
   * @param {string} chatId - Recipient chat ID
   * @param {string} templateName - Template name
   * @param {array} parameters - Parameters for template
   */
  async sendTemplateMessage(chatId, templateName, parameters = []) {
    try {
      const templateMessage = {
        text: `Template: ${templateName}`,
        templateButtons: parameters.map((param, idx) => ({
          index: idx,
          urlButton: {
            displayText: param.displayText,
            url: param.url
          }
        }))
      };

      await this.sock.sendMessage(chatId, templateMessage);
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error sending template message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send Contact Card (vCard)
   * @param {string} chatId - Recipient chat ID
   * @param {object} contact - Contact object with name, phone, email, organization
   */
  async sendContactCard(chatId, contact) {
    try {
      const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.name || 'Bot Support'}
TEL;type=CELL;type=VOICE;waid=${contact.phone?.replace(/\D/g, '') || ''}:+${contact.phone || ''}
ORG:${contact.organization || 'Smart Bot'}
EMAIL:${contact.email || 'support@bot.com'}
END:VCARD`;

      const contactMessage = {
        contacts: {
          displayName: contact.name || 'Contact',
          contacts: [
            {
              vcard: vcard
            }
          ]
        }
      };

      await this.sock.sendMessage(chatId, contactMessage);
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error sending contact card:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send Text Message
   * @param {string} chatId - Recipient chat ID
   * @param {string} text - Message text
   * @param {boolean} parseLinks - Whether to parse links
   */
  async sendTextMessage(chatId, text, parseLinks = true) {
    try {
      await this.sock.sendMessage(chatId, { text }, { parseLinks });
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error sending text message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send Message with Quote/Reply
   * @param {string} chatId - Recipient chat ID
   * @param {string} text - Message text
   * @param {object} quotedMessage - Message to quote
   */
  async sendReplyMessage(chatId, text, quotedMessage) {
    try {
      await this.sock.sendMessage(chatId, { text }, { quoted: quotedMessage });
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error sending reply message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * React to Message
   * @param {string} chatId - Recipient chat ID
   * @param {string} messageKey - Message key to react to
   * @param {string} emoji - Emoji reaction
   */
  async reactToMessage(chatId, messageKey, emoji) {
    try {
      await this.sock.sendMessage(chatId, {
        react: { text: emoji, key: messageKey }
      });
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error reacting to message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete Message (for everyone)
   * @param {string} chatId - Recipient chat ID
   * @param {object} messageKey - Message key to delete
   */
  async deleteMessage(chatId, messageKey) {
    try {
      await this.sock.sendMessage(chatId, { delete: messageKey });
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error deleting message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Edit Message Text
   * @param {string} chatId - Recipient chat ID
   * @param {string} newText - New message text
   * @param {object} messageKey - Message key to edit
   */
  async editMessage(chatId, newText, messageKey) {
    try {
      await this.sock.sendMessage(chatId, { text: newText, edit: messageKey });
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error editing message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Forward Message
   * @param {string} toChat - Destination chat ID
   * @param {object} message - Message to forward
   */
  async forwardMessage(toChat, message) {
    try {
      await this.sock.sendMessage(toChat, message);
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error forwarding message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send Mention in Group
   * @param {string} chatId - Group chat ID
   * @param {string} text - Message text
   * @param {array} mentions - Array of phone numbers to mention
   */
  async sendMentionMessage(chatId, text, mentions = []) {
    try {
      const mentionedJids = mentions.map(phone => phone.replace(/\D/g, '') + '@s.whatsapp.net');
      await this.sock.sendMessage(chatId, { text, mentions: mentionedJids });
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error sending mention message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Set Presence (Recording, Typing)
   * @param {string} chatId - Chat ID
   * @param {string} type - 'recording' or 'typing'
   */
  async setPresence(chatId, type = 'typing') {
    try {
      await this.sock.sendPresenceUpdate(type, chatId);
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error setting presence:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Read Receipt
   * @param {string} chatId - Chat ID
   * @param {array} messageKeys - Message keys to mark as read
   */
  async markAsRead(chatId, messageKeys) {
    try {
      for (const key of messageKeys) {
        await this.sock.sendReadReceipt(chatId, undefined, [key]);
      }
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error marking as read:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Archive Chat
   * @param {string} chatId - Chat ID
   */
  async archiveChat(chatId) {
    try {
      await this.sock.chatModify({ archive: true }, chatId);
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error archiving chat:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mute Chat
   * @param {string} chatId - Chat ID
   * @param {number} duration - Duration in milliseconds
   */
  async muteChat(chatId, duration = 28800000) {
    try {
      await this.sock.chatModify({ mute: duration }, chatId);
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error muting chat:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Pin Chat
   * @param {string} chatId - Chat ID
   * @param {boolean} pin - Whether to pin or unpin
   */
  async pinChat(chatId, pin = true) {
    try {
      await this.sock.chatModify({ pin }, chatId);
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error pinning chat:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Star Message
   * @param {object} message - Message object
   * @param {boolean} star - Whether to star or unstar
   */
  async starMessage(message, star = true) {
    try {
      await this.sock.sendMessage(message.key.remoteJid, {
        star: { key: message.key, starred: star }
      });
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error starring message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send Rich Text Message with External Ad Reply
   * Mimics the CypherX bot style with title, body, and external link preview
   * @param {string} chatId - Chat ID
   * @param {string} text - Message text
   * @param {object} options - Options object
   *   - title: External link title
   *   - description: External link description
   *   - thumbnail: Thumbnail image URL or Buffer
   *   - sourceUrl: URL to open when clicked
   *   - mediaType: 1 (image), 2 (video), etc.
   *   - mentions: Array of phone numbers to mention
   */
  async sendRichMessage(chatId, text, options = {}) {
    try {
      const message = {
        text: text,
        contextInfo: {}
      };

      // Add mentions if provided
      if (options.mentions && options.mentions.length > 0) {
        message.contextInfo.mentionedJid = options.mentions;
      }

      // Add external ad reply (link preview)
      if (options.title || options.sourceUrl) {
        message.contextInfo.externalAdReply = {
          title: options.title || 'Smart Bot',
          body: options.description || '',
          thumbnail: options.thumbnail || null,
          sourceUrl: options.sourceUrl || 'https://github.com',
          mediaType: options.mediaType || 1,
          renderLargerThumbnail: true
        };
      }

      await this.sock.sendMessage(chatId, message);
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error sending rich message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send Interactive Message (Baileys v7 compatible)
   * Converts interactive payloads to simple button messages
   * v7 doesn't support complex proto structures, so we use simpler format
   */
  async sendInteractiveMessage(chatId, messagePayload) {
    try {
      // Baileys v7 doesn't support viewOnceMessage + interactiveMessage
      // Instead, use simple text message with formatting for menus
      
      if (messagePayload.listMessage) {
        const listMsg = messagePayload.listMessage;
        
        // Format as numbered list
        let menuText = (listMsg.text || '') + '\n\n';
        
        if (Array.isArray(listMsg.sections)) {
          listMsg.sections.forEach((section, sectionIndex) => {
            if (section.title) {
              menuText += `\n*${section.title}*\n`;
            }
            if (Array.isArray(section.rows)) {
              section.rows.forEach((row, rowIndex) => {
                const number = rowIndex + 1;
                const title = row.title || '';
                const desc = row.description ? ` - ${row.description}` : '';
                menuText += `${number}. ${title}${desc}\n`;
              });
            }
          });
        }
        
        menuText += `\n${listMsg.footer || 'Smart Bot'}`;
        
        // Send as formatted text message
        await this.sock.sendMessage(chatId, { text: menuText });
        return { success: true };
      } else if (messagePayload.interactive) {
        // Try to send interactive format, fallback to text if fails
        try {
          await this.sock.sendMessage(chatId, messagePayload.interactive);
          return { success: true };
        } catch (interactiveError) {
          // Fallback to text
          const fallbackText = messagePayload.interactive?.body?.text || 'Menu';
          await this.sock.sendMessage(chatId, { text: fallbackText });
          return { success: true };
        }
      } else if (messagePayload.buttons) {
        // Send button message directly
        try {
          await this.sock.sendMessage(chatId, messagePayload);
          return { success: true };
        } catch (buttonError) {
          // Fallback to text
          const fallbackText = messagePayload.text || 'Menu';
          await this.sock.sendMessage(chatId, { text: fallbackText });
          return { success: true };
        }
      } else {
        // Standard message
        await this.sock.sendMessage(chatId, messagePayload);
        return { success: true };
      }
    } catch (error) {
      console.error(chalk.red('❌ Error sending interactive message:'), error.message);
      
      // Fallback: send plain text
      try {
        const fallbackText = messagePayload?.listMessage?.text 
          || messagePayload?.interactive?.body?.text 
          || messagePayload?.text 
          || 'Menu';
        
        await this.sock.sendMessage(chatId, { text: fallbackText });
      } catch (fallbackError) {
        console.error(chalk.red('❌ Fallback message failed:'), fallbackError.message);
      }
      return { success: false, error: error.message };
    }
  }
}

module.exports = MessageService;
