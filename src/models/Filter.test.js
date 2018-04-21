import { Filter } from './Filter';

const filterMock = {
  operation: 'IN',
  value: ['Amex', 'Diners'],
  path: 'payment_type',
};

it('can create an instance of a filter', () => {
  const filter = Filter.create(filterMock);
});
