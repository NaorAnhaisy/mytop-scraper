const isProductionEnv = process.env.NODE_ENV === 'production';
const isDevelopmentEnv = process.env.NODE_ENV === 'development';

module.exports = { isProductionEnv, isDevelopmentEnv };