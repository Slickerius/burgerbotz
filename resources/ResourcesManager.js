const fs = require(`fs`);

const utils = require(`../Utils.js`);

const capitals = require(`./Capitals.js`);
const flags = require(`./Flags.js`);

const burgerFile = fs.readFileSync(`./resources/BurgerGifs.txt`, `utf-8`);
const horseFile = fs.readFileSync(`./resources/HorseNames.txt`, `utf-8`);

exports.getBurgerGifs = () =>
{
    return burgerFile.split(/\r?\n/);
}

exports.getHorseNames = () =>
{
    return horseFile.split(/\r?\n/);
}

exports.getRandomCapital = () =>
{
    let { capitalCities } = capitals;
    let capitalCitiesNum = capitalCities.length;

    let determinant = utils.randomise(0, capitalCitiesNum);
    let capital = [capitalCities[determinant].name, capitalCities[determinant].city, capitalCities[determinant].difficulty, capitalCities[determinant].difficulty];
    let difficulty;

    switch(capital[2])
    {
        case 0:
            difficulty = `Very Easy`;
            break;

        case 1:
            difficulty = `Easy`;
            break;

        case 2:
            difficulty = `Medium`;
            break;

        case 3:
            difficulty = `Hard`;
            break;

        case 4:
            difficulty = `Very Hard`;
            break;
    }

    capital[2] = difficulty;
    return capital;
}

exports.getRandomFlag = () =>
{
    let { flagsCountry, flagsHistory, flagsUnrecognised } = flags;
    let flagsCountryNum = flagsCountry.length;
    let flagsHistoryNum = flagsHistory.length;
    let flagsUnrecognisedNum = flagsUnrecognised.length;

    let sum = flagsCountryNum + flagsHistoryNum + flagsUnrecognisedNum;
    let determinant = utils.randomise(0, sum);
    
    let flag;
    let difficulty;

    if(determinant <= flagsCountryNum)
    {
        flag = [`:flag_${flagsCountry[determinant].id.toLowerCase()}:`, flagsCountry[determinant].name, `Countries/Territories of the World`, flagsCountry[determinant].difficulty, flagsCountry[determinant].difficulty];
    } else if(determinant <= flagsCountryNum + flagsHistoryNum) {
        determinant -= flagsCountryNum;
        flag = [`<:${flagsHistory[determinant].id.toLowerCase()}>`, flagsHistory[determinant].name, `Historical Countries`, flagsHistory[determinant].difficulty, flagsHistory[determinant].difficulty];
    } else {
        determinant -= (flagsCountryNum + flagsHistoryNum);
        flag = [`<:${flagsUnrecognised[determinant].id.toLowerCase()}>`, flagsUnrecognised[determinant].name, `Unrecognised Countries`, flagsUnrecognised[determinant].difficulty, flagsUnrecognised[determinant].difficulty];
    }

    switch(flag[3])
    {
        case 0:
            difficulty = `Very Easy`;
            break;

        case 1:
            difficulty = `Easy`;
            break;

        case 2:
            difficulty = `Medium`;
            break;

        case 3:
            difficulty = `Hard`;
            break;

        case 4:
            difficulty = `Very Hard`;
            break;
    }

    flag[3] = difficulty;

    return flag;
}