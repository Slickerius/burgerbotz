exports.headers =
{
    name: `Quadratic`,
    aliases: [`q`],
    desc: `Solve quadratic equations.`,
    category: `math`,
    usage: `/q <a> <b> <c>`
};

exports.run = (client, message, args) =>
{
    if(args[0] == parseInt(args[0]) && args[1] == parseInt(args[1]) && args[2] == parseInt(args[2]))
	{
        let a = parseInt(args[0]);
        let b = parseInt(args[1]);
        let c = parseInt(args[2]);

        let _a = a.toString();
		if(a == -1) _a = `-`;
        if(a == 1) _a = ``;
        
        let __b = `+ ` + b;
        if(b == 1) __b = `+ `;
        if(b == -1) __b = `- `;
	    if(b < 0 && b != -1) __b = `- ` + Math.abs(b);
        if(b == 0) __b = ``;
        
        let _c = `+ ` + c;
		if(c < 0) _c = `- ` + Math.abs(c);
        if(c == 0) _c = ``;
        
        let _b = b * -1;
		let _b2 = b * b;
		let _4ac = 4 * a * c;
		let _2a = 2 * a;
				
		let x1 = (_b + Math.sqrt(_b2 - _4ac)) / _2a;
        let x2 = (_b - Math.sqrt(_b2 - _4ac)) / _2a;
        
        if(a == 0)
		{
			return message.channel.send(`The **a** value cannot be 0.`);
        }
        
        if(__b) __b = `${__b}x `;

        if(isNaN(x1) || isNaN(x2))
		{
		    return message.channel.send(`The quadratic equation **${_a}x² ${__b}${_c} = 0** has the root pair of **(${_b} ± i√${Math.abs((_b2 - _4ac))}) / ${_2a}**.`);
        }
        
        let _x1 = Math.abs(x1);
        let _x2 = Math.abs(x2);
        
        if(x1 > 0 && x2 > 0)
		{
			return message.channel.send("The quadratic equation **" + _a + "x² " + __b + "" + _c + " = 0** has roots of **" + x1 + "** and **" + x2 + "**.\nThe factors are **(x - " + _x1 + ")(x - " + _x2 + ")**. \nThe root pair is **(" + _b + " ± √" + (_b2 - _4ac) + ") / " + _2a + "**.");
		} else if(x1 > 0 && x2 < 0) {
			return message.channel.send("The quadratic equation **" + _a + "x² " + __b + "" + _c + " = 0** has roots of **" + x1 + "** and **" + x2 + "**.\nThe factors are **(x - " + _x1 + ")(x + " + _x2 + ")**. \nThe root pair is **(" + _b + " ± √" + (_b2 - _4ac) + ") / " + _2a + "**.");
		} else if(x1 < 0 && x2 > 0) { 
			return message.channel.send("The quadratic equation **" + _a + "x² " + __b + "" + _c + " = 0** has roots of **" + x1 + "** and **" + x2 + "**.\nThe factors are **(x + " + _x1 + ")(x - " + _x2 + ")**. \nThe root pair is **(" + _b + " ± √" + (_b2 - _4ac) + ") / " + _2a + "**.");
		} else if(x1 < 0 && x2 < 0) {
			return message.channel.send("The quadratic equation **" + _a + "x² " + __b + "" + _c + " = 0** has roots of **" + x1 + "** and **" + x2 + "**.\nThe factors are **(x + " + _x1 + ")(x + " + _x2 + ")**. \nThe root pair is **(" + _b + " ± √" + (_b2 - _4ac) + ") / " + _2a + "**.");
		}
		return;
    }
    message.channel.send(`:symbols: *Find roots, factors for quadratic equations using Burgerbotz quadratic equation solver!*\n**Usage: /q <a> <b> <c>**`, 
    { 
        files: ['https://cdn.discordapp.com/attachments/563998568940306437/573793996694880256/unknown.png']
    });
}