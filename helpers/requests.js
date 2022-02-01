module.exports = {
    // TODO: handle network errors
    handleNetworkError(error) {
        console.log('');

        if (error.response) {
            /**
             * The request was made and the server responded with a status code
             * that falls out of the range of 2xx
             */
            this.handleResponseError(error, false);
        } else if (error.request) {
            /**
             * The request was made but no response was received
             * `error.request` is an instance of XMLHttpRequest in the browser
             * and an instance of http.ClientRequest in node.js
             */
            this.handleRequestError(error, false);
        } else {
            /**
             * Something happened in setting up the request that triggered an Error
             */
            this.handleGenericError(error, false);
        }

        console.log('');
    },
    handleResponseError(error, putEmptyLines = true) {
        putEmptyLines && console.log('');
        console.log('[NETWORK] error.response.status = ', error.response.status);
        console.log('[NETWORK] error.response.statusText = ', error.response.statusText);
        console.log('[NETWORK] error.response.headers = ', error.response.headers);
        console.log('[NETWORK] error.response.data = ', error.response.data);
        console.log('[NETWORK] error.config = ', error.config);
        putEmptyLines && console.log('');
    },
    handleRequestError(error, putEmptyLines = true) {
        putEmptyLines && console.log('');
        console.log('[NETWORK] error.request =', error.request);
        console.log('[NETWORK] error.config = ', error.config);
        putEmptyLines && console.log('');
    },
    handleGenericError(error, putEmptyLines = true) {
        putEmptyLines && console.log('');
        console.log('[GENERIC] error.message =', error.message);
        console.log('[GENERIC] error.stack = ', error.stack);
        putEmptyLines && console.log('');
    },
    /**
     * Check whether a request should retry or not.
     * The code should wait for 60 seconds before retrying.
     * If the status code is in the range of 500,
     * the code should retry after 60 seconds, followed by every 300 seconds until 3600 seconds.
     * For more information: https://developer-guide.sovos.com/connect-once-api/general-concepts/responses
     * 
     * @param {{totalRetries: number, timeElapsed: number}} config axios' custom error config object
     * @param {number} statusCode HTTP Status Code
     * @returns {{retryAfter: number, shouldRetry: boolean}}
     */
    checkShouldRetry(config, statusCode) {
        // Add your custom retry limit if necessary
        if (config.totalRetries > process.env.RETRY_LIMIT) {
            return { retryAfter: 0, shouldRetry: false };
        }

        if (statusCode === 408 || statusCode === 429) {
            return { retryAfter: 60, shouldRetry: true };
        }

        if (statusCode >= 500 && statusCode !== 501 && config.timeElapsed < 3600) {
            return {
                retryAfter: config.totalRetries > 0 ? 300 : 60,
                shouldRetry: true
            };
        }

        return { retryAfter: 0, shouldRetry: false };
    },
    sleep(seconds = process.env.RETRY_DEFAULT_SECONDS) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    },
}