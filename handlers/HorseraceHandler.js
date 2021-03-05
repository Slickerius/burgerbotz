const mongoose = require(`mongoose`);
const UserProfile = require(`../models/UserProfile.js`);

const utils = require(`../Utils.js`);

const users = new Map();

const horse = `<:horsie:656477871476572203>`;
const waves = `:wavy_dash: `;

exports.setStake = (user, stake) =>
{
    users.set(user, stake);
}

exports.run = (client, message) =>
{
    let { content, author, channel } = message;

    let horseChoices = client.horseChoices.get(author).split(` `);

    let horse1 = horse;
    let horse2 = horse;
    let horse3 = horse;

    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;

    let timeout = 22.5;
    timeout *= 1000;

    let horseName;
    let win = false;

    if(content.startsWith(`1`))
    {
        horseName = horseChoices[0];
    } else if(content.startsWith(`2`)) {
        horseName = horseChoices[1];
    } else if(content.startsWith(`3`)) {
        horseName = horseChoices[2];
    } else {
        return;
    }

    client.horseChoices.set(author, ``);
    channel.send(`:horse: __**A Day at the Races**__ :horse:\n**Stake: :hamburger: ${users.get(author)} on ${horseName}**\n**${horseChoices[0].slice(0, 1)}) :red_circle: ${horse1}**\n**${horseChoices[1].slice(0, 1)}) :yellow_circle: ${horse2}**\n**${horseChoices[2].slice(0, 1)}) :blue_circle: ${horse3}**`).then((msg) =>
    {
        for(let i = 0; i < 30; i++)
		{
            let mov1 = utils.randomise(0, 2);
            let mov2 = utils.randomise(0, 2);
            let mov3 = utils.randomise(0, 2);

            if(mov1 == 1)
            {
                horse1 = waves + horse1;
                counter1++;
            }
            if(mov2 == 1) {
                horse2 = waves + horse2;
                counter2++;
            }
            if(mov3 == 1) {
                horse3 = waves + horse3;
                counter3++;
            }

            msg.edit(`:horse: __**A Day at the Races**__ :horse:\n**Stake: :hamburger: ${users.get(author)} on ${horseName}**\n**${horseChoices[0].slice(0, 1)}) :red_circle: ${horse1}**\n**${horseChoices[1].slice(0, 1)}) :yellow_circle: ${horse2}**\n**${horseChoices[2].slice(0, 1)}) :blue_circle: ${horse3}**`);
            
            if(counter1 == 10)
            {
                if(horseName == horseChoices[0])
                {
                    setTimeout(() => { channel.send(`:trophy: **Your horse ${horseName} has won the race! You won :hamburger: ${users.get(author) * 3}**`); }, timeout);
                    win = true;
                } else {
                    setTimeout(() => { channel.send(`:disappointed: **Your horse ${horseName} has not been able to compete against the might of ${horseChoices[0]}.**\n**Better luck next time!**`); }, timeout);
                }
                break;
            } else if(counter2 == 10) {
                if(horseName == horseChoices[1])
                {
                    setTimeout(() => { channel.send(`:trophy: **Your horse ${horseName} has won the race! You won :hamburger: ${users.get(author) * 3}**`); }, timeout);
                    win = true;
                } else {
                    setTimeout(() => { channel.send(`:disappointed: **Your horse ${horseName} has not been able to compete against the might of ${horseChoices[1]}.**\n**Better luck next time!**`); }, timeout);
                }
                break;
            } else if(counter3 == 10) {
                if(horseName == horseChoices[2])
                {
                    setTimeout(() => { channel.send(`:trophy: **Your horse ${horseName} has won the race! You won :hamburger: ${users.get(author) * 3}**`); }, timeout);
                    win = true;
                } else {
                    setTimeout(() => { channel.send(`:disappointed: **Your horse ${horseName} has not been able to compete against the might of ${horseChoices[2]}.**\n**Better luck next time!**`); }, timeout);
                }
                break;
            }
        }

        if(win)
        {
            UserProfile.findOne(
            {
                id: author.id
            }, (err, profile) =>
            {
                profile.burgers += users.get(author) * 3;
                profile.save();
            });
        }

        client.horseChoices.set(author, ``);
    });
}