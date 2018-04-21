import { Button, Navbar, NavbarGroup } from '@blueprintjs/core';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react/';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import defaultLogo from '../../assets/zoomdata-logo-charcoal.svg';
import { navigationHeight } from '../../utils/presets';
import { Logo } from './logo';

const View = styled(Navbar)`
  && {
    align-items: center;
    width: 100%;
    position: fixed;
    top: 0;
    height: ${navigationHeight}px;
  }
`;

export let Navigation = ({ logo, user }) => (
  <View>
    <NavbarGroup align="left">
      <Logo alt="Zoomdata Logo" src={logo} />
    </NavbarGroup>
    <NavbarGroup align="right">
      <Button icon="user" minimal text={user.name} />
    </NavbarGroup>
  </View>
);

Navigation.propTypes = {
  logo: PropTypes.string,
  user: PropTypes.oneOfType([MobxPropTypes.observableObject]).isRequired,
};

Navigation.defaultProps = {
  logo: defaultLogo,
};

Navigation = observer(Navigation);
