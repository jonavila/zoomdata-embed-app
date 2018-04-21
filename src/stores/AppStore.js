/* eslint-disable no-unused-vars */
import { types } from 'mobx-state-tree';
import { RouterModel } from 'mst-react-router';
import { AuthenticationModel } from '../models/AuthenticationModel';
import { DashboardStore } from './DashboardStore';

export const AppStore = types.model('AppStore', {
  dashboardStore: types.maybe(DashboardStore),
  router: RouterModel,
  authentication: types.maybe(AuthenticationModel),
});
