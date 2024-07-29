require('dotenv').config();
const stripe = require('stripe')('sk_test_W353wCeK9s23BqD5ybvZee3w');

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
      apiVersion: '2024-04-10; embedded_connect_beta=v2',
      components: {},
      'components[financial_account][enabled]': true,
      'components[financial_account][features][money_movement]': true
    };

    console.log("I'm about to create an account session");

    const accountSession = await stripe.accountSessions.create(accountId, params);

    console.log("I've created the account session");

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ sessionId: accountSession.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
