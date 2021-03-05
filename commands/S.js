const utils = require(`../Utils.js`);

exports.headers =
{
    name: `Spit`,
    aliases: [`s`],
    desc: `Spit on others' graves!`,
    category: `fun`,
    usage: `/s <object>`
};

exports.run = (client, message, args) =>
{
    if(args.length < 1) return message.channel.send(`**Correct usage: ${exports.headers.usage}**`);
    
    let obj = args.join(` `);
    let det = utils.randomise(0, 2);
    if(det == 0)
    {
        return message.channel.send(`${message.author} has took a dump on ${obj}'s grave :poop:`);
    } else {
        return message.channel.send(`${message.author} has spat on ${obj}'s grave :sweat_drops:`);
    }
}