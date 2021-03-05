const battle = require(`../handlers/battle/BattleHandler.js`);

exports.headers =
{
    name: `Battle`,
    aliases: [`battle`],
    desc: `Battle other users!`,
    category: `fun`,
    usage: `/battle <user>`
};

exports.run = (client, message, args) =>
{
    let { content, author, channel } = message; 

    if(message.mentions.users.size < 1)
    {
        return channel.send(`:octagonal_sign: **You have to mention someone to battle with!**`);
    } else if(message.mentions.users.size >= 1 && message.mentions.users.first() == author)
    {
        return channel.send(`:octagonal_sign: **You cannot battle yourself!**`);
    } else if(client.battlePairs.get(author)) {
        return channel.send(`:octagonal_sign: **You can only be involved in one battle at a time!**`);
    } else if(client.battlePairs.get(message.mentions.users.first())) {
        return channel.send(`:octagonal_sign: **${message.mentions.users.first()} is already in a battle!**`);
    }

    let opponent = message.mentions.users.first();

    client.battlePairs.set(author, opponent);
    client.battlePairs.set(opponent, author);

    client.battleState.set(opponent, 0);

    channel.send(`${opponent}, you have been challenged to a battle by **${author.username}**! Do you:\n[1] Engage\n[2] Flee`);

    setTimeout(() =>
    {
        if(client.battleState.get(opponent) == 0)
        {
            channel.send(`:shrug: **${opponent.username} has ignored ${author.username}'s challenge to battle.**`);
            battle.terminate(client, author, 0);
        }
    }, 90000);
}