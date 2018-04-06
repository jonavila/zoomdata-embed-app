import { decorate, flow, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { injectGlobal } from 'styled-components';
import './App.css';
import logo from './assets/zoomdata-logo-charcoal.svg';
import { Dashboard } from './components/dashboard/dashboard';
import { ErrorBoundary } from './components/error-boundary/errorBoundary';
import { Navigation } from './components/navigation/navigation';
import { SpinnerWithText } from './components/spinner-with-text/spinnerWithText';

const { ZoomdataSDK } = window;

injectGlobal`
  html {
    box-sizing: border-box;
  }
  
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
  
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  
  #root {
    position: relative;
    height: 100%;
  }
  
  .zd-popover {
    & .pt-popover-content {
      display: flex;
      flex-flow: column;
      max-height: 650px;
    }
  }
`;

let App = class App extends Component {
  static application = {
    host: 'preview.zoomdata.com',
    port: 443,
    path: '/zoomdata',
    secure: true,
  };

  static credentials = {
    key: 'xVETgahWG5',
  };

  constructor(props) {
    super(props);
    this.getClient();
  }

  // eslint-disable-next-line func-names
  getClient = flow(function*() {
    try {
      this.client = yield ZoomdataSDK.createClient({
        credentials: App.credentials,
        application: App.application,
      });
    } catch (err) {
      console.error(err.message);
    }
  });

  client = null;

  render() {
    return (
      <ErrorBoundary>
        <Navigation logo={logo} />
        {this.client ? (
          <Dashboard client={this.client} />
        ) : (
          <SpinnerWithText
            className="pt-large"
            text="Waiting for Zoomdata client..."
          />
        )}
      </ErrorBoundary>
    );
  }
};

decorate(App, { client: observable.ref });

App = observer(App);

export { App };
