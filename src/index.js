/* eslint-disable import/no-extraneous-dependencies */
import createBrowserHistory from 'history/createBrowserHistory';
import { configure } from 'mobx';
import makeInspectable from 'mobx-devtools-mst';
import { Provider } from 'mobx-react';
import { onSnapshot } from 'mobx-state-tree';
import { RouterModel, syncHistoryWithStore } from 'mst-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { App } from './App';
import { AuthenticationModel } from './models/AuthenticationModel';
import { AppStore } from './stores/AppStore';
import { DashboardStore } from './stores/DashboardStore';
import * as Zoomdata from './zoomdata';

configure({ enforceActions: 'strict' }); // configure Mobx

let initialAuthentication;
if (sessionStorage.getItem('EmbedApp')) {
  initialAuthentication = JSON.parse(sessionStorage.getItem('EmbedApp'))
    .authentication;
}

const dashboardStore = DashboardStore.create({ dashboards: [] });
const router = RouterModel.create();
const authentication = AuthenticationModel.create(initialAuthentication);
export const history = syncHistoryWithStore(createBrowserHistory(), router);

// eslint-disable-next-line no-multi-assign
const appStore = (window.AppStore = AppStore.create(
  {
    dashboardStore,
    router,
    authentication,
  },
  {
    Zoomdata,
  },
));

onSnapshot(appStore, snapshot => {
  sessionStorage.setItem('EmbedApp', JSON.stringify(snapshot));
});

makeInspectable(appStore);

ReactDOM.render(
  <Provider {...appStore}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
