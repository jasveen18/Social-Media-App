require("dotenv").config();

const config = {
    MODE: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    EMAIL_USERNAME: process.env.EMAIL_USERNAME,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    
    SECRET_KEY: process.env.SECRET_KEY || 'secret_key',
    JWTEXP: '5d',

    DATABASE: process.env.DATABASE,
};

module.exports = config;
