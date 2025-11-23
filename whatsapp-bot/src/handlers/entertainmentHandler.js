/**
 * Entertainment & Fun Commands Handler
 * Provides fun, entertaining, and interactive games
 */

class EntertainmentHandler {
  constructor(cache = null) {
    this.cache = cache;
  }

  /**
   * !fun - Show fun commands menu
   */
  async handleFunMenuCommand(phoneNumber, from) {
    return require('../utils/interactiveMessageBuilder').listMessage(
      '🎮 FUN & ENTERTAINMENT',
      'Pick an activity:',
      [{
        title: 'Available Games',
        rows: [
          {
            id: 'dice',
            text: '🎲 Dice Game',
            description: 'Roll the dice'
          },
          {
            id: 'coin',
            text: '🪙 Coin Flip',
            description: 'Heads or tails?'
          },
          {
            id: 'lucky',
            text: '🍀 Lucky Number',
            description: 'Get your lucky number'
          },
          {
            id: 'truth',
            text: '🤐 Truth or Dare',
            description: 'Play truth or dare'
          },
          {
            id: 'joke',
            text: '😂 Random Joke',
            description: 'Get a laugh'
          },
          {
            id: 'quote',
            text: '✨ Inspirational Quote',
            description: 'Get inspired'
          },
          {
            id: 'riddle',
            text: '🧩 Riddle',
            description: 'Solve a riddle'
          },
          {
            id: '8ball',
            text: '🔮 Magic 8 Ball',
            description: 'Ask the magic ball'
          }
        ]
      }]
    );
  }

  /**
   * !dice - Roll a dice
   */
  async handleDiceCommand(phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');
    const sides = [1, 2, 3, 4, 5, 6];
    const roll = sides[Math.floor(Math.random() * sides.length)];
    const emoji = ['🎲', '🎯', '🎪', '🎨', '🎭', '🎬'][roll - 1];

    return InteractiveMessageBuilder.createSuccessCard(
      '🎲 Dice Roll',
      `You rolled: ${emoji} **${roll}**\n\nGood luck! 🍀`,
      [
        { text: '🎲 Roll Again', id: 'dice' },
        { text: '🎮 More Fun', id: 'fun' }
      ]
    );
  }

  /**
   * !coin - Flip a coin
   */
  async handleCoinFlipCommand(phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');
    const result = Math.random() > 0.5 ? 'HEADS 🪙' : 'TAILS 🪙';
    const emoji = result.includes('HEADS') ? '🟡' : '🔴';

    return InteractiveMessageBuilder.createSuccessCard(
      'Coin Flip Result',
      `${emoji} **${result}**\n\nIt's your lucky day! ✨`,
      [
        { text: '🪙 Flip Again', id: 'coin' },
        { text: '🎮 More Fun', id: 'fun' }
      ]
    );
  }

  /**
   * !lucky - Get lucky number
   */
  async handleLuckyNumberCommand(phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');
    const lucky = Math.floor(Math.random() * 100) + 1;
    const luckyColor = this.getLuckyColor();

    return InteractiveMessageBuilder.createStatusCard(
      '🍀 Your Lucky Number',
      [
        { label: 'Number', value: lucky.toString(), emoji: '🔢' },
        { label: 'Lucky Color', value: luckyColor, emoji: '🎨' },
        { label: 'Today\'s Vibe', value: this.getRandomVibe(), emoji: '✨' },
        { label: 'Luck Level', value: '⭐'.repeat(Math.floor(Math.random() * 5) + 1), emoji: '⭐' }
      ],
      [
        { text: '🍀 Get Another', id: 'lucky' },
        { text: '🎮 Back to Fun', id: 'fun' }
      ]
    );
  }

  /**
   * !truth - Truth or Dare
   */
  async handleTruthOrDareCommand(phoneNumber, from) {
    const FlowManager = require('../utils/flowManager');
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    const options = [
      { id: 'truth', text: '🤐 Truth', description: 'I\'ll ask you a truth question' },
      { id: 'dare', text: '😎 Dare', description: 'I\'ll give you a challenge' }
    ];

    return FlowManager.argumentSelectorFlow(
      '🎭 Truth or Dare',
      'Choose wisely:',
      options
    ).interactive;
  }

