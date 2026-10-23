const config = require('../config')
const { cmd, commands } = require('../command')
const fs = require('fs')
const path = require('path')

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

        // Local image path (ඔයා image එක දාපු තැනට අනුව මේ path එක වෙනස් කරන්න)
        const imgPath = path.join(__dirname, 'alive.jpg')   // plugin එකත් එක්කම folder එකේ තියෙනවා නම්
        // const imgPath = path.join(__dirname, '../media/alive.jpg')  // media folder එකේ තියෙනවා නම් මේක use කරන්න

        if (!fs.existsSync(imgPath)) {
            return reply('❌ alive.jpg image එක හොයාගන්න බෑ. Path එක චෙක් කරන්න.')
        }

        await conn.sendMessage(from, {
            image: fs.readFileSync(imgPath),
            caption: `*┏━━━━━━━━━━━━━━━┓*
*┃  ⚡ ɴᴇxᴀ ʙᴏᴛ ⚡  ┃*
*┗━━━━━━━━━━━━━━━┛*

*✅ Status    : Online*
*⏱️ Runtime   : ${runtime}*
*👑 Owner     : NEXA*
*⚡ Powered   : NEXA System*

*┌─────────────────┐*
*│  Where Worlds Connect  │*
*└─────────────────┘*`
        }, { quoted: mek })
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})
