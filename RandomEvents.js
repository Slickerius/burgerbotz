const Discord = require('discord.js');
const fs = require('fs');
const unst = require('./storage/unstatics.js');

//Messages
var 0msg_0 = "**:dagger: You have been approached by a mugger! Do you:**\n**[1]** Confront\n**[2]** Cry for help\n**[3]** Flee";

var 0msg_1 = "**:punch: You chose to confront the mugger and succeeded. They begged for your mercy.";
var 0msg_2 = "**:dizzy: You chose to confront the mugger but they overpowered you. You lost :hamburger: **";

var 0msg_3 = ":speaking_head: You yelled for help and others rushed to the rescue. The mugger fled the scene.";
var 0msg_4 = ":speak_no_evil: You tried to yell for help but the mugger threatened to hurt you. You stopped and watched as the mugger fled with your :hamburger: **";

var 0msg_5 = "You let the mugger take :hamburger: **";
//

module.exports =
{
        call: function(channel, id, stage, value)
        {
                if(id == 0)
                {
                        if(stage == 0)
                        {
                                channel.send(0msg_0);
                        } else if(stage == 1) {
                                channel.send(0msg_1);
                        } else if(stage == 2) {
                                0_msg_2 += value + "**";
                                channel.send(0msg_2);       
                        } else if(stage == 3) {
                                channel.send(0msg_3);      
                        } else if(stage == 4) {
                                0_msg_4 += value + "**";
                                channel.send(0msg_4);       
                        } else if(stage == 5) {
                                0_msg_5 += value + "** and fled the scene";
                                channel.send(0msg_5);
                        }
                }
        }
};
