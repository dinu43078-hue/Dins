const config = require('../config')
const { cmd } = require('../command')

cmd({
    pattern: "anticall",
    alias: ["acall", "rejectcall", "blockcall"],
    desc: "Toggle Anti-Call feature (Owner only)",
    category: "owner",
    react: "📞",
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
            return reply(
                '❌ *OWNER ONLY*\n\n' +
                'මේ command එක භාවිතා කරන්න පුළුවන් *Owner* ට විතරයි.'
            );
        }

        const arg = (q || '').trim().toLowerCase();

        // Status පෙන්වන්න
        if (!arg) {
            const status = (config.ANTI_CALL === true || config.ANTI_CALL === 'true')
                ? '✅ ON'
                : '❌ OFF';

            return reply(
                '╭━━〔 📞 ANTI-CALL 〕━━╮\n' +
                '┃\n' +
                `┃ Status: *${status}*\n` +
                '┃\n' +
                '╰━━━━━━━━━━━━━━━━━━╯\n\n' +
                '*Usage:*\n' +
                '• `.anticall on`\n' +
                '• `.anticall off`\n' +
                '• `.anticall` → current status'
            );
        }

        if (['on', 'true', '1', 'enable', 'yes'].includes(arg)) {
            config.ANTI_CALL = true;
            return reply(
                '✅ *Anti-Call Enabled*\n\n' +
                '📞 දැන් කවුරු හරි bot එකට call කළොත් auto reject වෙනවා.'
            );
        }

        if (['off', 'false', '0', 'disable', 'no'].includes(arg)) {
            config.ANTI_CALL = false;
            return reply(
                '❌ *Anti-Call Disabled*\n\n' +
                '📞 Call reject කිරීම නවත්වලා තියෙනවා.'
            );
        }

        // Toggle (on/off නැතුව command එක දුන්නොත්)
        if (['toggle', 'switch'].includes(arg) || arg === '') {
            // already handled above
        }

        return reply(
            '❌ Invalid option.\n\n' +
            'Use: `.anticall on` හෝ `.anticall off`'
        );

    } catch (error) {
        console.error('[ANTICALL ERROR]', error);
        await reply('❌ Error: ' + (error.message || 'Unknown error'));
    }
});
