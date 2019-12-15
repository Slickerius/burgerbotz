const Discord = require('discord.js');
const fs = require('fs');
const unst = require('./storage/unstatics.js');

//Messages
var msg;

//Event 0

var x0_msg_0 = "**:dagger: You have been approached by a mugger! Do you:**\n**[1]** Confront\n**[2]** Cry for help\n**[3]** Flee";

var x0_msg_1 = "**:punch: You chose to confront the mugger and succeeded. They begged for your mercy.**";
var x0_msg_2 = "**:dizzy_face: You chose to confront the mugger but they overpowered you. You lost :hamburger: ";

var x0_msg_3 = "**:speaking_head: You yelled for help and others rushed to the rescue. The mugger fled the scene.**";
var x0_msg_4 = "**:speak_no_evil: You tried to yell for help but the mugger threatened to hurt you. You stopped and watched as the mugger fled with your :hamburger: ";

var x0_msg_5 = "**You let the mugger take :hamburger: ";

// Event 1

var x1_msg_0 = "**:briefcase: You have found a briefcase! Do you: **[1]** Take it\n**[2]** Ignore it\n**[3]** Return it";

var x1_msg_1 = "**:money_mouth: You decided to take the briefcase and found that it contains :hamburger: ";
var x1_msg_2 = "**:confused: You decided to take the briefcase which turned out to be empty.**";
var x1_msg_3 = "**:man_police_officer: :raised_back_of_hand: You were caught attempting to steal a briefcase and had to pay a fine as much as :hamburger: ";

var x1_msg_4 = "**:person_shrugging: You decided to leave the briefcase and move along.**";

var x1_msg_5 = "**:smile: You decided to return the briefcase to whom it belongs, and they gratefully gave you :hamburger: ";
var x1_msg_6 = "**:angel: You returned the briefcase to its owner, who thanked you for your honesty.**";

//

module.exports =
{
        call: function(channel, id, stage, value)
        {
                if(id == 0)
                {
                        if(stage == 0)
                        {
                                msg = x0_msg_0;
                        } else if(stage == 1) {
                                msg = x0_msg_1;
                        } else if(stage == 2) {
                                msg = x0_msg_2 + value + "**";     
                        } else if(stage == 3) {
                                msg = x0_msg_3;    
                        } else if(stage == 4) {
                                msg = x0_msg_4 + value + "**";  
                        } else if(stage == 5) {
                                msg = x0_msg_5 + value + " and fled the scene.**";
                        }
                        channel.send(msg);
                        msg = "";
                } else if(id == 1) {
                        if(stage == 0)
                        {
                                msg = x1_msg_0;
                        } else if(stage == 1) {
                                msg = x1_msg_1 + value + "**";
                        } else if(stage == 2) {
                                msg = x1_msg_2;     
                        } else if(stage == 3) {
                                msg = x1_msg_3 + value + "**";    
                        } else if(stage == 4) {
                                msg = x1_msg_4;  
                        } else if(stage == 5) {
                                msg = x1_msg_5 + value + " as a bonus.**";
                        } else if(stage == 5) {
                                msg = x1_msg_6;
                        }
                        channel.send(msg);
                        msg = "";
                }
        }
};
