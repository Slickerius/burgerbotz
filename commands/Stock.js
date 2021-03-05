const request = require(`request-promise`);

exports.headers =
{
    name: `Stock`,
    aliases: [`stock`],
    desc: `Check real time stock data..`,
    category: `finance`,
    usage: `/stock <company name/ticker>**\nLookup real-time data of various companies/securities!\nExample: **/stock check MSFT** - lookup stock data for Microsoft Corporation.`
};

exports.run = (client, message, args) =>
{
    const key = client.stockApiKey;

    const searchUri = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${args.join(` `)}&apikey=${key}`;

    let msg = message.content.split(` `);

    let { content, author, channel } = message;
    if(args.length < 1) return channel.send(`**Correct usage: ${exports.headers.usage}`);

    channel.startTyping();

    request(searchUri, (_err, _response, _body) =>
    {
        let _content = JSON.parse(_body);
        let matches = _content.bestMatches;
        let match = matches[0];

        if(!match)
        {
            msg.shift();
            msg = msg.join(` `);
            channel.stopTyping();
            return channel.send(`:octagonal_sign: **Company/security not found: "${msg}"**`);
        }

        let ticker = match[`1. symbol`];
        let name = match[`2. name`];

        const uri = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${key}`;

        request(uri, (err, response, body) =>
        {
            let content = JSON.parse(body);
            if(!content[`Global Quote`]) 
            {
                channel.stopTyping();
                if(content[`Note`])
                {
                    console.log(content);
                    return channel.send(`:octagonal_sign: **An error occurred. Please try again later.**`);
                }
            }
            
            let quote = content[`Global Quote`];

            ticker = quote[`01. symbol`];

            let open = quote[`02. open`];
            open = parseFloat(open);
            let high = quote[`03. high`];
            high = parseFloat(high);
            let low = quote[`04. low`];
            low = parseFloat(low);
            let price = quote[`05. price`];
            price = parseFloat(price);

            let volume = quote[`06. volume`];

            let prevClose = quote[`08. previous close`];
            prevClose = parseFloat(prevClose);
            let changePercentage = quote[`10. change percent`];
            changePercentage = parseFloat(changePercentage);

            open = open.toFixed(2);
            high = high.toFixed(2);
            low = low.toFixed(2);
            price = price.toFixed(2);
            prevClose = prevClose.toFixed(2);
            changePercentage = changePercentage.toFixed(2);

            let chartUri = `https://stockcharts.com/c-sc/sc?s=${ticker}&p=D&b=5&g=0&i=0&r=1590024161312`;

            channel.stopTyping();
            
            if(parseFloat(changePercentage) > 0)
            {
                channel.send(`__**${name}**__\nSymbol: **${ticker}**\nPrice: **${price}** <:_bull:624633081302876160> +${changePercentage}%\nOpen: **${open}**\nDay High: **${high}**\nDay Low: **${low}**\nPrevious Close: **${prevClose}**\nVolume: **${volume}**`, 
                {
                    files: [
                    {
                        attachment: chartUri,
                        name: `chart.png`
                    }]
                });
            } else {
                channel.send(`__**${name}**__\nSymbol: **${ticker}**\nPrice: **${price}** <:_bear:624633128228749312> ${changePercentage}%\nOpen: **${open}**\nDay High: **${high}**\nDay Low: **${low}**\nPrevious Close: **${prevClose}**\nVolume: **${volume}**`, 
                {
                    files: [
                    {
                        attachment: chartUri,
                        name: `chart.png`
                    }]
                });
            }
        });
    }); 
}