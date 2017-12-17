const R = require('ramda');
const { OK } = require('http-status-codes');
const expect = require('expect.js');
const nock = require('nock');
const { join } = require('path');
const initRevolut = require('../..');

const {
  transfer,
  payment: samplePayment
} = require('require-all')(join(__dirname, '..', 'fixtures', 'payments'));

// Based on https://revolutdev.github.io/business-api/?shell--sandbox#payments

describe('Payments API', () => {
  const REVOLUT_URL = 'https://testingrevolut.com';

  let revolut;
  const environment = 'test';
  const token = 'BITCOIN';

  before(() => {
    revolut = initRevolut({ environment, token });
  });

  describe('Transfers', () => {
    const processTransfer = (payment) => {
      nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
        .post('/transfer', payment)
        .reply(OK, {});
      return revolut.payments.transfer(payment);
    };

    it('POSTs a new valid revolut transfer', () => processTransfer(transfer));

    it('fails to add an invalid revolut transfer', () => {
      const faultyTransfer = R.omit(['currency'], transfer);
      return Promise.resolve()
        .then(() => processTransfer(faultyTransfer))
        .then(() => { throw new Error('I should not be here!'); })
        .catch((error) => expect(error.message).to.equal('ValidationError: child "currency" fails because ["currency" is required]'));
    });
  });

  describe('Payments', () => {
    const processPayment = (payment) => {
      nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
        .post('/pay', payment)
        .reply(OK, {});
      return revolut.payments.pay(payment);
    };

    it('POSTs a new valid revolut payment', () => processPayment(samplePayment));

    it('fails to add an invalid revolut payment', () => {
      const faultyPayment = R.omit(['currency'], samplePayment);
      return Promise.resolve()
        .then(() => processPayment(faultyPayment))
        .then(() => { throw new Error('I should not be here!'); })
        .catch((error) => expect(error.message).to.equal('ValidationError: child "currency" fails because ["currency" is required]'));
    });
  });
});

