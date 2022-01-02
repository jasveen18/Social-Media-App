const jwt = require("jsonwebtoken");

const newToken = (content, secret, expiry) => {
  console.log("[Token Manager]: New token issued");
  return jwt.sign(content, secret, {
    expiresIn: expiry,
  });
};

const verify = (token, secret) => {
  try {
    const info = jwt.verify(token, secret);
    return {
      verified: true,
      content: info,
    };
  } catch (err) {
    return {
      verified: false,
      content: err.message,
    };
  }
};

module.exports = { newToken, verify };