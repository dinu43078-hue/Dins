const config = require('../config')
const { cmd } = require('../command')

cmd({
    pattern: "settings",
    alias: ["setting", "botsettings", "config"],
    desc: "View / change bot settings",
    category: "owner",
    react: "⚙️",
    filename: __filename
},
async (conn, mek, m, {
    from,
    q,
    isOwner,
    reply
}) => {
    try {
        if (!isOwner) {
            return reply('❌ *OWNER ONLY*\n\nමේ command එක භාවිතා කරන්න පුළුවන් Owner ට විතරයි.');
        }

        const args = q ? q.trim().split(/\s+/) : [];
        const option = (args[0] || '').toLowerCase();
        const value = (args[1] || '').toLowerCase();

        // ========== SHOW ALL SETTINGS ==========
        if (!option) {
            const status = (v) => v ? '✅ ON' : '❌ OFF';

            return reply(
                '╭━━〔 ⚙️ BOT SETTINGS 〕━━╮\n' +
                '┃\n' +
                `┃ 📖 Auto Read Status : ${status(config.AUTO_READ_STATUS)}\n` +
                `┃ ❤️ Auto React       : ${status(config.AUTO_REACT)}\n` +
                `┃ ⌨️ Auto Typing      : ${status(config.AUTO_TYPING)}\n` +
                `┃ 🔤 Prefix           : \`${config.PREFIX}\`\n` +
                '┃\n' +
                '╰━━━━━━━━━━━━━━━━━━╯\n\n' +
                '*Change Settings:*\n' +
                '• `.settings autoread on/off`\n' +
                '• `.settings autoreact on/off`\n' +
                '• `.settings autotyping on/off`\n' +
                '• `.settings prefix <symbol>`\n\n' +
                '⚡ *Powered by NEXA System*'
            );
        }

        // ========== TOGGLE HELPERS ==========
        const parseBool = (val) => {
            if (['on', 'true', '1', 'yes', 'enable'].includes(val)) return true;
            if (['off', 'false', '0', 'no', 'disable'].includes(val)) return false;
            return null;
        };

        // ========== AUTO READ STATUS ==========
        if (['autoread', 'readstatus', 'autostatus'].includes(option)) {
            const bool = parseBool(value);
            if (bool === null) {
                return reply('❌ Use: `.settings autoread on` හෝ `.settings autoread off`');
            }
            config.AUTO_READ_STATUS = bool;
            return reply(`✅ *Auto Read Status* → ${bool ? 'ON' : 'OFF'}`);
        }

        // ========== AUTO REACT ==========
        if (['autoreact', 'react', 'autoreaction'].includes(option)) {
            const bool = parseBool(value);
            if (bool === null) {
                return reply('❌ Use: `.settings autoreact on` හෝ `.settings autoreact off`');
            }
            config.AUTO_REACT = bool;
            return reply(`✅ *Auto React* → ${bool ? 'ON' : 'OFF'}`);
        }

        // ========== AUTO TYPING ==========
        if (['autotyping', 'typing', 'type'].includes(option)) {
            const bool = parseBool(value);
            if (bool === null) {
                return reply('❌ Use: `.settings autotyping on` හෝ `.settings autotyping off`');
            }
            config.AUTO_TYPING = bool;
            return reply(`✅ *Auto Typing* → ${bool ? 'ON' : 'OFF'}`);
        }

        // ========== PREFIX ==========
        if (['prefix', 'setprefix'].includes(option)) {
            if (!value) {
                return reply('❌ Use: `.settings prefix .`  හෝ  `.settings prefix !`');
            }
            config.PREFIX = value;
            return reply(`✅ *Prefix* changed to → \`${value}\``);
        }

        // ========== UNKNOWN ==========
        return reply(
            '❌ Unknown setting.\n\n' +
            '*Available:*\n' +
            '• autoread\n' +
            '• autoreact\n' +
            '• autotyping\n' +
            '• prefix'
        );

    } catch (error) {
        console.error('[SETTINGS ERROR]', error);
        await reply('❌ Settings error: ' + (error.message || 'Unknown'));
    }
});


// ===== AUTO READ STATUS =====
cmd({
    pattern: "autoread",
    alias: ["readstatus", "autostatus"],
    desc: "Toggle auto read status",
    category: "owner",
    react: "📖",
    filename: __filename
},
async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply('❌ Owner only.');
    config.AUTO_READ_STATUS = !config.AUTO_READ_STATUS;
    reply(`📖 *Auto Read Status* → ${config.AUTO_READ_STATUS ? '✅ ON' : '❌ OFF'}`);
});

// ===== AUTO REACT =====
cmd({
    pattern: "autoreact",
    alias: ["areact"],
    desc: "Toggle auto react",
    category: "owner",
    react: "❤️",
    filename: __filename
},
async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply('❌ Owner only.');
    config.AUTO_REACT = !config.AUTO_REACT;
    reply(`❤️ *Auto React* → ${config.AUTO_REACT ? '✅ ON' : '❌ OFF'}`);
});

// ===== AUTO TYPING =====
cmd({
    pattern: "autotyping",
    alias: ["typing"],
    desc: "Toggle auto typing",
    category: "owner",
    react: "⌨️",
    filename: __filename
},
async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply('❌ Owner only.');
    config.AUTO_TYPING = !config.AUTO_TYPING;
    reply(`⌨️ *Auto Typing* → ${config.AUTO_TYPING ? '✅ ON' : '❌ OFF'}`);
});
