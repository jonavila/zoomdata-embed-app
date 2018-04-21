import flowRight from 'lodash.flowright';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export let PrivateRoute = ({
  component: Component,
  router: {
    location: { state },
  },
  authentication,
  ...rest
}) => {
  const { referrer } = state || { referrer: { pathname: '/dashboards' } };
  return (
    <Route
      {...rest}
      render={props =>
        authentication.hasValidToken ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { referrer },
            }}
          />
        )
      }
    />
  );
};

PrivateRoute = flowRight([inject('router', 'authentication'), observer])(
  PrivateRoute,
);

PrivateRoute.wrappedComponent.propTypes = {
  component: PropTypes.func.isRequired,
  router: PropTypes.shape({}).isRequired,
  authentication: PropTypes.shape({}).isRequired,
};
