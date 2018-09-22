module.exports = 
{
    post: function(channel, arg) 
    {
        if(arg.length > 1)
				{
					return channel.send(arg);
				} else {
					return channel.send("Correct usage: /post <message>");
				}
    }
};
