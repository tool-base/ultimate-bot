/**
 * Advanced Tools & Utilities Handler
 * Provides calculator, browser, formatting, and other utility commands
 */

const axios = require('axios');
const fetch = require('node-fetch');

class ToolsHandler {
  constructor(cache = null) {
    this.cache = cache;
  }

  /**
   * !tools - Show tools menu
   */
  async handleToolsCommand(phoneNumber, from) {
    return require('../utils/interactiveMessageBuilder').listMessage(
      '🔧 TOOLS & UTILITIES',
      'Select a tool to use:',
      [{
        title: 'Available Tools',
        rows: [
          { 
            id: 'calc', 
            text: '🧮 Calculator',
            description: 'Basic math calculations'
          },
          { 
            id: 'browser', 
            text: '🌐 Browser',
            description: 'Fetch and browse URLs'
          },
          { 
            id: 'format', 
            text: '📝 Text Formatter',
            description: 'Format text with styles'
          },
          { 
            id: 'qrcode', 
            text: '📱 QR Code',
            description: 'Generate QR codes'
          },
          { 
            id: 'shorturl', 
            text: '🔗 Short URL',
            description: 'Shorten long URLs'
          },
          { 
            id: 'weather', 
            text: '🌤️ Weather',
            description: 'Get weather info'
          }
        ]
      }]
    );
  }

  /**
   * !calc <expression> - Calculator with selector
   */
  async handleCalculatorCommand(args, phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');
    const FlowManager = require('../utils/flowManager');

    if (!args[0]) {
      const operations = [
        { id: 'add', text: '➕ Addition', description: 'Add numbers' },
        { id: 'sub', text: '➖ Subtraction', description: 'Subtract numbers' },
        { id: 'mul', text: '✖️ Multiplication', description: 'Multiply numbers' },
        { id: 'div', text: '➗ Division', description: 'Divide numbers' },
        { id: 'power', text: '⚡ Power', description: 'Raise to power' },
        { id: 'sqrt', text: '√ Square Root', description: 'Calculate square root' }
      ];

      return FlowManager.argumentSelectorFlow(
        '🧮 CALCULATOR',
        'Select operation type:',
        operations
      ).interactive;
    }

    try {
      const expression = args.join(' ');
      const result = this.evaluateExpression(expression);

      if (result === null) {
        return InteractiveMessageBuilder.createErrorCard(
          'Invalid Expression',
          ['Could not calculate. Check your expression format']
        );
      }

      return InteractiveMessageBuilder.createSuccessCard(
        '🧮 Calculation Result',
        `${expression} = **${result}**`,
        [
          { text: '🔢 Another Calc', id: 'calc' },
          { text: '🔧 More Tools', id: 'tools' }
        ]
      );
    } catch (error) {
      return InteractiveMessageBuilder.createErrorCard(
        'Calculation Error',
        [error.message]
      );
    }
  }

