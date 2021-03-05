exports.memberAddBotServer = (client, member) =>
{
    member.user.send(`Welcome to the **${member.guild.name}**! Unlike most servers, there isn't a lot of *crippling* rules to bar your freedom of speech here. Just have fun alright?`);
    
    let invites = member.guild.fetchInvites().then(invite =>
    {
        let inviteArray = invite.array();
        let inviteObj = {"x": 0};

        for(let i = 0; i < inviteArray.length; i++)
        {
            let inv = inviteArray[i];
            inviteObj[inv.code] = inv.uses;
        }

        for(const [key, value] of Object.entries(inviteObj))
        {
            if(inviteObj[key] !== client.inviteObj[key])
            {
                for(let i = 0; i < inviteArray.length; i++)
                {
                    let inv = inviteArray[i];
                    if(inv.code == key)
                    {
                        client.joinChannel.send(`User ${member.user} has joined the brotherhood. Bid them your warmest welcome!\nInvited by: **${inv.inviter.username}#${inv.inviter.discriminator}** using the invite code **${inv.code}**.`);
                        for(const [key, value] of Object.entries(inviteObj))
                        {
                            client.inviteObj[key] = inviteObj[key];
                        }
                    }
                }
            }
        }
    });
}

exports.memberRemoveBotServer = (client, member) =>
{
    return client.leaveChannel.send(`**${member.user.username}#${member.user.discriminator}** has withdrawn their presence from the brotherhood. Until next time.`);
}

exports.handleInvite = (client, message) =>
{
    let { content, author } = message;

    let contentArray = content.toLowerCase().split(` `);
    let contentArrayU = content.split(` `);
    let template = `discord.gg/`;
    if(content.toLowerCase().includes(template))
    {
        for(let i = 0; i < contentArray.length; i++)
        {
            if(contentArray[i].includes(template) || contentArray[i].startsWith(template))
            {
                let length = contentArray[i].length;
                let code;

                if(contentArray[i].startsWith(`https`))
                {
                    code = contentArrayU[i].substr(19, (length - 1));
                } else if(contentArrayU[i].startsWith(`http`)) {
                    code = contentArrayU[i].substr(18, (length - 1));
                } else if(contentArrayU[i].startsWith(`d`)) {
                    code = contentArrayU[i].substr(11, (length - 1));
                }

                client.fetchInvite(code).then((invite) =>
                {
                    if(invite.guild.name)
                    {
                        message.delete().then(() =>
                        {
                            client.logChannel.send(`Deleted invite posted by **${author.username}#${author.discriminator}** (${invite.code}) to **${invite.guild.name}**`);
                            author.send(`:warning: **Do not post Discord invite links onto the ${message.guild.name} server.**`);
                        });
                    }
                });
            }
        }
    }
}