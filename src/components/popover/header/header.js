import flowRight from 'lodash.flowright';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Title } from './title';

const View = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`;

let Header = ({ title }) => (
  <View>
    <Title text={title} />
  </View>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

Header = flowRight([observer])(Header);

export { Header };