  /**
   * !browse <url> - Browser utility
   */
  async handleBrowserCommand(args, phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    if (!args[0]) {
      return InteractiveMessageBuilder.createErrorCard(
        'URL Required',
        ['Usage: !browse <url>', 'Example: !browse https://example.com']
      );
    }

    try {
      const url = args[0];
      if (!url.startsWith('http')) {
        return InteractiveMessageBuilder.createErrorCard(
          'Invalid URL',
          ['URL must start with http:// or https://']
        );
      }

      const response = await fetch(url, { timeout: 10000 });

      if (!response.ok) {
        return InteractiveMessageBuilder.createErrorCard(
          `Error ${response.status}`,
          [`Failed to fetch: ${response.statusText}`]
        );
      }

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const json = await response.json();
        const preview = JSON.stringify(json, null, 2).substring(0, 1000);
        
        return InteractiveMessageBuilder.createStatusCard(
          '🌐 JSON Response',
          [
            { label: 'Status', value: response.status.toString(), emoji: '✅' },
            { label: 'Type', value: 'JSON', emoji: '📄' },
            { label: 'Preview', value: preview + '...', emoji: '👀' }
          ],
          [{ text: '🌐 Browse Another', id: 'browse' }]
        );
      } else {
        const text = await response.text();
        const preview = text.substring(0, 500);

        return {
          text: `*🌐 Browser Response*\n\n*Status:* ${response.status}\n*Content-Type:* ${contentType}\n\n_Preview:_\n\`\`\`\n${preview}...\n\`\`\``
        };
      }
    } catch (error) {
      return InteractiveMessageBuilder.createErrorCard(
        'Browser Error',
        [error.message]
      );
    }
  }

  /**
   * !shorten <url> - Shorten URLs
   */
  async handleShortenCommand(args, phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    if (!args[0]) {
      return InteractiveMessageBuilder.createErrorCard(
        'URL Required',
        ['Usage: !shorten <long-url>']
      );
    }

    try {
      const longUrl = args[0];
      const shortUrl = await this.shortenUrl(longUrl);

      return InteractiveMessageBuilder.createSuccessCard(
        '🔗 URL Shortened',
        `Original: ${longUrl}\n\nShort: ${shortUrl}`,
        [
          { text: '📋 Copy Short URL', id: 'copy' },
          { text: '🔗 Shorten Another', id: 'shorten' }
        ]
      );
    } catch (error) {
      return InteractiveMessageBuilder.createErrorCard(
        'Error Shortening URL',
        [error.message]
      );
    }
  }

  /**
   * !weather <city> - Get weather information
   */
  async handleWeatherCommand(args, phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    if (!args[0]) {
      return InteractiveMessageBuilder.createErrorCard(
        'City Required',
        ['Usage: !weather <city-name>']
      );
    }

    try {
      const city = args.join(' ');
      const weather = await this.getWeatherData(city);

      if (!weather) {
        return InteractiveMessageBuilder.createErrorCard(
          'Weather Not Found',
          [`Could not find weather data for ${city}`]
        );
      }

      return InteractiveMessageBuilder.createStatusCard(
        `🌤️ Weather - ${weather.city}`,
        [
          { label: 'Temperature', value: weather.temp, emoji: '🌡️' },
          { label: 'Condition', value: weather.condition, emoji: '☁️' },
          { label: 'Humidity', value: weather.humidity, emoji: '💧' },
          { label: 'Wind Speed', value: weather.windSpeed, emoji: '💨' },
          { label: 'Feels Like', value: weather.feelsLike, emoji: '🤔' }
        ],
        [
          { text: '🌍 Check Another City', id: 'weather' },
          { text: '🔧 Tools Menu', id: 'tools' }
        ]
      );
    } catch (error) {
      return InteractiveMessageBuilder.createErrorCard(
        'Weather Error',
        [error.message]
      );
    }
  }

  /**
   * Helper: Evaluate mathematical expressions
   */
  evaluateExpression(expression) {
    try {
      // Remove spaces
      expression = expression.replace(/\s/g, '');
      
      // Validate - only allow numbers and basic operators
      if (!/^[\d+\-*/().^sqrt]+$/i.test(expression)) {
        return null;
      }

      // Simple evaluation (in production, use a proper math library)
      const result = Function('"use strict"; return (' + expression + ')')();
      
      if (typeof result === 'number' && isFinite(result)) {
        return result.toFixed(4).replace(/\.?0+$/, '');
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Helper: Shorten URL
   */
  async shortenUrl(longUrl) {
    try {
      // Using TinyURL as fallback (free service)
      const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to shorten URL: ' + error.message);
    }
  }

  /**
   * Helper: Get weather data
   */
  async getWeatherData(city) {
    try {
      // Using Open-Meteo (free, no API key required)
      const geocoding = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: { name: city, count: 1, language: 'en', format: 'json' }
      });

      if (!geocoding.data.results || geocoding.data.results.length === 0) {
        return null;
      }

      const location = geocoding.data.results[0];
      const weather = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
          timezone: 'auto'
        }
      });

      const current = weather.data.current;
      
      return {
        city: `${location.name}, ${location.country}`,
        temp: `${current.temperature_2m}°C`,
        feelsLike: `${current.apparent_temperature}°C`,
        condition: this.getWeatherCondition(current.weather_code),
        humidity: `${current.relative_humidity_2m}%`,
        windSpeed: `${current.wind_speed_10m} km/h`
      };
    } catch (error) {
      throw new Error('Weather API error: ' + error.message);
    }
  }

  /**
   * Helper: Map weather codes to descriptions
   */
  getWeatherCondition(code) {
    const conditions = {
      0: 'Clear Sky ☀️',
      1: 'Mainly Clear 🌤️',
      2: 'Partly Cloudy ⛅',
      3: 'Overcast ☁️',
      45: 'Foggy 🌫️',
      48: 'Foggy/Rime 🌫️',
      51: 'Light Drizzle 🌧️',
      53: 'Moderate Drizzle 🌧️',
      55: 'Heavy Drizzle 🌧️',
      61: 'Slight Rain 🌧️',
      63: 'Moderate Rain 🌧️',
      65: 'Heavy Rain ⛈️',
      71: 'Light Snow 🌨️',
      73: 'Moderate Snow 🌨️',
      75: 'Heavy Snow 🌨️',
      77: 'Snow Grains 🌨️',
      80: 'Slight Rain Showers 🌧️',
      81: 'Moderate Rain Showers 🌧️',
      82: 'Violent Rain Showers ⛈️',
      85: 'Slight Snow Showers 🌨️',
      86: 'Heavy Snow Showers 🌨️',
      95: 'Thunderstorm ⛈️',
      96: 'Thunderstorm with Hail ⛈️',
      99: 'Thunderstorm with Hail ⛈️'
    };
    return conditions[code] || 'Unknown ❓';
  }
}

module.exports = ToolsHandler;
