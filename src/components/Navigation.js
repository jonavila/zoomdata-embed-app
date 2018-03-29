import { Navbar, NavbarGroup } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import logo from '../assets/zoomdata-logo-charcoal.svg';
import presets from '../utils/presets';

const StyledNavigation = styled(Navbar).attrs({ role: `navigation` })`
  && {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    width: 100%;
    position: fixed;
    height: ${presets.headerHeight}px;
  }
`;

const Logo = styled.img`
  height: ${presets.headerHeight * 0.8}px;
`;

const Navigation = () => (
  <StyledNavigation>
    <NavbarGroup align="left">
      <Logo alt="Zoomdata Logo" src={logo} />
    </NavbarGroup>
  </StyledNavigation>
);

export default Navigation;
