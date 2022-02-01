# Sovos CoAPI JavaScript Code Sample

This repository contains a sample implementation for the client to make the following requests:
- Generate access token
- Send an invoice document
- Take actions such as cancelling, correction or distribution of a created document
- Retrieve notifications
- Acknowledge notifications

## Setup
Download & install [NodeJS](https://nodejs.org/en/download)

Install dependencies:
```
npm install
```
The code sample makes use of **[dotenv package][dep]**. This is why the environment variables are configured in an .env file in the root folder.

Set up your .env file accordingly.

| Variable | Description |
| -------- | ----------- |
| BASE_URL | https://api.sovos.com * |
| API_KEY | API key that you receive when you create your app on the [developer portal][devportal]. |
| SECRET_KEY | API Secret key that you receive when you create your app on the [developer portal][devportal]. |
| SENDER_TAX_ID | Your tax ID |
| SENDER_SYSTEM_ID | System ID provided by Sovos |
| RETRY_DEFAULT_SECONDS | The sample code provides timeouts for retrying mechanism. This is usually provided by Sovos in the "Retry-After" header |
| RETRY_LIMIT | You may want to limit the resending requests in case they fail for your convenience. |
| TIMEOUT_SECONDS | Timeout (in seconds) that provide for the configuration of Axios |
| COUNTRY_CODE | The country code that you are using the APIs for |
| SAMPLE_DOCUMENT_ID | You may need to provide a document ID for one of the test case scenarios |

*There are three BASE URLs for different use cases:

| Production | Sandbox | TLS |
| ---------- | ------- | --- |
| https://api.sovos.com | https://api-test.sovos.com | https://api-test-tls.sovos.com |

Please visit [the developer guide][dgapispecs] for more information on Base URLs & API Specifications.

Before you can move on to run anything, please check out the basic examples in the **index.js** file. For sending documents, you must have created a SBD [(Standard Business Document)][sbd] yourself. Then, you can send this document to CoAPI by following either of these steps:
1. Use fetchAndSend method as shown as an example in the index.js
    - Name your SBD file as "document.xml",
    - Move it into the **sbds** folder.
2. Use document service:
    1. Run your document service with `npm run doc-srv`.
    2. Send a POST request with your document in Base64 format to this server with below configuration:
        - Route: /send-document
        - Sample Payload (in JSON): { "data": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz..." }

Please check out the implementation for both fetchAndSend method and the document service, and make changes if necessary.

If you have completed the steps above, then run:
```
npm start
```

## Testing
```
npm test
```
If you have configured your environment variables correctly, and followed the steps above to configure how you send documents to CoAPI, you should now be able to run tests and see the outcomes for yourself. You can follow the logic in the tests to make your own request in your own environment.

## Understanding the Code Sample
Connect Once API requires an **access token** to be provided in the Authentication header. In order to get an access token, you must use Basic Authentication with the provided API key and API secret key. Please visit the [developer guide][dgauth] for more information. This generated access token will expire in 1 hour, after which you must generate a new access token. Cache and reuse the token for the duration of its validity instead of continuously generating new token.

You are also required to have **x-correlationId** header for all requests as specified in the [documentation][dgapispecs], and you will need to have an **X-Idempotency-Key** header for the POST requests as specified in the [documentation][dgidemreq].

You can send documents or cancel them. After the documents are approved, you can send a cancellation request with the provided samples.

You will have notifications for the documents, and you should acknowledge them. You can view and acknowledge the notifications as shown in the provided code samples.

### Further Configuration
This code sample uses Axios as an HTTP client due to its popularity. As seen in the **config.js** file, we set up our axios instance with BASE_URL and TIMEOUT_SECONDS. We are also using axios interceptors for the request we make. Here, we are making use of request helpers in **helpers/requests.js** for handling errors and determining whether the requests should be retried or not. Please checkout the file and the [developer guide][dgerrhandling] to read about responses in more detail.

**IMPORTANT!**
We urge you to you update how you handle errors in the **helpers/requests.js** file. The parts that require your own implementations are marked as todos (with the text of "TODO:").

### Methods
documents.js will help you
- send a document
- take an action on documents: cancel, correct or distribute documents.

Please do not forget that you may have to wait for while before the document is approved. Only then you will be able to see the notifications or take an action on the documents. Otherwise, if the document isn't confirmed to be approved, you might risk attempting to cancel a rejected document.

notifications.js will help you
- retrieve documents
- acknowledge documents, or mark documents as unread.

You can follow the implementations in  **index.js** file or in the test files to see how we have implemented a very basic version of sending requests to Once Connect API.

[sbd]: <https://developer-guide.sovos.com/connect-once-api/general-concepts/standard-business-document>
[dep]: <https://www.npmjs.com/package/dotenv>
[dgapispecs]: <[https://developer-guide.sovos.com/connect-once-api/general-concepts/api-specifications]>
[dgauth]: <https://developer-guide.sovos.com/connect-once-api/general-concepts/api-specifications/authentication>
[dgerrhandling]: <https://developer-guide.sovos.com/connect-once-api/general-concepts/responses>
[devportal]: <https://developer.sovos.com>
[dgidemreq]: <https://developer-guide.sovos.com/connect-once-api/general-concepts/idempotent-requests/>