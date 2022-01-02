const validator = require("validator");
const { isValidObjectId } = require("mongoose");
const { validate } = require("uuid");

/**
 * Validates email is correct or not
 * @param {string} email
 * @returns boolean
 */
exports.emailValidator = (email) => {
    try {
        return validator.isEmail(email);
    } catch (e) {
        return false;
    }
};
/**
 * Check whether the id provided is valid or not
 * @param {ObjectId} id
 * @returns boolean
 */
exports.IdValidator = (id) => {
    try {
        return isValidObjectId(id) && validator.isMongoId(id);
    } catch (e) {
        return false;
    }
};

/**
 * checks whether the eventName for dispatching email is correct or not
 * @param {string} eventName
 * @returns boolean
 */
exports.eventValidator = (eventName) => {
    const acceptedEventName = ["verificationemail", "forgotpasswordemail"];
    return acceptedEventName.includes(eventName);
};

/**
 * checks whether verification code is valid for application or not
 * @param {string} code
 * @returns boolean
 */
exports.verificationCodeValidator = (code) => {
    if (validate(code)) return true;
    return false;
};
