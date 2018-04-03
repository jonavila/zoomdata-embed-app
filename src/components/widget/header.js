import flowRight from 'lodash.flowright';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import colors from '../../utils/colors';

const View = styled.div`
  display: flex;
  align-items: center;
  flex: auto;
  width: 100%;
  max-height: 24px;
  padding: 0 5px;

  &:hover {
    background-color: ${colors.chromium};
  }
`;

let Header = ({ title }) => (
  <View>
    <div>{title}</div>
  </View>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

Header = flowRight([observer])(Header);

export { Header };
