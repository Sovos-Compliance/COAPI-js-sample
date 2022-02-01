const documents = require('../methods/documents');

describe('documents', () => {
    it('should send a document successfully', async () => {
        const response = await documents.fetchAndSend();
        expect(response.success).toBe(true);
    });

    it('should cancel a document successfully', async () => {
        // documentId documentId represents a document that was created and approved
        // prior to this call. You will not be able to cancel the document
        // before it is approved.
        const documentId = process.env.SAMPLE_DOCUMENT_ID;
        if (documentId) {
            const countryCode = process.env.COUNTRY_CODE;
            const response = await documents.executeAction(countryCode, {
                actionCode: 'document.cancellation',
                documents: [
                    {
                        documentId,
                        metadata: {
                            reason: 'Reason for cancelling the document'
                        }
                    }
                ]
            });
            expect(response.success).toBe(true);
        }
    });
});