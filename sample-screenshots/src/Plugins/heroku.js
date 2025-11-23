const updateHerokuVar = async ({ Cypher, m, reply, isCreator, key, value, setHerokuEnvVar }) => {
  if (!isCreator) return reply("❌ *Only the bot owner can modify this setting.*");
  try {
    await setHerokuEnvVar(key, value);
    reply(`✅ *${key.replace(/_/g, " ")} updated:*\n\`\`\`${key} = ${value.toUpperCase()}\`\`\``);
    reply("🔄 *Bot will restart to apply changes!*");
  } catch (error) {
    reply(`❌ *Error updating ${key.replace(/_/g, " ")}*\n${error.message}`);
  }
};

module.exports = [
  {
    command: ["addvar"],
    operate: async ({ Cypher, m, reply, isCreator, full_args, setHerokuEnvVar }) => {
      if (!isCreator) return;
      const [varName, varValue] = full_args.split("=").map(v => v.trim());
      if (!varName || !varValue) return reply(`*Provide a variable name and value*\n\nExample: .addvar NEW_VAR = value`);
      await updateHerokuVar({ Cypher, m, reply, isCreator, key: varName, value: varValue, setHerokuEnvVar });
    }
  },
  {
    command: ["delvar"],
    operate: async ({ Cypher, m, reply, isCreator, full_args, deleteHerokuEnvVar }) => {
      if (!isCreator) return;
      const varName = full_args.trim();
      if (!varName) return reply("*Provide a variable name to delete*");

      try {
        await deleteHerokuEnvVar(varName);
        reply(`✅ *Environment variable deleted:*\n\`\`\`${varName}\`\`\``);
        reply("🔄 *Bot will restart to apply changes!*");
      } catch (error) {
        reply(`❌ *Error deleting environment variable*\n${error.message}`);
      }
    }
  },
  {
    command: ["anticall"],
    operate: async ({ Cypher, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Specify on/off*\n\nExample: .anticall on");
      const value = text.trim().toLowerCase();
      if (!["on", "off"].includes(value)) return reply("❌ *Invalid input. Use 'on' or 'off'*");
      await updateHerokuVar({ Cypher, m, reply, isCreator, key: "ANTI_CALL", value: value === "on" ? "true" : "false", setHerokuEnvVar });
    }
  },
  {
    command: ["alwaysonline"],
    operate: async ({ Cypher, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Specify on/off*\n\nExample: .alwaysonline on");
      const value = text.trim().toLowerCase();
      if (!["on", "off"].includes(value)) return reply("❌ *Invalid input. Use 'on' or 'off'*");
      await updateHerokuVar({ Cypher, m, reply, isCreator, key: "ALWAYS_ONLINE", value: value === "on" ? "true" : "false", setHerokuEnvVar });
    }
  },
  {
    command: ["antidelete"],
    operate: async ({ Cypher, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Specify the antidelete mode*\n\nExample: .antidelete private");
      const mode = text.trim().toLowerCase();
      const validModes = ["private", "chat", "off"];
      if (!validModes.includes(mode)) return reply("❌ *Invalid mode. Use 'private', 'chat', or 'off'*");
      await updateHerokuVar({ Cypher, m, reply, isCreator, key: "ANTIDELETE", value: mode, setHerokuEnvVar });
    }
  },
  {
    command: ["chatbot"],
    operate: async ({ Cypher, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Specify on/off*\n\nExample: .chatbot on");
      const value = text.trim().toLowerCase();
      if (!["on", "off"].includes(value)) return reply("❌ *Invalid input. Use 'on' or 'off'*");
      await updateHerokuVar({ Cypher, m, reply, isCreator, key: "CHATBOT", value: value === "on" ? "true" : "false", setHerokuEnvVar });
    }
  },
  {
    command: ["mode"],
    operate: async ({ Cypher, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Specify the mode*\n\nExample: .mode private");
      const mode = text.trim().toLowerCase();
      if (!["private", "public"].includes(mode)) return reply("❌ *Invalid mode. Use 'private' or 'public'*");
      await updateHerokuVar({ Cypher, m, reply, isCreator, key: "MODE", value: mode, setHerokuEnvVar });
    }
  },
  {
    command: ["setbotname"],
    operate: async ({ Cypher, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Provide a bot name*\n\nExample: .setbotname CypherX");
      await updateHerokuVar({ Cypher, m, reply, isCreator, key: "BOT_NAME", value: text.trim(), setHerokuEnvVar });
    }
  },
  {
    command: ["setprefix"],
    operate: async ({ Cypher, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Provide a prefix*\n\nExample: .setprefix !");
      await updateHerokuVar({ Cypher, m, reply, isCreator, key: "PREFIX", value: text.trim(), setHerokuEnvVar });
    }
  },
  {
    command: ["setsudo"],
    operate: async ({ Cypher, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Provide one or more sudo numbers*\n\nExample: .setsudo 1234567890");
      await updateHerokuVar({ Cypher, m, reply, isCreator, key: "SUDO", value: text.trim(), setHerokuEnvVar });
    }
  },
  {
    command: ["welcome"],
    operate: async ({ Cypher, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Specify on/off*\n\nExample: .welcome on");
      const value = text.trim().toLowerCase();
      if (!["on", "off"].includes(value)) return reply("❌ *Invalid input. Use 'on' or 'off'*");
      await updateHerokuVar({ Cypher, m, reply, isCreator, key: "WELCOME_MSG", value: value === "on" ? "true" : "false", setHerokuEnvVar });
    }
  }
];