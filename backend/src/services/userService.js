const UserProfile = require("../models/UserProfile");

async function createUser(userData) {

    const user = await UserProfile.create(userData);

    return user;

}

const getUserProfile = async (learnerId) => {
    return await UserProfile.findOne({ learnerId });
};

module.exports = {
    createUser,
    getUserProfile
};