const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const keep_alive = require('./keep_alive.js');
const db = require('quick.db');

require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};


client.on('message', msg => {
  if (msg.content.toLowerCase() === 'sa') {
    msg.reply('Aleyküm selam,  hoş geldin');
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === '!ip') {
    msg.delete();
    msg.channel.send('<a:fire:691775654601031700> Consola : connect alwaysroleplay.4cloudgame.net:27015  <a:fire:691775654601031700>');
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === '!aktif') {
    if(!msg.member.hasPermission('ADMINISTRATOR')) return msg.channel.send("**Bu Komutu Kullanmak için yetkin yok !**")
    msg.delete();
    msg.channel.send('<a:fire:691775654601031700> SUNUCU AKTİF <a:fire:691775654601031700>\n<a:fire:691775654601031700> Consola : connect alwaysroleplay.4cloudgame.net:27015 <a:fire:691775654601031700>\n<a:fire:691775654601031700> TS3: alwayshogwarts <a:fire:691775654601031700>');
    msg.channel.send("@everyone")
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === '!bakım') {
    if(!msg.member.hasPermission('ADMINISTRATOR')) return msg.channel.send("**Bu Komutu Kullanmak için yetkin yok !**")
    msg.delete();
    msg.channel.send(' <a:fire:691775654601031700> Sunucu Kısa Süreliğine Bakıma Alınmıştır. Bitince Duyuru Geçilir. <a:fire:691775654601031700> ```');
    msg.channel.send("@everyone")
  }
});


client.on('message', msg => {
  if (msg.content.toLowerCase() === '!kayıtol') {
    msg.channel.send('<@&689478164233322524> <@&689478165122646139> Lütfen kayıt kanalına geliniz.');
  }
});


client.on('message', msg => {
  if (msg.content.toLowerCase() === '!ts3') {
    msg.delete();
    msg.channel.send('<a:fire:691775654601031700> alwayshogwarts <a:fire:691775654601031700>');
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === '!destek') {
    msg.delete();
    msg.channel.send('<@&689478165914976282> Destek kanalındayız lütfen bizim ile ilgilenirmisiniz. ');
  }
});


client.on('message', msg => {
 var moment = require('moment-timezone');
  if (msg.content.toLowerCase() === '!giriş') {
     if(!msg.member.roles.has("720965731973595136")) return msg.channel.send('**Yetkili - Seherbaz - Profesör - Rol Sahibi - Karanlık Tarafa Sahip değilsin. \n  Giriş-Çıkış Rolüne sahip olman gerekiyor.**')
    msg.delete();
    var zaman = new Date();
   let saat = moment().tz("Europe/Istanbul").format('HH:mm:ss');
    msg.reply(` **Always Hogwarts Sunucumuza ${saat} saatinde giriş yaptınız.** `);
    let süre = Date.now()
    db.set(`süre_${msg.author.id}_${msg.guild.id}`, süre);
  }
});


/*client.on('message', msg => {
 var moment = require('moment-timezone');
  if (msg.content.toLowerCase() === '!çıkış') {
    msg.delete();
    var zaman = new Date();
   let saat = moment().tz("Europe/Istanbul").format('HH:mm:ss');
    msg.reply(` Oyun'dan ${saat} saatin'de ÇIKIŞ yaptınız. `);
  }
});*/

