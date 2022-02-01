const axios = require('../config.js');
const requestHelpers = require('../helpers/requests.js');
const helpers = require('../helpers/common.js');

module.exports = {
    /**
     * This method shows how the request should look when
     * you want to retrieve notifications using search criteria.
     * 
     * For more information, please visit: [documentation](https://developer.sovos.com/apis/e-invoicing#operation/Notifications_Get) or
     * [developer guide](https://developer-guide.sovos.com/connect-once-api/general-concepts/api-specifications/retrieving-and-acknowledging-notifications)
     * 
     * @param {string} countryCode The two-digit country code specified
     * by the ISO 3166-1 alpha-2 standard
     * @param {Object} params required - Query parameters
     * @param {number} params.taxId required - Sender tax id
     * @param {number} params.sourceSystemId required - Sender system id
     * @param {number} [params.page=1] Specifies the page of results to return.
     * The default is 1.
     * @param {number} [params.perPage=50] Specifies how many results to return
     * for this page. The Default is 50.
     * @param {boolean} [params.includeAcknowledged=false] Determines whether
     * previously acknowledged notifications will be included in the response
     * or not. The default behavior is "false".
     * @param {boolean} [params.includeBinaryData=false] Determines whether
     * binary data will be included in the application response instead of 
     * only URLs. The default behavior is "false".
     * @param {boolean} [params.processType] Determines whether
     * outbound or inbound notifications will be retrieved.
     * Use "0" for outbound and "1" for inbound. 
     * Excluding this will lead to the inclusion of both outbound and inbound notifications.
     * @returns {*} response data
     */
    async retrieve(countryCode, params) {
        let response;
        let responseData;

        try {
            const path = `/v1/notifications/${countryCode}`;
            const headers = await helpers.generateRequestHeaders();

            response = await axios.get(path, { headers, params });
            responseData = response.data;

            // TODO: handle retrieved notifications
            console.log('[RetrieveNotifications] response.data = ', responseData);
            console.log('');
        } catch (error) {
            requestHelpers.handleNetworkError(error);
            responseData = error.response.data;
        }

        return responseData;
    },

    /**
     * This method shows how the request should look when
     * you want to retrieve a notification by id.
     * 
     * For more information, please visit: [documentation](https://developer.sovos.com/apis/e-invoicing#operation/Document_GetNotifications) or
     * [developer guide](https://developer-guide.sovos.com/connect-once-api/general-concepts/api-specifications/retrieving-and-acknowledging-notifications)
     * 
     * @param {string} countryCode The two-digit country code specified
     * by the ISO 3166-1 alpha-2 standard
     * @param {string} notificationId The id of the notification to be returned
     * @param {Object} params Optional query parameters
     * @param {boolean} [params.includeBinaryData=false] Determines whether
     * binary data will be included in the application response instead of
     * only URLs. The default behavior is "false".
     * @returns {*} response data
     */
    async retrieveById(countryCode, notificationId, params={}) {
        let response;
        let responseData;

        try {
            const path = `/v1/notifications/${countryCode}/${notificationId}`;
            const headers = await helpers.generateRequestHeaders();

            response = await axios.get(path, { headers, params });
            responseData = response.data;

            // TODO: handle retrieved notification
            console.log('[RetrieveNotificationById] response.data = ', responseData);
            console.log('');
        } catch (error) {
            requestHelpers.handleNetworkError(error);
            responseData = error.response.data;
        }

        return responseData;
    },

    /**
     * This method shows how the request should look when
     * you want to retrieve notifications by document id.
     * 
     * For more information, please visit: [documentation](https://developer.sovos.com/apis/e-invoicing#operation/Document_GetNotifications) or
     * [developer guide](https://developer-guide.sovos.com/connect-once-api/general-concepts/api-specifications/retrieving-and-acknowledging-notifications)
     * 
     * @param {string} countryCode The two-digit country code specified
     * by the ISO 3166-1 alpha-2 standard
     * @param {string} documentId The id of the document to be returned.
     * @param {Object} params Optional query parameters
     * @param {boolean} [params.includeAcknowledged=false] Determines whether
     * previously acknowledged notifications will be included in the response
     * or not. The default behavior is "false".
     * @param {boolean} [params.includeBinaryData=false] Determines whether
     * binary data will be included in the application response instead of
     * only URLs. The default behavior is "false".
     * @returns {*} response data
     */
    async retrieveByDocumentId(countryCode, documentId, params={}) {
        let response;
        let responseData;

        try {
            const path = `/v1/documents/${countryCode}/${documentId}/notifications`;
            const headers = await helpers.generateRequestHeaders();
            response = await axios.get(path, { headers, params });
            responseData = response.data;

            // TODO: handle retrieved notifications
            console.log('[RetrieveNotificationsByDocumentId] response.data = ', responseData);
            console.log('');
        } catch (error) {
            requestHelpers.handleNetworkError(error);
            responseData = error.response.data;
        }

        return responseData;
    },

    /**
     * This method shows how the request should look when
     * you want to mark processed notifications as "read",
     * or mark notifications that have not been properly processed as "unread".
     * 
     * For more information, please visit: [documentation](https://developer.sovos.com/apis/e-invoicing#operation/Notifications_Put) or
     * [developer guide](https://developer-guide.sovos.com/connect-once-api/general-concepts/api-specifications/retrieving-and-acknowledging-notifications)
     * 
     * @param {string} countryCode The two-digit country code specified by the ISO 3166-1 alpha-2 standard
     * @param {string[]} notificationIds
     * @param {"read"|"unread"} status Status of the notifications. 
     * @returns {*} response data
     */
    async mark(countryCode, notificationIds, status="read") {
        let response;
        let responseData;
        
        try {
            const path = `/v1/notifications/${countryCode}`;
            const payload = notificationIds.map(notificationId => ({
                notificationId,
                status
            }));
            const headers = await helpers.generateRequestHeaders();

            response = await axios.put(path, payload, { headers });
            responseData = response.data;

            // TODO: handle marked notifications
            console.log('[AcknowledgeNotifications] response.data = ', responseData);
            console.log('');
        } catch (error) {
            requestHelpers.handleNetworkError(error);
            responseData = error.response.data;
        }

        return responseData;
    }
}