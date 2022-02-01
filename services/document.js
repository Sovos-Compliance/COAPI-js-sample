const express = require('express');
const xml2js = require('xml2js');
const app = express();
const documents = require('../methods/documents');
const util = require('util');

app.use(express.json());


const parse = util.promisify(xml2js.parseString);

/**
 * You can configure how your service will accept the data, but
 * in our case, we are expecting a base64 encoded string for the data,
 * so we are decoding the data, making the necessary changes, and
 * sending it to the CoAPI.
 */
app.post('/send-document', async (req, res) => {
    // TODO: Update how you handle your document service
    if (!req.body.data) { 
        res.sendStatus(400);
    }

    // update if necessary
    // we are updating our Sender Identifier just as an example
    const taxId = process.env.SENDER_TAX_ID;
    const xml = Buffer.from(req.body.data, 'base64').toString();

    const obj = await parse(xml)
        .then(result => result)
        .catch(err => null);
    if (!obj) {
        res.sendStatus(400);
        return;
    }
    obj['sbd:StandardBusinessDocument']['sbd:StandardBusinessDocumentHeader'][0]['sbd:Sender'][0]['sbd:Identifier'][0]['_'] = taxId;
    const builder = new xml2js.Builder();
    const doc = builder.buildObject(obj);
    
    // our document.send method requires an xml string,
    // and will do the necessary base64 conversion before making the request
    const response = await documents.send(doc);
    res.send(response);
});

app.listen(3000);