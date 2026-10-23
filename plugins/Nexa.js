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

        // Image එක Buffer විදිහට download කරනවා
        const res = await fetch('https://files.catbox.moe/18xnev.jpg')
        const buffer = Buffer.from(await res.arrayBuffer())

        await conn.sendMessage(from, {
            image: buffer,
            caption: `*┏━━━━━━━━━━━┓*
*┃⚡ ɴᴇxᴀ ʙᴏᴛ ⚡┃*
*┗━━━━━━━━━━━┛*

*✅ Status    : Online*
*⏱️ Runtime   : ${runtime}*
*👑 Owner     : NEXA*
*⚡ Powered   : NEXA Dx*

*┌─────────────┐*
*│Where Worlds Connect│*
*└─────────────┘*`
        }, { quoted: mek })
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})
