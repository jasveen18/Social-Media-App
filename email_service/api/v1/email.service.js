const { Email } = require("./email.model");
const { v4: uuid } = require("uuid");
const { transporter } = require("./helper/transporter");
const { BASEURL } = require("../../config");

/**
 * sends Email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns null
 */
async function sendEmail(to, subject, text) {
    await transporter.sendMail({
        to,
        subject: subject,
        text,
    });
    return;
}
/**
 * Deletes one doc searched by code
 * @param {string} code
 * @returns Email Document
 */
async function findOneAndDeleteByCode(code) {
    const doc = await Email.findOneAndDelete({ verificationCode: code }).exec();
    return doc;
}
/**
 * Deletes one doc searched by id
 * @param {ObjectId} id
 * @returns Email Document
 */
async function deleteOneById(id) {
    const doc = await Email.deleteOne({ _id: id });
    return doc;
}
/**
 * Creates email dispatch event
 * @param {string} eventName
 * @param {ObjectId} associatedUser
 * @returns Email Document
 */
async function createOne(eventName, associatedUser) {
    const code = await uuid();

    const doc = await Email.create({
        verificationCode: code,
        eventName,
        associatedUser,
    });
    return doc;
}
/**
 * Sends event email using different email
 * @param {string} eventName
 * @param {string} email
 * @param {string} username
 * @param {string} name
 * @param {string} code
 * @param {ObjectId} id
 * @returns boolean
 */
async function sendEventEmail(eventName, email, username, name, code, id) {
    try {
        let message = "";
        let subject = "";
        if (eventName === "verificationemail") {
            let url = BASEURL + "/api/v1/user";
            subject = "Verification Link for Account";
            message = `
            Dear ${name},

            You are just one step behind to verify your account and get most out of it 
            Please click the link below to confirm your account creation with username ${username}

            ${url}/email_verify/${code}
            `;
        } else if (eventName === "forgotpasswordemail") {
            subject = `Update Password Link For Username ${username}`;
            message = `
            Dear ${name},
            For updating the password add this token as code:[token] and send password both in the body
            If not requested then ignore this mail .You can login through your old password
            
            ${code}
            `;
        }
        await sendEmail(email, subject, message);
        return true;
    } catch (e) {
        console.log("send email failed due to ", e.message, "docid - ", id);
        return false;
    }
}
/**
 * Changes state of email if it fails to send
 * @param {ObjectId} id
 * @returns Email Document
 */
async function changeSendStatus(id) {
    return await Email.findByIdAndUpdate(id, { failed: true }).exec();
}
module.exports = {
    createOne,
    changeSendStatus,
    deleteOneById,
    findOneAndDeleteByCode,
    sendEmail,
    sendEventEmail,
};
