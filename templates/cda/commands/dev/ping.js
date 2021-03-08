module.exports = {
	name: 'ping',
	aliases: ['p', 'latency'],
	description: 'Ping!',
	args: false,
	guildOnly: true,
	cooldown: 5,
	execute(message) {
		message.channel.send('Pinging...').then(sent=>{
			sent.edit(`Websocket heartbeat: ${message.client.ws.ping}ms. Roundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms`);
		});
	},
};