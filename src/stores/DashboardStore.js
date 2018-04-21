/* eslint-disable no-param-reassign */
import {
  applySnapshot,
  flow,
  getEnv,
  getParent,
  getSnapshot,
  types,
} from 'mobx-state-tree';
import { DashboardModel } from '../models/DashboardModel';
import { AppToaster } from '../utils/toaster';

export const DashboardStore = types
  .model('DashboardStore', {
    dashboards: types.array(DashboardModel),
  })
  .volatile(() => ({ client: null, fetchStatus: null }))
  .actions(self => ({
    load: flow(function* load() {
      self.fetchStatus = 'pending';
      const { request } = getEnv(self).Zoomdata;
      try {
        const { data: dashboards } = yield request({
          url: `/service/bookmarks`,
          headers: {
            'Content-Type': 'application/vnd.zoomdata.v2+json',
          },
        });
        applySnapshot(self, { dashboards: dashboards.bookmarksMap });
        self.fetchStatus = 'fulfilled';
      } catch (error) {
        console.error(error);
        AppToaster.show({
          icon: 'warning-sign',
          intent: 'danger',
          message: `There was an error while fetching the dashboards from the server.`,
        });
        self.fetchStatus = 'error';
      }
    }),
    getClient: flow(function* getClient() {
      const { authentication } = getParent(self);
      const {
        Zoomdata: { application },
      } = getEnv(self);
      try {
        self.client = yield getEnv(self).Zoomdata.SDK.createClient({
          credentials: getSnapshot(authentication.user),
          application,
        });
      } catch (error) {
        console.error(error);
      }
    }),
  }));
