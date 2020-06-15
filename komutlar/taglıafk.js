const discord = require('discord.js');
exports.run = async (client, msg, args) => {
   if (!args[0]) return msg.channel.send({embed: {
       color: Math.floor(Math.random() * (0xFFFFFF + 1)),
       description: (`:no_entry_sign:AFK nedenini gir.`)
 }});
  let name = msg.author.username
  if(msg.author.username.startsWith("[AFK]")){
    msg.reply("Zaten AFK'sın.")
  }
  else {
            var e = new discord.RichEmbed()
         
        .setColor("RANDOM")
        .setAuthor("AFK MODU!")
        .setDescription(`<@${msg.author.id}> Başarı İle Afk Modundan Giriş Yaptın!<a:ok:589407612227944461> `)
       msg.channel.send(e).then(msg => msg.delete(5000));

     msg.member.setNickname(`[AFK]${msg.author.username}`);
  }  
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  kategori: 'kullanıcı'
};

exports.help = {
  name: 'afk',
  description: 'Afk Olduğunuzu Tag ekleyerek Gösterir',
  usage: 'afk <sebep>'
};