import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Title } from './title';

const View = styled.div`
  display: flex;
  flex: 0 0 auto;
  justify-content: center;
  padding: 5px;
`;

let Header = ({ title }) => (
  <View>
    <Title text={title} />
  </View>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

Header = observer(Header);

export { Header };
