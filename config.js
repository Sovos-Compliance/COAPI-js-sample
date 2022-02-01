const axios = require('axios');
const helpers = require('./helpers/requests.js');

/**
 * We create an instance of Axios based on environment variables.
 * Thus and such you will see that we use environment variables
 * in various places throughout the whole project.
 */
const instance = axios.create({
    baseURL: process.env.BASE_URL,
    timeout: (process.env.TIMEOUT_SECONDS * 1000) || 60 * 1000
});

/**
 * Thanks to the middleware we have added below, we ensure that
 * the request is sent again when the necessary conditions are met
 * and the Retry-After header exists in the client requests we will make.
 * However, we also put a limit on this mechanism. This way, there will
 * be no more attempts to resend requests than the number we have set.
 */
instance.interceptors.response.use(null, async error => {
    error.config.totalRetries = error.config.totalRetries || 0;
    error.config.timeElapsed = error.config.timeElapsed || 0;

    const { shouldRetry, retryAfter } = helpers.checkShouldRetry(error.config, error.response.status);

    if (shouldRetry) {
        await helpers.sleep(error.response.headers['Retry-After'] || retryAfter);

        error.config.totalRetries++;
        error.config.timeElapsed += retryAfter;

        return instance.request(error.config);
    }

    return Promise.reject(error);
});

module.exports = instance;