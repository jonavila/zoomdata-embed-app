import { AuthenticationModel } from './AuthenticationModel';

const authenticationMock = {
  username: 'jonathan',
  token: 'abcdefg-hijk-lmno-pqrs',
};

it('can create an instance of Authentication', () => {
  const authentication = AuthenticationModel.create(authenticationMock);

  expect(authentication.username).toBe('jonathan');
});
