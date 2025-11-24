/**
 * Command Registry
 * Central registry of ALL available commands organized by category
 * Includes commands from: customerHandler, merchantHandler, adminHandler, 
 * authHandler, groupManagementHandler, entertainmentHandler, toolsHandler, ownerDeploymentHandler
 * 
 * Total Commands: 80+
 */

const commandRegistry = {
  // ===== CUSTOMER SHOPPING =====
  shopping: {
    name: 'Shopping',
    emoji: '🛍️',
    commands: {
      menu: {
        name: 'Menu',
        aliases: ['m'],
        description: 'Browse all products',
        usage: '!menu',
        category: 'shopping'
      },
      search: {
        name: 'Search',
        aliases: ['find', 's'],
        description: 'Search for products',
        usage: '!search <query>',
        args: true,
        category: 'shopping'
      },
      categories: {
        name: 'Categories',
        aliases: ['cat', 'browse'],
        description: 'Shop by category',
        usage: '!categories',
        category: 'shopping'
      },
      nearby: {
        name: 'Nearby Stores',
        aliases: ['stores', 'near'],
        description: 'Find nearby stores',
        usage: '!nearby',
        category: 'shopping'
      },
      products: {
        name: 'Products',
        aliases: ['prod'],
        description: 'View all products',
        usage: '!products',
        category: 'shopping'
      },
      storedetails: {
        name: 'Store Details',
        aliases: ['store', 'seller'],
        description: 'View store information',
        usage: '!storedetails <store_id>',
        args: true,
        category: 'shopping'
      }
    }
  },

  // ===== CART & CHECKOUT =====
  cart: {
    name: 'Cart & Checkout',
    emoji: '🛒',
    commands: {
      cart: {
        name: 'View Cart',
        aliases: ['c', 'bag', 'items'],
        description: 'View your shopping cart',
        usage: '!cart',
        category: 'cart'
      },
      add: {
        name: 'Add to Cart',
        aliases: ['addcart', 'additem'],
        description: 'Add item to cart',
        usage: '!add <product_id> <qty>',
        args: true,
        category: 'cart'
      },
      remove: {
        name: 'Remove from Cart',
        aliases: ['rm', 'del', 'removecart'],
        description: 'Remove item from cart',
        usage: '!remove <index>',
        args: true,
        category: 'cart'
      },
      clear: {
        name: 'Clear Cart',
        aliases: ['clearcart', 'empty'],
        description: 'Clear entire cart',
        usage: '!clear',
        category: 'cart'
      },
      checkout: {
        name: 'Checkout',
        aliases: ['pay', 'purchase', 'order'],
        description: 'Proceed to payment',
        usage: '!checkout',
        category: 'cart'
      }
    }
  },

  // ===== ORDERS =====
  orders: {
    name: 'Orders',
    emoji: '📦',
    commands: {
      orders: {
        name: 'My Orders',
        aliases: ['myorders', 'history', 'purchases'],
        description: 'View order history',
        usage: '!orders',
        category: 'orders'
      },
      track: {
        name: 'Track Order',
        aliases: ['status', 'delivery', 'trackorder'],
        description: 'Track order status',
        usage: '!track <order_id>',
        args: true,
        category: 'orders'
      },
      reorder: {
        name: 'Reorder',
        aliases: ['again', 'repeatorder'],
        description: 'Reorder from previous purchase',
        usage: '!reorder <order_id>',
        args: true,
        category: 'orders'
      },
      rate: {
        name: 'Rate Order',
        aliases: ['review', 'rateorder', 'feedback'],
        description: 'Rate an order',
        usage: '!rate <order_id> <rating>',
        args: true,
        category: 'orders'
      }
    }
  },

  // ===== ACCOUNT & PROFILE =====
  account: {
    name: 'Account',
    emoji: '👤',
    commands: {
      profile: {
        name: 'My Profile',
        aliases: ['me', 'myprofile', 'account'],
        description: 'View your profile',
        usage: '!profile',
        category: 'account'
      },
      favorites: {
        name: 'Favorites',
        aliases: ['fav', 'wishlist', 'likes'],
        description: 'View favorite items',
        usage: '!favorites',
        category: 'account'
      },
      addresses: {
        name: 'Addresses',
        aliases: ['addr', 'delivery', 'location'],
        description: 'Manage delivery addresses',
        usage: '!addresses <add|remove|list>',
        args: true,
        category: 'account'
      }
    }
  },

  // ===== DEALS & PROMOTIONS =====
  deals: {
    name: 'Deals & Promotions',
    emoji: '🎉',
    commands: {
      deals: {
        name: 'Today\'s Deals',
        aliases: ['deal', 'special', 'offers'],
        description: 'View today\'s deals',
        usage: '!deals',
        category: 'deals'
      },
      trending: {
        name: 'Trending',
        aliases: ['popular', 'hot', 'bestseller'],
        description: 'View trending products',
        usage: '!trending',
        category: 'deals'
      },
      promo: {
        name: 'Promotions',
        aliases: ['promotion', 'coupon', 'discount'],
        description: 'View promotions and coupons',
        usage: '!promo',
        category: 'deals'
      },
      featured: {
        name: 'Featured',
        aliases: ['feature', 'spotlight'],
        description: 'View featured products',
        usage: '!featured',
        category: 'deals'
      }
    }
  },

  // ===== MERCHANT COMMANDS =====
  merchant: {
    name: 'Merchant',
    emoji: '💼',
    commands: {
      merchant: {
        name: 'Merchant Menu',
        aliases: ['mm'],
        description: 'View merchant commands',
        usage: '!merchant',
        category: 'merchant'
      },
      dashboard: {
        name: 'Dashboard',
        aliases: ['db', 'overview', 'home'],
        description: 'View merchant dashboard',
        usage: '!dashboard',
        category: 'merchant'
      },
      inventory: {
        name: 'Inventory',
        aliases: ['inv', 'stock', 'products'],
        description: 'Manage inventory',
        usage: '!inventory',
        category: 'merchant'
      },
      analytics: {
        name: 'Analytics',
        aliases: ['stats', 'data', 'report'],
        description: 'View sales analytics',
        usage: '!analytics',
        category: 'merchant'
      },
      merchantorders: {
        name: 'Orders',
        aliases: ['myorders', 'sales'],
        description: 'View merchant orders',
        usage: '!merchantorders',
        category: 'merchant'
      },
      accept: {
        name: 'Accept Order',
        aliases: ['acceptorder'],
        description: 'Accept pending order',
        usage: '!accept <order_id>',
        args: true,
        category: 'merchant'
      },
      reject: {
        name: 'Reject Order',
        aliases: ['rejectorder', 'decline'],
        description: 'Reject order',
        usage: '!reject <order_id> <reason>',
        args: true,
        category: 'merchant'
      },
      updatestatus: {
        name: 'Update Status',
        aliases: ['setstatus'],
        description: 'Update order status',
        usage: '!updatestatus <order_id> <status>',
        args: true,
        category: 'merchant'
      },
      store: {
        name: 'Store Settings',
        aliases: ['storeset', 'settings'],
        description: 'Manage store settings',
        usage: '!store <subcommand>',
        args: true,
        category: 'merchant'
      },
      storehours: {
        name: 'Store Hours',
        aliases: ['hours', 'schedule'],
        description: 'Set store hours',
        usage: '!storehours <open> <close>',
        args: true,
        category: 'merchant'
      },
      storeopen: {
        name: 'Store Open/Close',
        aliases: ['storeclose'],
        description: 'Open or close store',
        usage: '!storeopen',
        category: 'merchant'
      },
      boost: {
        name: 'Boost Store',
        aliases: ['promote', 'advertise'],
        description: 'Boost store visibility',
        usage: '!boost <duration>',
        args: true,
        category: 'merchant'
      },
      tips: {
        name: 'Tips & Help',
        aliases: ['help', 'guide'],
        description: 'Get merchant tips',
        usage: '!tips',
        category: 'merchant'
      }
    }
  },

  // ===== GROUP MANAGEMENT =====
  group: {
    name: 'Group Management',
    emoji: '👥',
    commands: {
      groupmenu: {
        name: 'Group Menu',
        aliases: ['gm', 'grouptools'],
        description: 'View group commands',
        usage: '!groupmenu',
        category: 'group'
      },
      groupinfo: {
        name: 'Group Info',
        aliases: ['info', 'details'],
        description: 'Show group information',
        usage: '!groupinfo',
        category: 'group'
      },
      members: {
        name: 'Member List',
        aliases: ['memberlist', 'list'],
        description: 'List group members',
        usage: '!members',
        category: 'group'
      },
      groupstats: {
        name: 'Group Stats',
        aliases: ['statistics', 'stats'],
        description: 'View group statistics',
        usage: '!groupstats',
        category: 'group'
      },
      promote: {
        name: 'Promote Member',
        aliases: ['admin', 'makeadmin'],
        description: 'Promote member to admin',
        usage: '!promote @user',
        args: true,
        category: 'group'
      },
      demote: {
        name: 'Demote Admin',
        aliases: ['unadmin', 'removeadmin'],
        description: 'Demote admin to member',
        usage: '!demote @user',
        args: true,
        category: 'group'
      },
      kick: {
        name: 'Remove Member',
        aliases: ['remove', 'ban'],
        description: 'Remove member from group',
        usage: '!kick @user',
        args: true,
        category: 'group'
      },
      mute: {
        name: 'Mute Member',
        aliases: ['silence'],
        description: 'Mute member temporarily',
        usage: '!mute @user <duration>',
        args: true,
        category: 'group'
      },
      unmute: {
        name: 'Unmute Member',
        aliases: ['unsilence'],
        description: 'Unmute member',
        usage: '!unmute @user',
        args: true,
        category: 'group'
      },
      announce: {
        name: 'Announce',
        aliases: ['announcement', 'broadcast'],
        description: 'Make group announcement',
        usage: '!announce <message>',
        args: true,
        category: 'group'
      },
      createpoll: {
        name: 'Create Poll',
        aliases: ['poll', 'vote'],
        description: 'Create group poll',
        usage: '!createpoll <question>',
        args: true,
        category: 'group'
      }
    }
  },

  // ===== ADMIN COMMANDS =====
  admin: {
    name: 'Admin',
    emoji: '⚙️',
    commands: {
      admin: {
        name: 'Admin Menu',
        aliases: ['am', 'admintools'],
        description: 'View admin commands',
        usage: '!admin',
        category: 'admin'
      },
      merchants: {
        name: 'Manage Merchants',
        aliases: ['merchant', 'sellers'],
        description: 'Manage merchants on platform',
        usage: '!merchants',
        category: 'admin'
      },
      approve: {
        name: 'Approve Merchant',
        aliases: ['accept'],
        description: 'Approve merchant application',
        usage: '!approve <merchant_id>',
        args: true,
        category: 'admin'
      },
      reject: {
        name: 'Reject Merchant',
        aliases: ['decline'],
        description: 'Reject merchant application',
        usage: '!reject <merchant_id> <reason>',
        args: true,
        category: 'admin'
      },
      suspend: {
        name: 'Suspend Merchant',
        aliases: ['block'],
        description: 'Suspend merchant account',
        usage: '!suspend <merchant_id> <reason>',
        args: true,
        category: 'admin'
      },
      broadcast: {
        name: 'Broadcast Message',
        aliases: ['announce', 'message'],
        description: 'Send broadcast to users',
        usage: '!broadcast <message>',
        args: true,
        category: 'admin'
      },
      sales: {
        name: 'Sales Report',
        aliases: ['revenue', 'income'],
        description: 'View sales report',
        usage: '!sales',
        category: 'admin'
      },
      logs: {
        name: 'View Logs',
        aliases: ['log', 'activity'],
        description: 'View system logs',
        usage: '!logs [type]',
        category: 'admin'
      },
      adminstats: {
        name: 'Platform Stats',
        aliases: ['statistics', 'data'],
        description: 'View platform statistics',
        usage: '!adminstats',
        category: 'admin'
      },
      alerts: {
        name: 'Alerts',
        aliases: ['notification', 'notify'],
        description: 'View system alerts',
        usage: '!alerts',
        category: 'admin'
      }
    }
  },

  // ===== ENTERTAINMENT & FUN =====
  entertainment: {
    name: 'Entertainment',
    emoji: '🎮',
    commands: {
      fun: {
        name: 'Fun Menu',
        aliases: ['games', 'entertainment'],
        description: 'View fun games',
        usage: '!fun',
        category: 'entertainment'
      },
      dice: {
        name: 'Dice Game',
        aliases: ['roll'],
        description: 'Roll the dice',
        usage: '!dice',
        category: 'entertainment'
      },
      coin: {
        name: 'Coin Flip',
        aliases: ['flip'],
        description: 'Flip a coin',
        usage: '!coin',
        category: 'entertainment'
      },
      lucky: {
        name: 'Lucky Number',
        aliases: ['fortune', 'lucky_number'],
        description: 'Get lucky number',
        usage: '!lucky',
        category: 'entertainment'
      },
      truth: {
        name: 'Truth or Dare',
        aliases: ['dare', 'tod'],
        description: 'Play truth or dare',
        usage: '!truth',
        category: 'entertainment'
      },
      joke: {
        name: 'Random Joke',
        aliases: ['laugh', 'humor'],
        description: 'Get a random joke',
        usage: '!joke',
        category: 'entertainment'
      },
      quote: {
        name: 'Inspirational Quote',
        aliases: ['motivation', 'inspire'],
        description: 'Get inspirational quote',
        usage: '!quote',
        category: 'entertainment'
      },
      riddle: {
        name: 'Riddle',
        aliases: ['puzzle'],
        description: 'Solve a riddle',
        usage: '!riddle',
        category: 'entertainment'
      },
      '8ball': {
        name: 'Magic 8 Ball',
        aliases: ['magic', 'ball'],
        description: 'Ask magic 8 ball',
        usage: '!8ball <question>',
        args: true,
        category: 'entertainment'
      },
      rather: {
        name: 'Would You Rather',
        aliases: ['wyr', 'either'],
        description: 'Would you rather question',
        usage: '!rather',
        category: 'entertainment'
      },
      trivia: {
        name: 'Trivia Quiz',
        aliases: ['quiz', 'question'],
        description: 'Play trivia quiz',
        usage: '!trivia',
        category: 'entertainment'
      }
    }
  },

  // ===== TOOLS & UTILITIES =====
  tools: {
    name: 'Tools & Utilities',
    emoji: '🔧',
    commands: {
      tools: {
        name: 'Tools Menu',
        aliases: ['utilities', 'util'],
        description: 'View available tools',
        usage: '!tools',
        category: 'tools'
      },
      calculator: {
        name: 'Calculator',
        aliases: ['calc', 'math'],
        description: 'Calculate expressions',
        usage: '!calculator <expression>',
        args: true,
        category: 'tools'
      },
      browser: {
        name: 'Web Browser',
        aliases: ['fetch', 'web'],
        description: 'Browse web content',
        usage: '!browser <url>',
        args: true,
        category: 'tools'
      },
      shorten: {
        name: 'Shorten URL',
        aliases: ['url', 'short'],
        description: 'Shorten a URL',
        usage: '!shorten <url>',
        args: true,
        category: 'tools'
      },
      weather: {
        name: 'Weather',
        aliases: ['climate', 'forecast'],
        description: 'Get weather info',
        usage: '!weather <location>',
        args: true,
        category: 'tools'
      }
    }
  },

  // ===== AUTHENTICATION =====
  auth: {
    name: 'Authentication',
    emoji: '🔐',
    commands: {
      login: {
        name: 'Login',
        aliases: ['signin'],
        description: 'Login to account',
        usage: '!login <email> <password>',
        args: true,
        category: 'auth'
      },
      logout: {
        name: 'Logout',
        aliases: ['signout'],
        description: 'Logout from account',
        usage: '!logout',
        category: 'auth'
      },
      register: {
        name: 'Register',
        aliases: ['signup'],
        description: 'Create new account',
        usage: '!register <email>',
        args: true,
        category: 'auth'
      },
      verify: {
        name: 'Verify',
        aliases: ['confirm', 'verify_code'],
        description: 'Verify account',
        usage: '!verify <code>',
        args: true,
        category: 'auth'
      }
    }
  },

  // ===== INFORMATION & HELP =====
  info: {
    name: 'Information',
    emoji: 'ℹ️',
    commands: {
      help: {
        name: 'Help',
        aliases: ['h', '?', 'assist'],
        description: 'Get help on commands',
        usage: '!help [command]',
        category: 'info'
      },
      menu: {
        name: 'Main Menu',
        aliases: ['mainmenu', 'start'],
        description: 'View main menu',
        usage: '!menu',
        category: 'info'
      },
      about: {
        name: 'About',
        aliases: ['info', 'version', 'bot'],
        description: 'About this bot',
        usage: '!about',
        category: 'info'
      },
      ping: {
        name: 'Ping',
        aliases: ['pong', 'status'],
        description: 'Check bot status',
        usage: '!ping',
        category: 'info'
      },
      uptime: {
        name: 'Uptime',
        aliases: ['online', 'alive'],
        description: 'Check bot uptime',
        usage: '!uptime',
        category: 'info'
      },
      support: {
        name: 'Support',
        aliases: ['contact', 'help'],
        description: 'Get support contact',
        usage: '!support',
        category: 'info'
      },
      terms: {
        name: 'Terms',
        aliases: ['tos', 'terms_of_service'],
        description: 'View terms of service',
        usage: '!terms',
        category: 'info'
      },
      privacy: {
        name: 'Privacy',
        aliases: ['gdpr', 'privacy_policy'],
        description: 'View privacy policy',
        usage: '!privacy',
        category: 'info'
      }
    }
  },

  // ===== OWNER ONLY =====
  owner: {
    name: 'Owner',
    emoji: '👑',
    commands: {
      owner: {
        name: 'Owner Menu',
        aliases: ['om'],
        description: 'View owner commands',
        usage: '!owner',
        category: 'owner'
      },
      eval: {
        name: 'Eval',
        aliases: ['execute', 'exec'],
        description: 'Execute code',
        usage: '!eval <code>',
        args: true,
        category: 'owner'
      },
      restart: {
        name: 'Restart',
        aliases: ['reboot', 'restart_bot'],
        description: 'Restart bot',
        usage: '!restart',
        category: 'owner'
      },
      update: {
        name: 'Update',
        aliases: ['pull', 'upgrade'],
        description: 'Update bot code',
        usage: '!update',
        category: 'owner'
      },
      backup: {
        name: 'Backup',
        aliases: ['save', 'export'],
        description: 'Backup data',
        usage: '!backup',
        category: 'owner'
      },
      logs: {
        name: 'Logs',
        aliases: ['log', 'activity'],
        description: 'View bot logs',
        usage: '!logs [type]',
        category: 'owner'
      }
    }
  }
};

