require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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

    const params = {
      account: accountId,
      components: {},
      'components[financial_account][enabled]': true,
      'components[financial_account][features][money_movement]': true
    };

    const accountSession = await stripe.accountSessions.create(params);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ sessionId: accountSession.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
