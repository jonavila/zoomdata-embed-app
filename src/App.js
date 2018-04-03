import { Provider } from 'mobx-react';
import React from 'react';
import { injectGlobal } from 'styled-components';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import Main from './components/Main';
import Navigation from './components/Navigation';
import Zoomdata from './stores/Zoomdata';
import colors from './utils/colors';

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
    height: 100%;
  }
  
  .zd-popover {
    background-color: ${colors.charcoal};
    padding: 12px;
    
    & .pt-popover-arrow-fill {
      fill: ${colors.charcoal};
    }
    
    & .pt-popover-content {
      background-color: ${colors.charcoal};
    }
  }
`;

const application = {
  host: 'preview.zoomdata.com',
  port: 443,
  path: '/zoomdata',
  secure: true,
};

const credentials = {
  key: 'UZUwYrTcLb',
};

const App = () => {
  const zoomdata = new Zoomdata({ application, credentials });

  return (
    <Provider zoomdata={zoomdata}>
      <ErrorBoundary>
        <Navigation />
        <Main />
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
