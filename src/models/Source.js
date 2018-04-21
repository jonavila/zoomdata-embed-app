/* eslint-disable no-param-reassign */
import { types } from 'mobx-state-tree';

export const Source = types
  .model({
    id: types.identifier(),
    name: types.string,
    description: types.string,
  })
  .actions(self => ({
    changeName(newName) {
      self.name = newName;
    },
    changeDescription(newDescription) {
      self.description = newDescription;
    },
  }));