  /**
   * !joke - Get a random joke
   */
  async handleJokeCommand(phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');
    const jokes = this.getJokes();
    const joke = jokes[Math.floor(Math.random() * jokes.length)];

    return {
      text: `*😂 Here's a joke for you:*\n\n${joke.setup}\n\n_${joke.punchline}_\n\n😆🤣😂`
    };
  }

  /**
   * !quote - Get inspirational quote
   */
  async handleQuoteCommand(phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');
    const quotes = this.getQuotes();
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    return InteractiveMessageBuilder.createSuccessCard(
      '✨ Inspirational Quote',
      `_"${quote.text}"_\n\n— ${quote.author}`,
      [
        { text: '✨ Another Quote', id: 'quote' },
        { text: '🎮 Back to Fun', id: 'fun' }
      ]
    );
  }

  /**
   * !riddle - Get a riddle
   */
  async handleRiddleCommand(phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');
    const riddles = this.getRiddles();
    const riddle = riddles[Math.floor(Math.random() * riddles.length)];

    // Store answer in cache for verification
    if (this.cache) {
      this.cache.set(`riddle_${from}`, riddle.answer, 3600); // 1 hour
    }

    return InteractiveMessageBuilder.createStatusCard(
      '🧩 Here\'s a Riddle',
      [
        { label: 'Riddle', value: riddle.question, emoji: '❓' },
        { label: 'Category', value: riddle.category, emoji: '📂' },
        { label: 'Difficulty', value: '⭐'.repeat(riddle.difficulty), emoji: '⭐' }
      ],
      [
        { text: '📝 Answer (Type below)', id: 'answer' },
        { text: '🧩 Another Riddle', id: 'riddle' }
      ]
    );
  }

  /**
   * !8ball <question> - Magic 8 Ball
   */
  async handleMagic8BallCommand(args, phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    if (!args[0]) {
      return InteractiveMessageBuilder.createErrorCard(
        'Ask a Question',
        ['Usage: !8ball <your question>']
      );
    }

    const responses = this.getMagic8BallResponses();
    const answer = responses[Math.floor(Math.random() * responses.length)];

    return InteractiveMessageBuilder.createStatusCard(
      '🔮 Magic 8 Ball',
      [
        { label: 'Your Question', value: args.join(' '), emoji: '❓' },
        { label: 'Answer', value: answer.text, emoji: '🔮' },
        { label: 'Type', value: answer.type, emoji: '✨' }
      ],
      [
        { text: '🔮 Ask Another', id: '8ball' },
        { text: '🎮 More Fun', id: 'fun' }
      ]
    );
  }

  /**
   * !would-you-rather - Would you rather question
   */
  async handleWouldYouRatherCommand(phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');
    const questions = this.getWouldYouRatherQuestions();
    const question = questions[Math.floor(Math.random() * questions.length)];

    return InteractiveMessageBuilder.buttonMessage(
      '🤔 Would You Rather...',
      question.question,
      [
        { id: 'option1', text: `Option A: ${question.optionA}` },
        { id: 'option2', text: `Option B: ${question.optionB}` },
        { id: 'skip', text: '⏭️ Skip This' }
      ]
    );
  }

  /**
   * !trivia - Trivia quiz
   */
  async handleTriviaCommand(phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');
    const trivia = this.getTriviaQuestion();

    // Store correct answer for verification
    if (this.cache) {
      this.cache.set(`trivia_${from}`, trivia.correct, 3600);
    }

    return InteractiveMessageBuilder.buttonMessage(
      '🧠 Trivia Question',
      `📚 ${trivia.question}\n\nCategory: ${trivia.category}`,
      trivia.options.map((opt, idx) => ({
        id: `trivia_${idx}`,
        text: opt
      }))
    );
  }

