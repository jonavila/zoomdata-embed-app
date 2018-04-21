import { types } from 'mobx-state-tree';

export const UserModel = types.model('UserModel', {
  id: types.identifier(),
  name: types.string,
  accountId: types.string,
  accounts: types.array(types.frozen),
  activeRoles: types.array(types.string),
  groupRoles: types.array(types.string),
});
