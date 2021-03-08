const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();
// Dynammically fetch files
const client = new Discord.Client();
const eventFiles = fs
	.readdirSync('./events')
	.filter((file) => file.endsWith('.js'));
const commandFolders = fs.readdirSync('./commands');
// Grab all command files
client.commands = new Discord.Collection();

// Load all event files

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

// Load all command files

for (const folder of commandFolders) {
	const commandFiles = fs
		.readdirSync(`./commands/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

client.login(process.env.BOT_TOKEN);
