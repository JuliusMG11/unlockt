/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require('firebase-functions/v2');
const cors = require('cors')({ origin: true });
const stripe = require('stripe')('sk_test_51QHQO7BU3nCGItWdkkktUZioLshN0PAcpVf8PUfyvqya1K3CaT4mZDiEsokjBI992S1EV6kCUcjopJ6edJEyWyQ500AFSIvaeY');

exports.createPaymentIntent = functions.https.onRequest((req: any, res: any) => {
  cors(req, res, async () => {
    try {
      const { amount, currency, customer } = req.body;

      console.log('Received request:', { amount, currency, customer }); // Pre debugging

      // Vytvoríme payment intent bez customer ID
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata: {
          firebaseUID: customer // Stačí uložiť ako metadata
        }
      });

      console.log('Payment Intent created:', paymentIntent.id); // Pre debugging

      if (!paymentIntent.client_secret) {
        throw new Error('No client secret generated');
      }

      return res.status(200).json({ 
        clientSecret: paymentIntent.client_secret 
      });
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      return res.status(500).json({ 
        error: error.message,
        details: error.toString()
      });
    }
  });
});