import { Button, ControlGroup, InputGroup } from '@blueprintjs/core';
import { action } from 'mobx';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/z-logo.svg';
import { handleKeyPress, handleStringChange } from '../../utils/inputUtils';
import { SpinnerWithText } from '../spinner-with-text/spinnerWithText';

const View = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  min-height: 100%;
  align-items: center;
  background: url(${logo}) no-repeat center;
  background-size: contain;
`;

@inject('router', 'authentication')
@observer
export class Login extends Component {
  @action('handle username input change')
  handleUsernameInputChange = handleStringChange(value => {
    const { authentication } = this.props;
    authentication.setUsername(value);
  });

  @action('handle password input change')
  handlePasswordInputChange = handleStringChange(value => {
    const { authentication } = this.props;
    authentication.setPassword(value);
  });

  handlePasswordKeypress = handleKeyPress(key => {
    if (key === 'Enter') {
      this.handleLogIn();
    }
  });

  @action('handle log-in')
  handleLogIn = () => {
    const { authentication } = this.props;
    authentication.getToken();
  };

  render() {
    const {
      router: {
        location: { state },
      },
      authentication,
    } = this.props;
    const { referrer } = state || {
      referrer: { pathname: '/dashboards' },
    };

    if (authentication.logInStatus === 'pending') {
      return <SpinnerWithText text="Logging In..." />;
    }

    if (
      authentication.hasValidToken &&
      authentication.logInStatus === 'fulfilled'
    ) {
      return <Redirect to={referrer} />;
    }

    return (
      <View>
        <ControlGroup vertical>
          <InputGroup
            leftIcon="person"
            onChange={this.handleUsernameInputChange}
            placeholder="Username"
          />
          <InputGroup
            leftIcon="lock"
            onChange={this.handlePasswordInputChange}
            onKeyPress={this.handlePasswordKeypress}
            placeholder="Password"
            type="password"
          />
          <Button
            className="pt-large pt-intent-primary"
            text="Login"
            onClick={() => this.handleLogIn()}
          />
        </ControlGroup>
      </View>
    );
  }
}

Login.wrappedComponent.propTypes = {
  router: PropTypes.shape({}).isRequired,
  authentication: PropTypes.shape({}).isRequired,
};
