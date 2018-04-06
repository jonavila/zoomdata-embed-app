import { Navbar, NavbarGroup } from '@blueprintjs/core';
import { observer } from 'mobx-react/index';
import ProptTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import defaultLogo from '../../assets/zoomdata-logo-charcoal.svg';
import presets from '../../utils/presets';
import { Logo } from './logo';

const View = styled(Navbar)`
  && {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    width: 100%;
    position: fixed;
    height: ${presets.headerHeight}px;
  }
`;

let Navigation = ({ logo }) => (
  <View>
    <NavbarGroup align="left">
      <Logo alt="Zoomdata Logo" src={logo} />
    </NavbarGroup>
  </View>
);

Navigation.propTypes = {
  logo: ProptTypes.string,
};

Navigation.defaultProps = {
  logo: defaultLogo,
};

Navigation = observer(Navigation);

export { Navigation };
