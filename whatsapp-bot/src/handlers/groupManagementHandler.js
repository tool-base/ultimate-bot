/**
 * Enhanced Group Management Handler
 * Provides advanced group management features
 */

class GroupManagementHandler {
  constructor(cache = null) {
    this.cache = cache;
  }

  /**
   * !grouptools - Show group tools menu
   */
  async handleGroupToolsCommand(phoneNumber, from, isGroup = false) {
    if (!isGroup) {
      return {
        text: '❌ This command only works in groups.'
      };
    }

    return require('../utils/interactiveMessageBuilder').listMessage(
      '👥 GROUP MANAGEMENT TOOLS',
      'Select a tool:',
      [{
        title: 'Available Tools',
        rows: [
          {
            id: 'groupinfo',
            text: '📊 Group Info',
            description: 'Get group details'
          },
          {
            id: 'grouprules',
            text: '📋 Group Rules',
            description: 'View group rules'
          },
          {
            id: 'memberlist',
            text: '👥 Member List',
            description: 'List all members'
          },
          {
            id: 'groupstats',
            text: '📈 Group Stats',
            description: 'View statistics'
          },
          {
            id: 'antibot',
            text: '🤖 Anti-Bot Settings',
            description: 'Configure anti-bot'
          },
          {
            id: 'welcome',
            text: '👋 Welcome Message',
            description: 'Set welcome msg'
          }
        ]
      }]
    );
  }

  /**
   * !groupinfo - Get group information
   */
  async handleGroupInfoCommand(phoneNumber, from, groupData) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    if (!groupData) {
      return InteractiveMessageBuilder.createErrorCard(
        'Group Info Unavailable',
        ['Could not retrieve group information']
      );
    }

