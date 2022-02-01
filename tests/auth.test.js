const helpers = require('../helpers/common');

describe('Access token', () => {    
    it('gets success token successfully with the right credentials', async () => {
        process.env.ACCESS_TOKEN = '';
        process.env.ACCESS_TOKEN_EXPIRE = '0';
        
        const accessToken = await helpers.getAccessToken();
        expect(accessToken).toBeDefined();
    });
});