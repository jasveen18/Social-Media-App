const User = require('../models/userModel');


async function findOnebyEmailorUsername(username, email) {
    return await User.findOne({ $or: [{ email }, { username }] }).exec();
};

async function createOne(user) {
    const doc = new User(user);
    await doc.save();
    return doc;
};

async function findOneAndUpdate(filter, update) {
    let doc = await User.findOneAndUpdate(filter, update, {
        new: true,
    });
    return doc;
};

async function findOneById(id) {
    return await User.findById(id).exec();
};

async function search(username, email){
    return await User.find({
            username:{$regex:username, $options:'$i'},
            email:{$regex:email, $options:'$i'}
    });
};

async function findOneOnly(id){
    return await User.findOne(id);
};


module.exports = {
    findOnebyEmailorUsername,
    createOne,
    findOneAndUpdate,
    findOneById,
    search,
    findOneOnly,
};