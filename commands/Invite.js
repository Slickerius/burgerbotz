const invite = `\n<https://bit.ly/2Hv31F8>`;

exports.headers =
{
    name: `Invite`,
    aliases: [`invite`],
    desc: `Invite Burgerbotz!`,
    category: `bot`,
    usage: `/invite`
};

exports.run = (client, message, args) =>
{
    return message.channel.send(`:hamburger: ***__Get Burgerbotz!__*** :hamburger: ${invite}`);
}