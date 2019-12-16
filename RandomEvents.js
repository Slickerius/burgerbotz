const Discord = require('discord.js');
const fs = require('fs');
const unst = require('./storage/unstatics.js');

//Messages
var msg;

//Event 0 => Mugging

var x0_msg_0 = " You have been approached by a mugger! Do you:**\n**[1]** Confront\n**[2]** Cry for help\n**[3]** Flee";

var x0_msg_1 = "**:punch: You chose to confront the mugger and succeeded. They begged for your mercy.**";
var x0_msg_2 = "**:dizzy_face: You chose to confront the mugger but they overpowered you. You lost :hamburger: ";

var x0_msg_3 = "**:speaking_head: You yelled for help and others rushed to the rescue. The mugger fled the scene.**";
var x0_msg_4 = "**:speak_no_evil: You tried to yell for help but the mugger threatened to hurt you. You stopped and watched as the mugger fled with your :hamburger: ";

var x0_msg_5 = "**You let the mugger take :hamburger: ";

// Event 1 => Briefcase

var x1_msg_0 = " You have found a briefcase! Do you:**\n**[1]** Take it\n**[2]** Ignore it\n**[3]** Return it";

var x1_msg_1 = "**:money_mouth: You decided to take the briefcase and found that it contains :hamburger: ";
var x1_msg_2 = "**:confused: You decided to take the briefcase which turned out to be empty.**";
var x1_msg_3 = "**:man_police_officer: :raised_back_of_hand: You were caught attempting to steal a briefcase and had to pay a fine as much as :hamburger: ";

var x1_msg_4 = "**:person_shrugging: You decided to leave the briefcase and move along.**";

var x1_msg_5 = "**:smile: You decided to return the briefcase to whom it belongs, and they gratefully gave you :hamburger: ";
var x1_msg_6 = "**:angel: You returned the briefcase to its owner, who thanked you for your honesty.**";

//Event 2 => Paper

var x2_msg_0 = " You have been approached by a person in a suit, handing over to you a piece of paper on which your signature is expected. Do you:**\n**[1]** Sign it\n**[2]** Flee";

var x2_msg_1 = "**:tada: The paper turned out to be a registration form for a lucky draw, which you won. You received :hamburger: ";
var x2_msg_2 = "**:confused: You signed the paper but nothing happened.**";
var x2_msg_3 = "**:dizzy_face: You signed the paper which turned out to be a cunning scam. You lost :hamburger: ";

var x2_msg_4 = "**:person_walking: You declined to sign the paper and walked away.**";

//Event 3 => Homeless

var x3_msg_0 = " You see a homeless person who appears to be fast asleep. Do you:**\n**[1]** Donate\n**[2]** Ignore them\n**[3]** Steal from them";

var x3_msg_1 = "**:angel: You donated :hamburger: ";
var x3_msg_2 = "**:camera_with_flash: As you were attempting to donate to them, they revealed themselves to be a YouTuber filming a social experiment and thanked you for your honesty. They also gave you :hamburger: ";

var x3_msg_3 = "**:person_walking: Unbothered, you walked on from the scene.**";

var x3_msg_4 = "**:punch: They woke up as soon as you attempted to reach for their hamburgers. They tried to assault you but you overpowered them and took :hamburger: ";
var x3_msg_5 = "**:dizzy_face: You attempted to steal from them which resulted in them waking up. They assaulted you and left after taking :hamburger: ";
var x3_msg_6 = "**:confused_face: You reached for their pockets but they do not seem to have anything valuable with them.**";
var x3_msg_7 = "**:money_mouth: You found and took :hamburger: ";
var x3_msg_8 = "**:pensive: You fled the scene after stealing from them and a group of people with cameras claiming to be YouTubers approached you, claiming it was merely a social experiment. You returned what you stole and walked away in shame.**";

module.exports =
{
        call: function(channel, user, id, stage, value)
        {
                if(id == 0)
                {
                        if(stage == 0)
                        {
                                msg = "**:dagger: " + user + x0_msg_0;
                        } else if(stage == 1) {
                                msg = x0_msg_1;
                        } else if(stage == 2) {
                                msg = x0_msg_2 + value + ".**";     
                        } else if(stage == 3) {
                                msg = x0_msg_3;    
                        } else if(stage == 4) {
                                msg = x0_msg_4 + value + ".**";  
                        } else if(stage == 5) {
                                msg = x0_msg_5 + value + " and fled the scene.**";
                        }
                        channel.send(msg);
                        msg = "";
                } else if(id == 1) {
                        if(stage == 0)
                        {
                                msg = "**:briefcase: " + user + x1_msg_0;
                        } else if(stage == 1) {
                                msg = x1_msg_1 + value + ".**";
                        } else if(stage == 2) {
                                msg = x1_msg_2;     
                        } else if(stage == 3) {
                                msg = x1_msg_3 + value + ".**";    
                        } else if(stage == 4) {
                                msg = x1_msg_4;  
                        } else if(stage == 5) {
                                msg = x1_msg_5 + value + " as a bonus.**";
                        } else if(stage == 6) {
                                msg = x1_msg_6;
                        }
                        channel.send(msg);
                        msg = "";
                } else if(id == 2) {
                        if(stage == 0)
                        {
                                msg = "**:scroll: :pen_fountain: " + user + x2_msg_0;
                        } else if(stage == 1) {
                                msg = x2_msg_1 + value + ".**";
                        } else if(stage == 2) {
                                msg = x2_msg_2;     
                        } else if(stage == 3) {
                                msg = x2_msg_3 + value + ".**";    
                        } else if(stage == 4) {
                                msg = x2_msg_4;  
                        }
                        channel.send(msg);
                        msg = "";
                } else if(id == 3) {
                        if(stage == 0)
                        {
                                msg = "**:sleepy: " + user + x3_msg_0;
                        } else if(stage == 1) {
                                msg = x3_msg_1 + value + " to the homeless person.**";
                        } else if(stage == 2) {
                                msg = x3_msg_2 + value + " for your honesty.**";     
                        } else if(stage == 3) {
                                msg = x3_msg_3;    
                        } else if(stage == 4) {
                                msg = x3_msg_4 + value + ".**";  
                        } else if(stage == 5) {
                                msg = x3_msg_5 + value + ".**";
                        } else if(stage == 6) {
                                msg = x3_msg_6;     
                        } else if(stage == 7) {
                                msg = x3_msg_7 + value + ".**";
                        } else if(stage == 8) {
                                msg = x3_msg_8;     
                        }
                        channel.send(msg);
                        msg = "";
                }
        }
};
