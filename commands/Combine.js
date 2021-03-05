const utils = require(`../Utils.js`);

exports.headers =
{
    name: `Combine`,
    aliases: [`combine`],
    desc: `Calculate number of combinations.`,
    category: `math`,
    usage: `/combine <n> <k>`
};

exports.run = (client, message, args) =>
{
    if(args[0] != parseInt(args[0]) || args[1] != parseInt(args[1])) return message.channel.send(`**Correct usage: ${exports.headers.usage}**`);

    let n = parseInt(args[0]);
    let k = parseInt(args[1]);

    if(n < k) return message.channel.send(`:octagonal_sign: The *n* value cannot be smaller than the *k* value!`);

    let result = utils.factorial(n) / (utils.factorial(n - k) * utils.factorial(k));
    return message.channel.send(`C(${n}, ${k}) = ${result}`);
}