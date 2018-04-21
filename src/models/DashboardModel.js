/* eslint-disable no-param-reassign */
import { types } from 'mobx-state-tree';
import { SourceVisualization } from './SourceVisualization';

const DashboardVisualizationLayoutModel = types.model(
  'DashboardVisualizationLayoutModel',
  {
    col: types.number,
    row: types.number,
    rowSpan: types.number,
    colSpan: types.number,
  },
);

const DashboardVisualizationModel = types.compose(
  SourceVisualization,
  types.model('DashboardVisualizationModel', {
    id: types.identifier(),
    layout: DashboardVisualizationLayoutModel,
  }),
);

export const DashboardModel = types
  .model('DashboardModel', {
    id: types.identifier(),
    name: types.string,
    description: types.string,
    layout: types.string,
    shareState: types.string,
    visualizations: types.array(DashboardVisualizationModel),
  })
  .actions(self => ({
    changeName(newName) {
      self.name = newName;
    },
    changeDescription(newDescription) {
      self.description = newDescription;
    },
  }));
