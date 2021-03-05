const mongoose = require(`mongoose`);
const UserProfile = require(`../models/UserProfile.js`);

exports.headers =
{
    name: `Pay`,
    aliases: [`pay`],
    desc: `Transfer burgers to other users!`,
    category: `economy`,
    usage: `/pay <user> <amount>`
};

exports.run = (client, message, args) =>
{
    let { content, author, channel } = message;

    if(message.mentions.users.size < 1 || args[1] != parseFloat(args[1])) return channel.send(`:hamburger: **Correct usage: ${exports.headers.usage}**`);
    if(parseFloat(args[1]) <= 0) return channel.send(`:octagonal_sign: **You may only enter a positive value!**`);

    UserProfile.findOne(
    {
        id: author.id
    }, (err, profile) =>
    {
        if(!profile)
        {
            const newProfile = new UserProfile(
            {
                id: author.id,
                burgers: 10
            });
            return newProfile.save().then(exports.run(client, message, args));
        }

        if(profile.burgers <= 0 || profile.burgers < parseFloat(args[1]))
        {
            return channel.send(`:octagonal_sign: **You have insufficient burgers to make the transaction!**`);
        } else {
            let user = message.mentions.users.first();

            UserProfile.findOne(
            {
                id: user.id
            }, (_err, _profile) => 
            {
                if(!_profile)
                {
                    let balance = 10 + parseFloat(args[1]);
                    const _newProfile = new UserProfile(
                    {
                        id: user.id,
                        burgers: balance
                    });
                    _newProfile.save();
                } else {
                    profile.burgers -= parseFloat(args[1]);
                    _profile.burgers += parseFloat(args[1]);

                    profile.save();
                    _profile.save();
                }
            });

            return channel.send(`Successfully given :hamburger: **${parseFloat(args[1])}** to user **${user.username}**!`);
        }
    });
}