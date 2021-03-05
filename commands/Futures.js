const embeds = require(`../Embeds.js`);

exports.headers =
{
    name: `Futures`,
    aliases: [`futures`],
    desc: `Display assets futures.`,
    category: `finance`,
    usage: `/futures <asset>`
};

exports.run = (client, message, args) =>
{
    let uri;
    let asset;
    let { channel } = message;

    if(args[0] == `brent`)
    {
        uri = `https://finviz.com/fut_chart.ashx?t=QA&p=h1&rev=637213994972398998`;
        asset = `Brent Crude Oil`;
    } else if(args[0] == `crude`) {
        uri = `https://finviz.com/fut_chart.ashx?t=CL&cot=067651&p=h1&rev=637213994858796340`;
        asset = `WTI Crude Oil`;
    } else if(args[0] == `gas`) {
        uri = `https://finviz.com/fut_chart.ashx?t=NG&cot=023651&p=h1&rev=637213995309769266`;
        asset = `Natural Gas`;
    } else if(args[0] == `copper`) {
        uri = `https://finviz.com/fut_chart.ashx?t=HG&cot=085692&p=h1&rev=637213999000169571`;
        asset = `Copper`;
    } else if(args[0] == `gold`) {
        uri = `https://finviz.com/fut_chart.ashx?t=GC&cot=088691&p=h1&rev=637213999920506084`;
        asset = `Gold`;
    } else if(args[0] == `platinum`) {
        uri = `https://finviz.com/fut_chart.ashx?t=PL&cot=076651&p=h1&rev=637214000758039463`;
        asset = `Platinum`;
    } else if(args[0] == `silver`) {
        uri = `https://finviz.com/fut_chart.ashx?t=SI&cot=084691&p=h1&rev=637214001013219357`;
        asset = `Silver`;
    } else if(args[0] == `dow`) {
        uri = `https://finviz.com/fut_chart.ashx?t=YM&cot=124601,124603&p=h1&rev=637214007289891640`;
        asset = `Dow Jones Industrial Average`;
    } else if(args[0] == `nasdaq`) {
        uri = `https://finviz.com/fut_chart.ashx?t=NQ&cot=209741,209742&p=h1&rev=637214008056258939`;
        asset = `Nasdaq 100`;
    } else if(args[0] == `russell`) {
        uri = `https://finviz.com/fut_chart.ashx?t=ER2&cot=239742&p=h1&rev=637214008373317543`;
        asset = `Russell 2000`;
    } else if(args[0] == `sp500`) {
        uri = `https://finviz.com/fut_chart.ashx?t=ES&cot=138741,13874A&p=h1&rev=637214009937927422`;
        asset = `S&P 500`;
    } else {
        return channel.send(embeds.getFutures());
    }

    return channel.send(`__**${asset} Futures**__`, 
	{
		files: [
        {
			attachment: uri,
			name: `chart.png`
		}]
	});
}