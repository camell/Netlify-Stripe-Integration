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

    stripe.setApiVersion('2024-04-10; embedded_connect_beta=v2');

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
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