client.on('message', async msg => {
if (msg.content.toLowerCase() === '!çıkış') {
  if(!msg.member.roles.has("720965731973595136")) return msg.channel.send('**Yetkili - Seherbaz - Profesör - Rol Sahibi - Karanlık Tarafa Sahip değilsin. \n  Giriş-Çıkış Rolüne sahip olman gerekiyor.**')
    msg.delete();
  var moment = require('moment-timezone');
  var girissuresi = await db.fetch(`süre_${msg.author.id}_${msg.guild.id}`);
  if (girissuresi) {
    let süre = await db.fetch(`süre_${msg.author.id}_${msg.guild.id}`);
    let zaman = moment().tz("Europe/Istanbul").format('HH:mm:ss');
    let simdi = Date.now();
    let timeObj = simdi - süre;

    var gün = Math.floor(timeObj / (1000 * 60 * 60 * 24));
    var saat = Math.floor((timeObj % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var dakika = Math.floor((timeObj % (1000 * 60 * 60)) / (1000 * 60));
    var saniye = Math.floor((timeObj % (1000 * 60)) / 1000);
    
    msg.reply(`**Saat:**  **${zaman}**  ** Oyundan çıkış yaptınız.**\n **Oyun'da geçirdiğiniz süre :** **${gün}** **Gün** , **${saat}** **Saat** , **${dakika}** **Dakika** , **${saniye}** **Saniye.** `);
  }
}
});






client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("MOVE_MEMBERS")) permlvl = 1;
  if (message.member.hasPermission("MANAGE_ROLES")) permlvl = 2;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 3;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 4;
  if (message.author.id === ayarlar.sahip) permlvl = 5;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });









client.login(ayarlar.token);

client.on('guildMemberAdd', (member) => {
    const guild = member.guild;


 let sChannel = member.guild.channels.find(c => c.name === '💠┇bot-koruma')

    if(member.user.bot !==true){

    } 
    else {

    sChannel.send(`**Kaovi Koruma Sistemi**
Sunucuya Bir Bot Eklendi Ve Güvenlik Nedeniyle Banlandı
Banlanan Bot: **${member.user.tag}**
@everyone`)
    .then(() => console.log(`yasaklandı ${member.displayName}`))
    .catch(console.error);
       member.ban(member) 
  }  
  });



client.on("message", message => {
    if (message.channel.type === "💠┇bot-dm") {
        if (message.author.bot) return;
        const dmlog = new Discord.RichEmbed()
         .setTitle(`${client.user.username}'a Özelden Mesaj Gönderildi!`)
         .setColor('RANDOM')
         .addField('Mesajı Gönderen',` \`\`\` ${message.author.tag} \`\`\` `)
         .addField('Mesajı Gönderenin ID', ` \`\`\`${message.author.id}\`\`\` `)
         .addField(`Gönderilen Mesaj`, message.content)
         .setThumbnail(message.author.avatarURL) 
    client.channels.get("689478344965619713").send(dmlog);
    }
});




const invites = {};

const wait = require('util').promisify(setTimeout);

client.on('ready', () => {

  wait(1000);

  client.guilds.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});


client.on('guildMemberAdd', async member => {
  member.guild.fetchInvites().then(guildInvites => {
    const ei = invites[member.guild.id];
    invites[member.guild.id] = guildInvites;
    let invite = guildInvites.find(i => ei.get(i.code).uses < i.uses)
    let davetçi = client.users.get(invite.inviter.id);
    let user = client.users.get(member.id);
    var kanal = member.guild.channels.get('689478244721754224')
    var sayi = member.guild.memberCount
       const kurulus = new Date().getTime() - user.createdAt.getTime();
       const gün = moment.utc(user.createdAt).format('DD')
    var kontrol;
      if (kurulus > 2629800000) {
            const exampleEmbed = new Discord.RichEmbed()
	.setColor('#0099ff')
    .setDescription(`**<a:patlyoz:691775700113424384>Hoşgeldin,** <@${member.id}> **Seninle beraber** ${sayi} **kişiyiz!**\n**<a:patlyoz:691775704315985970>Kaydının yapılması için sesli odaya gelmelisin.**\n**<a:patlyoz:691775654273875998>Kayıt sorumluları senin ile ilgilenicektir.**<@&689478165122646139> <@&689478164233322524>\n<a:patlyoz:691775577602129970> <#689478270374510629> <#690261929494839372>**Kanalından kuralları okumuş sayılacaksınız.**\n<a:patlyoz:691775654601031700> <@${member.id}>**Adlı kişiyi davet eden; <@${davetçi.id}> \`\`${invite.uses}\`\` adet daveti var.**\n**<a:patlyoz:691775623953383486>Hesap Güvenilir Mi ? : GÜVENLİ  <a:patlyoz:691775576981372998>**  `)
    kanal.send(exampleEmbed);
  
        
      } else {

    const exampleEmbed = new Discord.RichEmbed()
	.setColor('#0099ff')
    .setDescription(`**<a:patlyoz:691775700113424384>Hoşgeldin**, <@${member.id}> **Seninle beraber** ${sayi} **kişiyiz**!\n**<a:patlyoz:691775704315985970>Kaydının yapılması için sesli odaya gelmelisin.**\n**<a:patlyoz:691775654273875998>Kayıt sorumluları senin ile ilgilenicektir.**<@&689478165122646139> <@&689478164233322524>\n<a:patlyoz:691775577602129970> <#689478270374510629> <#690261929494839372>**Kanalından kuralları okumuş sayılacaksınız.**\n<a:patlyoz:691775654601031700> <@${member.id}>**Adlı kişiyi davet eden; <@${davetçi.id}>  \`\`${invite.uses}\`\` adet daveti var.**\n**<a:patlyoz:691775623953383486>Hesap Güvenilir Mi ? : TEHLİKELİ  <a:patlyoz:691775576637309000>** `)
    kanal.send(exampleEmbed);
  
      } 
    
})
  
});

