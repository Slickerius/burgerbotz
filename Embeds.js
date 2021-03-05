const Discord = require(`discord.js`);

const utils = require(`./Utils.js`);
const config = require(`./config.json`);
const res = require(`./resources/ResourcesManager.js`);

const burgerGifs = res.getBurgerGifs();
const colour = `#fcc66a`;

exports.getBurgerSelf = (username) =>
{
    let burgerSelf = new Discord.MessageEmbed()
                    .setImage(burgerGifs[utils.randomise(0, burgerGifs.length)])
                    .setDescription(`:hamburger: **${username}** is eating a hamburger!`)
                    .setColor(colour);
    return burgerSelf;
}

exports.getBurgerFeed = (username, _username) =>
{
    let burgerFeed = new Discord.MessageEmbed()
                    .setImage(burgerGifs[utils.randomise(0, burgerGifs.length)])
                    .setDescription(`:hamburger: **${username}** is feeding a hamburger to **${_username}**`)
                    .setColor(colour);
    return burgerFeed;
}

exports.getAbout = () =>
{
    const authors = config.authors.join(`, `);
    const helpers = config.helpers.join(`, `);

    let about = new Discord.MessageEmbed()
	                .setThumbnail(config.url)
		            .setAuthor(config.name, config.url)
		            .setDescription(config.description)
		            .addField(`Developer(s)`, authors)
		            .addField(`Special Thanks`, helpers)
		            .setColor(colour);
    return about;
}

exports.getHelp = (client, category) =>
{
    let help = new Discord.MessageEmbed()
            .setAuthor(`Burgerbotz`, config.url)
            .setColor(colour);
    
    let _category;

    if(category == `bot`)
    {
        help.setDescription(`Burgerbotz Bot-Related Commands.`);
    } else if(category == `economy`) {
        help.setDescription(`Commands involving the virtual economy of Burgerbotz.`);
    } else if(category == `finance`) {
        help.setDescription(`Tools for investors including real time market data and assets futures.`);
    } else if(category == `fun`) {
        help.setDescription(`It wouldn't be Burgerbotz without its fun commands!`);
    } else if(category == `image`) {
        help.setDescription(`Artistic commands that will secure your status as the next Bob Ross!`);
    } else if(category == `math`) {
        help.setDescription(`The mathemagical commands of Burgerbotz.`);
    } else if(category == `utility`) {
        help.setDescription(`What robots are made for: to serve humans.`);
    } else {
        help.setDescription(`Here are several categories of Burgerbotz commands.`)
            .addField(`:robot: **/help bot**`, `Bot related commands fall into this category.`)
            .addField(`:dollar: **/help economy**`, `The virtual economy commands of Burgerbotz!`)
            .addField(`:chart_with_upwards_trend: **/help finance**`, `Informative charts and market data for investors.`)
            .addField(`:joystick: **/help fun**`, `F is for fun Burgerbotz commands!`)
            .addField(`:frame_photo: **/help image**`, `Image manipulation commands that will make you the next Bob Ross.`)
            .addField(`:symbols: **/help math**`, `Mathemagical commands.`)
            .addField(`:tools: **/help utility**`, `Commands that might come in handy.`);
        return help;
    }

    for(let command of client.commands.keys())
    {
        let commandFile = client.commands.get(command);
        if(commandFile.headers.category == category)
        {
            help.addField(`**/${command}**`, commandFile.headers.desc);
        }
    }

    return help;
}

exports.getFutures = () =>
{
	let thumbnailUrl = "https://pngimg.com/uploads/gold/gold_PNG11028.png";

    let botembed = new Discord.MessageEmbed()
                .setAuthor(`Assets Futures`, config.url)
                .setThumbnail(thumbnailUrl)
                .setDescription(`__**Commands**__`)
                .addField(`Energy`, `**/futures brent** - Displays Brent crude oil futures chart.\n**/futures crude** - Displays WTI crude oil futures chart.\n**/futures gas** - Displays natural gas futures chart.`)
                .addField(`Indices`, `**/futures dow** - Displays Dow Jones Industrial Average futures chart.\n**/futures nasdaq** - Displays Nasdaq 100 futures chart.\n**/futures russell** - Displays Russell 2000 futures chart.\n**/futures sp500** - Displays S&P 500 futures chart.`)
                .addField(`Metals`, `**/futures copper** - Displays copper futures chart.\n**/futures gold** - Displays gold futures chart.\n**/futures platinum** - Displays platinum futures chart.\n**/futures silver** - Displays silver futures chart.`)
                .setColor(colour);

    return botembed;
}

exports.getForex = () =>
{
    let thumbnailUrl = `https://pngimg.com/uploads/dollar_sign/dollar_sign_PNG21539.png`;

    let date = new Date();
    let dateString = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

    let forex = new Discord.MessageEmbed()
                .setAuthor(`Currency Exchange Rates`, config.url)
                .setThumbnail(thumbnailUrl)
                .setDescription(`Foreign exchange market rates as of ${dateString}`)
                .setColor(colour);

    return forex;
}

exports.getNews = (category) =>
{
    let thumbnailUrl = `https://images.emojiterra.com/google/android-10/512px/1f4f0.png`;

    let date = new Date();
    let dateString = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

    let news = new Discord.MessageEmbed()
                .setThumbnail(thumbnailUrl)
                .setDescription(`Top ${category} news as of ${dateString}`)
                .setFooter(`"Where the press is free and every man able to read, all is safe."\n-Thomas Jefferson`)
                .setColor(colour);
    
    return news;
                
}

exports.getBattle = (client, turnUser) =>
{
    let opponent = client.battlePairs.get(turnUser);

    let battle = new Discord.MessageEmbed()
                .setThumbnail(turnUser.avatarURL())
                .setTitle(`${turnUser.username}'s turn`)
                .addField(`${turnUser.username}`, `:heart: ${client.battleHealth.get(turnUser)}\t:gun: ${client.battleBullets.get(turnUser)}`)
                .addField(`${opponent.username}`, `:heart: ${client.battleHealth.get(opponent)}\t:gun: ${client.battleBullets.get(opponent)}`)
                .addField(`Actions`, `[1] :fist: Punch\n[2] :boot: Kick\n[3] :gun: Shoot\n[4] :heart: Heal\n[5] :person_running: Run`)
                .setColor(colour);

    return battle;
}