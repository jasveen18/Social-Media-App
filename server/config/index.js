require('dotenv').config();

const config = {
    MODE: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    EMAIL: process.env.EMAIL,
    
    JWTSECRETKEY: process.env.JWTSECRETKEY || 'secret_key',
    JWTEXP: '5d',

    DATABASE: process.env.DATABASE,

}


module.exports = config;
    