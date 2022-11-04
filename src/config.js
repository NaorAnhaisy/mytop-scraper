const USERS_TO_EMAIL = process.env.NODE_ENV === 'production' ?
    process.env.EMAIL_RECIVERS.split(',') : process.env.DEV_EMAIL_RECIVER;

module.exports = { USERS_TO_EMAIL };