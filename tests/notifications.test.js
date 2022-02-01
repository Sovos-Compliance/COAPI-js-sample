const notifications = require('../methods/notifications');

const countryCode = process.env.COUNTRY_CODE;
const sourceSystemId = process.env.SENDER_SYSTEM_ID;
const taxId = process.env.SENDER_TAX_ID;
const documentId = process.env.SAMPLE_DOCUMENT_ID;

describe('notifications', () => {
    it('should respond with error when perPage param is out of range', async () => {
        const response = await notifications.retrieve(countryCode, {
            sourceSystemId,
            taxId,
            page: 1,
            perPage: 101
        });
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
    });

    it('should retrieve all notifications', async () => {
        const response = await notifications.retrieve(countryCode, {
            sourceSystemId,
            taxId
        });
        expect(response.success).toBe(true);
    });

    it('should retrieve a notification by id', async () => {
        const list = await notifications.retrieve(countryCode, {
            sourceSystemId,
            taxId,
            page: 1,
            perPage: 1
        });
        expect(list.success).toBe(true);

        const notificationId = list.data.notifications[0].notificationId;
        const response = await notifications.retrieveById(countryCode, notificationId);
        expect(response.success).toBe(true);
    });

    it('should retrieve notifications by document id', async () => {
        const response = await notifications.retrieveByDocumentId(countryCode, documentId);
        expect(response.success).toBe(true);
    });

    it('should acknowledge notifications', async () => {
        // you can retrieve all notifications instead
        const list = await notifications.retrieveByDocumentId(countryCode, process.env.SAMPLE_DOCUMENT_ID);
        expect(list.success).toBe(true);
                
        const ids = list.data.notifications.map((item)=> item.notificationId);
        const response = await notifications.mark(countryCode, ids, 'read');
        expect(response.success).toBe(true);
    });
});