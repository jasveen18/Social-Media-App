const mongoose = require("mongoose"),
    { DBURL } = require("../../../config");

const connect = async (url = DBURL, opts = {}) => {
    mongoose.connection.on("connected", () => {
        console.log("connected to db");
    });
    mongoose.connection.on("disconnected", () => {
        console.log("disconnected db");
        throw new Error("Database disconnected");
    });

    return await mongoose.connect(url, {
        ...opts,
        useNewUrlParser: true,
    });
};

module.exports.connect = connect;
