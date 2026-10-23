const config = require('../config')
const { cmd, commands } = require('../command')

cmd({
    pattern: "alive",
    alias: ["bot", "online"],
    desc: "Check if bot is alive.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const uptime = process.uptime()
        const hours = Math.floor(uptime / 3600)
        const minutes = Math.floor((uptime % 3600) / 60)
        const seconds = Math.floor(uptime % 60)
        const runtime = `${hours}h ${minutes}m ${seconds}s`

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/18xnev.jpg' },
            caption: `*┏━━━━━━━━━━━━┓*
*┃  ⚡ ɴᴇxᴀ ʙᴏᴛ ⚡  ┃*
*┗━━━━━━━━━━━━┛*

*✅ Status    : ΛᑕƬIVΣ*
*⏱️ Runtime   : ${runtime}*
*👑 Owner     : ПΣXΛ*
*⚡ Powered   : ПΣXΛ DX*

*┌──────────────┐*
*│Where Worlds Connect │*
*└──────────────┘*`
        }, { quoted: mek })
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})
