const UserProfile = require("../models/UserProfile");

async function createUser(userData) {

    const user = await UserProfile.create(userData);

    return user;

}

module.exports = {
    createUser
};