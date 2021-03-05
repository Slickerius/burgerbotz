const request = require(`request-promise`);

const crypto = require(`crypto`);

exports.headers =
{
    name: `Password`,
    aliases: [`password`, `pw`],
    desc: `Password checker.`,
    category: `utility`,
    usage: `/password <string>**\nThe Burgerbotz password checker! We compile passwords from a database of passwords that have been cracked/leaked in the past, and show you how many times a password has been found.`
};

exports.run = (client, message, args) =>
{
    if(args.length <1)
    {
        return message.channel.send(`**Correct usage: ${exports.headers.usage}`);
    }

    let string = message.content.trim().split(/ +/g)
    string.shift();

    string = string.join(` `);

    const hash = crypto.createHash(`sha1`).update(string).digest(`hex`).toUpperCase();
    const head = hash.slice(0, 5);
    const tail = hash.slice(hash.length - 5, hash.length);

    const uri = `https://api.pwnedpasswords.com/range/${head}`;

    request(uri, (err, response, body) =>
    {
        const content = body.split(`\r\n`);
        let isFound = false;

        for(let index in content)
        {
            let foundHash = content[index].split(`:`);
            
            if(foundHash[0].slice(foundHash[0].length - 5, foundHash[0].length) == tail)
            {
                message.channel.send(`Password lookup for **"${string}"**\nSHA1: **${hash}**\nFound **${foundHash[1]}** occurrences of this password.`);
                isFound = true;
            }
        }

        if(!isFound)
        {
            message.channel.send(`Password lookup for **"${string}"**\nSHA1: **${hash}**\nThis password can not be found!`);
        }
    });
}