client.on("message", (message) => {
  if (message.content.toLowerCase().startsWith(prefix + `skyardım`)) {
    const desteksohbet = message.guild.channels.find(channel => channel.name === "📢sk-bildirim📢");
    const destekekip = message.guild.roles.find("name", "💠 Staff")
    const embed = new Discord.RichEmbed()
    .setTitle(`:mailbox_with_mail: **ALWAYS Roleplay Discord SK Sistemi** :mailbox_with_mail:`)
    .setColor("RANDOM")
    .addField(`SK Yardım`, `**[${prefix}skaç]()** -> SK Açar!\n**[${prefix}skkapat]()** -> SK kapatır!`)
    .addField(`Diğer`, `**[${prefix}skyardım]()** -> Yardım menüsünü gösterir.`)
    .setThumbnail(`https://cdn.discordapp.com/attachments/691714684042084443/692801063899889825/always_simge_logo-01.jpg`)
    .setFooter(`Kaovi & seindleR`,`${message.author.avatarURL}`)
    message.channel.send({ embed: embed });
  }

if (message.content.toLowerCase().startsWith(prefix + `skaç`)) {
    const taleps = message.author
    const desteksohbet = message.guild.channels.find(channel => channel.name === "📢sk-bildirim📢");
    const destekekip = message.guild.roles.find("name", "💠 Staff")
    const reason = message.content.split(" ").slice(1).join(" ");
    if (!message.guild.roles.exists("name", "💠 Staff")) return message.channel.send(`Bu Sunucuda '**💠 Staff**' rolünü bulamadım bu yüzden SK açamıyorum \nEğer sunucu sahibiysen, 💠 Staff Rolünü oluşturabilirsin.`);
    if (message.guild.channels.exists("name", "sk-" + `${taleps.username}`)) return message.channel.send(`**Zaten bir SK açmışsın !**`)
    message.guild.createChannel(`sk-${taleps.username}`, "text").then(c => {
       c.setParent(message.guild.channels.find(channel => channel.name === "|📢|SK Kanalları|📢|"));
        let role = message.guild.roles.find("name", "💠 Staff");
        let role2 = message.guild.roles.find("name", "@everyone");
        c.overwritePermissions(role, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        c.overwritePermissions(role2, {
            SEND_MESSAGES: false,
            READ_MESSAGES: false
        });
        c.overwritePermissions(message.author, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        message.channel.send(`:white_check_mark: SK Kanalın oluşturuldu, ${c}.`).then(msg => msg.delete(5000));
        const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .addField(`Hey ${taleps.username}!`, `SK Kanalın başarılı bir şekilde açıldı ${destekekip.name}'a haber gönderdim. Yakında seninle iletişime geçecekler.'`)
        .addField(`**Eğer talebini sonlandırmak istersen ${prefix}skkapat yazarak**`, `**ve daha sonrasında kapat yazarak SK talebini kapatabilirsin.**`)
        .setFooter("Always Roleplay SK Sistemi")
        c.send({ embed: embed });
        message.delete();
      desteksohbet.send(`${destekekip}`).then(msg => msg.delete(120000));
        const acildimesaj = new Discord.RichEmbed()
        .setColor("BLUE")
        .addField(`**Yeni bir SK açıldı ;**`, `**${c}**`);
       desteksohbet.send(acildimesaj).then(msg => msg.delete(120000));
    }).catch(console.error);
}
if (message.content.toLowerCase().startsWith(prefix + `skkapat`)) {
    const taleps = message.author
    const sklogkanal = message.guild.channels.find(channel => channel.name === "📢sk-log📢");
    const desteksohbet = message.guild.channels.find(channel => channel.name === "📢sk-bildirim📢");
    const destekekip = message.guild.roles.find("name", "💠 Staff")
    const kapkanalid = message.channel.id
    const kapkanalname = message.channel.name
    if (!message.channel.name.startsWith(`sk-`)) return message.channel.send(`Bu komutu kullanamazsın SK kanalında olman gerekir.`).then(msg => msg.delete(5000));

    message.channel.send(`Destek Kanalını kapatmaya emin misin? kapatmak için **kapat** yazman yeterli.`)
    .then((m) => {
      message.channel.awaitMessages(response => response.content === 'kapat', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
      .then((collected) => {
          message.channel.delete();        
        const sklog = new Discord.RichEmbed()
      .setColor("RED")
      .setTitle(`${taleps.username} tarafından bir SK kapatıldı`)
      .addField(`Kapatılan Talebin ID ;`,`${kapkanalid}`)
      .addField(`Kapatılan Talebin Adı ;`,`${kapkanalname}`)
      .addField(`Kapatan Kişinin ID ;`,`${taleps.id}`)
      .addField(`Kapatan Kişinin Adı ;`,`${taleps.username}`)
      .addField(`Kapatan Staff mı ?`,`❌`)
        const sklogstaff = new Discord.RichEmbed()
      .setColor("RED")
      .setTitle(`${taleps.username} tarafından bir SK kapatıldı`)
      .addField(`Kapatılan Talebin ID ;`,`${kapkanalid}`)
      .addField(`Kapatılan Talebin Adı ;`,`${kapkanalname}`)
      .addField(`Kapatan Kişinin ID ;`,`${taleps.id}`)
      .addField(`Kapatan Kişinin Adı ;`,`${taleps.username}`)
      .addField(`Kapatan Staff mı ?`,`✅`)
        const kapatildimesaj = new Discord.RichEmbed()
        .setColor("RED")
        .addField(`**Açılan ${kapkanalname} isimli talep**`, `**SK Sahibi ${taleps.username} tarafından kapatıldı.**`);
        const staffkapatildimesaj = new Discord.RichEmbed()
        .setColor("RED")
        .addField(`**Açılan ${kapkanalname} isimli sk**`, `**${destekekip.name} ${taleps.username} tarafından kapatıldı.**`);
       if (message.member.roles.find("name","💠 Staff")) return desteksohbet.send(staffkapatildimesaj), sklogkanal.send(sklogstaff);
       if (!message.member.roles.find("name","💠 Staff")) return desteksohbet.send(kapatildimesaj), sklogkanal.send(sklog);
        })
        .catch(() => {
          m.edit('SK Kapatma isteğin zaman aşımına uğradı.').then(m2 => {
              m2.delete();
          }, 3000);
        });
    });
}
});



client.on("message", async message => {
const dcsk = client.channels.get("689478287725953077")

  const voiceChannels = message.guild.channels.filter(c => c.type === "voice");
  let count = 0;
  for (const [id, voiceChannel] of voiceChannels)
    count += voiceChannel.members.size;
  

  var onlayn = message.guild.members
    .filter(m => m.presence.status !== "offline")
    .size.toString()
    .replace(/ /g, "    ");
  var üs4 = onlayn.match(/([0-9])/g);
  onlayn = onlayn.replace(/([a-zA-Z])/g, "YOK").toLowerCase();
  if (üs4) {
    onlayn = onlayn.replace(/([0-9])/g, d => {
      return {
          "0": "<a:Sayi0:707699255019831319>",
        "1": "<a:Sayi1:707699281196351530>",
        "2": "<a:Sayi2:707699293448044555>",
        "3": "<a:Sayi3:707699297369718917>",
        "4": "️<a:Sayi4:707699297742749766>",
        "5": "<a:Sayi5:707699297873035314>",
        "6": "️<a:Sayi6:707699298078556190>",
        "7": "️<a:Sayi7:707699297507868753>",
        "8": "<a:Sayi8:707699298355380234>",
        "9": "️<a:Sayi9:707699298426683423>",
      }[d];
    });
  }

  var üyesayısı = message.guild.memberCount.toString().replace(/ /g, "");
  var üs = üyesayısı.match(/([0-9])/g);
  üyesayısı = üyesayısı.replace(/([a-zA-Z])/g, "YOK").toLowerCase();
  if (üs) {
    üyesayısı = üyesayısı.replace(/([0-9])/g, d => {
      return {
         "0": "<a:Sayi0:707699255019831319>",
        "1": "<a:Sayi1:707699281196351530>",
        "2": "<a:Sayi2:707699293448044555>",
        "3": "<a:Sayi3:707699297369718917>",
        "4": "️<a:Sayi4:707699297742749766>",
        "5": "<a:Sayi5:707699297873035314>",
        "6": "️<a:Sayi6:707699298078556190>",
        "7": "️<a:Sayi7:707699297507868753>",
        "8": "<a:Sayi8:707699298355380234>",
        "9": "️<a:Sayi9:707699298426683423>",
      }[d];
    });
  }

dcsk.setTopic(` ** <a:tik2:691775654273875998> Üye : __${üyesayısı}__**\n ** <a:tik2:691775654273875998> Online: __${onlayn}__**`)

})


const yourID = "319121959726088192"; //Instructions on how to get this: https://redd.it/40zgse //Kendi İD'nizi Yazın
const setupCMD = "!rol" //İstediğiniz Komut Yapabilirsiniz örn : !kayıtol
let initialMessage = ``; //Dilediğiniz Şeyi Yazabilirsiniz
const roles = ["Giriş-Çıkış"];
const reactions = ["🔮"]; //İstediğiniz Emojiyi Ekleyebilirsiniz
const botToken = "";  //Buraya botunuzun tokenini koyunuz
                     
//Load up the bot...
const discord = require('discord.js');
const bot = new Discord.Client();
bot.login(botToken);
//If there isn't a reaction for every role, scold the user!
if (roles.length !== reactions.length) throw "Roles list and reactions list are not the same length!";
//Function to generate the role messages, based on your settings
function generateMessages(){
    var messages = [];
    messages.push(initialMessage);
    for (let role of roles) messages.push(`Giriş Çıkış rolü için **"${role}"** Emojisine Tıkla!`); //DONT CHANGE THIS
    return messages;
}
bot.on("message", message => {
    if (message.author.id == yourID && message.content.toLowerCase() == setupCMD){
        var toSend = generateMessages();
        let mappedArray = [[toSend[0], false], ...toSend.slice(1).map( (message, idx) => [message, reactions[idx]])];
        for (let mapObj of mappedArray){
            message.channel.send(mapObj[0]).then( sent => {
                if (mapObj[1]){
                  sent.react(mapObj[1]);  
                } 
            });
        }
    }
})
bot.on('raw', event => {
    if (event.t === 'MESSAGE_REACTION_ADD' || event.t == "MESSAGE_REACTION_REMOVE"){
        
        let channel = bot.channels.get(event.d.channel_id);
        let message = channel.fetchMessage(event.d.message_id).then(msg=> {
        let user = msg.guild.members.get(event.d.user_id);
        
        if (msg.author.id == bot.user.id && msg.content != initialMessage){
       
            var re = `\\*\\*"(.+)?(?="\\*\\*)`;
            var role = msg.content.match(re)[1];
        
            if (user.id != bot.user.id){
                var roleObj = msg.guild.roles.find(r => r.name === role);
                var memberObj = msg.guild.members.get(user.id);
                
                if (event.t === "MESSAGE_REACTION_ADD"){
                    memberObj.addRole(roleObj)
                } else {
                    memberObj.removeRole(roleObj);
                }
            }
        }
        })
 
    }   
});