  // ===== Helper Methods =====

  getJokes() {
    return [
      { setup: 'Why don\'t scientists trust atoms?', punchline: 'Because they make up everything!' },
      { setup: 'What do you call a fake noodle?', punchline: 'An impasta!' },
      { setup: 'Why don\'t eggs tell jokes?', punchline: 'They\'d crack each other up!' },
      { setup: 'What did the ocean say to the beach?', punchline: 'Nothing, it just waved!' },
      { setup: 'Why did the scarecrow win an award?', punchline: 'He was outstanding in his field!' }
    ];
  }

  getQuotes() {
    return [
      { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
      { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
      { text: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon' },
      { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
      { text: 'It is during our darkest moments that we must focus to see the light.', author: 'Aristotle' },
      { text: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins' }
    ];
  }

  getRiddles() {
    return [
      { question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?', answer: 'an echo', category: 'Nature', difficulty: 2 },
      { question: 'The more you take, the more you leave behind. What am I?', answer: 'footsteps', category: 'Logic', difficulty: 2 },
      { question: 'I can be cracked, made, told, and played. What am I?', answer: 'a joke', category: 'General', difficulty: 1 },
      { question: 'What has keys but no locks, space but no room, and you can enter but can\'t go outside?', answer: 'a keyboard', category: 'Tech', difficulty: 2 },
      { question: 'I am taken from a mine and shut up in a wooden case, from which I am never released, yet I am used by almost everyone. What am I?', answer: 'pencil lead', category: 'Objects', difficulty: 3 }
    ];
  }

  getMagic8BallResponses() {
    return [
      { text: 'Yes, definitely', type: 'Positive' },
      { text: 'It is certain', type: 'Positive' },
      { text: 'Most likely', type: 'Positive' },
      { text: 'Looking good', type: 'Positive' },
      { text: 'Ask again later', type: 'Non-Committal' },
      { text: 'Cannot predict now', type: 'Non-Committal' },
      { text: 'Concentrate and ask again', type: 'Non-Committal' },
      { text: 'Don\'t count on it', type: 'Negative' },
      { text: 'Highly unlikely', type: 'Negative' },
      { text: 'No way', type: 'Negative' }
    ];
  }

  getWouldYouRatherQuestions() {
    return [
      { question: 'Would you rather...', optionA: 'Have the ability to fly', optionB: 'Have the ability to be invisible' },
      { question: 'Would you rather...', optionA: 'Live in the mountains', optionB: 'Live on the beach' },
      { question: 'Would you rather...', optionA: 'Always be 10 minutes late', optionB: 'Always be 20 minutes early' },
      { question: 'Would you rather...', optionA: 'Have unlimited money', optionB: 'Have unlimited time' },
      { question: 'Would you rather...', optionA: 'Be able to speak all languages', optionB: 'Be able to play all instruments' }
    ];
  }

  getTriviaQuestion() {
    const questions = [
      { question: 'What is the capital of France?', category: 'Geography', options: ['Paris', 'London', 'Berlin', 'Madrid'], correct: 0 },
      { question: 'What is 2 + 2?', category: 'Math', options: ['3', '4', '5', '6'], correct: 1 },
      { question: 'Which planet is closest to the Sun?', category: 'Science', options: ['Venus', 'Mercury', 'Earth', 'Mars'], correct: 1 },
      { question: 'Who painted the Mona Lisa?', category: 'Art', options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'], correct: 1 }
    ];

    return questions[Math.floor(Math.random() * questions.length)];
  }

  getLuckyColor() {
    const colors = ['Red ❤️', 'Blue 💙', 'Green 💚', 'Purple 💜', 'Yellow 💛', 'Pink 🩷', 'Orange 🧡', 'Gold ✨'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getRandomVibe() {
    const vibes = ['Excellent', 'Great', 'Good', 'Okay', 'Not Bad', 'Amazing', 'Wonderful'];
    return vibes[Math.floor(Math.random() * vibes.length)];
  }
}

module.exports = EntertainmentHandler;
