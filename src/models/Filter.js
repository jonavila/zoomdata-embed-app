import { types } from 'mobx-state-tree';

export const Filter = types.model({
  path: types.string,
  operation: types.string,
  value: types.array(types.union(types.string, types.number)),
});
