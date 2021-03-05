const request = require(`request-promise`);

const embeds = require(`../Embeds.js`);
const config = require(`../config.json`);

exports.headers =
{
    name: `News`,
    aliases: [`news`],
    desc: `Gather news from all over the world.`,
    category: `utility`,
    usage: `/news <country> <category>**\nCategory is optional, for example type **/news us** to get headline news from the US.\nCategories: **business**, **entertainment**, **health**, **science**, **sports**, **technology**.`
};

exports.run = (client, message, args) =>
{
    if(args.length < 1) return message.channel.send(`**Correct usage: ${exports.headers.usage}`);

    let country = args[0].toLowerCase();

    let category = ` `;
    let categoryTitle = ` `;
    
    if(args[1])
    {
        switch(args[1].toLowerCase())
        {
            case `business`:
            case `entertainment`:
            case `health`:
            case `science`:
            case `sports`:
            case `technology`:
                category = args[1].toLowerCase();
                categoryTitle = ` ${category.charAt(0).toUpperCase() + category.slice(1)} `;
                break;
        }
    }

    let countryCode;

    switch(country)
    {
        case `us`:
        case `usa`:
            countryCode = `us`;
            break;

        case `uk`:
        case `gb`:
            countryCode = `gb`;
            break;

        case `argentina`:
            countryCode = `ar`;
            break;
            
        case `australia`:
            countryCode = `au`;
            break;

        case `austria`:
            countryCode = `at`;
            break;
            
        case `belgium`:
            countryCode = `be`;
            break;

        case `brazil`:
            countryCode = `br`;
            break;
            
        case `bulgaria`:
            countryCode = `bg`;
            break;
        
        case `canada`:
            countryCode = `ca`;
            break;
            
        case `china`:
            countryCode = `cn`;
            break;

        case `colombia`:
            countryCode = `co`;
            break;
            
        case `cuba`:
            countryCode = `cu`;
            break;

        case `czechia`:
            countryCode = `cz`;
            break;
            
        case `egypt`:
            countryCode = `eg`;
            break;

        case `france`:
            countryCode = `fr`;
            break;
            
        case `germany`:
            countryCode = `de`;
            break;

        case `greece`:
            countryCode = `gr`;
            break;
            
        case `hong kong`:
            countryCode = `hk`;
            break;

        case `hungary`:
            countryCode = `hu`;
            break;
            
        case `india`:
            countryCode = `in`;
            break;

        case `indonesia`:
            countryCode = `id`;
            break;
            
        case `ireland`:
            countryCode = `ie`;
            break;

        case `israel`:
            countryCode = `il`;
            break;
            
        case `italy`:
            countryCode = `it`;
            break;

        case `japan`:
            countryCode = `jp`;
            break;
            
        case `latvia`:
            countryCode = `lv`;
            break;

        case `lithuania`:
            countryCode = `lt`;
            break;
            
        case `malaysia`:
            countryCode = `my`;
            break;

        case `mexico`:
            countryCode = `mx`;
            break;
            
        case `morocco`:
            countryCode = `ma`;
            break;

        case `netherlands`:
            countryCode = `nl`;
            break;
            
        case `nz`:
            countryCode = `nz`;
            break;

        case `nigeria`:
            countryCode = `ng`;
            break;
            
        case `norway`:
            countryCode = `no`;
            break;
        
        case `philippines`:
            countryCode = `ph`;
            break;

        case `poland`:
            countryCode = `pl`;
            break;
            
        case `portugal`:
            countryCode = `pt`;
            break;

        case `romania`:
            countryCode = `ro`;
            break;
            
        case `russia`:
            countryCode = `ru`;
            break;

        case `saudi`:
            countryCode = `sa`;
            break;
            
        case `serbia`:
            countryCode = `rs`;
            break;

        case `singapore`:
            countryCode = `sg`;
            break;
            
        case `slovakia`:
            countryCode = `sk`;
            break;

        case `slovenia`:
            countryCode = `si`;
            break;
            
        case `southafrica`:
            countryCode = `za`;
            break;

        case `korea`:
            countryCode = `kr`;
            break;
            
        case `sweden`:
            countryCode = `se`;
            break;

        case `switzerland`:
            countryCode = `ch`;
            break;
            
        case `taiwan`:
            countryCode = `tw`;
            break;

        case `thailand`:
            countryCode = `th`;
            break;
            
        case `turkey`:
            countryCode = `tr`;
            break;

        case `uae`:
            countryCode = `ae`;
            break;
            
        case `ukraine`:
            countryCode = `ua`;
            break;

        case `venezuela`:
            countryCode = `vz`;
            break;
            
        default:
            return message.channel.send(`**Correct usage: ${exports.headers.usage}**`);
    }

    request(`https://newsapi.org/v2/top-headlines?country=${countryCode}&category=${category}&apiKey=${client.newsApiKey}`, (err, response, body) =>
    {
        let content = JSON.parse(body);
        let articles = content.articles;

        if(category == ` `) category = `headline`;
        let newsEmbed = embeds.getNews(category);

        newsEmbed.setTitle(`:flag_${countryCode}:${categoryTitle}News`);

        articles.forEach((article) =>
        {
            newsEmbed.addField(article.source.name, `[${article.title}](${article.url})`);
        });

        message.channel.send(newsEmbed);
    });
}