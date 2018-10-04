const discord = require("discord.js");
const config = require("./config");
const axios = require("axios");

const bot = new discord.Client();

bot.on("ready", () => {
  console.log("Bot ready to rumble");
});

bot.on("message", message => {
  if (message.author.bot) return;
  if (message.content.startsWith(config.prefix)) {
    const command = message.content.split(" ")[0].slice(config.prefix.length);

    if (command === "players") {
      getCityInfo().then(data => {
        getResponseEmbed(data).then(embed => {
          message.channel.send(embed);
        });
      });
    }
  }
});

async function getCityInfo() {
  try {
    const response = await axios.get(
      "http://cnr.renegade334.me.uk/api/playerlist/json.php"
    );
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
}

function getResponseEmbed(data) {
  const embed = new discord.RichEmbed()
    .setColor(0x00ffff)
    .setTimestamp()
    .addField(
      "**Server 1**",
      `**
🏙 ${data.servers[0].mapname}
🕒 ${data.servers[0].worldtime}
👥 ${data.servers[0].players.length}/200**
`,
      true
    )
    .addField(
      "**Server 2**",
      `**
🏙 ${data.servers[1].mapname}
🕒 ${data.servers[1].worldtime}
👥 ${data.servers[1].players.length}/200**
`,
      true
    );
  return Promise.resolve(embed);
}

bot.login(config.token);
