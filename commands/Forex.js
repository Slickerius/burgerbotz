const request = require(`request-promise`);

const embeds = require(`../Embeds.js`);

exports.headers =
{
    name: `Forex`,
    aliases: [`forex`],
    desc: `Display currency exchange rates.`,
    category: `finance`,
    usage: `/forex`
};

exports.run = (client, message, args) =>
{
    let forexEmbed = embeds.getForex();
    let { stockApiKey } = client;
    
    let uri = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=`;
    let dir = `Realtime Currency Exchange Rate`;
    
    request(`${uri}EUR&apikey=${stockApiKey}`, (err, response, body) =>
    {
        let content = JSON.parse(body);
        if(content[dir]) forexEmbed.addField(`Euro (€)`, `1 USD = €${parseFloat(content[dir][`5. Exchange Rate`]).toFixed(2)}`);
    }).then(() => {
    request(`${uri}GBP&apikey=${stockApiKey}`, (err, response, body) =>
    {
        let content = JSON.parse(body);
        if(content[dir]) forexEmbed.addField(`British Pound Sterling (£)`, `1 USD = £${parseFloat(content[dir][`5. Exchange Rate`]).toFixed(2)}`);
    }).then(() => {
    request(`${uri}JPY&apikey=${stockApiKey}`, (err, response, body) =>
    {
        let content = JSON.parse(body);
        if(content[dir]) forexEmbed.addField(`Japanese Yen (¥)`, `1 USD = ¥${parseFloat(content[dir][`5. Exchange Rate`]).toFixed(2)}`);
    }).then(() => {
    request(`${uri}CNY&apikey=${stockApiKey}`, (err, response, body) =>
    {
        let content = JSON.parse(body);
        if(content[dir]) forexEmbed.addField(`Chinese Yuan (¥)`, `1 USD = ¥${parseFloat(content[dir][`5. Exchange Rate`]).toFixed(2)}`);
    }).then(() => {
    request(`${uri}AUD&apikey=${stockApiKey}`, (err, response, body) =>
    {
        let content = JSON.parse(body);
        if(content[dir]) forexEmbed.addField(`Australian Dollar ($)`, `1 USD = $${parseFloat(content[dir][`5. Exchange Rate`]).toFixed(2)}`);
        return message.channel.send(forexEmbed);
    }) }); }); }); }); 
}