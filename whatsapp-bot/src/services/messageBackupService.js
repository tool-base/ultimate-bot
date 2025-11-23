/**
 * Message Backup & Archive Service
 * Handles storage and retrieval of messages for backup purposes
 */

const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');

class MessageBackupService {
  constructor(options = {}) {
    this.backupDir = options.backupDir || './whatsapp-bot/data/backup';
    this.cacheDir = options.cacheDir || './whatsapp-bot/data/cache';
    this.maxAge = options.maxAge || 30 * 24 * 60 * 60 * 1000; // 30 days default
    this.maxMessages = options.maxMessages || 10000;
    
    // In-memory cache for recent messages
    this.cache = new NodeCache({ stdTTL: 60 * 60 }); // 1 hour TTL
    
    this.initDirectories();
  }

  initDirectories() {
    [this.backupDir, this.cacheDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Save message to backup
   */
  async saveMessage(message, metadata = {}) {
    try {
      const key = `${message.key.remoteJid}_${message.key.id}`;
      
      // Store in cache for quick access
      this.cache.set(key, {
        message,
        metadata,
        timestamp: Date.now()
      });

      // Save to file periodically (batch writes)
      await this.batchWriteMessage(key, message, metadata);
      
      return true;
    } catch (error) {
      console.error('Error saving message:', error);
      return false;
    }
  }

  /**
   * Batch write messages to reduce I/O
   */
  async batchWriteMessage(key, message, metadata) {
    try {
      const backupFile = path.join(this.backupDir, `backup_${this.getDateFolder()}.json`);
      
      let data = [];
      if (fs.existsSync(backupFile)) {
        data = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
      }

      // Check size limit
      if (data.length >= this.maxMessages) {
        const oldest = data.shift(); // Remove oldest
      }

      data.push({
        key,
        message: this.sanitizeMessage(message),
        metadata,
        timestamp: Date.now()
      });

      fs.writeFileSync(backupFile, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error batch writing message:', error);
    }
  }

  /**
   * Get message from backup
   */
  async getMessage(remoteJid, messageId) {
    try {
      const key = `${remoteJid}_${messageId}`;
      
      // Check cache first
      const cached = this.cache.get(key);
      if (cached) return cached.message;

      // Search in backup files
      const backupFiles = fs.readdirSync(this.backupDir);
      for (const file of backupFiles) {
        const data = JSON.parse(fs.readFileSync(path.join(this.backupDir, file), 'utf8'));
        const found = data.find(m => m.key === key);
        if (found) return found.message;
      }

      return null;
    } catch (error) {
      console.error('Error retrieving message:', error);
      return null;
    }
  }

  /**
   * Get conversation history
   */
  async getConversation(remoteJid, limit = 50) {
    try {
      const messages = [];
      const backupFiles = fs.readdirSync(this.backupDir);

      for (const file of backupFiles) {
        const data = JSON.parse(fs.readFileSync(path.join(this.backupDir, file), 'utf8'));
        const filtered = data.filter(m => m.key.startsWith(remoteJid));
        messages.push(...filtered);
      }

      // Sort by timestamp and limit
      return messages
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting conversation:', error);
      return [];
    }
  }

  /**
   * Archive messages older than maxAge
   */
  async archiveOldMessages() {
    try {
      const now = Date.now();
      const backupFiles = fs.readdirSync(this.backupDir);

      for (const file of backupFiles) {
        const filePath = path.join(this.backupDir, file);
        const stat = fs.statSync(filePath);
        
        if (now - stat.mtimeMs > this.maxAge) {
          const archiveDir = path.join(this.backupDir, 'archive');
          if (!fs.existsSync(archiveDir)) {
            fs.mkdirSync(archiveDir, { recursive: true });
          }
          
          fs.renameSync(filePath, path.join(archiveDir, file));
          console.log(`Archived old backup: ${file}`);
        }
      }
    } catch (error) {
      console.error('Error archiving messages:', error);
    }
  }

  /**
   * Get backup statistics
   */
  async getBackupStats() {
    try {
      let totalMessages = 0;
      let totalSize = 0;
      const backupFiles = fs.readdirSync(this.backupDir);

      backupFiles.forEach(file => {
        const filePath = path.join(this.backupDir, file);
        const stat = fs.statSync(filePath);
        totalSize += stat.size;
        
        if (file.endsWith('.json')) {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          totalMessages += data.length;
        }
      });

      return {
        totalMessages,
        totalSize: this.formatBytes(totalSize),
        fileCount: backupFiles.length,
        cacheSize: Object.keys(this.cache.getStats()).length
      };
    } catch (error) {
      console.error('Error getting backup stats:', error);
      return null;
    }
  }

  /**
   * Clear old cache entries
   */
  clearExpiredCache() {
    this.cache.flushAll();
  }

  /**
   * Sanitize message for storage (remove large binary data)
   */
  sanitizeMessage(message) {
    const sanitized = JSON.parse(JSON.stringify(message));
    
    // Remove binary data
    if (sanitized.message?.imageMessage?.imageData) {
      delete sanitized.message.imageMessage.imageData;
    }
    if (sanitized.message?.videoMessage?.videoData) {
      delete sanitized.message.videoMessage.videoData;
    }
    
    return sanitized;
  }

  /**
   * Get date folder (YYYY-MM-DD format)
   */
  getDateFolder() {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }

  /**
   * Format bytes to human readable
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

module.exports = MessageBackupService;
