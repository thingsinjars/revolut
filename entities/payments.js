const debug = require('debug')('revolut:payments');
const validate = require('../lib/validators/payments');

module.exports = ({ url, request }) => {
  // POST https://b2b.revolut.com/api/1.0/transfer
  const transfer = (payment) => {
    debug('Processing transfer within Revolut accounts');
    return request.post(`${url}/transfer`, validate(payment));
  };

  return {
    transfer
  };
};