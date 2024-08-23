require('dotenv').config();
const stripe = require('stripe')('sk_test_W353wCeK9s23BqD5ybvZee3w',{apiVersion: '2024-06-20; embedded_connect_beta=v2;'});

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }
  try {
    const { accountId, financialAccountId } = JSON.parse(event.body);

    console.log("I am about to set up the params for the account session");

    const params = {
      account: accountId,
      components: {
        financial_account: {
          enabled: true,
          features: {
            money_movement: true,
            external_account_collection: true,
          },
        },
      }
    };

    console.log("I'm about to create an account session");

    const accountSession = await stripe.accountSessions.create(params);

    console.log("I've created the account session");

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ client_secret: accountSession.client_secret }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
