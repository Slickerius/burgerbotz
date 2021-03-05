const UserProfile = require(`../../models/UserProfile.js`);

const utils = require(`../../Utils.js`);
const embeds = require(`../../Embeds.js`);

exports.run = (client, message) =>
{
    let { content, author, channel } = message;
    let opponent = client.battlePairs.get(author);

    if(content.startsWith(`1`))
    {
        let det = utils.randomise(0, 2);

        client.battleHealth.set(author, 100);
        client.battleHealth.set(opponent, 100);

        client.battleBullets.set(author, 1);
        client.battleBullets.set(opponent, 1);

        if(det == 0)
        {
            client.battleState.set(author, 1);
            client.battleState.set(opponent, 2);
            channel.send(embeds.getBattle(client, opponent));
        } else {
            client.battleState.set(author, 2);
            client.battleState.set(opponent, 1);
            channel.send(embeds.getBattle(client, author));
        }
    } else if(content.startsWith(`2`)) {
        channel.send(`:person_running: **${author.username}** has left the scene!`);
        exports.terminate(client, author, 0);
    }
}

exports.turn = (client, message) =>
{
    let { content, author, channel } = message;
    let opponent = client.battlePairs.get(author);
    let luck = utils.randomise(0, 100);

    if(content.startsWith(`1`))
    {
        let damage = utils.randomise(5, 10);
        let health = client.battleHealth.get(opponent);
        health -= damage;

        channel.send(`:fist: **${author.username} has punched ${opponent.username}. -:heart: ${damage} HP**`);

        if(luck >= 85)
        {
            let bullets = client.battleBullets.get(author);
            bullets += 1;

            channel.send(`**${author.username} has grabbed a magazine while punching ${opponent.username}! +:gun: 1 ammo**`);
            client.battleBullets.set(author, bullets);
        }

        client.battleHealth.set(opponent, health);
    } else if(content.startsWith(`2`)) {
        if(client.battleEffects.get(author) == 1)
        {
            channel.send(`:cartwheel: **${author.username} tried to kick ${opponent.username} but failed since they're crippled!**`);
        } else {
            let damage;

            if(luck >= 95)
            {
                damage = utils.randomise(8, 15);
                let health = client.battleHealth.get(author);
                health -= damage;

                channel.send(`:boot: **${author.username} torn their hamstring whilst attempting to kick ${opponent.username}! -:heart: ${damage} HP**`);
                client.battleHealth.set(author, health);
                client.battleEffects.set(author, 1);
            } else {
                damage = utils.randomise(8, 20);
                let health = client.battleHealth.get(opponent);
                health -= damage;

                channel.send(`:boot: **${author.username} has kicked ${opponent.username}. -:heart: ${damage} HP**`);
                client.battleHealth.set(opponent, health);
            }
        }
    } else if(content.startsWith(`3`)) {
        let bullets = client.battleBullets.get(author);

        if(bullets < 1)
        {
            channel.send(`:gun: **You tried to open fire but you ran out of ammo!**`)
        } else {
            let success = utils.randomise(0, 10);
            let health = client.battleHealth.get(opponent);
            if(success < 2)
            {
                channel.send(`:gun: **Your shot has missed!**`);
            } else {
                let damage = utils.randomise(30, 75);
                health -= damage;

                channel.send(`:gun: **${author.username} has shot ${opponent.username}. -:heart: ${damage} HP**`);
                client.battleHealth.set(opponent, health);
            }
            bullets -= 1;
            client.battleBullets.set(author, bullets);
        }
    } else if(content.startsWith(`4`)) {
        if(luck >= 80)
        {
            channel.send(`:dizzy_face: **${author.username} tried to heal themselves but failed!**`);
        } else {
            let heal = utils.randomise(4, 20);
            let health = client.battleHealth.get(author);
            health += heal;

            channel.send(`:fist: **${author.username} has healed themselves. +:heart: ${heal} HP**`);
            client.battleHealth.set(author, health);
        }
    } else if(content.startsWith(`5`)) {
        if(luck >= 55)
        {
            channel.send(`:person_running: **${author.username} has left the battlefield.**`);
            return exports.terminate(client, author, 1);
        } else {
            let damage = utils.randomise(2, 10);
            let health = client.battleHealth.get(author);
            health -= damage;

            channel.send(`:cartwheel: **${author.username} tried to run away but slipped and fell! -:heart: ${damage} HP**`);
            client.battleHealth.set(author, health);
        }
    } else {
        return;
    }

    if(client.battleHealth.get(opponent) <= 0)
    {
        let prize = utils.randomise(20, 80);
        channel.send(`:trophy: **${author.username} has defeated ${opponent.username}!**\n**Given :hamburger: ${prize} as prize.**`);
        
        UserProfile.findOne(
        {
            id: author.id
        }, (err, profile) =>
        {
            profile.burgers += prize;
            profile.save();
        });
        
        return exports.terminate(client, author, 1);
    } else if(client.battleHealth.get(author) <= 0) {
        let prize = utils.randomise(20, 80);
        channel.send(`:trophy: **${opponent.username} has defeated ${author.username}!**\n**Given :hamburger: ${prize} as prize.**`);
        
        UserProfile.findOne(
        {
            id: opponent.id
        }, (err, profile) =>
        {
            profile.burgers += prize;
            profile.save();
        });
        
        return exports.terminate(client, author, 1);
    }

    client.battleState.set(author, 1);
    client.battleState.set(opponent, 2);

    channel.send(embeds.getBattle(client, opponent));
}

exports.terminate = (client, user, inGame) =>
{
    let opponent = client.battlePairs.get(user);

    client.battleState.delete(opponent);
    client.battleState.delete(user);

    client.battlePairs.delete(opponent);
    client.battlePairs.delete(user);

    if(inGame == 1)
    {
        client.battleHealth.delete(opponent);
        client.battleHealth.delete(user);

        client.battleBullets.delete(opponent);
        client.battleBullets.delete(user);

        client.battleEffects.delete(opponent);
        client.battleEffects.delete(user);
    }
}