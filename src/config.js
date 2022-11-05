const USERS_TO_EMAIL = process.env.NODE_ENV === 'production' ?
    process.env.EMAIL_RECIVERS.split(',') : process.env.DEV_EMAIL_RECIVER;

const isProductionEnv = process.env.NODE_ENV === 'production';
const isDevelopmentEnv = process.env.NODE_ENV === 'development';

module.exports = { USERS_TO_EMAIL, isProductionEnv, isDevelopmentEnv };