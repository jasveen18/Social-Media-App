const { Router } = require("express");
const emailcontroller = require("./email.controller");

const emailRouter = Router();
emailRouter.post("/send_email", emailcontroller.sendEmail);
emailRouter.post("/", emailcontroller.createEmailEntry);
emailRouter.delete("/:id", emailcontroller.deleteOnebyId);
emailRouter.post("/getbycode", emailcontroller.getOneByCode);

module.exports = emailRouter;
