const axios = require('../config.js');
const fs = require('fs');
const path = require('path');
const helpers = require('../helpers/common.js');
const requestHelpers = require('../helpers/requests.js');

module.exports = {  
    /**
     * Fetch your XML documents and send them to CoAPI.
     * You can set up your ftp server to retrieve your documents, however,
     * we are getting our document from the sbds folder here.
     * 
     * In order to successfully send a document,
     * you must be sure that it follows the guidelines provided by Sovos
     * For more information: [developer guide](https://developer-guide.sovos.com/connect-once-api/general-concepts/standard-business-document)
     */
    async fetchAndSend() {
        // TODO: update how you fetch your files.
        const document = fs.readFileSync(path.join(__dirname, '../sbds/document.xml'), 'utf-8');
        if (!document) {
            throw new Error('Error reading the document');
        }
        return this.send(document);
    },

    /**
     * This method shows how the request should look when
     * you want to send a document. Please pay attention to
     * Correlation Id and Idempotency Key headers.
     * 
     * For more information, please visit: [documentation](https://developer.sovos.com/apis/e-invoicing#operation/Document_Post) or
     * [developer guide](https://developer-guide.sovos.com/connect-once-api/general-concepts/api-specifications/sending-and-retrieving-documents)
     * 
     * @param {string} document stringified Sovos Business Document
     */
    async send(document) {
        let response;
        let responseData;

        try {
            const path = '/v1/documents';
            const payload = {
                dataEncoding: 'base64',
                data: Buffer.from(document, 'binary').toString('base64')
            };
            const headers = await helpers.generateRequestHeaders({
                isPostRequest: true,
                payload
            });

            response = await axios.post(path, payload, { headers });
            responseData = response.data;

            // TODO: handle sent document
            console.log('[PostDocument] response.data = ', responseData);
            console.log('');
        } catch (error) {
            requestHelpers.handleNetworkError(error);
            responseData = error.response.data;
        }

        return responseData;
    },

    /**
     * This method helps build metadata object for the post request
     * when you want to execute an action on a document or multiple documents.
     * You may want to add extra information in your documents' metadata
     * especially if you are executing these actions:
     * "document.correction" or "document.distribute"
     * 
     * This is just a helper method just to remind you of what is needed for
     * an item (document object) in the document action payload.
     * 
     * For more information, please visit:
     * [developer guide](https://developer.sovos.com/apis/e-invoicing#operation/Document_PostActionMultipleDocs)

     * @param {string} documentId Id of the document
     * @param {Object} metadata Metadata options for the document to be sent
     * @param {string} metadata.reason - required. Reason why you're executing this action on the document
     * @param {string|null} [metadata.reasonCode]
     * @param {string|null} [metadata.companyId]
     * @param {string|null} [metadata.branchId]
     * @param {string|null} [metadata.documentType]
     * @param {string|null} [metadata.documentReferenceID]
     */
    createDocumentActionItem(documentId, metadata) {
        return {
            documentId,
            metadata
        };
    },

    /**
     * This method shows how the request should look when
     * you want to cancel a document. Please pay attention to
     * Correlation Id and Idempotency Key headers.
     * 
     * For more information, please visit: [documentation](https://developer.sovos.com/apis/e-invoicing#operation/Document_PostActionMultipleDocs) or
     * [developer guide](https://developer-guide.sovos.com/connect-once-api/general-concepts/api-specifications/sending-and-retrieving-documents)
     * 
     * @param {string} countryCode The two-digit country code specified by the ISO 3166-1 alpha-2 standard
     * @param {Object} payload Payload for the document action. Please refer to
     * createDocumentActionItem helper function for more details on creating documents.
     * @param {"document.cancellation" | "document.correction" | "document.distribute"} payload.actionCode
     * Action code for the document to be sent. There are three values you can use here:
     * "document.cancellation", "document.correction" or "document.distribute".
     * You may want to add extra metadata information in your documents other than
     * "reason" field if you are using "document.correction" or "document.distribute".
     * @param {Object[]} payload.documents Documents to be sent. You may want to refer to
     * createDocumentActionItem helper function when creating these documents.
     * @param {string} payload.documents[].documentId Id of the document
     * @param {Object} payload.documents[].metadata Metadata options for the document to be sent
     * @param {string} payload.documents[].metadata.reason - required. Reason why you're executing this action on the document
     * @param {string|null} [payload.documents[].metadata.reasonCode]
     * @param {string|null} [payload.documents[].metadata.companyId]
     * @param {string|null} [payload.documents[].metadata.branchId]
     * @param {string|null} [payload.documents[].metadata.documentType]
     * @param {string|null} [payload.documents[].metadata.documentReferenceID]
     */
     async executeAction(countryCode, payload) {
        let response;
        let responseData;
        
        try {
            const path = `/v1/documents/${countryCode}/action`;
            const headers = await helpers.generateRequestHeaders({
                isPostRequest: true,
                payload
            });

            response = await axios.post(path, payload, { headers });
            responseData = response.data;

            // TODO: handle action executed on documents
            console.log('[CancelDocument] response.data = ', responseData);
            console.log('');
        } catch (error) {
            requestHelpers.handleNetworkError(error);
            responseData = error.response.data;
        }

        return responseData;
    }
}