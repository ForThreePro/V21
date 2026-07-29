import db from "#db"
export default {
  command: ['todos', 'all', 'tagall'],
  category: 'grupo',
  isAdmin: true,
  run: async ({ msg, sock, args }) => {
    const groupMetadata = msg.isGroup ? await sock.groupMetadata(msg.chat).catch(() => null) : null
    if (!groupMetadata) return msg.reply('《✤》 Este comando solo es para grupos')
    
    const groupParticipants = groupMetadata?.participants || []
    const mentions = groupParticipants.map(p => sock.decodeJid(p.id)).filter(Boolean)

    let texto = args.join(' ')
    if(!texto) texto = `《✤》 ATENCIÓN A TODOS《✤》`

    await msg.react('📢')

    try {
      // Anti-ban: dividir en partes de 100
      if(mentions.length > 100){
        const part1 = mentions.slice(0, 100)
        const part2 = mentions.slice(100)
        await sock.sendMessage(msg.chat, { text: texto, mentions: part1 }, { quoted: null })
        await new Promise(r => setTimeout(r, 3000))
        return sock.sendMessage(msg.chat, { text: texto, mentions: part2 }, { quoted: null })
      }

      return sock.sendMessage(msg.chat, { text: texto, mentions }, { quoted: null })

    } catch (e) {
      console.log(e)
      return msg.reply(global.msgglobal)
    }
  }
}