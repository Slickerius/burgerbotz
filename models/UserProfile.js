const mongoose = require(`mongoose`);

const userProfileSchema = new mongoose.Schema(
{
    id: String,
    burgers: Number
});

module.exports = mongoose.model(`UserProfile`, userProfileSchema);
