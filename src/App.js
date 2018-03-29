import { Provider } from 'mobx-react';
import React from 'react';
import { injectGlobal } from 'styled-components';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import Main from './components/Main';
import Navigation from './components/Navigation';
import Zoomdata from './stores/Zoomdata';

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
`;

const App = () => {
  const zoomdata = new Zoomdata();

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
