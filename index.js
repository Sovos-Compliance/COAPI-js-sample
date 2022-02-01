const documents = require('./methods/documents.js');
const requestHelpers = require('./helpers/requests.js');
const notifications = require('./methods/notifications.js');

/**
 * This part is just the initial method. In other words, it is
 * the place where we call the methods we have written and wait
 * for certain data to be returned and use this data elsewhere.
 */
async function run() {
    try {
        // retrieve global values
        const countryCode = process.env.COUNTRY_CODE;
        const taxId = process.env.SENDER_TAX_ID;
        const sourceSystemId = process.env.SENDER_SYSTEM_ID;

        /**
         * You should have a service where you create your own
         * SBD (Standard Business Document), and where you can fetch
         * your SBD files from. In this example, we are getting
         * our document from the sbds folder in this project.
         * You will either add a SBD file in the sbds folder, or change
         * the implementation of the below method.
         * 
         * For more information on SBD:
         * https://developer-guide.sovos.com/connect-once-api/general-concepts/standard-business-document
         */
        const newDocumentResponse = await documents.fetchAndSend();

        /**
         * You can retrieve all notifications.
         * Please pay attention to limits:
         * page parameter's range is [1, 10]
         * perPage parameter's range is [1, 100] if includeBinaryData is false, and
         * perPage parameter's range is [1, 10] if includeBinaryData is true.
         */
        const notificationsResponse = await notifications.retrieve(countryCode, {
            taxId,
            sourceSystemId,
            page: 1,
            perPage: 20,
            includeBinaryData: false
        });
        
        // if you have no notifications, the status code will be 404.
        if (notificationsResponse.status === 200) {
            /**
             * You can also get notifications by the document id
             * or a single notification by id
             */
            const notificationId = notificationsResponse.data.notifications[0].notificationId;
            const notifDocId = notificationsResponse.data.notifications[0].metadata.documentId;
            const notificationById = await notifications.retrieveById(countryCode, notificationId);
            const notificationsByDocument = await notifications.retrieveByDocumentId(countryCode, notifDocId);
        
            /**
             * You can acknowledge notificitations
             * or you may want to mark these notifications as "unread" if you think
             * they are not processed properly
             */
            await notifications.mark(countryCode, [notificationId], 'read');
            // await notifications.mark(countryCode, notificationIds, 'unread')
        }
        
        /**
         * Actions on documents: you may cancel, correct or distribute documents.
         * 
         * Here, documentId represents a document that was created and approved
         * prior to this call. You will not be able to cancel the document
         * before it is approved.
         * 
         * Set an approved document id for the SAMPLE_DOCUMENT_ID if you want to
         * use the code below
         */
        const documentId = process.env.SAMPLE_DOCUMENT_ID;
        if (documentId) {
            const documentItem = documents.createDocumentActionItem(documentId, {
                reason: 'Reason for cancelling the document',
                // add more fields if necessary
                // ...
            });
    
            await documents.executeAction(countryCode, {
                actionCode: 'document.cancellation',
                documents: [documentItem]
            });
        }
    } catch (error) {
        requestHelpers.handleGenericError(error);
    }
}

run();