exports.headers =
{
    name: `Random`,
    aliases: [`random`],
	desc: `Generate a random integer.`,
	category: `utility`,
	usage: `/random <upper bound>`
};

exports.run = (client, message, args) =>
{
    if(args[0] == null)
	{
		message.channel.send(`:symbols: **Correct usage: /random <upper bound>**\nGenerates a random integer with a range of 0 to the upper bound.`);
	} else {
		let max = parseInt(args[0]);
		message.channel.send(`Returned integer ${Math.floor(Math.random() * (max + 1))}`);
	}	
}