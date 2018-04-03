import { NavbarDivider, Popover } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import colors from '../utils/colors';
import Button from './Button';
import FilterControl from './FilterControl';

const StyledMasthead = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  background-color: ${colors.zoomdataBlue};
  padding: 5px 15px;
  width: 100%;
`;

const H1Container = styled.div`
  margin-right: 15px;
`;

const H1 = styled.h1`
  color: ${colors.chromium};
  margin: 0;
  font-size: 24px;
`;

const StyledNavbarDivider = styled(NavbarDivider)`
  background-color: ${colors.chromium};
`;

const HeaderControl = ({ icon, content }) => (
  <Popover popoverClassName="zd-popover" content={content}>
    <Button className="pt-minimal pt-intent-primary" icon={icon} />
  </Popover>
);

HeaderControl.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

HeaderControl.defaultProps = {
  icon: null,
  content: null,
};

const Masthead = () => (
  <StyledMasthead>
    <H1Container>
      <H1>Embed Example</H1>
    </H1Container>
    <StyledNavbarDivider />
    <HeaderControl icon="filter-list" content={<FilterControl />} />
  </StyledMasthead>
);

export default Masthead;
