const mongoose = require(`mongoose`);
const UserProfile = require(`../models/UserProfile.js`);

const utils = require(`../Utils.js`);

const users = new Map();

exports.setStake = (user, stake) =>
{
    users.set(user, stake);
}

exports.run = (client, message) =>
{
    let { content, author, channel } = message;
    content = content.toLowerCase();
    if(content.startsWith(`h`) || content.startsWith(`head`))
    {
        //Determinant
        let det = utils.randomise(0, 2);
        if(det == 0)
        {
            channel.send(`:trophy: Guessed correctly! You got **heads**\nYour prize: :hamburger: **${users.get(author) * 2}**`);
            UserProfile.findOne(
            {
                id: author.id
            }, (err, profile) =>
            {
                profile.burgers += (users.get(author) * 2);
                profile.save();
            });
        } else {
            channel.send(`:pensive: Guessed incorrectly! You got **tails**`);
        }
        return client.coinChoice.set(author, ``);
    } else if(content.startsWith(`t`) || content.startsWith(`tail`)) {
        //Determinant
        let det = utils.randomise(0, 2);
        if(det == 0)
        {
            channel.send(`:pensive: Guessed incorrectly! You got **heads**`);
        } else {
            channel.send(`:trophy: Guessed correctly! You got **tails**\nYour prize: :hamburger: **${users.get(author) * 2}**`);
            UserProfile.findOne(
            {
                id: author.id
            }, (err, profile) =>
            {
                profile.burgers += (users.get(author) * 2);
                profile.save();
            });
        }
        return client.coinChoice.set(author, ``);
    }
}