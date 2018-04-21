/* eslint-disable import/no-extraneous-dependencies */
import flowRight from 'lodash.flowright';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { hot } from 'react-hot-loader';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { injectGlobal } from 'styled-components';
import './App.css';
import { ErrorBoundary } from './components/error-boundary/errorBoundary';
import { FourOhFour } from './components/four-oh-four/FourOhFour';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { PrivateRoute } from './components/private-route/privateRoute';

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
  
  #tooltip-root {
    position: absolute;
    z-index: 999;
    pointer-events: none;
  }
  
  .zd-popover {
    & .pt-popover-content {
      display: flex;
      flex-flow: column;
      max-height: 650px;
    }
  }
`;

export let App = () => (
  <ErrorBoundary>
    <Switch>
      <PrivateRoute exact path="/dashboards" component={Home} />
      <Route path="/login" component={Login} />
      <Redirect exact from="/" to="/dashboards" />
      <Route component={FourOhFour} />
    </Switch>
  </ErrorBoundary>
);

App = flowRight([hot(module), withRouter, inject('router'), observer])(App);
