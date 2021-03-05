const utils = require(`../Utils.js`);

exports.headers =
{
    name: `Permute`,
    aliases: [`permute`],
    desc: `Calculate number of permutations.`,
    category: `math`,
    usage: `/permute <n> <k>`
};

exports.run = (client, message, args) =>
{
    if(args[0] != parseInt(args[0]) || args[1] != parseInt(args[1])) return message.channel.send(`**Correct usage: ${exports.headers.usage}**`);

    let n = parseInt(args[0]);
    let k = parseInt(args[1]);

    if(n < k) return message.channel.send(`:octagonal_sign: The *n* value cannot be smaller than the *k* value!`);

    let result = utils.factorial(n) / utils.factorial(n - k);
    return message.channel.send(`P(${n}, ${k}) = ${result}`);
}