// Helper functions
const CommandRegistry = {
  /**
   * Get all commands
   */
  getAllCommands() {
    const commands = {};
    for (const [catKey, category] of Object.entries(commandRegistry)) {
      for (const [cmdKey, cmd] of Object.entries(category.commands)) {
        commands[cmdKey] = { ...cmd, categoryKey: catKey };
      }
    }
    return commands;
  },

  /**
   * Get category by key
   */
  getCategory(key) {
    return commandRegistry[key];
  },

  /**
   * Get all categories
   */
  getCategories() {
    return commandRegistry;
  },

  /**
   * Find command by name or alias
   */
  findCommand(input) {
    const allCmds = this.getAllCommands();
    
    // Direct match
    if (allCmds[input]) {
      return { key: input, ...allCmds[input] };
    }

    // Alias match
    for (const [key, cmd] of Object.entries(allCmds)) {
      if (cmd.aliases && cmd.aliases.includes(input)) {
        return { key, ...cmd };
      }
    }

    return null;
  },

  /**
   * Get commands by category
   */
  getCommandsByCategory(categoryKey) {
    const category = commandRegistry[categoryKey];
    if (!category) return null;

    return {
      name: category.name,
      emoji: category.emoji,
      commands: category.commands
    };
  },

  /**
   * Create interactive menu for category
   */
  createCategoryInteractiveMenu(categoryKey) {
    const category = this.getCommandsByCategory(categoryKey);
    if (!category) return null;

    const rows = Object.entries(category.commands).map(([key, cmd], idx) => ({
      id: `cmd_${key}`,
      title: `${cmd.name}`,
      description: cmd.description
    }));

    return {
      text: `${category.emoji} *${category.name.toUpperCase()}*\n\nSelect a command:`,
      footer: '━━━━━━ Smart Bot ━━━━━━',
      sections: [{
        title: category.name,
        rows
      }],
      buttonText: 'Select Command',
      title: category.name
    };
  },

  /**
   * Create menu showing ALL available commands organized by category
   * Includes ALL 80+ commands from all handlers
   */
  createAllCommandsMenu() {
    const categories = commandRegistry;
    const sections = Object.entries(categories).map(([catKey, category]) => {
      const rows = Object.entries(category.commands).map(([cmdKey, cmd]) => ({
        id: `${catKey}_${cmdKey}`,
        title: `${cmd.name}${cmd.aliases ? ` (${cmd.aliases.join(', ')})` : ''}`,
        description: cmd.description
      }));
      
      return {
        title: `${category.emoji} ${category.name}`,
        rows
      };
    });

    return {
      text: `📱 *SMART BOT - ALL COMMANDS*\n\nSelect any command to get details and learn how to use it:`,
      footer: '━━━━━━ Smart Bot v2.0 ━━━━━━',
      sections: sections,
      buttonText: 'Select Command',
      title: 'All Commands'
    };
  },

  /**
   * Create main menu with categories (alternative view)
   */
  createMainMenu() {
    const categories = commandRegistry;
    const rows = Object.entries(categories).map(([key, cat]) => ({
      id: `cat_${key}`,
      title: `${cat.emoji} ${cat.name}`,
      description: `${Object.keys(cat.commands).length} commands`
    }));

    return {
      text: `📱 *SMART BOT MAIN MENU*\n\nSelect a category to view commands:`,
      footer: '━━━━━━ Smart Bot v2.0 ━━━━━━',
      sections: [{
        title: 'Categories',
        rows
      }],
      buttonText: 'Browse',
      title: 'Main Menu'
    };
  }
};

module.exports = CommandRegistry;
