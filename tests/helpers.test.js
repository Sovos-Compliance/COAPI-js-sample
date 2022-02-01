const axios = require('../config');
const { checkShouldRetry } = require('../helpers/requests');
const helpers = require('../helpers/common');

jest.mock('../config');
axios.post.mockImplementation(() => ({
    data: {
        access_token: 'some-valid-access-token', 
        expires_in: '3600'
    }
}));

describe('helper functions', () => {
    it('reuses the access token stored in process.env with subsequent requests', async () => {
        process.env.ACCESS_TOKEN = '';
        process.env.ACCESS_TOKEN_EXPIRE = '0';
        
        const accessToken1 = await helpers.getAccessToken();
        const accessToken2 = await helpers.getAccessToken();
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(accessToken1).toEqual(accessToken2);
    });

    it.each([
        408,
        429,
        500,
        502,
        504
    ])('should retry after 60 seconds', (statusCode) => {
        const { shouldRetry, retryAfter } = checkShouldRetry({
            totalRetries: 0, 
            timeElapsed: 0
        }, statusCode);
        
        expect(shouldRetry).toBe(true);
        expect(retryAfter).toEqual(60);
    });

    it.each([
        500,
        502,
        504
    ])('should retry after 300 seconds', (statusCode) => {
        const { shouldRetry, retryAfter } = checkShouldRetry({
            totalRetries: 1, 
            timeElapsed: 60
        }, statusCode);
        
        expect(shouldRetry).toBe(true);
        expect(retryAfter).toEqual(300);
    });
});