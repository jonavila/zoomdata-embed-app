import { types } from 'mobx-state-tree';
import { Filter } from './Filter';

const SourceConfig = types.model({
  sourceId: types.string,
  sourceName: types.string,
  filters: types.array(Filter),
});

export const SourceVisualization = types.model({
  id: types.identifier(),
  visId: types.string,
  name: types.string,
  type: types.string,
  enabled: types.boolean,
  source: SourceConfig,
});
