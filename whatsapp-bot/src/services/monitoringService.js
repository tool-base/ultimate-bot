/**
 * Advanced Memory & Performance Monitoring Service
 * Tracks bot performance, memory usage, and system health
 */

const os = require('os');
const { performance } = require('perf_hooks');
const NodeCache = require('node-cache');

class MonitoringService {
  constructor(options = {}) {
    this.checkInterval = options.checkInterval || 60000; // 1 minute
    this.memoryLimit = options.memoryLimit || 512; // MB
    this.warningThreshold = options.warningThreshold || 80; // %
    this.criticalThreshold = options.criticalThreshold || 95; // %
    
    // Metrics storage
    this.metrics = new NodeCache({ stdTTL: 3600 }); // 1 hour
    this.history = [];
    this.maxHistory = 1440; // 24 hours at 1-minute intervals
    
    // Performance markers
    this.startTime = Date.now();
    this.commandCount = 0;
    this.errorCount = 0;
    this.warnings = [];
  }

  /**
   * Start continuous monitoring
   */
  start() {
    this.monitorInterval = setInterval(() => {
      this.recordMetrics();
    }, this.checkInterval);

    console.log('[MONITORING] Service started - Memory limit: ' + this.memoryLimit + 'MB');
  }

  /**
   * Stop monitoring
   */
  stop() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      console.log('[MONITORING] Service stopped');
    }
  }

  /**
   * Record current metrics
   */
  recordMetrics() {
    try {
      const memUsage = process.memoryUsage();
      const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
      const heapTotalMB = memUsage.heapTotal / 1024 / 1024;
      const externalMB = memUsage.external / 1024 / 1024;
      const rssMB = memUsage.rss / 1024 / 1024;
      
      const cpuUsage = process.cpuUsage();
      const cpuPercent = ((cpuUsage.user + cpuUsage.system) / 1000000 * 100).toFixed(2);
      
      const uptime = Date.now() - this.startTime;
      const systemUptime = os.uptime();
      const freeMemory = os.freemem();
      const totalMemory = os.totalmem();
      const systemMemoryPercent = ((totalMemory - freeMemory) / totalMemory * 100).toFixed(2);

      const metrics = {
        timestamp: Date.now(),
        memory: {
          heapUsed: heapUsedMB,
          heapTotal: heapTotalMB,
          external: externalMB,
          rss: rssMB,
          heapPercent: (heapUsedMB / heapTotalMB * 100).toFixed(2)
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system,
          percent: cpuPercent
        },
        system: {
          freeMemory: freeMemory / 1024 / 1024,
          totalMemory: totalMemory / 1024 / 1024,
          memoryPercent: systemMemoryPercent,
          uptime: systemUptime,
          platform: os.platform(),
          cpuCount: os.cpus().length,
          loadAverage: os.loadavg()
        },
        app: {
          uptime,
          commandCount: this.commandCount,
          errorCount: this.errorCount,
          avgResponseTime: this.getAverageResponseTime()
        }
      };

      // Store current metrics
      this.metrics.set('current', metrics);
      
      // Add to history
      this.history.push(metrics);
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }

      // Check thresholds
      this.checkThresholds(metrics);

      return metrics;
    } catch (error) {
      console.error('[MONITORING] Error recording metrics:', error);
      return null;
    }
  }

  /**
   * Check memory and performance thresholds
   */
  checkThresholds(metrics) {
    const heapPercent = parseFloat(metrics.memory.heapPercent);
    const systemMemPercent = parseFloat(metrics.system.memoryPercent);

    // Warning threshold
    if (heapPercent > this.warningThreshold) {
      const warning = {
        type: 'MEMORY_WARNING',
        level: 'WARNING',
        message: `Heap memory usage at ${heapPercent}%`,
        timestamp: Date.now()
      };
      this.warnings.push(warning);
      console.warn('[MONITORING] ⚠️ Memory warning:', warning.message);
    }

    // Critical threshold
    if (heapPercent > this.criticalThreshold) {
      const critical = {
        type: 'MEMORY_CRITICAL',
        level: 'CRITICAL',
        message: `Heap memory usage CRITICAL at ${heapPercent}%`,
        timestamp: Date.now()
      };
      this.warnings.push(critical);
      console.error('[MONITORING] 🚨 CRITICAL:', critical.message);
      
      // Trigger garbage collection if available
      if (global.gc) {
        global.gc();
        console.log('[MONITORING] Garbage collection triggered');
      }
    }

    // Keep only recent warnings
    const oneHourAgo = Date.now() - 3600000;
    this.warnings = this.warnings.filter(w => w.timestamp > oneHourAgo);
  }

  /**
   * Get current metrics
   */
  getCurrentMetrics() {
    return this.metrics.get('current') || this.recordMetrics();
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(minutes = 60) {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.history.filter(m => m.timestamp >= cutoff);
  }

  /**
   * Get system health status
   */
  getHealthStatus() {
    const current = this.getCurrentMetrics();
    if (!current) return null;

    const heapPercent = parseFloat(current.memory.heapPercent);
    let status = 'HEALTHY';
    let color = 'green';

    if (heapPercent > this.criticalThreshold) {
      status = 'CRITICAL';
      color = 'red';
    } else if (heapPercent > this.warningThreshold) {
      status = 'WARNING';
      color = 'yellow';
    }

    return {
      status,
      color,
      memoryUsage: heapPercent,
      systemMemory: current.system.memoryPercent,
      cpuUsage: current.cpu.percent,
      uptime: this.formatUptime(current.app.uptime),
      commands: current.app.commandCount,
      errors: current.app.errorCount,
      warnings: this.warnings.length
    };
  }

  /**
   * Get performance report
   */
  getPerformanceReport() {
    const metrics = this.getMetricsHistory(60);
    if (metrics.length === 0) return null;

    const avgHeap = metrics.reduce((sum, m) => sum + parseFloat(m.memory.heapPercent), 0) / metrics.length;
    const maxHeap = Math.max(...metrics.map(m => parseFloat(m.memory.heapPercent)));
    const minHeap = Math.min(...metrics.map(m => parseFloat(m.memory.heapPercent)));
    
    const avgCpu = metrics.reduce((sum, m) => sum + parseFloat(m.cpu.percent), 0) / metrics.length;
    const maxCpu = Math.max(...metrics.map(m => parseFloat(m.cpu.percent)));

    return {
      period: '1 hour',
      memory: {
        avgHeap: avgHeap.toFixed(2) + '%',
        maxHeap: maxHeap.toFixed(2) + '%',
        minHeap: minHeap.toFixed(2) + '%'
      },
      cpu: {
        avgUsage: avgCpu.toFixed(2) + '%',
        maxUsage: maxCpu.toFixed(2) + '%'
      },
      uptime: this.formatUptime(Date.now() - this.startTime),
      commandCount: this.commandCount,
      errorCount: this.errorCount,
      errorRate: ((this.errorCount / Math.max(this.commandCount, 1)) * 100).toFixed(2) + '%'
    };
  }

  /**
   * Record command execution
   */
  recordCommand(commandName, duration, success = true) {
    this.commandCount++;
    if (!success) this.errorCount++;
    
    const key = `cmd_${commandName}`;
    const stats = this.metrics.get(key) || { count: 0, totalTime: 0, errors: 0, lastUsed: null };
    
    stats.count++;
    stats.totalTime += duration;
    if (!success) stats.errors++;
    stats.lastUsed = Date.now();
    stats.avgTime = (stats.totalTime / stats.count).toFixed(2);

    this.metrics.set(key, stats);
  }

  /**
   * Get command statistics
   */
  getCommandStats(commandName) {
    return this.metrics.get(`cmd_${commandName}`);
  }

  /**
   * Get top commands by usage
   */
  getTopCommands(limit = 10) {
    const stats = [];
    const keys = this.metrics.keys();

    keys.forEach(key => {
      if (key.startsWith('cmd_')) {
        const stat = this.metrics.get(key);
        stats.push({
          command: key.replace('cmd_', ''),
          ...stat
        });
      }
    });

    return stats
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get recent errors/warnings
   */
  getRecentWarnings(limit = 20) {
    return this.warnings.slice(-limit).reverse();
  }

  /**
   * Get average response time
   */
  getAverageResponseTime() {
    const keys = this.metrics.keys();
    const times = keys
      .filter(k => k.startsWith('cmd_'))
      .map(k => parseFloat(this.metrics.get(k).avgTime))
      .filter(t => !isNaN(t));

    if (times.length === 0) return 0;
    return (times.reduce((a, b) => a + b) / times.length).toFixed(2);
  }

  /**
   * Format uptime
   */
  formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  /**
   * Generate detailed status report
   */
  generateDetailedReport() {
    const current = this.getCurrentMetrics();
    const health = this.getHealthStatus();
    const performance = this.getPerformanceReport();

    return {
      generatedAt: new Date().toISOString(),
      health,
      current,
      performance,
      topCommands: this.getTopCommands(5),
      recentWarnings: this.getRecentWarnings(5)
    };
  }
}

module.exports = MonitoringService;
