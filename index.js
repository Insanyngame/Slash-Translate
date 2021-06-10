const Discord = require("discord.js")
const translate = require('@iamtraction/google-translate');
require("./keep_alive.js");

const client = new Discord.Client();

client.on('ready', () => {
		console.log("ready");
		console.log(client.user.tag + " " + client.user.id);
});

client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;
	if (interaction.commandName === 'ping') await interaction.reply('Pong!');
});

const reply = async (interaction, response, eph = false) => {
	await client.api.interactions(interaction.id, interaction.token).callback.post({
		data:{
			type: 4,
			data: {
				content: response,
				flags: eph==true?64:undefined,
			}
		}
	})
	console.log(interaction);
}

client.ws.on('INTERACTION_CREATE', async (interaction) => {
	const { name, options } = interaction.data;

	if(name == "translate2"){

		let ch = client.channels.cache.get(interaction.channel_id);
		let txt = (options ? options[0].value : ch.lastMessage.content);
		//console.log(txt);
		let tr;
		let typo;

		translate(txt, { to: 'en' }).then(res => {

			tr = res.text;
			typo = res.from.text.value;
			//console.log(tr + ` `+ typo);
			reply(interaction, tr + "\n\nTypo: " + (typo.length?typo:"none"), true);

		}).catch(err => {
			console.error(err);
		});
		//console.log(tr + ` `+ typo);
		//reply(interaction, tr + "\n\nTypo: " + typo, true);
	}
	
	if(name == "translate"){
		try{
			let ch = client.channels.cache.get(interaction.channel_id);
			let txt, fr, to;
			if(options){
				txt = (options[0] ? options[0].value : ch.lastMessage.content);
				fr = (options[1] ? options[1].value : "auto");
				to = (options[2] ? options[2].value : "en");
			} else {
				txt = ch.lastMessage.content;
				fr = "auto";
				to = "en";
			}
			console.log(txt + ' ' + fr + ' ' + to);
			let tr;
			let typo;

			translate(txt, { from: fr, to: to }).then(res => {

				tr = res.text;
				typo = res.from.text.value;
				reply(interaction, tr + "\n\nTypo: " + (typo.length?typo:"none") + "\n" + res.from.language.iso + " -> " + to, true);
			});
		} catch (e){
			console.error(e);
			reply(interaction, "Something went wrong while trying to run that command, please notify the developers or try again later", true);
		}

		//console.log(tr + ` `+ typo);
		//reply(interaction, tr + "\n\nTypo: " + typo, true);
	}
})

client.login(process.env.CLIENT_TOKEN);