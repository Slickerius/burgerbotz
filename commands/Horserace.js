const UserProfile = require(`../models/UserProfile.js`);

const res = require(`../resources/ResourcesManager.js`);
const utils = require(`../Utils.js`);

const horserace = require(`../handlers/HorseraceHandler.js`);

const horseNames = res.getHorseNames();

exports.headers =
{
    name: `Horserace`,
    aliases: [`horserace`],
    desc: `Bet on a horse!`,
    category: `fun`,
    usage: `/horserace <bet amount>`
};

exports.run = (client, message, args) =>
{
    let { content, author, channel } = message;

    if(args[0] != parseInt(args[0])) return channel.send(`:horse: **Correct usage: ${exports.headers.usage}**`);
    if(parseInt(args[0]) < 1) return channel.send(`:octagonal_sign: **You may only enter a positive value!**`);

    UserProfile.findOne(
    {
            id: message.author.id
    }, (err, profile) =>
    {
        if(profile.burgers < parseInt(args[0])) return channel.send(`:octagonal_sign: **You have insufficient burgers to make this bet.**`);

        let horse1 = horseNames[utils.randomise(0, horseNames.length)];
        let horse2 = horseNames[utils.randomise(0, horseNames.length)];
        let horse3 = horseNames[utils.randomise(0, horseNames.length)];

        if(horse1 == horse2) horse2 = horseNames[utils.randomise(0, horseNames.length)];
        if(horse2 == horse3) horse3 = horseNames[utils.randomise(0, horseNames.length)];
        
        channel.send(`:horse: __**A Day at the Races**__ :horse:\n**Stake: :hamburger: ${parseInt(args[0])}**\n**Pick your horse:**\n:red_circle: **[1] ${horse1}**\n**:yellow_circle: [2] ${horse2}**\n**:blue_circle: [3] ${horse3}**`);
        client.horseChoices.set(author, `${horse1} ${horse2} ${horse3}`);
        horserace.setStake(author, parseInt(args[0]));

        profile.burgers -= parseInt(args[0]);
        profile.save();
    });
}