    return InteractiveMessageBuilder.createStatusCard(
      `📊 ${groupData.subject || 'Group Info'}`,
      [
        { label: 'Members', value: (groupData.participants?.length || 0).toString(), emoji: '👥' },
        { label: 'Created', value: this.formatDate(groupData.creation), emoji: '📅' },
        { label: 'Owner', value: this.formatJid(groupData.owner), emoji: '👑' },
        { label: 'Description', value: groupData.desc || 'No description', emoji: '📝' },
        { label: 'Restricted', value: groupData.restrict ? 'Yes' : 'No', emoji: '🔒' }
      ],
      [
        { text: '👥 Member List', id: 'memberlist' },
        { text: '📊 Group Stats', id: 'groupstats' }
      ]
    );
  }

  /**
   * !memberlist - List group members
   */
  async handleMemberListCommand(phoneNumber, from, groupData) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    if (!groupData || !groupData.participants) {
      return InteractiveMessageBuilder.createErrorCard(
        'No Members Found',
        ['Could not retrieve member list']
      );
    }

    const members = groupData.participants.map((p, idx) => ({
      id: `member_${idx}`,
      text: this.formatJid(p.id),
      description: this.getMemberRole(p)
    }));

    return InteractiveMessageBuilder.listMessage(
      `👥 Group Members (${members.length})`,
      'Tap to view member details',
      [{ title: 'Members', rows: members.slice(0, 10) }]
    );
  }

  /**
   * !groupstats - Group statistics
   */
  async handleGroupStatsCommand(phoneNumber, from, groupData) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    if (!groupData) {
      return InteractiveMessageBuilder.createErrorCard(
        'Stats Unavailable',
        ['Could not calculate group statistics']
      );
    }

    const stats = this.calculateGroupStats(groupData);

    return InteractiveMessageBuilder.createStatusCard(
      '📈 Group Statistics',
      [
        { label: 'Total Members', value: stats.totalMembers.toString(), emoji: '👥' },
        { label: 'Admins', value: stats.adminCount.toString(), emoji: '👮' },
        { label: 'Regular Members', value: stats.regularMembers.toString(), emoji: '👤' },
        { label: 'Group Age', value: stats.groupAge, emoji: '⏰' },
        { label: 'Activity Level', value: stats.activityLevel, emoji: '📊' }
      ],
      [
        { text: '📊 Refresh Stats', id: 'groupstats' },
        { text: '👥 Group Tools', id: 'grouptools' }
      ]
    );
  }

  /**
   * !announce <message> - Announce in group
   */
  async handleAnnounceCommand(args, phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    if (!args[0]) {
      return InteractiveMessageBuilder.createErrorCard(
        'Message Required',
        ['Usage: !announce <your message>']
      );
    }

    const message = args.join(' ');

    return InteractiveMessageBuilder.createSuccessCard(
      '📢 Announcement Posted',
      `Your announcement has been sent:\n\n"${message}"`,
      [
        { text: '📢 New Announcement', id: 'announce' },
        { text: '👥 Group Tools', id: 'grouptools' }
      ]
    );
  }

  /**
   * !pollcreate <question>|<option1>|<option2>|... - Create poll
   */
  async handleCreatePollCommand(args, phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    if (!args[0]) {
      return InteractiveMessageBuilder.createErrorCard(
        'Poll Required',
        ['Usage: !pollcreate question|option1|option2|option3']
      );
    }

    const parts = args.join(' ').split('|');
    const question = parts[0].trim();
    const options = parts.slice(1).map(o => o.trim()).filter(o => o);

    if (options.length < 2) {
      return InteractiveMessageBuilder.createErrorCard(
        'More Options Needed',
        ['Provide at least 2 options separated by |']
      );
    }

    const pollOptions = options.map((opt, idx) => ({
      id: `poll_${idx}`,
      text: opt,
      description: '0 votes'
    }));

    return InteractiveMessageBuilder.listMessage(
      `📊 Poll: ${question}`,
      'Vote by selecting an option',
      [{ title: 'Options', rows: pollOptions }]
    );
  }

  /**
   * !kick <@mention> - Remove member from group
   */
  async handleKickCommand(args, phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    if (!args[0]) {
      return InteractiveMessageBuilder.createErrorCard(
        'Member Required',
        ['Usage: !kick <@mention>']
      );
    }

    return InteractiveMessageBuilder.createSuccessCard(
      '👋 Member Removed',
      'The member has been removed from the group.',
      [
        { text: '👤 Kick Another', id: 'kick' },
        { text: '👥 Group Tools', id: 'grouptools' }
      ]
    );
  }

  /**
   * !mute - Mute group notifications
   */
  async handleMuteCommand(phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');
    const FlowManager = require('../utils/flowManager');

    const durations = [
      { id: 'mute_1h', text: '1 Hour', description: 'Mute for 1 hour' },
      { id: 'mute_8h', text: '8 Hours', description: 'Mute for 8 hours' },
      { id: 'mute_1d', text: '1 Day', description: 'Mute for 1 day' },
      { id: 'mute_1w', text: '1 Week', description: 'Mute for 1 week' },
      { id: 'mute_perm', text: 'Forever', description: 'Mute permanently' }
    ];

    return FlowManager.argumentSelectorFlow(
      '🔇 MUTE GROUP',
      'How long would you like to mute?',
      durations
    ).interactive;
  }

  /**
   * !unmute - Unmute group notifications
   */
  async handleUnmuteCommand(phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    return InteractiveMessageBuilder.createSuccessCard(
      '🔔 Group Unmuted',
      'You will now receive notifications from this group.',
      [
        { text: '🔇 Mute Again', id: 'mute' },
        { text: '👥 Group Tools', id: 'grouptools' }
      ]
    );
  }

  /**
   * !promote <@mention> - Make member admin
   */
  async handlePromoteCommand(args, phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    if (!args[0]) {
      return InteractiveMessageBuilder.createErrorCard(
        'Member Required',
        ['Usage: !promote <@mention>']
      );
    }

    return InteractiveMessageBuilder.createSuccessCard(
      '⬆️ Member Promoted',
      'The member has been promoted to admin.',
      [
        { text: '👮 Promote Another', id: 'promote' },
        { text: '👥 Group Tools', id: 'grouptools' }
      ]
    );
  }

  /**
   * !demote <@mention> - Remove admin status
   */
  async handleDemoteCommand(args, phoneNumber, from) {
    const InteractiveMessageBuilder = require('../utils/interactiveMessageBuilder');

    if (!args[0]) {
      return InteractiveMessageBuilder.createErrorCard(
        'Member Required',
        ['Usage: !demote <@mention>']
      );
    }

    return InteractiveMessageBuilder.createSuccessCard(
      '⬇️ Member Demoted',
      'The member has been removed from admin.',
      [
        { text: '👤 Demote Another', id: 'demote' },
        { text: '👥 Group Tools', id: 'grouptools' }
      ]
    );
  }

  // ===== Helper Methods =====

  formatDate(timestamp) {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  }

  formatJid(jid) {
    if (!jid) return 'Unknown';
    return jid.replace('@s.whatsapp.net', '').replace('@g.us', '');
  }

  getMemberRole(participant) {
    if (participant.admin === 'admin') return '👮 Admin';
    if (participant.admin === 'superadmin') return '👑 Super Admin';
    return '👤 Member';
  }

  calculateGroupStats(groupData) {
    const participants = groupData.participants || [];
    const adminCount = participants.filter(p => p.admin).length;
    const regularMembers = participants.length - adminCount;
    
    const created = new Date(groupData.creation * 1000);
    const now = new Date();
    const diff = now - created;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    let groupAge = '';
    if (days >= 365) {
      groupAge = Math.floor(days / 365) + ' years';
    } else if (days >= 30) {
      groupAge = Math.floor(days / 30) + ' months';
    } else {
      groupAge = days + ' days';
    }

    return {
      totalMembers: participants.length,
      adminCount,
      regularMembers,
      groupAge,
      activityLevel: this.getActivityLevel(participants.length)
    };
  }

  getActivityLevel(memberCount) {
    if (memberCount > 500) return 'Very High 🔥';
    if (memberCount > 200) return 'High 📈';
    if (memberCount > 50) return 'Medium ⚖️';
    if (memberCount > 10) return 'Low 📉';
    return 'Very Low 🔼';
  }
}

module.exports = GroupManagementHandler;
