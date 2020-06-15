const Discord = require('discord.js');

exports.run = (client, message, args) => {
let kişi = args[0];
if(!kişi) return message.channel.send(`Bir kişi'nin id'sini yazmalısın.`)
let mesaj = args.slice(1).join(' ');
if(!mesaj) return message.channel.send(`Yollamam için bir mesaj yazmalısın.`)
let guild = message.guild;
let kişi2 = message.guild.members.get(kişi)
kişi2.send(mesaj)
message.channel.send(`${kişi2} isimli kişiye başarıyla mesaj gönderildi.\n**Gönderilen mesaj:** ${mesaj}`)
};

exports.conf = {
 enabled: true,
 guildOnly: false,
 aliases: ['mesaj'],
 permLevel: 4
};

exports.help = {
 name: 'mesaj'
};